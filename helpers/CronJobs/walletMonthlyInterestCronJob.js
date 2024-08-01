const Wallet = require("../../models/Wallet");
const WalletHistory = require("../../models/WalletHistory");
const FCMToken = require("../../models/FCMToken");
const { getMessaging } = require("firebase-admin/messaging");
const cron = require("node-cron");

const startMonthlyInterestCreditCronJob = () => {
  cron.schedule("0 0 1 * *", async () => {
    console.log("Running monthly interest credit cron job...");
    try {
      await creditMonthlyInterest();
      console.log("Monthly interest credited successfully.");
    } catch (error) {
      console.error("Error crediting monthly interest:", error);
    }
  });
};

const creditMonthlyInterest = async () => {
  try {
    const wallets = await Wallet.find({
      monthlyAccumulatedInterest: { $gt: 0 },
    });

    if (!wallets.length) {
      console.log("No wallets found for monthly interest credit.");
      return;
    }

    const bulkWalletOps = [];
    const walletHistoryDocs = [];
    const notificationPromises = [];

    for (const wallet of wallets) {
      const interest = wallet.monthlyAccumulatedInterest;

      wallet.mainBalance = parseFloat(
        (wallet.mainBalance + interest).toFixed(2)
      );
      wallet.accumulatedInterest = parseFloat(
        (wallet.accumulatedInterest + interest).toFixed(2)
      );
      wallet.monthlyAccumulatedInterest = 0;

      bulkWalletOps.push({
        updateOne: {
          filter: { _id: wallet._id },
          update: {
            $set: {
              mainBalance: wallet.mainBalance,
              accumulatedInterest: wallet.accumulatedInterest,
              monthlyAccumulatedInterest: 0,
            },
          },
        },
      });

      walletHistoryDocs.push({
        user: wallet.user._id,
        transactionType: "Credit",
        amount: interest,
        description: "Monthly Space Wallet Interest",
      });

      notificationPromises.push(sendNotification(wallet.user._id, interest));

      console.log(`Interest ${interest} credited to wallet ID: ${wallet._id}`);
    }

    await Promise.all([
      Wallet.bulkWrite(bulkWalletOps),
      WalletHistory.insertMany(walletHistoryDocs),
      ...notificationPromises,
    ]);
  } catch (error) {
    console.error("Error processing monthly interest credit:", error);
  }
};

const sendNotification = async (userId, interest) => {
  try {
    const fcmToken = await FCMToken.findOne({ user: userId });
    if (fcmToken && fcmToken.token) {
      const message = {
        notification: {
          title: "RentSpace",
          body: `You have received ₦${interest} in interest for last month. Great Job! 🚀`,
        },
        data: {
          notificationType: "interest",
          amount: interest.toFixed(2).toString(),
        },
        token: fcmToken.token,
      };
      await getMessaging().send(message);
      console.log(`Sent notification for user ID: ${userId}`);
    }
  } catch (error) {
    console.error(`Error sending notification for user ID: ${userId}:`, error);
  }
};

module.exports = startMonthlyInterestCreditCronJob;
