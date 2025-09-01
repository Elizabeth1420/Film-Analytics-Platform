const supabase = require('../utils/supabaseClient');
const baseUrls = require('../config');

async function authenticate(req, res, next) {

  // Try to get our auth token - if we didn't get on then return 401.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  // Extract our auth bearer token
  const token = authHeader.split(' ')[1]; 

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
        
    // Attach user info to request
    req.user = data.user; 
    next();
  } catch (err) {
    handleApiError(err, res, next);
  }
}


async function omdbFetch(imdb_id) {

  const omdbApiKey = process.env.OMBD_API_KEY;
  const omdbUrl = `${baseUrls.OMDB_BASE_URL}${omdbApiKey}&i=${imdb_id}`;

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

  const resp = await fetch(`${baseUrls.TMDB_BASE_URL}${url}`, {
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
    return res.status(504).json({ error: "Upstream timeout contacting server." });
  }

  // 400 bad request error handling
  if(err.status === 400 || err.statusCode === 400) {
    return res.status(400).json({ error: err.message || "Bad request to server." });
  }

  if(err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({ error: err.message || "Not found." });
  }

  if(err.status === 409 || err.statusCode === 409) {
    return res.status(409).json({ error: err.message || "Unauthorized request." });
  }

  if(err.status === 429 || err.statusCode === 429) {
    return res.status(429).json({ error: err.message || "Too many requests - rate limit exceeded." });
  }

  // 500 internal server error handling
  if (err.status === 500 || err.statusCode === 500) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }

  // 502 bad gateway error handling
  if (err.upstream) {
    return res.status(err.status || 502).json({
      error: "Upstream server error",
      status: err.status,
      data: err.data,
    });
  }
  next(err);
}

module.exports = { omdbFetch, tmdbFetch, handleApiError, authenticate };
