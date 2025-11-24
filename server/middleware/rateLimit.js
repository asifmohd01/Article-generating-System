const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, slow down" },
});
