require("module-alias/register");
require("reflect-metadata");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const startCronJob = require("../helpers/CronJobs/paymentCronJob");
const startSpaceRentInterestCronJob = require("../helpers/CronJobs/spaceRentInterestCronJob");
const startDailyInterestCronJob = require("../helpers/CronJobs/spaceWalletInterestCronJob");
const startMonthlyInterestCreditCronJob = require("../helpers/CronJobs/walletMonthlyInterestCronJob");
const resetNextWithdrawalDatesInBatchesCron = require("../helpers/CronJobs/walletNextWithdrawalDateCron");
const deleteUserSpaceRentCron = require("../helpers/CronJobs/deleteSpaceRentCron");
const sendSurveyCron = require("../helpers/survey");

const db = require("../configs/dbConfig");
const { AppError } = require("../helpers/error");
const { expressPinoLogger, logger } = require("../utils/logger.util");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const {
  startAllQueuesAndWorkers,
  stopAllQueuesAndWorkers,
} = require("../queues/index");
const { trxQueue } = require("../queues/transactionQueue");
const { emailQueue } = require("../queues/emailQueue");
const { bvnVerificationQueue } = require("../queues/bvnReminderQueue");
const { spaceRentQueue } = require("../queues/spaceRentQueue");
const {
  spaceRentFirstDepositQueue,
} = require("../queues/spaceRentFirstDepositQueue");

const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const hpp = require("hpp");


// App Init
const app = express();

// Trust the first hop of the proxy
app.set("trust proxy", 1);

app.use(hpp());

// Define API version prefix
const apiVersion = "/api/v1";

// Start the email worker and queues
(async () => {
  await startAllQueuesAndWorkers();
  console.log("Redis Queue started");
  // loggerService.info('Email queue started!', 'trxQueue');
})();

// QUEUE
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(`${apiVersion}/queue`);
createBullBoard({
  queues: [
    new BullMQAdapter(trxQueue, { readOnlyMode: true }),
    new BullMQAdapter(bvnVerificationQueue, { readOnlyMode: true }),
    new BullMQAdapter(spaceRentQueue, { readOnlyMode: true }),
    new BullMQAdapter(spaceRentFirstDepositQueue, { readOnlyMode: true }),
    new BullMQAdapter(emailQueue, { readOnlyMode: true }),
  ],
  serverAdapter,
});

app.use(helmet());
// Middlewares
const allowedOrigins = [
  "https://dashboard-rentspace.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow requests from the specified origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressPinoLogger({ logger }));
app.use(mongoSanitize());
app.use(`${apiVersion}/queue`, serverAdapter.getRouter());
// App Home Route
app.use(xss());
app.get("/", (req, res) => {
  res.send("Welcome to the RentSpace API");
});

// Register Routes

require("../routes/index.routes")(app);

// Calling the db connection function.
db();

startCronJob();
deleteUserSpaceRentCron();
startSpaceRentInterestCronJob();
startDailyInterestCronJob()
startMonthlyInterestCreditCronJob()
resetNextWithdrawalDatesInBatchesCron();
sendSurveyCron()

app.use((error, req, res, next) => {
  error.status = error.status || "error";
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    errors: [
      {
        error: error.message,
      },
    ],
  });
});
app.all("*", (req, res, next) => {
  res.status(404).json({
    errors: [
      {
        error: `Can't find ${req.originalUrl} on this server`,
      },
    ],
  });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

/**
 *  uncaughtException handler
 */
process.on("uncaughtException", async (error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Server Shutting down...");
  console.log(error.name, error.message);
  // logger.error('UNCAUGHT EXCEPTION!! 💥 Server Shutting down... ' + new Date(Date.now()) + error.name, error.message);
  await stopAllQueuesAndWorkers();
  process.exit(1);
});

/**
 * unhandledRejection  handler
 */

process.on("unhandledRejection", async (error) => {
  console.log("UNHANDLED REJECTION! 💥 Server Shutting down...");
  console.log(error.name, error.message);
  // logger.error('UNHANDLED REJECTION! 💥 Server Shutting down... ' + new Date(Date.now()) + error.name, error.message);
  await stopAllQueuesAndWorkers();
  process.exit(1);
});

module.exports = app;
