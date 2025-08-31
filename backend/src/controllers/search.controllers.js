// Pull in required modules
const searchService = require("../service/search.service");
const { parseIntWithFallback } = require("../utils/validation");
const { handleApiError } = require("../utils/apiUtils");

async function getMovieByName(req, res, next) {
  try {
    const movieName = req.query.name;
    const year = req.query.year;
    const page = Math.min(
      Math.max(parseIntWithFallback(req.query.page, 1), 1),
      500
    );

    const data = await searchService.fetchSearch(movieName, year ,page);
    res.status(200).json(data);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getMovieByName = getMovieByName;
