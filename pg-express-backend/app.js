const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { errorHandler, notFound } = require('./src/middlewares/error.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Note Taking API' });
});

// Mount all API routes
app.use('/api', routes);

// Middleware to handle 404
app.use(notFound);

// Middleware to handle errors
app.use(errorHandler);

module.exports = app;
