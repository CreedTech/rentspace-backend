const { Queue, Worker, QueueEvents } = require("bullmq");
const connection = require("./redisConnection");
const { findUserById } = require("../services/user");
const { sendMissedPaymentEmail } = require("./helpers/email");

const spaceRentMissedFirstPaymentQueue = new Queue(
  "spaceRentMissedFirstPaymentQueue",
  {
    connection,
    defaultJobOptions: {
      attempts: 1,
      backoff: {
        type: "fixed",
        delay: 1000,
      },
    },
  }
);

const addSpaceRentMissedFirstPaymentToQueue = async (data) => {
  console.log("Adding missed first payment check to queue");
  const delayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day
  await spaceRentMissedFirstPaymentQueue.add(
    "spaceRent-missed-first-payment",
    data,
    {
      delay: delayInMilliseconds
    }
  );
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

const spaceRentMissedFirstPaymentWorker = new Worker(
  "spaceRentMissedFirstPaymentQueue",
  async (job) => {
    const { userId } = job.data;
    const user = await findUserById(userId);

    await sendMissedPaymentEmail(user.email, user.firstName);
    return { status: "reminder sent", email: user.email };
  },
  workerOptions
);

spaceRentMissedFirstPaymentWorker.on("error", (err) => {
  console.error(
    "SpaceRent Missed First Payment Worker encountered an error:",
    err
  );
});

const spaceRentMissedFirstPaymentQueueEvents = new QueueEvents(
  "spaceRentMissedFirstPaymentQueue",
  {
    connection,
  }
);

spaceRentMissedFirstPaymentQueueEvents.on(
  "failed",
  ({ jobId, failedReason }) => {
    console.log(
      `SpaceRent Missed First Payment Job ${jobId} failed with error ${failedReason}`
    );
  }
);

spaceRentMissedFirstPaymentQueueEvents.on("waiting", ({ jobId }) => {
  console.log(
    `A SpaceRent Missed First Payment job with ID ${jobId} is waiting`
  );
});

spaceRentMissedFirstPaymentQueueEvents.on(
  "completed",
  ({ jobId, returnvalue }) => {
    console.log(
      `SpaceRent Missed First Payment Job ${jobId} completed with return value:`,
      returnvalue
    );
  }
);

const startSpaceRentMissedFirstPaymentQueue = async () => {
  await spaceRentMissedFirstPaymentQueue.waitUntilReady();
  await spaceRentMissedFirstPaymentWorker.waitUntilReady();
  await spaceRentMissedFirstPaymentQueueEvents.waitUntilReady();
};

const stopSpaceRentMissedFirstPaymentQueue = async () => {
  await spaceRentMissedFirstPaymentQueue.close();
  await spaceRentMissedFirstPaymentWorker.close();
  console.info("SpaceRent Missed First Payment queue closed!");
};

module.exports = {
  spaceRentMissedFirstPaymentQueue,
  addSpaceRentMissedFirstPaymentToQueue,
  startSpaceRentMissedFirstPaymentQueue,
  stopSpaceRentMissedFirstPaymentQueue,
};
