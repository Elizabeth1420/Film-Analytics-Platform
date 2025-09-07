const { tmdbFetch } = require("../utils/apiUtils");

async function fetchSearch(query, year, page = 1) {
  
  const params = new URLSearchParams({    
    include_adult: "false",
    language: "en-US",
    primary_release_year: year,
    query: query,
    page: String(page),
  });
  
  const searchUrl = `search/movie?${params.toString()}`;
  return await tmdbFetch(searchUrl);
}

module.exports.fetchSearch = fetchSearch;
