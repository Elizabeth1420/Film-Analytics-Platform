
/**
 * Handles API errors for Express controllers.
 * @param {Error} err - The error object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
function handleApiError(err, res, next) {
  // 504 timeout error handling
  if (err.name === "AbortError") {
    return res.status(504).json({ error: "Upstream timeout contacting TMDB." });
  }

  // 502 bad gateway error handling
  if (err.upstream) {
    return res.status(err.status || 502).json({
      error: "Upstream TMDB error",
      status: err.status,
      data: err.data,
    });
  }
  next(err);
}

module.exports = handleApiError;
