const mongoose = require("mongoose");
const { logger } = require("../utils/logger.util");
const Maintenance = require("../models/Maintenance");
const sendEmail = require("../services/email");
const seedAppStatus = async () => {
  try {
    // Check if there's already an app status
    const existingAppStatus = await Maintenance.findOne({ uniqueField: 'single_maintenance_status' });

    if (!existingAppStatus) {
      // Create the initial app status
      const initialAppStatus = new Maintenance({
        status: 'active', // or 'inactive' depending on your default status
        uniqueField: 'single_maintenance_status'
      });

      await initialAppStatus.save();

      console.log('Initial app status created successfully.');
    } else {
      console.log('App status already exists.');
    }

    // Close the database connection
    // await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding app status:', error);
    process.exit(1); // Exit with an error code
  }
};
const adjustTimestamps = async () => {
  try {
    const db = mongoose.connection;
    // Run the aggregation pipeline
    const result = await db.collection('your_collection_name').aggregate([
      {
        $project: {
          adjustedTimestamp: {
            $subtract: [
              { $toDate: "$timestamp" }, // Convert string timestamp to Date object
              { $multiply: [60 * 60 * 1000, 1] } // Adjust timezone by subtracting 1 hour (3600 seconds * 1000 milliseconds)
            ]
          }
        }
      }
    ]).toArray();

    console.log('Adjusted timestamps:', result);
  } catch (error) {
    console.error('Error adjusting timestamps:', error);
  }
};

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'RentspaceDatabase', 
    });
    console.log("Db is succesfully connected!!🚀");
    logger.info("connected");
    await seedAppStatus();
  } catch (error) {
    console.log('error');
    console.log(error);
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = db;
