// Pull in required modules
const trendingService = require("../service/trending.service");
const { handleApiError } = require("../utils/apiUtils");
const validation = require("../utils/validation");
const HTTP_STATUS = require("../utils/statusCodes");

async function getTrending(req, res, next, period) {

  const pageNumber = validation.validatePageNumber(req.query.page);

  try { 
    const trending = await trendingService.fetchTrending(period, pageNumber);
    res.status(HTTP_STATUS.OK).json(trending);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

exports.getTrending = getTrending;
