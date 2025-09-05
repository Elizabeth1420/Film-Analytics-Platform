// Pull in required modules
const reviewsService = require("../service/reviews.service");
const { handleApiError } = require("../utils/apiUtils");
const validation = require("../utils/validation");


async function getReviews(req, res, next) {

  const movieId = req.params.id;
  if (!validation.isValidPositiveInteger(movieId)) {
    return res.status(400).json({ error: "A valid movie ID is required." });
  }

  const pageNumber = validation.validatePageNumber(req.query.page);

  try {  
    const reviews = await reviewsService.fetchReviews(movieId, pageNumber);
    res.status(200).json(reviews);    
  } catch (err) {
    handleApiError(err, res, next);
  }
}

module.exports.getReviews = getReviews;
