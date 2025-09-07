const { handleApiError } = require("../utils/apiUtils");
const validation = require("../utils/validation");
const internalReviewsService = require("../service/internalReviews.service");
const HTTP_STATUS = require("../utils/statusCodes");

async function getReviews(req, res, next) {
  const movieId = req.query.movie_id;
  if (!validation.isValidPositiveInteger(movieId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "A valid movie ID is required." });
  }

  try {
    const data = await internalReviewsService.fetchInternalReviews(movieId);
    res.status(HTTP_STATUS.OK).json(data);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

async function addReview(req, res, next) {
  try {
    const review = req.body;
    const data = await internalReviewsService.postReview(
      review.movie_id,
      review.content,
      review.imdb,
      review.rotten_tomatoes,
      review.metacritic
    );
    res.status(HTTP_STATUS.OK).json(data);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

module.exports = { getInternalReviews: getReviews, addReview };
