// Pull in required modules
const trailerService = require("../service/trailer.service");
const { handleApiError } = require("../utils/apiUtils");

async function getTrailer(req, res, next) {
  try {
    const movieId = req.params.id;   
    const data = await trailerService.fetchTrailer(movieId);
    res.status(200).json(data);
    
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getTrailer = getTrailer;
