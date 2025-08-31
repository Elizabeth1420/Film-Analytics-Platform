const { handleApiError } = require("../utils/apiUtils");
const { parseIntWithFallback } = require("../utils/validation");
const  internalReviewsService  = require("../service/internalReviews.service");

async function getReviews(req, res, next) {
  try {   
    const movie_id = req.query.movie_id;
        const data = await internalReviewsService.fetchInternalReviews(movie_id);
    res.status(200).json(data);
    
  } catch (err) {
    handleApiError(err, res, next);
  }
}

async function addReview(req, res, next) {

  try {
    const review = req.body;
    const data = await internalReviewsService.postReview(review.movie_id, review.content, review.imdb, review.rotten_tomatoes, review.metacritic);  
    res.status(200).json(data);  
  } catch (err) {
    handleApiError(err, res, next);
  }  
}

module.exports = {  getInternalReviews: getReviews, addReview };