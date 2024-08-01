const User = require('../models/User');
const sendEmail = require('../services/email');
const { takeASurvey } = require("./mails/emailTemplates");
const cron = require('node-cron');
const fs = require('fs');

const BATCH_SIZE = 5;
const MAX_RETRIES = 3;
const DELAY_BETWEEN_BATCHES = 1250;
const FAILED_EMAILS_FILE = 'failed_emails.json';

// Ensure the file exists or create it if it doesn't
if (!fs.existsSync(FAILED_EMAILS_FILE)) {
  fs.writeFileSync(FAILED_EMAILS_FILE, '[]');
}

const logWithTimestamp = (message, level = 'info') => {
  const timestamp = `[${new Date().toISOString()}]`;
  if (level === 'error') {
    console.error(`${timestamp} ERROR: ${message}`);
  } else {
    console.log(`${timestamp} INFO: ${message}`);
  }
};

const storeFailedEmail = (email) => {
  const failedEmails = JSON.parse(fs.readFileSync(FAILED_EMAILS_FILE, 'utf-8') || '[]');
  failedEmails.push(email);
  fs.writeFileSync(FAILED_EMAILS_FILE, JSON.stringify(failedEmails, null, 2));
};

const sendEmailsInBatches = async (users) => {
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (user) => {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            await sendEmail({
              to: user.email,
              subject: "Take Our Survey & Win Big! We Value Your Feedback",
              text: "Survey",
              html: takeASurvey(user.firstName),
            });
            logWithTimestamp(`Email sent to ${user.email}`);
            break;
          } catch (error) {
            logWithTimestamp(
              `Error sending email to ${user.email} (Attempt ${attempt}): ${error.message}`,
              'error'
            );
            if (attempt === MAX_RETRIES) {
              logWithTimestamp(
                `Failed to send email to ${user.email} after ${MAX_RETRIES} attempts.`,
                'error'
              );
              storeFailedEmail(user.email);
            }
          }
        }
      })
    );
    if (i + BATCH_SIZE < users.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
};



const sendSurveyCron = () => {
    cron.schedule(
      // Runs at July 22, at 2:25 PM 
      '25 14 22 7 *',
      async () => {
        logWithTimestamp('Sending Survey emails...');
  
        try {
          const users = await User.find({ has_verified_email: true });
          logWithTimestamp(`Retrieved ${users.length} users with verified Emails.`);
  
          await sendEmailsInBatches(users);
  
          logWithTimestamp('Cron job completed successfully.');
        } catch (error) {
          logWithTimestamp(`Error occurred in cron job: ${error.message}`, 'error');
        }
      },
      {
        scheduled: true,
        timezone: 'Africa/Lagos',
      }
    );
  };
  
  module.exports = sendSurveyCron;
  