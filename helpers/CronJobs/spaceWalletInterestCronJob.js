const Wallet = require("../../models/Wallet");
const SpaceWalletInterestHistory = require("../../models/SpaceWalletInterestHistory");
const { calculateSpaceWalletInterest } = require("../../services/interestCalculator");
const cron = require("node-cron");

const startDailyInterestCronJob = () => {
  cron.schedule("0 4 * * *", async () => {
    console.log("Running daily interest cron job...");
    try {
      await applyDailyInterest();
      console.log("Daily interest applied successfully.");
    } catch (error) {
      console.error("Error applying daily interest:", error);
    }
  });
};

const applyDailyInterest = async () => {
  try {
    const wallets = await Wallet.find({ mainBalance: { $gt: 0 } });
    if (!wallets.length) {
      console.log("No wallets found for interest calculation.");
      return;
    }

    const bulkOps = [];
    const interestHistoryDocs = [];

    for (const wallet of wallets) {
      let interest = calculateSpaceWalletInterest(wallet.mainBalance);
      interest = parseFloat(interest.toFixed(2));

      if (interest > 0) {
        wallet.monthlyAccumulatedInterest = parseFloat((wallet.monthlyAccumulatedInterest + interest).toFixed(2));
        
        bulkOps.push({
          updateOne: {
            filter: { _id: wallet._id },
            update: { $set: { monthlyAccumulatedInterest: wallet.monthlyAccumulatedInterest } }
          }
        });

        interestHistoryDocs.push({
          wallet: wallet._id,
          interestAmount: interest,
        });

        console.log(`Interest ${interest} applied to wallet ID: ${wallet._id}`);
      } else {
        console.log(`No interest applied to wallet ID: ${wallet._id} due to zero interest.`);
      }
    }

    if (bulkOps.length > 0) {
      await Wallet.bulkWrite(bulkOps);
    }

    if (interestHistoryDocs.length > 0) {
      await SpaceWalletInterestHistory.insertMany(interestHistoryDocs);
    }
  } catch (error) {
    console.error("Error processing daily interest:", error);
  }
};

module.exports = startDailyInterestCronJob;