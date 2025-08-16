
const TMDB_BASE = 'https://api.themoviedb.org/3/search/movie';

// Constant filters from your brief
const BASE_PARAMS = {
  include_adult: 'false',
  language: 'en-US',
};


async function fetchSearch( query, page = 1 ) {
  const token = process.env.TMDB_BEARER_TOKEN;

  const params = new URLSearchParams({
    ...BASE_PARAMS,
    query: query,
    page: String(page),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  const url = `${TMDB_BASE}?${params.toString()}`;

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

  if (!resp.ok) {
    const err = new Error('TMDB responded with an error');
    err.upstream = true;
    err.status = resp.status;
    err.data = data;
    throw err;
  }

  return data;
};

module.exports.fetchSearch = fetchSearch;
