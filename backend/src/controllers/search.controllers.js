// Pull in required modules
const trendingService = require('../service/search.service');
const parseIntWithFallback = require('../utils/number'); 

async function getMovieByName(req, res, next) {
  try {
    const movieName = req.query.name;
    const page = Math.min(Math.max(parseIntWithFallback(req.query.page, 1), 1), 500);

    //Fetch trending data from the service
    const data = await trendingService.fetchSearch(movieName, page);

    console.log(`Fetching movie by name: ${movieName}, page: ${page}`);

    res.status(200).json({
      source: "tmdb",
      ...data,
    });

  } catch (err) {
    if (err.name === "AbortError") {
      return res
        .status(504)
        .json({ error: "Upstream timeout contacting TMDB." });
    }
    if (err.upstream) {
      return res.status(err.status || 502).json({
        error: "Upstream TMDB error",
        status: err.status,
        data: err.data,
      });
    }
    next(err);
  }
}


exports.getMovieByName = getMovieByName;
