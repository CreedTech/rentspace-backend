const express = require("express");
const userRouter = require("../routes/api/user.routes");
const authRouter = require("../routes/api/auth.routes");
const airtimeRouter = require("../routes/api/airtime.routes");
const electricityRouter = require("../routes/api/electricity.routes");
const dataRouter = require("../routes/api/data.routes");
const walletRouter = require("../routes/api/wallet.routes");
const accountRouter = require("../routes/api/account.routes");
// const waitlistRouter = require(".././routes/api/waitlist.routes");
const reportRouter = require("../routes/api/report-issue.routes");
const monifyRouter = require("../routes/api/monify.routes");
const watuRouter = require("../routes/api/watu.routes");
const bvnRouter = require("../routes/api/bvn.routes");
const cableRouter = require("../routes/api/cable.routes");
const bankRouter = require("../routes/api/bank.routes");
const dvaRouter = require("../routes/api/dva.routes");
const providusRouter = require("../routes/api/providus.routes");
const rentRouter = require("../routes/api/rent.routes");
const utilityRouter = require("../routes/api/utility.routes");
const notificationRouter = require("../routes/api/notification.routes");
const maintenanceRouter = require("../routes/api/maintenance.routes");
const announcementRouter = require("../routes/api/announcement.routes");
const loanRouter = require("../routes/api/loan.routes");

// define routes
module.exports = function routes(app) {
  app.use(express.json());

  // Registration & authentication routes.
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);

  // Airtime routes
  app.use("/api/", airtimeRouter);

  // Electricity_Bills routes
  app.use("/api/", electricityRouter);
  app.use("/api/", cableRouter);

  // Data subscription routes
  app.use("/api/", dataRouter);

  // Wallet routes
  app.use("/api/wallet", walletRouter);
  app.use("/api/account", accountRouter);



  // Report routes
  // app.use("/api/report", reportRouter);
  
  // Maintenance routes
  app.use("/api", maintenanceRouter);
  // Announcement routes
  app.use("/api", announcementRouter);

  // monify routes
  app.use("/api/monnify", monifyRouter);

  app.use("/api/watu", watuRouter);
  app.use("/api/bvn", bvnRouter);
  app.use("/api/dva", dvaRouter);
  app.use("/api/providus", providusRouter);

  // loan route
  app.use("/api/loan", loanRouter)



  app.use("/api/rent", rentRouter);
  app.use("/api/banks", bankRouter);
  app.use("/api/utilities", utilityRouter);
  app.use("/api",notificationRouter);
};
