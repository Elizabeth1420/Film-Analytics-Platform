const supabase = require('../utils/supabaseClient');
const baseUrls = require('../config');
const EnvHelper = require('../utils/envHelper');
const HTTP_STATUS = require("../utils/statusCodes");

async function authenticate(req, res, next) {

  // Try to get our auth token - if we didn't get on then return 401.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(HTTP_STATUS.Unauthorized).json({ error: 'No token provided.' });
  }

  // Extract our auth bearer token
  const token = authHeader.split(' ')[1]; 

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(HTTP_STATUS.Unauthorized).json({ error: 'Invalid or expired token.' });
    }
        
    // Attach user info to request
    req.user = data.user; 
    next();
  } catch (err) {
    handleApiError(err, res, next);
  }
}


async function omdbFetch(imdb_id) {

  const omdbUrl = `${baseUrls.OMDB_BASE_URL}${EnvHelper.OMBD_API_KEY}&i=${imdb_id}`;

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  const resp = await fetch(`${baseUrls.TMDB_BASE_URL}${url}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${EnvHelper.TMDB_BEARER_TOKEN}`,
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
  
  // 400 bad request error handling
  if(err.status === HTTP_STATUS.BAD_REQUEST || err.statusCode === HTTP_STATUS.BAD_REQUEST) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: err.message || "Bad request to server." });
  }

  if(err.status === HTTP_STATUS.UNAUTHORIZED || err.statusCode === HTTP_STATUS.UNAUTHORIZED) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: err.message || "Unauthorized request." });
  }
  
  // 404 not found error handling
  if(err.status === HTTP_STATUS.NOT_FOUND || err.statusCode === HTTP_STATUS.NOT_FOUND) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ error: err.message || "Not found." });
  }
  
  // 409 conflict error handling
  if(err.status === HTTP_STATUS.CONFLICT || err.statusCode === HTTP_STATUS.CONFLICT) {
    return res.status(HTTP_STATUS.CONFLICT).json({ error: err.message || "Duplicate or conflict request." });
  }
  
  // 429 too many requests - rate limit exceeded handling
  if(err.status === HTTP_STATUS.TOO_MANY_REQUESTS || err.statusCode === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({ error: err.message || "Too many requests - rate limit exceeded." });
  }
  
  // 500 internal server error handling
  if (err.status === HTTP_STATUS.INTERNAL_SERVER_ERROR || err.statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: err.message || "Internal server error" });
  }
  
  // 502 bad gateway error handling
  if (err.upstream || err.status === HTTP_STATUS.BAD_GATEWAY || err.statusCode === HTTP_STATUS.BAD_GATEWAY) {
    return res.status(HTTP_STATUS.BAD_GATEWAY).json({ error: "Upstream or bad gateway error." });
  }

  // 504 timeout error handling
  // Also handles the fetch AbortError - used to timeout fetch requests
  if (err.name === "AbortError" || err.status === HTTP_STATUS.GATEWAY_TIMEOUT || err.statusCode === HTTP_STATUS.GATEWAY_TIMEOUT) {
    return res.status(HTTP_STATUS.GATEWAY_TIMEOUT).json({ error: "Timeout error." });
  }
  next(err);
}

module.exports = { omdbFetch, tmdbFetch, handleApiError, authenticate };
