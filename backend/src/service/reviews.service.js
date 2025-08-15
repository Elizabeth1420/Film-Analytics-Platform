// Vanilla Node fetch + AbortController (Node 18+)
// Use trending endpoint with dynamic time window
const TMDB_BASE = 'https://api.themoviedb.org/3/movie/';

// Constant filters from your brief
const BASE_PARAMS = {
  language: 'en-US',
};


async function fetchReviews( id, page = 1 ) {
  const token = process.env.TMDB_BEARER_TOKEN;
  const omdbApiKey = process.env.OMBD_API_KEY;

  // Ensure both tokens are available
  if (!token || !omdbApiKey) {
    throw new Error('TMDB_BEARER_TOKEN or api key is missing. Add it to your environment.');
  }

  const params = new URLSearchParams({
    ...BASE_PARAMS,
    page: String(page),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  const url = `${TMDB_BASE}${id}/reviews?${params.toString()}`;
  const movieUrl = `${TMDB_BASE}${id}/external_ids`;
  console.log(`Fetching reviews for movie: ${movieUrl}`);
  
  console.log(`Fetching TMDB trending: ${url}`);
  
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
    signal: controller.signal,
  }).catch((e) => {
    throw e;
  }).finally(() => clearTimeout(timeoutId));
  
  const data = await resp.json().catch(() => ({}));
  
  const secondResp = await fetch(movieUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
    signal: controller.signal,
  });
  
  const external_ids = await secondResp.json().catch(() => ({}));
  
  
  
  console.log(`External IDs found: ${JSON.stringify(external_ids.imdb_id)}`);
  
  // http://www.omdbapi.com/?apikey=9bebff40&i=tt1375666
  const omdbUrl = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${external_ids.imdb_id}`;
  
  const omdbResp = await fetch(omdbUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    signal: controller.signal,
  });
  
  console.log(`Fetching OMDB data: ${omdbUrl}`);
  const omdbData = await omdbResp.json().catch(() => ({}));
  console.log(`OMDB data fetched: ${JSON.stringify(omdbData.Ratings)}`);
  
  const shaped_data = {
    tmdb_id: data.id,
    imdb_id: external_ids.imdb_id,
    tmdb_page: data.page,
    ratings: omdbData.Ratings,
    reviews: data.results,
    total_pages: data.total_pages,
    total_results: data.total_results,
  };

  if (!resp.ok) {
    const err = new Error('TMDB responded with an error');
    err.upstream = true;
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return shaped_data;
};

module.exports.fetchReviews = fetchReviews;
