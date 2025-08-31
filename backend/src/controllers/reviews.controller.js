// Pull in required modules
const reviewsService = require("../service/reviews.service");
const { handleApiError } = require("../utils/apiUtils");
const { parseIntWithFallback } = require("../utils/validation");


async function getReviews(req, res, next) {
  try {
    const movieId = req.params.id;
    const page = Math.min(
      Math.max(parseIntWithFallback(req.query.page, 1), 1),
      500
    );

    const data = await reviewsService.fetchReviews(movieId, page);
    res.status(200).json(data);
    
  } catch (err) {
    handleApiError(err, res, next);
  }
}

module.exports.getReviews = getReviews;
