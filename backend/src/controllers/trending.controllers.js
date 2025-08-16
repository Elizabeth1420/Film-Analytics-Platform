// Pull in required modules
const trendingService = require("../service/trending.service");
const { handleApiError } = require("../utils/apiUtils");
const parseIntWithFallback = require("../utils/number");

async function getTrending(req, res, next) {
  try {
    const timewindow = req.query.timewindow ? req.query.timewindow : "week";
    const page = Math.min(
      Math.max(parseIntWithFallback(req.query.page, 1), 1),
      500
    );

    const data = await trendingService.fetchTrending(timewindow, page);
    res.status(200).json(data);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getTrending = getTrending;
