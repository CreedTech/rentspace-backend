const {
  startTransactionQueue,
  stopTransactionQueue,
} = require("./transactionQueue");
const {
  startBVNVerificationQueue,
  stopBVNVerificationQueue,
} = require("./bvnReminderQueue");

const { startSpaceRentQueue, stopSpaceRentQueue } = require("./spaceRentQueue");
const {
  startSpaceRentFirstDepositQueue,
  stopSpaceRentFirstDepositQueue,
} = require("./spaceRentFirstDepositQueue");

const { startEmailQueue, stopEmailQueue } = require("./emailQueue");
const startAllQueuesAndWorkers = async () => {
  await startTransactionQueue();
  await startBVNVerificationQueue();
  await startSpaceRentQueue();
  await startSpaceRentFirstDepositQueue();
  await startEmailQueue();
};

const stopAllQueuesAndWorkers = async () => {
  await stopTransactionQueue();
  await stopBVNVerificationQueue();
  await stopSpaceRentQueue();
  await stopSpaceRentFirstDepositQueue();
  await stopEmailQueue();
};

module.exports = {
  startAllQueuesAndWorkers,
  stopAllQueuesAndWorkers,
};
