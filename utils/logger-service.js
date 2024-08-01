// const logger = require('./winston-logger.util');
// const moment = require('moment');

// class LoggerService {
//   log(message, context) {
//     const timestamp = moment().format();
//     logger.info(message, { timestamp, context });
//   }

//   error(msg, ctx, additional = {}) {
//     const timestamp = moment().format();
//     const { error, ...info } = additional;
//     logger.error(msg, { timestamp, context: ctx, ...info, stackTrace: error?.stack });
//   }
//   warn(message, context, additionalInfo) {
//     const timestamp = moment().format();
//     logger.warn(message, { timestamp, context, ...additionalInfo });
//   }

//   debug(message, context, additionalInfo) {
//     const timestamp = moment().format();
//     logger.debug(message, { timestamp, context, ...additionalInfo });
//   }

//   info(message, context, additionalInfo) {
//     const timestamp = moment().format();
//     logger.info(message, { timestamp, context, ...additionalInfo });
//   }
// }

// module.exports = LoggerService;