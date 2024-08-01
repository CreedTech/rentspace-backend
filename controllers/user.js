const User = require("../models/User");
const BlacklistToken = require("../models/Logout");
const fs = require("fs");

const moment = require("moment");
const { getSecondsBetweenTime, timeDifference } = require("../helpers/date");
const {
  UserSchema,
  VerifyUserSchema,
  LoginUserSchema,
  VerifyPasswordOtpSchema,
  UpdatePasswordSchema,
  ChangePasswordSchema,
  ResetPasswordSchema,
  UpdateUserProfile,
  FCMTokenSchema,
  VerifySingleDeviceOtpSchema,
} = require("../validations/user");
const { WithdrawalAccountSchema } = require("../validations/account");
const { encrypt } = require("../helpers/auth");
const { compare } = require("../helpers/auth");
const { generateToken, generateRefreshToken } = require("../helpers/token");
const { validateUser } = require("../services/auth");
const {
  recordAdminLogin,
  recordAdminLogout,
} = require("../services/adminHistory");
const { generateOTP } = require("../helpers/token");
const { badRequest, notFound } = require("../helpers/error");
const verifyOTP = require("../helpers/verifyOtp");
const sendEmail = require("../services/email");
const { createAccountOtp, resetPasswordOtp } = require("../helpers/mails/emailTemplates");
const { cloudinaryConfig, uploader } = require("../services/cloudinaryConfig");
const { createUserWallet } = require("../services/wallet");
const Activities = require("../models/Activities");
const AdminControl = require("../models/AdminControl");
const AdminHistory = require("../models/AdminHistory");
const UserInfo = require("../models/UserInfo");
const Wallet = require("../models/Wallet");
const WalletHistory = require("../models/WalletHistory");
const WithdrawalAccount = require("../models/withdrawalAccount");
const FCMToken = require("../models/FCMToken");
const SpaceRent = require("../models/SpaceRent");
const { createDVA } = require("./dva");
const { createUserDva } = require("../services/createDVA");
const {
  createUserProvidusAccountOnLogin,
} = require("../controllers/providusVirtualAccount");

const {addBVNVerificationCheckToQueue} = require('../queues/bvnReminderQueue')

const generateReferralCode = (username) => {
  // Extract the first 5 characters of the use rname
  const usernamePrefix = username.replace(/\s+/g, "").toUpperCase();

  // Generate a random string
  const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();

  // Concatenate the username prefix and random string to create the referral code
  return usernamePrefix + randomString;
};
exports.createUser = async (req, res) => {
  const body = UserSchema.safeParse(req.body);
  console.log("body");
  console.log(body);

  if (!body.success) {
    console.log("error");
    return res.status(400).json({
      errors: body.error.issues,
    });
  }

  const { userName, email, phoneNumber, password, referral_code } = body.data;
  try {
    // Check if the username is already taken

    const checkPhone = await User.findOne({ phoneNumber });
    if (checkPhone) {
      return badRequest(res, "Phone Number already taken");
    }
    const checkUsername = await User.findOne({ userName });
    if (checkUsername) {
      return badRequest(res, "Username already taken");
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return badRequest(res, "Email is already taken");
    }

    body.data.password = await encrypt(password);

    const otpValue = generateOTP();

    const otp = await encrypt(otpValue);
    let newUsername = userName.replace(/\s+/g, "").toUpperCase();
    while (await User.findOne({ userName: newUsername })) {
      newUsername = generateReferralCode(userName);
    }
    // const referringUser = await User.findOne({ referral_code });

    // const referralCode = generateReferralCode(userName);

    const user = new User({
      ...body.data,
      referral_code: newUsername,
      referralPoints: 0,
      referrals: 0,
      otp,
      otpExpireIn: new Date().getTime() + 30 * 60 * 1000, // To expire in 30 minutes.
      avatar: {
        public_id: "v1707553702/tw3c16vw47vpizhn6oy7",
        url: "https://res.cloudinary.com/dqwulfc1j/image/upload/v1707553702/tw3c16vw47vpizhn6oy7.png",
      },
    });

    let referredBy = "";

    if (referral_code) {
      const referralCodeUpperCase = referral_code.toUpperCase(); 
      const referringUser = await User.findOne({
        referral_code: referralCodeUpperCase,
      });
      console.log(referringUser);
      if (referringUser) {
        referredBy = referringUser.userName; // Store the username of the referring user
        user.referredBy = referredBy;
        // Increase referral points of the referring user
        referringUser.referredUsers.push(user._id);
        referringUser.referrals += 1;
        // referringUser.referralPoints += 500;
        // user.referredPoints += 500;
        await referringUser.save();
      }
    }

    await user.save();
    // await createUserReferralSystem(user._id, res);
    const data = {
      to: email,
      text: "RentSpace OTP Verification",
      subject: "Kindly Verify Your Account",
      html: createAccountOtp(otpValue),
    };
    await sendEmail(data);

    const refreshToken = generateRefreshToken(user._id);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 240 * 60 * 60 * 1000,
    });
    const activity = new Activities({
      user: user._id,
      activityType: "Creation",
      description: "RentSpace Account Created",
    });
    await activity.save();

    // Add BVN verification check to the queue
    await addBVNVerificationCheckToQueue({ userId: user._id });

    res.status(201).json({
      msg: "account created",
      user,
    });
  } catch (error) {
    console.log("CREATE USER ERROR=>", error);
    console.error(error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// VERIFY NEWLY CREATED USER
exports.verifyUser = async (req, res) => {
  const body = VerifyUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      errors: body.error.issues,
    });
  }
  const { email, otp } = body.data;

  try {
    const { error, user } = await validateUser(email, otp);

    if (error) {
      return badRequest(res, error);
    }

    await createUserWallet(user._id, res);
    // Update the user in the database
    //  user = await User.findOneAndUpdate(
    //   { _id: req.user.id },
    //   {
    //     $set: {
    //       has_verified_email: true,
    //     },
    //   },
    //   { new: true }
    // );
    const activity = new Activities({
      user: user._id,
      activityType: "Creation",
      description: "RentSpace Account Verified",
    });
    await activity.save();
    res.status(200).json({
      verified: user.verified,
      has_verified_email: true,
      msg: "User verified",
    });
  } catch (error) {
    console.log("VERIFY USER ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.userLogin = async (req, res) => {
  const body = LoginUserSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({
      error: body.error.issues,
    });
  }

  const { email, password, fcm_token, deviceType, deviceName } = body.data;

  try {
    console.log("userLogin function called with email", email);
    console.log("userLogin function called with fcm_token", fcm_token);
    console.log("userLogin function called with deviceType", deviceType);
    console.log("userLogin function called with deviceName", deviceName);

    const checkUser = await User.findOne({ email });

    if (!checkUser || !(await compare(password, checkUser.password))) {
      return res.status(400).json({
        error: "Incorrect credentials",
      });
    }

    if (!checkUser.verified) {
      return res.status(400).json({
        error: "User not verified, please verify your account",
      });
    }

    if (!checkUser.has_verified_bvn) {
      return res.status(400).json({
        error: "BVN not verified, please verify your BVN to continue",
      });
    }

    // if (!checkUser.has_dva) {
    //   await createUserDva(email);
    // }
    // Check if the user has no DVA or default bank is not Providus
    // if (!checkUser.has_dva || checkUser.defaultBank !== "providus") {
    //   await createUserProvidusAccountOnLogin(email);
    // }

    // Check if the user has no DVA or default bank is not Providus
    if (!checkUser.has_dva || checkUser.defaultBank !== "providus") {
      try {
        const providusAccountResult = await createUserProvidusAccountOnLogin(
          email
        );
        if (
          providusAccountResult &&
          providusAccountResult.message ===
            "User already has a Providus account"
        ) {
          console.log(
            "User already has a Providus account, continuing login process..."
          );
        } else {
          console.log("Providus account created successfully");
        }
      } catch (error) {
        console.error("Error creating Providus account:", error);
      }
    }

    const existingToken = await FCMToken.findOne({ user: checkUser._id });
    if (
      existingToken &&
      existingToken.token &&
      existingToken.token !== fcm_token
    ) {
      return res
        .status(400)
        .json({ error: "User already logged in on another device" });
    }

    console.log("existingToken", existingToken);

    const token = generateToken(checkUser._id, checkUser.email, fcm_token);

    await FCMToken.findOneAndUpdate(
      { user: checkUser._id },
      { token: fcm_token, deviceType, deviceName },
      { upsert: true, new: true }
    );

    console.log("FCMToken updated");

    if (
      [
        "account",
        "super-admin",
        "admin",
        "marketing",
        "tester",
        "sales",
      ].includes(checkUser.role)
    ) {
      await recordAdminLogin(checkUser);
    }

    console.log("recordAdminLogin called");

    res.status(200).json({
      message: "Login Success",
      token,
    });
  } catch (error) {
    console.log("userLogin error", error);
    res.status(500).json({
      errors: [{ error: "Server Error" }],
    });
  }
};

exports.postFcmToken = async (req, res) => {
  const { id } = req.user;
  // let user = await User.findById(id);
  const body = FCMTokenSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({
      error: body.error.issues,
    });
  }
  try {
    const fcm = await FCMToken.findOne({ user: id });
    const checkToken = await FCMToken.findOne({
      token: body.data.fcm_token,
      user: id,
    });
    if (!checkToken) {
      const createFcmToken = new FCMToken({
        user: id,
        token: body.data.fcm_token,
      });
      createFcmToken.save();
      // fcm.token = body.data.fcm_token;
    }
    console.log("token already exists");
    return res.status(200).json({ message: "Token Stored Succesfully" });
    // fcm.save();
  } catch (error) {
    console.log("FCM TOKEN ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// RESEND VERIFIICATION OTP
exports.resendVerificationOTP = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp) {
      // Clear the already existing otp and create another one.
      user.otp = undefined;
      user.otpExpireIn = undefined;
      await user.save();
    }
    // Generate a new OTP
    const newOTP = generateOTP();
    const otp = await encrypt(newOTP);

    // Update user's OTP and OTP expiration
    user.otp = otp;
    user.otpExpireIn = new Date().getTime() + 30 * 60 * 1000;
    await user.save();

    // Send the new verification code to the user
    const data = {
      to: email,
      text: "RentSpace resend OTP Verification",
      subject: "Kindly Verify Your Account",
      html: createAccountOtp(newOTP),
    };
    await sendEmail(data);

    res.status(200).json({ message: "New verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// SEND OTP FOR DEVICE LOGIN
exports.sendDeviceLoginOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        errors: [{ error: "User not found" }],
      });
    } else {
      const otpValue = generateOTP();
      const otp = await encrypt(otpValue);
      user.otp = otp;
      // To expire in 30 minutes
      user.otpExpireIn = new Date().getTime() + 30 * 60 * 1000;
      await user.save();
      // Send the new verification code to the user
      const data = {
        to: email,
        text: "RentSpace Device Login OTP",
        subject: "OTP to Verify Device Login",
        html: createAccountOtp(otpValue),
      };
      await sendEmail(data);

      res.status(200).json({
        msg: `OTP sent to ${email}`,
      });
    }
  } catch (error) {
    console.log("SEND DEVICE LOGIN OTP ERROR =>", error);
    res.status(500).json({
      errors: [{ error: "Server Error" }],
    });
  }
};

exports.verifyDeviceLoginOtp = async (req, res) => {
  const body = VerifySingleDeviceOtpSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  const { email, otp } = body.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        errors: [{ error: "User not found" }],
      });
    }

    if (!(await compare(otp, user.otp))) {
      return badRequest(res, "Invalid OTP");
    }

    if (new Date().getTime() > user.otpExpireIn) {
      return badRequest(res, "This OTP has expired");
    }

    // Clear FCM Token
    await FCMToken.findOneAndUpdate(
      { user: user._id },
      { token: null },
      { new: true }
    );

    // Clear OTP and expiry time after verification
    user.otp = null;
    user.otpExpireIn = null;
    await user.save();

    res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log("VERIFY DEVICE LOGIN OTP ERROR =>", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// FORGOT PASSWORD
exports.forgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({
        errors: [
          {
            error: "User not found",
          },
        ],
      });
    } else {
      const otpValue = generateOTP();
      const otp = await encrypt(otpValue);
      user.otp = otp;
      // To expire in 5mins.
      user.otpExpireIn = new Date().getTime();
      await user.save();
      // Send the new verification code to the user
      const data = {
        to: email,
        text: "RentSpace Forgot Password OTP",
        subject: "OTP To Reset Your Password",
        html: createAccountOtp(otpValue),
      };
      await sendEmail(data);

      res.status(200).json({
        msg: `otp sent to ${email}`,
      });
    }
  } catch (error) {
    console.log("RESET PASSWORD ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// TO VERIFY OTP FOR FORGOT PASSWORD
exports.verifyForgotPasswordOtp = async (req, res) => {
  const body = VerifyPasswordOtpSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  const { email, otp } = body.data;

  try {
    const user = await User.findOne({ email });

    if (!(await compare(otp, user.otp))) {
      return badRequest(res, "Invalid OTP");
    }
    if (getSecondsBetweenTime(user.otpExpireIn) > timeDifference["2m"]) {
      return badRequest(res, "This otp has expired");
    }

    res.status(200).json({ message: "OTP Verified!" });
  } catch (error) {
    console.log("VERIFY OTP ERROR=>", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// TO RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const body = ResetPasswordSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  const { email, newPassword, repeatPassword } = body.data;

  if (newPassword !== repeatPassword) {
    return res
      .status(400)
      .json({ errors: [{ error: "Passwords do not match" }] });
  }
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log("USER ASKING TO RESET PASSSWORD=>", user);
    if (!user) {
      return notFound(res, "User not found");
    }

    // Check if the new password is the same as the previous password
    const isSamePassword = await compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        errors: [
          { error: "New Password cannot be the same as the previous one." },
        ],
      });
    }

    // Encrypt the new password
    const newPasswordHash = await encrypt(newPassword);
    // Update the user's password with the new encrypted password
    user.password = newPasswordHash;
    await user.save();
    res.status(200).json({ message: "Password has been successfully reset" });
  } catch (error) {
    console.log("RESET PASSWORD ERROR=>", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// RESEND PASSWORD OTP
exports.resendPasswordOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp) {
      // Clear the already existing otp and create another one.
      user.otp = undefined;
      user.otpExpireIn = undefined;
      await user.save();
    }
    // Generate a new OTP
    const newOTP = generateOTP();
    const otp = await encrypt(newOTP);

    // Update user's OTP and OTP expiration
    user.otp = otp;
    user.otpExpireIn = new Date().getTime() + 5 * 60 * 1000;
    await user.save();

    // Send the new verification code to the user
    const data = {
      to: email,
      text: "RentSpace resend Password OTP",
      subject: "Kindly Verify Your Password OTP",
      html: resetPasswordOtp(newOTP),
    };
    await sendEmail(data);

    res.status(200).json({ message: "New verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  const body = UpdatePasswordSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  const { email, oldPassword, newPassword } = body.data;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log("USER=>", user);

    if (!user) {
      return notFound(res, "User not found");
    }

    // Verify if the old password matches the current password
    const isPasswordMatch = await compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return badRequest(res, "Old password doesn't match");
    }

    // Encrypt the new password
    const newPasswordHash = await encrypt(newPassword);

    // Update the user's password with the new encrypted password
    user.password = newPasswordHash;
    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully", data: true });
  } catch (error) {
    console.log("UPDATE PASSWORD ERROR=>", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const body = ChangePasswordSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  const { currentPassword, newPassword, repeatNewPassword } = body.data;

  try {
    //FIND THE USER BY id
    const user = await User.findById(req.user.id);
    console.log("USER=>", user);

    if (!user) {
      return notFound(res, "User not found");
    }

    // VERIFY IF CURRENT PASSWORD MATCHES NEW ONE
    const isPasswordMatch = await compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return badRequest(res, " Current password doesn't match");
    }

    // ENCRYPT THE NEW PASSWORD
    const newPasswordHash = await encrypt(newPassword);

    // THEN UPDATE THE USER'S PASSWORD WITH THE NEW ENCRYPTED PASSWORD
    user.password = newPasswordHash;
    await user.save();

    res
      .status(200)
      .json({ message: "Password changed successfully", data: true });
  } catch (error) {
    console.log("CHANGE PASSWORD ERROR=>", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

exports.getAllUsers = async (req, res) => {
  const { searchTerm } = req.query;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const query = searchTerm ? { $text: { $search: searchTerm } } : {};

  try {
    const [users, newUsersCount, verifiedUsersCount] = await Promise.all([
      User.find(query)
        .select("-password -otp")
        .populate("wallet activities")
        .exec(),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ has_verified_bvn: true }),
    ]);

    const totalUsersCount = users.length;
    const newUsersPercentage =
      totalUsersCount > 0
        ? ((newUsersCount / totalUsersCount) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      users,
      newUsersCountLastSevenDays: newUsersCount,
      newUsersPercentageLastSevenDays: newUsersPercentage,
      bvnVerifiedUsersCount: verifiedUsersCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// TO GET ALL USERS ACTIVITIES
exports.getAllUsersActivities = async (req, res) => {
  try {
    const activities = await Activities.find().populate("user", "-password");
    res.status(200).json({
      activities,
    });
  } catch (error) {
    console.log("GET ALL USERS ACTIVITIES ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// UPDATE USER PROFILE

exports.updateUserInfo = async (req, res) => {
  const MAX_RETRY_ATTEMPTS = 3;
  const { id } = req.user;
  try {
    let user = await User.findById(id);

    if (!user) {
      return notFound(res, "User");
    }

    if (user.avatar.updated) {
      return res.status(403).json({
        error: "Profile picture can only be changed once.",
      });
    }

    let result;
    let retryAttempts = 0;

    // THIS IS TO RETRY THE CLOUDINARY UPLOAD IN CASE OF NETWORK UPLOAD
    while (retryAttempts < MAX_RETRY_ATTEMPTS) {
      try {
        console.log(req.file);
        const fileBuffer = req.file.buffer;

        // CONVERT THE FILE BUFFER TO BASE64 STRING
        const fileString = fileBuffer.toString("base64");

        result = await uploader.upload(`data:image/png;base64,${fileString}`, {
          folder: "avatars",
        });

        // IF THE UPLOAD IS SUCCESSFUL, BREAK OUT OF THE RETRY LOOP
        break;
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary =>", uploadError);

        retryAttempts++;

        if (retryAttempts < MAX_RETRY_ATTEMPTS) {
          console.log(`Retrying upload (attempt ${retryAttempts})...`);
        } else {
          // ONCE THE MAX ATTEMPT IS REACHED, THROW THE UPLOAD ERROR
          console.log(uploadError);
          throw uploadError;
        }
      }
    }

    // const body = UpdateUserProfile.safeParse(req.body);

    // if (!body.success) {
    //   return res.status(400).json({
    //     errors: body.error.issues,
    //   });
    // }

    // const { userName, phoneNumber } = body.data;

    // Update the user in the database
    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          "avatar.public_id": result.public_id,
          "avatar.url": result.secure_url,
          "avatar.updated": true,
        },
      },
      { new: true }
    );

    res.status(200).json({
      msg: "User Profile Updated Successfully",
      user: {
        // userName,
        // phoneNumber,
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      },
    });
  } catch (error) {
    console.log("UPDATE USER ERROR =>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
//GET A USER'S DETAILS
exports.getUserDetail = async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        errors: [
          {
            error: "User not found",
          },
        ],
      });
    }
    // console.log("USER=>", user)

    const userDetails = await User.findById(id)
      .populate("referredUsers")
      .populate("withdrawalAccount")
      .exec();
    // .populate('wallet')
    // .populate('activities')
    // .exec();
    const wallet = await Wallet.findOne({ user: user._id }).exec();
    // const activities = await Activities.find({ user: user._id }).exec();
    const walletHistories = await WalletHistory.find({
      user: user._id,
      status: { $nin: ["pending", "Pending"] },
    })
      .sort({ createdAt: -1 })
      .exec();
    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }
    userDetails.wallet = wallet;
    // if (!activities) {
    //   return res.status(404).json({ error: "Activities not found" });
    // }
    // userDetails.activities = activities;
    if (walletHistories) {
      userDetails.walletHistories = walletHistories;
    }
    const referredUserIds = user.referredUsers;
    console.log(referredUserIds);

    // Fetch information about the referred users
    const referredUsers = await User.find({ _id: { $in: referredUserIds } });
    // console.log('Populated User:', userDetails);
    if (!userDetails) {
      return res.status(404).json({
        errors: [
          {
            error: "User's details not found",
          },
        ],
      });
    }
    return res
      .status(200)
      .json({ msg: "User successfully fetched", userDetails });
  } catch (error) {
    console.log("ERROR GETING USER DETAILS=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
exports.getUserFullInfo = async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.user;
    console.log("ID=>", id);

    // Assuming User and UserInfo models are correctly imported
    const user = await User.findById(id);
    console.log("USER=>", user);

    // Now, call aggregateUserInfo with the id directly
    // const userInfos = await UserInfo.aggregateUserInfo(id);
    // console.log(userInfos);

    const userInfo = await UserInfo.find({ user: id }).populate("user").exec();
    console.log("Populated User:", userInfo);
    if (!userInfo) {
      return res.status(404).json({
        errors: [
          {
            error: "User's informations not found",
          },
        ],
      });
    }
    return res.status(200).json({ msg: "User successfully fetched", userInfo });
  } catch (error) {
    console.log("ERROR GETING USER INFORMATIONS=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// GET A USER'S ACTIVITY
exports.getUserActivity = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("ID=>", id);
    const user = await User.findById(id);
    console.log("USER=>", user);
    if (!user) {
      return res.status(404).json({
        errors: [
          {
            error: "User not found",
          },
        ],
      });
    }
    const userActivities = await Activities.find({ user: id })
      .sort({ timestamp: -1 })
      .populate("user", "-password")
      .exec();
    if (!userActivities) {
      return res.status(404).json({
        errors: [
          {
            error: "User's Activities not found",
          },
        ],
      });
    }

    return res
      .status(200)
      .json({ msg: "User Activities Successfully Fetched", userActivities });
  } catch (error) {
    console.log("ERROR GETING USER ACTIVITIES=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
  // try {
  //   const { id } = req.user;
  //   const userActivities = await Activities.findById({ user:id }).sort({ timestamp: -1 });
  //   if (!userActivities) {
  //     return res.status(404).json({
  //       errors: [
  //         {
  //           error: "User's activities not found",
  //         },
  //       ],
  //     });
  //   }
  //   return res.status(200).json({ msg: "User Activities Successfully Fetched", userActivities });
  // } catch (error) {
  //   console.log("ERROR GETING USER ACTIVITIES=>", error);
  //   res.status(500).json({
  //     errors: [
  //       {
  //         error: "Server Error",
  //       },
  //     ],
  //   });
  // }
};

// USER LOGOUT
exports.userLogout = async (req, res) => {
  const { email, role: userRole } = req.user;
  const user = await User.findOne({ email });

  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    await BlacklistToken.create({ token });

    const fcmToken = await FCMToken.findOne({ user: user._id });
    if (fcmToken) {
      fcmToken.token = null;
      fcmToken.deviceType = null;
      fcmToken.deviceName = null;
      await fcmToken.save();
    }

    if (
      [
        "account",
        "super-admin",
        "admin",
        "marketing",
        "tester",
        "sales",
      ].includes(userRole)
    ) {
      await recordAdminLogout(user);
    }

    res.status(200).json({ message: "Logout Success" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET ADMIN HISTORY
exports.adminHistory = async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.user;
    const { startDate, endDate } = req.query;

    const query = {};

    if (startDate && endDate) {
      query.in = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const history = await AdminHistory.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password");

    return res
      .status(200)
      .json({ msg: "Admin History successfully fetched", history });
  } catch (error) {
    console.log("ERROR GETING ADMIN HISTORY=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// DELETE USER FOR TESTING (by email)
exports.deleteUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndDelete({ email });
    console.log("USER=>", user);

    if (!user) {
      return res.status(404).json({
        errors: [
          {
            error: "User not found",
          },
        ],
      });
    }

    res.status(200).json({
      msg: "User Deleted",
    });
  } catch (error) {
    console.log("DELETE USER ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// DELETE USER (where a user can delete their account by id)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete related data from Wallet collection
    await Wallet.deleteMany({ user: id });

    // Delete related data from Rent collection
    await SpaceRent.deleteMany({ user: id });

    // Delete related data from Activities collection
    await Activities.deleteMany({ user: id });
    await FCMToken.deleteMany({ user: id });
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        errors: [
          {
            error: "User not found",
          },
        ],
      });
    }

    res.status(200).json({
      msg: "User Deleted",
    });
  } catch (error) {
    console.error("DELETE USER ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// Function to check referral money expiry
function isReferralMoneyExpired(referralDate) {
  const expiryDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const currentTimestamp = Date.now();

  return currentTimestamp - referralDate.getTime() > expiryDuration;
}

exports.referrals = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the referring user
    const referringUser = await User.findById(userId).populate("referredUsers");

    if (referringUser) {
      // Filter out expired referral rewards
      const validReferredUsers = referringUser.referredUsers.filter(
        (referredUser) => {
          return !isReferralMoneyExpired(referredUser.createdAt);
        }
      );

      res.status(200).json(validReferredUsers);
    }
  } catch (error) {
    console.error("REFERRAL ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }

  // Example controller function to handle fetching referred users for a referrer
};

exports.fetchReferredUsers = async (req, res) => {
  const { id } = req.user;
  try {
    // Assuming you have access to referrerId from the request or session

    // Fetch the referrer document
    const referrer = await User.findById(id);

    if (!referrer) {
      return res.status(404).json({ error: "Referrer not found" });
    }

    // Get the IDs of the referred users
    const referredUserIds = referrer.referredUsers;
    console.log(referredUserIds);

    // Fetch information about the referred users
    const referredUsers = await User.find({ _id: { $in: referredUserIds } });

    // Respond with the list of referred users
    res.json({ referredUsers });
  } catch (error) {
    console.error("REFERRAL ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const projection = {
      firstName: 1,
      lastName: 1,
      email: 1,
      phoneNumber: 1,
      avatar: 1,
      referral_code: 1,
      dva_name: 1,
      dva_number: 1,
      utility_points: 1,
      has_verified_email: 1,
      has_verified_bvn: 1,
    };

    const [user, wallet] = await Promise.all([
      User.findById(userId, projection).lean(),
      Wallet.findOne({ user: userId }, { _id: 1, mainBalance: 1 })
        .select("-_id mainBalance")
        .lean(),
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      firstName,
      lastName,
      email,
      avatar,
      referral_code,
      dva_name,
      dva_number,
      utility_points,
      has_verified_email,
      has_verified_bvn,
    } = user;
    const avatarUrl = avatar && avatar.url;
    const fullname = `${firstName} ${lastName}`;

    const trimmedResponse = {
      fullname,
      email,
      phoneNumber: user.phoneNumber || "",
      has_verified_email,
      has_verified_bvn,
      referral_code,
      defaultAccountName: dva_name,
      defaultAccountNumber: dva_number,
      avatar: { url: avatarUrl },
      utility_points,
      wallet: {
        _id: wallet._id,
        mainBalance: wallet.mainBalance || 0,
      },
    };

    res.status(200).json({
      statusCode: 200,
      message: "Successfully fetched user",
      user: trimmedResponse,
    });
  } catch (error) {
    console.error("GET SINGLE USER ERROR=>", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.fetchUserReferralTree = async (req, res) => {
  const { userId } = req.query;

  try {
    const referrer = await User.findById(userId).populate("referredUsers");

    if (!referrer) {
      return res.status(404).json({ error: "User not found" });
    }

    const fetchReferralTree = async (user) => {
      const { _id, firstName, lastName, avatar } = user;
      const trimmedUser = {
        _id,
        fullName: `${firstName} ${lastName}`,
        avatarUrl: avatar.url,
      };
      const referralTree = {
        user: trimmedUser,
        children: [],
        totalChildrenCount: 0,
      };

      const referredUserIds = user.referredUsers.map((user) => user._id);
      const referredUsers = await User.find({
        _id: { $in: referredUserIds },
      }).populate("referredUsers");

      for (const referredUser of referredUsers) {
        const childTree = await fetchReferralTree(referredUser);
        referralTree.children.push(childTree);
        referralTree.totalChildrenCount += childTree.totalChildrenCount + 1;
      }

      return referralTree;
    };

    const referralTree = await fetchReferralTree(referrer);

    res.json({ referralTree });
  } catch (error) {
    console.error("REFERRAL ERROR=>", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.createWithdrawalAccount = async (req, res) => {
  const userData = req.user;

  console.log(userData);

  try {
    const parsedBody = WithdrawalAccountSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.issues });
    }

    const { bankName, accountNumber, accountHolderName, bankCode } =
      parsedBody.data;

    if (userData.withdrawalAccount) {
      return res
        .status(400)
        .json({ error: "User already has a withdrawal account" });
    }

    const newWithdrawalAccount = new WithdrawalAccount({
      bankName,
      accountNumber,
      accountHolderName,
      bankCode,
      user: userData._id,
    });

    await newWithdrawalAccount.save();

    userData.withdrawalAccount = newWithdrawalAccount._id;
    await userData.save();

    res.status(201).json(newWithdrawalAccount);
  } catch (error) {
    console.error("add a withdrawal account error=>", error);
    res.status(500).json({ error: error.message });
  }
};
