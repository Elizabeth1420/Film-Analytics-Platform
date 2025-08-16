const { tmdbFetch } = require("../utils/apiUtils");

async function fetchSearch(query, year, page = 1) {
  
  const params = new URLSearchParams({    
    include_adult: "false",
    language: "en-US",
    primary_release_year: year,
    query: query,
    page: String(page),
  });
  
  const TMDB_BASE = "https://api.themoviedb.org/3/search/movie";
  const url = `${TMDB_BASE}?${params.toString()}`;

  return await tmdbFetch(url);
}

module.exports.fetchSearch = fetchSearch;
