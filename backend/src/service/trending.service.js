const { tmdbFetch } = require("../utils/apiUtils");

async function fetchTrending(timewindow, page = 1 ) {
  
  const params = new URLSearchParams({
    language: 'en-US',
    page: String(page),
  });
  
  const TMDB_BASE = 'https://api.themoviedb.org/3/trending/movie';
  const url = `${TMDB_BASE}/${timewindow}?${params.toString()}`; 
  
  return await tmdbFetch(url);
};

module.exports.fetchTrending = fetchTrending;
