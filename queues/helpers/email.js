const {
  reminderMailForBVNVerification,
  reminderMailForSpaceRent,
  firstDepositMailForSpaceRent,
  missedFirstDepositMailForSpaceRent,
} = require("../../helpers/mails/emailTemplates");
const sendEmail = require("../../services/email");

exports.sendBVNVerificationReminder = async (email, username) => {
  try {
    const mailOptions = {
      to: email,
      subject: "BVN Verification Reminder",
      text: "Please verify your BVN to complete your registration process.",
      html: reminderMailForBVNVerification(username),
    };

    sendEmail(mailOptions);

    console.log("BVN verification reminder sent to:", email);
  } catch (error) {
    console.error("Error sending BVN verification reminder:", error);
    throw error;
  }
};

exports.sendSpaceRentReminder = async (email, firstName) => {
  try {
    const mailOptions = {
      to: email,
      subject: "Final Step! Start Saving on SpaceRent and Reach Your Goals",
      text: "We noticed you’re interested in starting a SpaceRent plan.",
      html: reminderMailForSpaceRent(firstName),
    };
    sendEmail(mailOptions);
    console.log("SpaceRent reminder sent to:", email);
  } catch (error) {
    console.error("Error sending SpaceRent reminder:", error);
    throw error;
  }
};
exports.sendSpaceRentFirstDepositEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      to: email,
      subject:
        "Congrats on Starting Your SpaceRent Plan! Keep Saving and Reap the Benefits!",
      text: "Congratulations on starting your SpaceRent plan!",
      html: firstDepositMailForSpaceRent(firstName),
    };
    sendEmail(mailOptions);
  } catch (error) {
    console.error("Error sending SpaceRent first deposit email:", error);
    throw error;
  }
};

exports.sendMissedPaymentEmail = async (email, firstName) => {
  try {
    const mailOptions = {
      to: email,
      subject: "Missed First Deposit for SpaceRent Plan - Let's Get Started!",
      text: "We noticed you missed your initial deposit for SpaceRent. Let's get back on track!",
      html: missedFirstDepositMailForSpaceRent(firstName),
    };
    sendEmail(mailOptions);
  } catch (error) {
    console.error("Error sending SpaceRent missed first deposit email:", error);
    throw error;
  }
};
