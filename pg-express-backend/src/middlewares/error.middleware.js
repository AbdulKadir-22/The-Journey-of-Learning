// Middleware for handling non-existent routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  // If the status code is 200, but there's an error, change it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    error: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
