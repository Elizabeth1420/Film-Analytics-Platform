require('dotenv').config();
const express = require('express');
const trendingRoutes = require('./routes/trending.routes');
const searchRoutes = require('./routes/search.routes');
const reviewsRoutes = require('./routes/reviews.routes');


const app = express();
app.use(express.json());

app.use('/api/trending', trendingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reviews', reviewsRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

module.exports = app;