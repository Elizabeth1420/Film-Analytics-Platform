// Pull in required modules
const trailerService = require("../service/trailer.service");
const { handleApiError } = require("../utils/apiUtils");
const validation = require("../utils/validation");

async function getTrailer(req, res, next) {
  const movieId = req.params.id;
  if (!validation.isValidPositiveInteger(movieId)) {
    return res.status(400).json({ error: "A valid movie ID is required." });
  }

  try {
    const trailer = await trailerService.fetchTrailer(movieId);
    res.status(200).json(trailer);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getTrailer = getTrailer;
