const { Queue, Worker, QueueEvents } = require("bullmq");
const connection = require("./redisConnection");
const { findUserById } = require("../services/user");
const { sendSpaceRentReminder } = require("./helpers/email");

const spaceRentQueue = new Queue("spaceRentQueue", {
  connection,
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: "fixed",
      delay: 1000,
    },
  },
});

const addSpaceRentReminderToQueue = async (data) => {
  console.log("Adding SpaceRent reminder to queue");
  const delayInMilliseconds = 15 * 60 * 1000;
  await spaceRentQueue.add("space-rent-reminder", data, {
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

const spaceRentWorker = new Worker(
  "spaceRentQueue",
  async (job) => {
    const { userId, spaceRentId } = job.data;
    const user = await findUserById(userId);
    if (user && !user.has_paid) {
      console.log(
        `Sending SpaceRent: ${spaceRentId} for user: ${user.email} reminder to queue`
      );

      await sendSpaceRentReminder(user.email, user.firstName);
      return { status: "SpaceRent Funding Reminder sent", email: user.email };
    } else {
      return { status: "No Reminder Needed", email: user.email };
    }
  },
  workerOptions
);

spaceRentWorker.on("error", (err) => {
  console.error("SpaceRent Worker encountered an error:", err);
});

const spaceRentQueueEvents = new QueueEvents("spaceRentQueue", {
  connection,
});

spaceRentQueueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`SpaceRent Job ${jobId} failed with error ${failedReason}`);
});

spaceRentQueueEvents.on("waiting", ({ jobId }) => {
  console.log(`A SpaceRent job with ID ${jobId} is waiting`);
});

spaceRentQueueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(
    `SpaceRent Job ${jobId} completed with return value:`,
    returnvalue
  );
});

const startSpaceRentQueue = async () => {
  await spaceRentQueue.waitUntilReady();
  await spaceRentWorker.waitUntilReady();
  await spaceRentQueueEvents.waitUntilReady();
};

const stopSpaceRentQueue = async () => {
  await spaceRentQueue.close();
  await spaceRentWorker.close();
  console.info("SpaceRent queue closed!");
};

module.exports = {
  spaceRentQueue,
  addSpaceRentReminderToQueue,
  startSpaceRentQueue,
  stopSpaceRentQueue,
};
