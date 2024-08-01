const cron = require("node-cron");
const Wallet = require("../../models/Wallet");

const logWithTimestamp = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

const resetNextWithdrawalDatesInBatchesCron = async () => {
  const batchSize = 50;
  const maxRetries = 3;

  try {
    let offset = 0;
    let usersToUpdate;
    let batchNumber = 1;

    do {
      logWithTimestamp(`Fetching users to update (Batch ${batchNumber}, Offset ${offset}, Batch Size ${batchSize})...`);
      usersToUpdate = await Wallet.find({ nextWithdrawalDate: { $lt: new Date() } })
        .skip(offset)
        .limit(batchSize);

      logWithTimestamp(`Fetched ${usersToUpdate.length} users to update.`);

      await Promise.all(usersToUpdate.map(async (user) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            await Wallet.updateOne({ _id: user._id }, { nextWithdrawalDate: null });
            logWithTimestamp(`Updated user with ID ${user._id}`);
            break;
          } catch (updateError) {
            logWithTimestamp(`Error updating user with ID ${user._id} (Attempt ${attempt}): ${updateError}`);
            if (attempt === maxRetries) {
              logWithTimestamp(`Failed to update user with ID ${user._id} after ${maxRetries} attempts.`);
            }
          }
        }
      }));

      offset += batchSize;
      batchNumber++;
    } while (usersToUpdate.length === batchSize);

    logWithTimestamp("Completed batch update for next withdrawal dates.");
  } catch (error) {
    logWithTimestamp(`Error updating next withdrawal dates: ${error}`);
  }
};

//Runs at 12:01 server time
cron.schedule("1 0 * * *", async () => {
  console.log("Running withdrawal reset cron job...");
  await resetNextWithdrawalDatesInBatchesCron();
});

module.exports = resetNextWithdrawalDatesInBatchesCron;

