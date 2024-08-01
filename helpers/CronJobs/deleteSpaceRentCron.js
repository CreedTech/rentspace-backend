const cron = require("node-cron");
const SpaceRent = require("../../models/SpaceRent");
const sendEmail = require("../../services/email");
const { spaceRentDeletionReminderMail } = require("../mails/emailTemplates");

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date) => {
  const newDay = ("0" + date.getDate()).slice(-2);
  const newMonth = ("0" + (date.getMonth() + 1)).slice(-2);
  return `${newDay}/${newMonth}/${date.getFullYear()}`;
};

const deleteUserSpaceRentCron = () => {
  // Schedule to run at 3 AM UTC (4am WAT)
  cron.schedule("0 3 * * *", async () => {
    console.log("Cron job to delete SpaceRent started at", new Date());
    await sendReminderEmails();
    await deleteUnpaidSpaceRents();
  });
};

const sendReminderEmails = async () => {
  try {
    const today = new Date();
    const twoDaysFromNow = addDays(today, 2);
    const formattedTwoDaysFromNow = formatDate(twoDaysFromNow);

    // Find SpaceRents that will be deleted in 2 days
    const spaceRentsToNotify = await SpaceRent.find({
      has_paid: false,
      failedDebitCount: 1,
      next_date: formattedTwoDaysFromNow,
    }).populate('user'); 

    // Log the results to see if it actually populates
    console.log("SpaceRents to notify:", spaceRentsToNotify);

    for (const spaceRent of spaceRentsToNotify) {
      const user = spaceRent.user;

      if (user) {
        const data = {
          to: user.email,
          subject: "Your SpaceRent Plan Needs Action – Start Saving Today!",
          text: "We hope this message finds you well",
          html: spaceRentDeletionReminderMail(user.firstName)
        };
        console.log(
          `Sending email reminder for rent ${spaceRent._id} with name ${spaceRent.rentName}`
        );
        await sendEmail(data);
      } else {
        console.error(`User not found for SpaceRent ${spaceRent._id}`);
      }
    }
  } catch (error) {
    console.error("Error sending reminder emails for SpaceRents:", error);
  }
};

const deleteUnpaidSpaceRents = async () => {
  try {
    const result = await SpaceRent.deleteMany({
      has_paid: false,
      failedDebitCount: { $gte: 2 },
    });
    console.log(`Deleted ${result.deletedCount} unpaid space rents.`);
  } catch (error) {
    console.error("Error deleting unpaid space rents:", error);
  }
};

module.exports = deleteUserSpaceRentCron;
