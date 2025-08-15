// Pull in required modules
const trendingService = require('../service/trending.service');
const parseIntWithFallback = require('../utils/number'); 


async function getTrending(req, res, next) {
  try {
    const timewindow = req.query.timewindow ? req.query.timewindow : 'week';    
    const page = Math.min(Math.max(parseIntWithFallback(req.query.page, 1), 1), 500);


    console.log(`Fetching trending for time window: ${timewindow}, page: ${page}`);

    // Fetch trending data from the service
    const data = await trendingService.fetchTrending(timewindow, page );
    res.status(200).json({      
      source: 'tmdb',
      ...data,
    });
  } catch (err) {

    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Upstream timeout contacting TMDB.' });
    }
    if (err.upstream) {
      return res.status(err.status || 502).json({
        error: 'Upstream TMDB error',
        status: err.status,
        data: err.data,
      });
    }
    next(err);
  }
}

exports.getTrending = getTrending;
