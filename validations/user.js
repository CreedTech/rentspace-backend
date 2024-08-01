const z = require("zod");

const UserSchema = z
  .object({
    firstName: z.string({
      required_error: "firstname is required",
    }),
    lastName: z.string({
      required_error: "lastname is required",
    }),
    residential_address: z.string({
      required_error: "Address is required",
    }),
    referral_code: z.string().optional(),
    bvn: z.string().optional(),
    userName: z
      .string({
        required_error: "username is required",
      })
      .min(7, "username is too short"),
    gender: z.enum(["Male", "Female"]),
    email: z
      .string({
        required_error: "email is required",
      })
      .email("Invalid email"),
    phoneNumber: z
      .string({
        required_error: "phone number is required",
      })
      .min(10),
    password: z.string().min(8, "Password is too short"),
    date_of_birth: z.string({
      required_error: "Date Of Birth is required",
    }),
  })
  .strict();

const VerifyUserSchema = z
  .object({
    email: z
      .string({
        required_error: "email address is required",
      })
      .email("invalid email address"),
    otp: z
      .string({
        required_error: "otp is required",
      })
      .min(4, "otp must be 4 characters long")
      .max(4, "otp can only be 4 characters long"),
  })
  .strict();

const LoginUserSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(4).max(30),
    fcm_token: z.string().max(255),
    deviceType: z.string(),
    deviceName: z.string(),
  })
  .strict();

const VerifyPasswordOtpSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().min(4).max(5),
  })
  .strict();

const VerifySingleDeviceOtpSchema = z
  .object({
    email: z.string().email(),
    otp: z.string().min(4).max(5),
  })
  .strict();

const ResetPasswordSchema = z
  .object({
    repeatPassword: z.string().min(4, "Password is too short"),
    newPassword: z.string().min(4, "Password is too short"),
    email: z.string().email(),
  })
  .strict();

const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string().min(4, "Password is too short"),
    newPassword: z.string().min(4, "Password is too short"),
    email: z.string().email(),
  })
  .strict()
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password can not be the same as old password",
    path: ["newPassword"],
  });

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(4, "Password is too short"),
    newPassword: z.string().min(4, "Password is too short"),
    repeatNewPassword: z.string().min(4, "Password is too short"),
  })
  .strict();

const UpdateEmail = z
  .object({
    otp: z.string().optional(),
    email: z.string().email(),
    newEmail: z.string().email(),
    password: z.string().min(4, "Password is too short"),
  })
  .strict();

const UpdateEmailUpdated = z
  .object({
    email: z.string().email(),
    password: z.string(),
    newMail: z.string().email(),
  })
  .strict();

const UpdateUserProfile = z.object({
  userName: z.string().min(2, "username is too short"),
  // fullName: z.string().min(2, "fullname is too short"),
  // email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10),
});
const UpdateAppStatus = z.object({
  status: z.enum(["active", "inactive"]),
});
const AnnouncementSchema = z
  .object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
  })
  .strict();

const AccountSchema = z
  .object({
    accountName: z.string({
      required_error: "Account Name is required",
    }),
    bankName: z.string({
      required_error: "Bank Name is required",
    }),
  })
  .strict();
const FCMTokenSchema = z.object({
  fcm_token: z.string({
    required_error: "FCM Token is required",
  }),
});

module.exports = {
  UserSchema,
  VerifyUserSchema,
  LoginUserSchema,
  VerifyPasswordOtpSchema,
  UpdatePasswordSchema,
  ChangePasswordSchema,
  UpdateEmail,
  ResetPasswordSchema,
  UpdateEmailUpdated,
  UpdateUserProfile,
  UpdateAppStatus,
  AnnouncementSchema,
  AccountSchema,
  FCMTokenSchema,
  VerifySingleDeviceOtpSchema
};
