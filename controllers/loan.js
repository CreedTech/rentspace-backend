const { uploader } = require("cloudinary").v2;
const User = require("../models/User");
const SpaceRent = require("../models/SpaceRent");

const LoanApplication = require("../models/Loan");
const LoanApplicationSchema = require("../validations/loan");
const { hasPaid70Percent } = require("../utils/spaceRent");
const { trimUserPortfolio } = require("../utils/trimObjects");

exports.applyForLoan = async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("User not found");

    const validationResult = LoanApplicationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.issues });
    }

    const {
      spaceRent,
      reason,
      personalID,
      landlordOrAgent,
      occupation,
      guarantor,
    } = validationResult.data;

    const [existingLoan, spaceRentInstance] = await Promise.all([
      LoanApplication.findOne({ user: user._id, spaceRent }),
      SpaceRent.findById(spaceRent),
    ]);

    if (existingLoan) {
      return res.status(400).json({
        error: "A loan application already exists for this SpaceRent and user.",
      });
    }

    if (!spaceRentInstance) {
      return res.status(404).json({
        error: "SpaceRent not found.",
      });
    }

    const paid70Percent = hasPaid70Percent(spaceRentInstance);
    if (!paid70Percent) {
      return res.status(400).json({
        error:
          "Cannot apply for a loan. SpaceRent has not been paid 70% or more.",
      });
    }

    const loanApplication = new LoanApplication({
      user: user._id,
      spaceRent,
      reason,
      personalID,
      landlordOrAgent,
      occupation,
      guarantor,
    });

    await loanApplication.save();

    spaceRentInstance.loanApplication = loanApplication._id;
    user.loanApplications.push(loanApplication._id);

    await Promise.all([spaceRentInstance.save(), user.save()]);

    res.status(201).json({
      msg: "Loan application submitted successfully",
      loanApplication,
    });
  } catch (error) {
    console.error("Error applying for loan =>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.uploadUtilityBill = async (req, res) => {
  const MAX_RETRY_ATTEMPTS = 3;

  try {
    const { spaceRent } = req.body;

    const loanApplication = await LoanApplication.findOne({ spaceRent });
    if (!loanApplication) {
      return res.status(404).json({
        error: "Loan application not found for the provided SpaceRent.",
      });
    }

    let result;
    let retryAttempts = 0;

    while (retryAttempts < MAX_RETRY_ATTEMPTS) {
      try {
        const fileBuffer = req.file.buffer;
        const fileString = fileBuffer.toString("base64");

        result = await uploader.upload(`data:image/png;base64,${fileString}`, {
          folder: "utilityBills",
        });

        break;
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary =>", uploadError);
        retryAttempts++;

        if (retryAttempts < MAX_RETRY_ATTEMPTS) {
          console.log(`Retrying upload (attempt ${retryAttempts})...`);
        } else {
          throw uploadError;
        }
      }
    }

    const updatedLoanApplication = await LoanApplication.findOneAndUpdate(
      { spaceRent },
      {
        $set: {
          "proofOfResidence.utilityBill.public_id": result.public_id,
          "proofOfResidence.utilityBill.url": result.secure_url,
        },
      },
      { new: true }
    );

    if (!updatedLoanApplication) {
      return res.status(404).json({ error: "Loan application not found" });
    }

    res.status(200).json({
      msg: "Utility Bill Uploaded Successfully",
      loanApplication: updatedLoanApplication,
    });
  } catch (error) {
    console.error("UPLOAD UTILITY BILL ERROR =>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
exports.getUserLoans = async (req, res) => {
  try {
    const userId = req.user._id;
    const userPortfolio = await User.findById(userId)
      .populate({
        path: "loanApplications",
        populate: {
          path: "spaceRent",
        },
      })
      .lean()
      .exec();

    const basicPortfolio = trimUserPortfolio(userPortfolio);

    res.status(200).json({
      msg: "OK",
      userPortfolio: basicPortfolio,
    });
  } catch (error) {
    console.error("UPLOAD UTILITY BILL ERROR =>", error);

    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
