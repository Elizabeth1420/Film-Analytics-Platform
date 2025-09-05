// Pull in required modules
const searchService = require("../service/search.service");
const validation = require("../utils/validation");
const { handleApiError } = require("../utils/apiUtils");


async function getMovieByName(req, res, next) {

  const movieName = req.query.name;
  if (!validation.isValidTitle(movieName)) {
    return res.status(400).json({ error: "A valid movie name is required." });
  }

  const year = req.query.year;
  if (!validation.isValidYear(year) ) {
    return res.status(400).json({ error: "A valid movie date is required." });
  }

  const pageNumber = validation.validatePageNumber(req.query.page);

  try {
    const searchResults = await searchService.fetchSearch(movieName, year, pageNumber);
    res.status(200).json(searchResults);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getMovieByName = getMovieByName;
