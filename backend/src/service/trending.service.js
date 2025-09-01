const { tmdbFetch } = require("../utils/apiUtils");

async function fetchTrending(timewindow, page = 1 ) {  
  const params = new URLSearchParams({
    language: 'en-US',
    page: String(page),
  });    
  const trendingUrl = `trending/movie/${timewindow}?${params.toString()}`;  
  return await tmdbFetch(trendingUrl);
};

module.exports.fetchTrending = fetchTrending;
