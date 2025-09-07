// Pull in required modules
const reviewsService = require("../service/reviews.service");
const { handleApiError } = require("../utils/apiUtils");
const validation = require("../utils/validation");
const HTTP_STATUS = require("../utils/statusCodes");


async function getReviews(req, res, next) {

  const movieId = req.params.id;
  if (!validation.isValidPositiveInteger(movieId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "A valid movie ID is required." });
  }

  const pageNumber = validation.validatePageNumber(req.query.page);

  try {  
    const reviews = await reviewsService.fetchReviews(movieId, pageNumber);
    res.status(HTTP_STATUS.OK).json(reviews);    
  } catch (err) {
    handleApiError(err, res, next);
  }
}

module.exports.getReviews = getReviews;
