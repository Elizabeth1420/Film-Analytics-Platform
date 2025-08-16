// Pull in required modules
const searchService = require("../service/search.service");
const parseIntWithFallback = require("../utils/number");
const handleApiError = require("../utils/apiUtils");

async function getMovieByName(req, res, next) {
  try {
    const movieName = req.query.name;
    const page = Math.min(
      Math.max(parseIntWithFallback(req.query.page, 1), 1),
      500
    );

    //Fetch trending data from the service 123
    const data = await searchService.fetchSearch(movieName, page);

    console.log(`Fetching movie by name: ${movieName}, page: ${page}`);

    res.status(200).json({
      source: "tmdb",
      ...data,
    });
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getMovieByName = getMovieByName;
