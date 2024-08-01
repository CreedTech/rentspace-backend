const cron = require("node-cron");
const SpaceRent = require("../../models/SpaceRent");
const FCMToken = require("../../models/FCMToken");
const { getMessaging } = require("firebase-admin/messaging");
const SpaceRentInterestHistory = require("../../models/SpaceRentinterestHistory");
const {calculateSpaceRentInterest} = require("../../services/interestCalculator");

const startSpaceRentInterestCronJob = () => {
  cron.schedule("0 7 * * *", async () => {
    console.log("Starting cron job...");

    try {
      // Retrieve active Space Rents that are not stopped
      const spaceRents = await SpaceRent.find({
        payment_status: "Active",
        isStopped: false,
      });

      console.log(`Retrieved ${spaceRents.length} active space rent(s).`);

      // Track processed rents to avoid duplicates
      const processedRentIds = new Set();

      for (const rent of spaceRents) {
        if (processedRentIds.has(rent._id.toString())) {
          console.warn(`Rent ${rent._id} is already processed. Skipping.`);
          continue;
        }

        processedRentIds.add(rent._id.toString());

        try {
          console.log(
            `Calculating interest for rent: ${rent.rentName} (ID: ${rent._id})`
          );

          const principal = parseFloat(
            rent.paid_amount + rent.spaceRentInterest
          );
          const interest = calculateSpaceRentInterest(principal, 1);

          console.log(
            `Interest calculated for rent ${rent.rentName} (ID: ${rent._id}): ${interest}`
          );

          // Update spaceRentInterest
          rent.spaceRentInterest = parseFloat(
            (rent.spaceRentInterest + interest).toFixed(2)
          );
          await rent.save();

          console.log(
            `Updated spaceRentInterest for rent ${rent.rentName} (ID: ${rent._id}).`
          );

          // Record the interest in SpaceRentInterestHistory
          const interestHistory = new SpaceRentInterestHistory({
            spaceRent: rent._id,
            interestAmount: parseFloat(interest.toFixed(2)),
          });
          await interestHistory.save();

          console.log(
            `Saved interest history for rent ${rent.rentName} (ID: ${rent._id}).`
          );

          // If interest is greater than 0, send a notification
          if (interest > 0) {
            const fcmToken = await FCMToken.findOne({ user: rent.user._id });

            if (fcmToken && fcmToken.token) {
              const message = {
                notification: {
                  title: "RentSpace",
                  body: `You have received ₦${interest} in interest for your rent: ${rent.rentName}. Keep saving! 🚀`,
                },
                data: {
                  notificationType: "interest",
                  amount: interest.toFixed(2).toString(),
                },
                token: fcmToken.token,
              };
              try {
                await getMessaging().send(message);
                console.log(
                  `Sent notification for rent ${rent.rentName} (ID: ${rent._id}):`,
                  message
                );
              } catch (notificationError) {
                console.error(
                  `Error sending notification for rent ${rent.rentName} (ID: ${rent._id}):`,
                  notificationError
                );
              }
            }
          }
        } catch (rentError) {
          console.error(
            `Error processing rent ${rent.rentName} (ID: ${rent._id}):`,
            rentError
          );
        }
      }

      console.log("Cron job completed successfully.");
    } catch (error) {
      console.error("Error occurred in cron job:", error);
    }
  });
};

module.exports = startSpaceRentInterestCronJob;
