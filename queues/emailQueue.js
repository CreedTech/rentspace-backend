const { Queue, QueueEvents, Worker } = require("bullmq");
const sendEmail = require("../services/email");
const connection = require("./redisConnection");

// Create a new connection in every node instance
const emailQueue = new Queue("emailQueue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

const addEmailToQueue = async (data) => {
  try {
    await emailQueue.add("send-email", data);
    console.log("Email added to the queue");
  } catch (error) {
    console.error("Error enqueueing email job:", error);
    throw error;
  }
};

const workerOptions = {
  connection,
  limiter: { max: 1, duration: 1000 },
  lockDuration: 5000,
  removeOnComplete: {
    age: 3600,
    count: 1000,
  },
  removeOnFail: {
    age: 24 * 3600,
  },
  concurrency: 5,
};

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    sendEmail(job.data);
  },
  workerOptions
);


const emailQueueEvent = new QueueEvents("emailQueue", { connection });

emailQueueEvent.on("failed", ({ jobId, failedReason }) => {
  console.log(`Job ${jobId} failed with error ${failedReason}`);
});

emailQueueEvent.on("waiting", ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

emailQueueEvent.on("completed", ({ jobId, returnvalue }) => {
  console.log(`Job ${jobId} completed`, returnvalue);
});

emailWorker.on("error", (err) => {
  console.error(err);
});

const startEmailQueue = async () => {
  await emailQueue.waitUntilReady();
  await emailWorker.waitUntilReady();
  await emailQueueEvent.waitUntilReady();
};

const stopEmailQueue = async () => {
  await emailWorker.close();
  await emailQueue.close();
  console.info("Email queue closed!");
};

module.exports = {
  addEmailToQueue,
  emailQueue,
  startEmailQueue,
  stopEmailQueue,
};
