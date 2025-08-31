const { Router } = require('express');
const trendingController = require('../controllers/trending.controllers');
const searchController = require('../controllers/search.controllers');
const reviewsController = require('../controllers/reviews.controller');
const trailerController = require('../controllers/trailer.controllers');
const internalMoviesController = require('../controllers/internalMovies.Controller');
const internalReviewsController = require('../controllers/internalReviews.controller');
const { authenticate } = require('../utils/apiUtils');

const router = Router();

// Internal routes for managing user added movies and reviews
router.get('/internal/reviews', authenticate, internalReviewsController.getInternalReviews);
router.post('/internal/reviews', authenticate, internalReviewsController.addReview);
router.get('/internal', authenticate, internalMoviesController.getInternalMovies);
router.delete('/internal/:id', authenticate, internalMoviesController.deleteMovie);
router.post('/internal', authenticate, internalMoviesController.addInternalMovie);

// "Public" routes for fetching data from TMDB/OMDB
router.get('/trending', trendingController.getTrending);
router.get('/search', searchController.getMovieByName);
router.get('/:id/reviews', reviewsController.getReviews);
router.get('/:id/trailer', trailerController.getTrailer);

module.exports = router;