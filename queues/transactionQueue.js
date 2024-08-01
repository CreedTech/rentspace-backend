const { Queue, QueueEvents, Worker } = require("bullmq");
const connection = require('./redisConnection');
const {
  ProvidusTransactionStatus,
} = require("../controllers/providusVirtualAccount");



const trxQueue = new Queue("trxQueue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});


const addTrxToQueue = async (data) => {
  console.log("Inside addTrxToQueue function");
  try {
    // This is the data for the queue
    console.log("Trying to add trx to queue");
    console.log("This is the data for the queue:", data);
    // Convert 15 minutes to milliseconds
    const delayInMilliseconds = 15 * 60 * 1000; // 15 minutes * 60 seconds * 1000 milliseconds
    await trxQueue.add("trx-requery", data, { delay: delayInMilliseconds });
    console.log("Transaction added to the queue with a delay of 15 minutes");
  } catch (error) {
    console.error("Error enqueueing Transaction job:", error);
    throw error;
  }
};


const workerOptions = {
  connection,
  limiter: { max: 1, duration: 1000 }, // Process 1 trx every second due to rate limiting 
  lockDuration: 5000, // 5 seconds to process the job before it can be picked up by another worker
  removeOnComplete: {
    age: 3600, // Keep up to 1 hour
    count: 1000, // Keep up to 1000 jobs
  },
  removeOnFail: {
    age: 24 * 3600, // Keep up to 24 hours
  },
  concurrency: 5, // Process 5 jobs concurrently
};

// Create a worker to process jobs from the email queue
const trxWorker = new Worker(
  "trxQueue",
  async (job) => {
    // Parse job data and send email
    const { transactionReference, transferType } = job.data;
    console.log("Processing job with transactionReference:", transactionReference, "and transferType:", transferType);
    await ProvidusTransactionStatus(transactionReference, transferType);
  },
  workerOptions
);

trxWorker.on("error", (err) => {
  // Log the error
  console.error("Worker encountered an error:", err);
});

// Event Listeners
// Create a queue event listener
const transactionQueueEvent = new QueueEvents("trxQueue", { connection });

transactionQueueEvent.on("failed", ({ jobId, failedReason }) => {
  console.log(`Job ${jobId} failed with error ${failedReason}`);
  // Handle the failure
});

transactionQueueEvent.on("waiting", ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

transactionQueueEvent.on("completed", ({ jobId, returnvalue }) => {
  console.log(`Job ${jobId} completed with return value:`, returnvalue);
});


// Start and stop functions for the transaction queue
const startTransactionQueue = async () => {
  await trxQueue.waitUntilReady();
  await trxWorker.waitUntilReady();
  await transactionQueueEvent.waitUntilReady();
};

const stopTransactionQueue = async () => {
  await trxQueue.close();
  await trxWorker.close();
  console.info("Transaction queue closed!");
};

module.exports = {
  addTrxToQueue,
  trxQueue,
  transactionQueueEvent,
  trxWorker,
  startTransactionQueue,
  stopTransactionQueue,
};
