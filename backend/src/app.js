const express = require('express');


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


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

module.exports = app;