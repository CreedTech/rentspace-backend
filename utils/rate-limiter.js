const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1,
    message: {
      error: "Too many requests. Please try again later.",
      code: 429 // HTTP 429 Too Many Requests
    },
  });
  

module.exports = rateLimiter;