// Pull in required modules
const trailerService = require("../service/trailer.service");
const { handleApiError } = require("../utils/apiUtils");
const HTTP_STATUS = require("../utils/statusCodes");
const validation = require("../utils/validation");

async function getTrailer(req, res, next) {
  const movieId = req.params.id;
  if (!validation.isValidPositiveInteger(movieId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: "A valid movie ID is required." });
  }

  try {
    const trailer = await trailerService.fetchTrailer(movieId);
    res.status(HTTP_STATUS.OK).json(trailer);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getTrailer = getTrailer;
