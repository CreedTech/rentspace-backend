const { Queue, Worker, QueueEvents } = require("bullmq");
const connection = require("./redisConnection");
const { findUserById } = require("../services/user");
const { sendBVNVerificationReminder} = require("./helpers/email")

const bvnVerificationQueue = new Queue("bvnVerificationQueue", {
  connection,
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: "fixed",
      delay: 1000,
    },
  },
});

const addBVNVerificationCheckToQueue = async (data) => {
  console.log("Adding BVN verification check to queue");
  const delayInMilliseconds = 60 * 60 * 1000; // 1 hour
  await bvnVerificationQueue.add("bvn-verification", data, {
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

const bvnVerificationWorker = new Worker(
    "bvnVerificationQueue",
    async (job) => {
      const { userId } = job.data;
      const user = await findUserById(userId);
  
      if (!user.has_verified_bvn && !user.has_bvn) {
        await sendBVNVerificationReminder(user.email, user.userName);
        return { status: "reminder sent", email: user.email }; 
      } else {
        return { status: "no reminder needed", email: user.email };
      }
    },
    workerOptions
  );
  

bvnVerificationWorker.on("error", (err) => {
  console.error("BVN Verification Worker encountered an error:", err);
});

const bvnVerificationQueueEvents = new QueueEvents("bvnVerificationQueue", {
  connection,
});

bvnVerificationQueueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(
    `BVN Verification Job ${jobId} failed with error ${failedReason}`
  );
});

bvnVerificationQueueEvents.on("waiting", ({ jobId }) => {
  console.log(`A BVN Verification job with ID ${jobId} is waiting`);
});

bvnVerificationQueueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(
    `BVN Verification Job ${jobId} completed with return value:`,
    returnvalue
  );
});

const startBVNVerificationQueue = async () => {
  await bvnVerificationQueue.waitUntilReady();
  await bvnVerificationWorker.waitUntilReady();
  await bvnVerificationQueueEvents.waitUntilReady();
};

const stopBVNVerificationQueue = async () => {
  await bvnVerificationQueue.close();
  await bvnVerificationWorker.close();
  console.info("BVN Verification queue closed!");
};



module.exports = {
  bvnVerificationQueue,
  addBVNVerificationCheckToQueue,
  startBVNVerificationQueue,
  stopBVNVerificationQueue,
};
