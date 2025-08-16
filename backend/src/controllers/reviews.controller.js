// Pull in required modules
const reviewsService = require('../service/reviews.service');
const handleApiError = require('../utils/apiUtils');
const parseIntWithFallback = require('../utils/number'); 


async function getReviews(req, res, next) {
  try {
    const movieId = req.params.id;   
    const page = Math.min(Math.max(parseIntWithFallback(req.query.page, 1), 1), 500);

    console.log(`Fetching reviews for movie with: ${movieId}, page: ${page}`);

    // Fetch trending data from the service
    const data = await reviewsService.fetchReviews(movieId, page );
    res.status(200).json({      
      source: 'tmdb',
      ...data,
    });
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getReviews = getReviews;
