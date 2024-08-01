const { Queue, Worker, QueueEvents } = require("bullmq");
const connection = require("./redisConnection");
const { findUserById } = require("../services/user");
const { sendSpaceRentFirstDepositEmail } = require("./helpers/email");

const spaceRentFirstDepositQueue = new Queue("spaceRentFirstDepositQueue", {
  connection,
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: "fixed",
      delay: 1000,
    },
  },
});

const addSpaceRentFirstDepositCheckToQueue = async (data) => {
  console.log("Adding SpaceRent first deposit check to queue");
  const delayInMilliseconds = 1 * 60 * 60 * 1000; // 1 hour
  await spaceRentFirstDepositQueue.add("spaceRent-first-deposit", data, {
    delay: delayInMilliseconds,
  });
};

const workerOptions = {
  connection,
  removeOnComplete: {
    age: 3600,
    count: 1000,
  },
  removeOnFail: {
    age: 24 * 3600,
  },
  concurrency: 5,
};

const spaceRentFirstDepositWorker = new Worker(
  "spaceRentFirstDepositQueue",
  async (job) => {
    const { userId } = job.data;

    try {
      const user = await findUserById(userId);

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      await sendSpaceRentFirstDepositEmail(user.email, user.firstName);
      return { status: "reminder sent", email: user.email };
    } catch (error) {
      console.error(
        "Error processing job in spaceRentFirstDepositWorker:",
        error
      );
      return { status: "error", message: error.message };
    }
  },
  workerOptions
);

spaceRentFirstDepositWorker.on("error", (err) => {
  console.error("SpaceRent First Deposit Worker encountered an error:", err);
});

const spaceRentFirstDepositQueueEvents = new QueueEvents(
  "spaceRentFirstDepositQueue",
  {
    connection,
  }
);

spaceRentFirstDepositQueueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(
    `SpaceRent First Deposit Job ${jobId} failed with error ${failedReason}`
  );
});

spaceRentFirstDepositQueueEvents.on("waiting", ({ jobId }) => {
  console.log(`A SpaceRent First Deposit job with ID ${jobId} is waiting`);
});

spaceRentFirstDepositQueueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(
    `SpaceRent First Deposit Job ${jobId} completed with return value:`,
    returnvalue
  );
});

const startSpaceRentFirstDepositQueue = async () => {
  await spaceRentFirstDepositQueue.waitUntilReady();
  await spaceRentFirstDepositWorker.waitUntilReady();
  await spaceRentFirstDepositQueueEvents.waitUntilReady();
};

const stopSpaceRentFirstDepositQueue = async () => {
  await spaceRentFirstDepositQueue.close();
  await spaceRentFirstDepositWorker.close();
  console.info("SpaceRent First Deposit queue closed!");
};

module.exports = {
  spaceRentFirstDepositQueue,
  addSpaceRentFirstDepositCheckToQueue,
  startSpaceRentFirstDepositQueue,
  stopSpaceRentFirstDepositQueue,
};
