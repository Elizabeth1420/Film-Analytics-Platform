const express = require('express');
const { handleApiError } = require('./utils/apiUtils');

// Validate environment variables are set
const EnvHelper = require('./utils/envHelper');
EnvHelper.validate();

const app = express();
app.use(express.json());

// Use CORS to allow cross-origin requests
const cors = require('cors');
app.use(cors());

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