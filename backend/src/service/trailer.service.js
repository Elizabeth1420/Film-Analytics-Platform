const { tmdbFetch } = require("../utils/apiUtils");

async function fetchTrailer(id) {
  const params = new URLSearchParams({
    language: "en-US",
  });

  const TMDB_BASE = "https://api.themoviedb.org/3/movie/";
  const reviewsUrl = `${TMDB_BASE}${id}/videos?${params.toString()}`;

  let response;
  try {
    response = await tmdbFetch(reviewsUrl);
  } catch (error) {
    throw error; // Let controller handle the error
  }

  const trailer = response.results.find(
    (item) =>
      item.type === "Trailer" &&
      item.name.includes("Official Trailer") &&
      item.site === "YouTube"
  );

  // If a trailer is found, return its details
  if (trailer) {
    return {
      id: id,
      youtube_key: trailer.key,
      name: trailer.name,
      site: trailer.site,
      type: trailer.type,
    };
  }

  return { message: "Trailer not found" }; // Return a message if no trailer is found
}

module.exports.fetchTrailer = fetchTrailer;
