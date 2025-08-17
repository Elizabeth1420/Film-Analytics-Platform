const { Router } = require('express');
const trendingController = require('../controllers/trending.controllers');
const searchController = require('../controllers/search.controllers');
const reviewsController = require('../controllers/reviews.controller');
const trailerController = require('../controllers/trailer.controllers');

const router = Router();

router.get('/trending', trendingController.getTrending);
router.get('/search', searchController.getMovieByName);
router.get('/:id/reviews', reviewsController.getReviews);
router.get('/:id/trailer', trailerController.getTrailer);

module.exports = router;