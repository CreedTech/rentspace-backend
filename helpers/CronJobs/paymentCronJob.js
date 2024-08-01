const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const admin = require("firebase-admin");
const SpaceRent = require("../../models/SpaceRent");
const User = require("../../models/User");
const Wallet = require("../../models/Wallet");
const WebSocket = require("ws");
const sendEmail = require("../../services/email");
const {
  fundWalletMessage,
  upcomingRentPayment,
  failedDebit,
  successfulDebit,
} = require("../mails/emailTemplates");
const WalletHistory = require("../../models/WalletHistory");
const RentHistory = require("../../models/RentHistory");
const Activities = require("../../models/Activities");
const FCMToken = require("../../models/FCMToken");
const wss = new WebSocket.Server({ noServer: true });
const { getMessaging } = require("firebase-admin/messaging");
const { getRandom } = require("../token");
const { calculateRentSpacePoint } = require("../spacePoint");
const { addSpaceRentMissedFirstPaymentToQueue } = require("../../queues/missedSpaceRentFirstPaymentQueue")

const startCronJob = () => {
  cron.schedule(
    // 6 AM UTC, which will run at 7 AM local time if server time is off by 1 hour
    "0 6 * * *",
    async () => {
      console.log("Cron job started at", new Date());
      await executeCronJob();
    }
  );

  cron.schedule(
    // 10:50 PM UTC, which will run at 11:50 PM local time if server time is off by 1 hour
    "50 22 * * *",
    async () => {
      console.log("Cron job started at", new Date());
      await executeCronJob(true);
    }
  );
};

const executeCronJob = async (isEveningJob = false) => {
  try {
    console.log("Fetching active space rents...");
    const spaceRents = await SpaceRent.find({ isStopped: false });
    console.log(`Found ${spaceRents.length} active space rents`);

    const userIds = spaceRents.map((rent) => rent.user._id);
    console.log("Fetching users, wallets, and FCM tokens...");
    const [users, wallets, fcmTokens] = await Promise.all([
      User.find({ _id: { $in: userIds } }),
      Wallet.find({ user: { $in: userIds } }),
      FCMToken.find({ user: { $in: userIds } }),
    ]);

    console.log("Mapping users, wallets, and FCM tokens...");
    const userMap = users.reduce(
      (map, user) => ((map[user._id] = user), map),
      {}
    );
    const walletMap = wallets.reduce(
      (map, wallet) => ((map[wallet.user] = wallet), map),
      {}
    );
    const fcmTokenMap = fcmTokens.reduce(
      (map, token) => ((map[token.user] = token), map),
      {}
    );

    console.log("Processing each rent sequentially...");
    for (const rent of spaceRents) {
      await processRent(rent, userMap, walletMap, fcmTokenMap, isEveningJob);
    }

    if (isEveningJob) {
      console.log("Running second cron job of the day for date shifting...");
      await shiftNextPaymentDates(spaceRents);
    }

    console.log("Automatic checks completed successfully at", new Date());
  } catch (error) {
    console.error("Error performing automatic checks:", error);
  }
};

async function processRent(
  rent,
  userMap,
  walletMap,
  fcmTokenMap,
  isEveningJob
) {
  try {
    console.log(`Processing rent for user ${rent.user._id}`);
    const user = userMap[rent.user._id];
    const wallet = walletMap[rent.user._id];
    const fcmToken = fcmTokenMap[rent.user._id];
    const amountToDebit = rent.interval_amount;

    if (isToday(rent.next_date)) {
      console.log(
        `Processing payment for rent ${rent._id} with name ${rent.rentName}`
      );
      await processPayment(
        rent,
        user,
        wallet,
        fcmToken,
        amountToDebit,
        isEveningJob
      );
    } else {
      console.log(
        `Trying to check if rent is upcoming for user ${user.email} with rent ${rent._id} and rent name ${rent.rentName}`
      );
      await sendReminders(rent, user, fcmToken, amountToDebit);
    }
  } catch (error) {
    console.error(`Error processing rent for user ${rent.user._id}:`, error);
  }
}

async function processPayment(
  rent,
  user,
  wallet,
  fcmToken,
  amountToDebit,
  isEveningJob
) {
  try {
    console.log(
      `Checking wallet balance for user ${user._id} with email ${user.email}`
    );
    if (wallet.mainBalance >= amountToDebit) {
      console.log(
        `Sufficient balance for user ${user._id} with email ${user.email}. Proceeding with payment.`
      );
      await handleSuccessfulPayment(rent, user, wallet, amountToDebit);

      await sendEmail({
        to: user.email,
        subject: "Successful Debit Notification",
        text: `Dear ${user.firstName}, your account was debited for your spacerent ${rent.rentName}.`,
        html: successfulDebit(user.firstName, amountToDebit, rent.rentName),
      });

      await sendNotification(
        fcmToken?.token,
        "Space Rent Auto Debit",
        `Payment of ₦${amountToDebit.toFixed(
          2
        )} for ${rent.rentName.toUpperCase()} successful. Next payment due on ${
          rent.next_date
        }`
      );
    } else {
      console.log(
        `Insufficient balance for user ${user._id} with email ${user.email}. Handling failed payment.`
      );
      await handleFailedPayment(
        rent,
        user,
        fcmToken,
        amountToDebit,
        isEveningJob
      );
      // Add user to queue if they missed their first payment
      if (rent.firstPayment && !rent.has_paid) {
        console.log(
          `User ${user._id} missed their first payment. Adding to missed payment queue.`
        );
        await addSpaceRentMissedFirstPaymentToQueue({
          userId: user._id,
        });
      }
    }
  } catch (error) {
    console.error(
      `Error processing payment for rent ${rent._id} with name ${rent.rentName}:`,
      error
    );
  }
}

async function handleSuccessfulPayment(rent, user, wallet, amountToDebit) {
  try {
    console.log(
      `Handling successful payment for rent ${rent._id} with name ${rent.rentName}`
    );
    if (rent.firstPayment && !rent.has_paid) {
      console.log(
        `First payment for rent ${rent._id} with name ${rent.rentName}. Awarding utility points.`
      );
      user.utility_points += 100;
      rent.firstPayment = false;
      // Add job to the SpaceRent First Deposit Queue for the reminder
      await addSpaceRentFirstDepositCheckToQueue({ userId: user._id });
    } else {
      const { spacePoints } = calculateRentSpacePoint(amountToDebit);
      console.log(
        `Awarding ${spacePoints} utility points for rent ${rent._id} with name ${rent.rentName}`
      );
      user.utility_points += spacePoints;
    }
    wallet.mainBalance -= amountToDebit;
    rent.paid_amount += amountToDebit;
    rent.current_payment += 1;
    rent.payment_count -= 1;
    rent.has_paid = true;
    rent.payment_status = "Active";
    rent.next_date = calculateNextPaymentDate(rent.next_date, rent.interval);

    const referenceId = "REN" + getRandom(6) + rent.rentspace_id;
    const walletHistory = createWalletHistory(
      wallet.user,
      referenceId,
      amountToDebit,
      rent.rentName
    );
    const rentHistory = createRentHistory(
      rent.user,
      rent._id,
      referenceId,
      amountToDebit,
      user.firstName
    );
    const activity = createActivity(
      rent.user._id,
      "Rent Funding",
      "Space Rent Funded"
    );

    await Promise.all([
      user.save(),
      rent.save(),
      wallet.save(),
      walletHistory.save(),
      rentHistory.save(),
      activity.save(),
    ]);
    console.log(
      `Payment processed and records saved for rent ${rent._id} with name ${rent.rentName}`
    );
  } catch (error) {
    console.error(
      `Error handling successful payment for rent ${rent._id} with name ${rent.rentName}:`,
      error
    );
  }
}

function createWalletHistory(user, referenceId, amountToDebit, rentName) {
  console.log(
    `Creating wallet history record for user ${user} with rent name ${rentName}`
  );
  return new WalletHistory({
    user,
    transactionReference: referenceId,
    amount: amountToDebit,
    currency: "NGN",
    transactionType: "Debit",
    transactionGroup: "Space Rent Payment",
    fees: 0,
    totalAmount: amountToDebit,
    merchantReference: referenceId,
    status: "Completed",
    message: "Space Rent Funded Through Wallet",
    description: `Space Rent Funding For Rent - ${rentName.toUpperCase()}`,
  });
}

function createRentHistory(
  user,
  rentId,
  referenceId,
  amountToDebit,
  firstName
) {
  console.log(
    `Creating rent history record for user ${user} with name ${firstName}`
  );
  return new RentHistory({
    user,
    rent: rentId,
    transactionReference: referenceId,
    amount: amountToDebit,
    currency: "NGN",
    fees: 0,
    totalAmount: amountToDebit,
    merchantReference: referenceId,
    status: "Completed",
    message: "Funded Through Space Wallet",
    description: `Space Rent funding from ${firstName}`,
  });
}

function createActivity(userId, activityType, description) {
  console.log(`Creating activity record for user ${userId}`);
  return new Activities({
    user: userId,
    activityType,
    description,
  });
}

async function handleFailedPayment(
  rent,
  user,
  fcmToken,
  amountToDebit,
  isEveningJob
) {
  try {
    console.log(
      `Handling failed payment for rent ${rent._id} with name ${rent.rentName}`
    );
    await sendEmail({
      to: user.email,
      subject: "Failed Debit Notification",
      text: "Insufficient funds.",
      html: failedDebit(user.firstName, amountToDebit, rent.rentName),
    });
    await sendNotification(
      fcmToken?.token,
      "Space Rent Failed Debit",
      `Failed Debit of ₦${amountToDebit.toFixed(
        2
      )} for ${rent.rentName.toUpperCase()}. Fund your wallet.`
    );

    if (isEveningJob) {
      rent.failedDebitCount += 1;
      await rent.save();
      console.log(
        `Incremented failed debit count for rent ${rent.rentName} to ${rent.failedDebitCount}`
      );
    }

    console.log(
      `Failed payment notifications sent for rent ${rent._id} with name ${rent.rentName}`
    );
  } catch (error) {
    console.error(
      `Error handling failed payment for rent ${rent._id} with name ${rent.rentName}:`,
      error
    );
  }
}

async function sendReminders(rent, user, fcmToken, amountToDebit) {
  try {
    const today = new Date();
    const twoDaysBefore = addDays(today, 2);
    const oneDayBefore = addDays(today, 1);
    const rentNextDate = parseDate(rent.next_date);

    if (isWithinRange(rentNextDate, twoDaysBefore, oneDayBefore)) {
      console.log(
        `Sending email reminder for rent ${rent._id} with name ${rent.rentName}`
      );
      await sendEmail({
        to: user.email,
        subject: "Upcoming Rent Payment",
        text: "Your rent payment is coming up soon.",
        html: upcomingRentPayment(
          user.firstName,
          amountToDebit,
          rent.rentName,
          rent.next_date
        ),
      });
    }

    if (isWithinRange(rentNextDate, oneDayBefore, today)) {
      console.log(
        `Sending FCM notification reminder for rent ${rent._id} with name ${rent.rentName}`
      );
      await sendNotification(
        fcmToken?.token,
        "Upcoming Rent Payment",
        `Payment of ₦${amountToDebit.toFixed(
          2
        )} for ${rent.rentName.toUpperCase()} is due tomorrow.`
      );
    }
  } catch (error) {
    console.error(
      `Error sending reminders for rent ${rent._id} with name ${rent.rentName}:`,
      error
    );
  }
}

function isToday(dateString) {
  const date = parseDate(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
}

function calculateNextPaymentDate(currentDate, interval) {
  const date = parseDate(currentDate);

  if (interval === "Weekly") {
    date.setDate(date.getDate() + 7); // Add 7 days for weekly interval
  } else if (interval === "Monthly") {
    date.setMonth(date.getMonth() + 1); // Add 1 month for monthly interval
  }

  return formatDate(date);
}

function formatDate(date) {
  const newDay = ("0" + date.getDate()).slice(-2);
  const newMonth = ("0" + (date.getMonth() + 1)).slice(-2);
  return `${newDay}/${newMonth}/${date.getFullYear()}`;
}

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function isWithinRange(date, start, end) {
  return date <= start && date > end;
}

async function shiftNextPaymentDates(spaceRents) {
  try {
    await Promise.all(
      spaceRents.map(async (rent) => {
        if (isToday(rent.next_date)) {
          rent.next_date = calculateNextPaymentDate(
            rent.next_date,
            rent.interval
          );
          await rent.save();
          console.log(`Shifted next payment date for rent ${rent._id}`);
        }
      })
    );
  } catch (error) {
    console.error("Error shifting next payment dates:", error);
  }
}

async function sendNotification(token, title, body) {
  if (token) {
    try {
      console.log(`Sending FCM notification to token ${token}`);
      await getMessaging().send({
        token,
        notification: { title, body },
      });
      console.log(`FCM notification sent: ${title}`);
    } catch (error) {
      console.error("Error sending FCM notification:", error);
    }
  }
}

module.exports = startCronJob;
