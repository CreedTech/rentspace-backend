const IORedis = require('ioredis');

// Create a connection to Redis
// const connection = new IORedis({
//   port: 6379,
//   host: '127.0.0.1',
//   maxRetriesPerRequest: null,
//   enableOfflineQueue: false,
//   offlineQueue: false,
// });

const connection = new IORedis({
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  offlineQueue: false,
});

connection.on('connect', () => {
  console.log('Connected to Redis cluster');
});

module.exports = connection;
