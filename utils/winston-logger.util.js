// const winston = require('winston');
// require('winston-daily-rotate-file');
// const winstonMongoDB = require('winston-mongodb');
// const moment = require('moment');

// // Create transports instance
// const transports = [
//   new winston.transports.Console({
//     format: winston.format.combine(
//       winston.format.timestamp(),
//       winston.format.colorize(),
//       winston.format.printf(({ timestamp, level, message, context, stackTrace }) => {
//         const formattedMessage = message ? `\n${message}` : '';
//         const formattedStackTrace = stackTrace ? `\nStack Trace: ${stackTrace}` : '';
//         return `${timestamp} [${context}] ${level}: ${formattedMessage}${formattedStackTrace}`;
//       }),
//     ),
//   }),

//   new winston.transports.DailyRotateFile({
//     filename: 'logs/application-%DATE%.log',
//     datePattern: 'YYYY-MM-DD',
//     zippedArchive: true,
//     maxSize: '20m',
//     maxFiles: '14d',
//     format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
//   }),

//   new winstonMongoDB.MongoDB({
//     level: 'info',
//     db: process.env.MONGO_URI,
//     options: {
//       useUnifiedTopology: true,
//     },
//     collection: 'logs',
//     format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
//   }),
// ];

// // Create and export the logger instance
// const logger = winston.createLogger({
//   level: 'info', // Default log level
//   format: winston.format.json(),
//   transports,
// });

// module.exports = logger;