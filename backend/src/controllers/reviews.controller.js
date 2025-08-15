// Pull in required modules
const reviewsService = require('../service/reviews.service');
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

    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Upstream timeout contacting TMDB.' });
    }
    if (err.upstream) {
      return res.status(err.status || 502).json({
        error: 'Upstream TMDB error',
        status: err.status,
        data: err.data,
      });
    }
    next(err);
  }
}

exports.getReviews = getReviews;
