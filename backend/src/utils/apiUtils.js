async function omdbFetch(imdb_id) {
  const omdbApiKey = process.env.OMBD_API_KEY;

  const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdb_id}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  const resp = await fetch(omdbUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    signal: controller.signal,
  })
    .catch((e) => {
      throw e;
    })
    .finally(() => clearTimeout(timeoutId));

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const err = new Error("OMDB responded with an error");
    err.upstream = true;
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data;
}

async function tmdbFetch(url) {
  const token = process.env.TMDB_BEARER_TOKEN;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  const resp = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    signal: controller.signal,
  })
    .catch((e) => {
      throw e;
    })
    .finally(() => clearTimeout(timeoutId));

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const err = new Error("TMDB responded with an error");
    err.upstream = true;
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data;
}

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

module.exports = { omdbFetch, tmdbFetch, handleApiError };
