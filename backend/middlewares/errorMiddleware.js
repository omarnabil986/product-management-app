// middleware/errorMiddleware.js
function errorHandler(err, req, res, next) {
  console.error(err.stack); // Optional: log the error for debugging purposes

  // Check if it's a validation error or a server error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  // Check if it's a MongoDB error (like not found)
  if (err.name === "CastError") {
    return res.status(404).json({
      status: "error",
      message: "Resource not found",
    });
  }

  // Default to internal server error
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}

module.exports = errorHandler;
