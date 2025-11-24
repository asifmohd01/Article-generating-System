const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      console.warn("[AUTH] Missing authorization header");
      return res.status(401).json({
        success: false,
        message:
          "Authorization header required. Use: Authorization: Bearer <token>",
      });
    }

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      console.warn("[AUTH] Invalid authorization header format");
      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format. Use: Authorization: Bearer <token>",
      });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.warn(`[AUTH] Token verification failed: ${err.message}`);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};
