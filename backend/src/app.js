const express = require('express');

const { handleApiError } = require('./utils/apiUtils');

// Load environment variables from .env file
require('dotenv').config();

// Check for required environment variables
const requiredEnv = ['TMDB_BEARER_TOKEN', 'OMBD_API_KEY'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});


const app = express();
app.use(express.json());

// Expose the movies routes
app.use('/api/movies', require('./routes/movies.routes'));

// Expose the auth routes
app.use('/api/auth', require('./routes/users.routes'));

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err);
  handleApiError(err, res, next);
});

module.exports = app;