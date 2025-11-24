exports.errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${status} - ${message}`);
  console.error(`[ERROR] Stack:`, err.stack);

  res.status(status).json({
    success: false,
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
    },
  });
};
