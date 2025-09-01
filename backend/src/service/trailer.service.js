const { tmdbFetch } = require("../utils/apiUtils");

async function fetchTrailer(movie_id) {  

  const reviewsUrl = `movie/${movie_id}/videos?language=en-US`;
  let response;
  try {
    response = await tmdbFetch(reviewsUrl);
  } catch (error) {
    throw error; // Let controller handle the error
  }

  // Check if the response contains a movie trailer,
  // in the TMDB API, trailer are either name "Trailer" or "Official Trailer".
  const trailer = response.results.find(
    (item) =>
      item.type === "Trailer" &&
      item.name.toLowerCase().includes("trailer") &&
      item.site === "YouTube"
  );

  // Return a message if no trailer is found
  if (!trailer) {
    return { status: 404, message: "Trailer not found." };
  }

  return {
    id: movie_id,
    youtube_key: trailer.key,
    name: trailer.name,
    site: trailer.site,
    type: trailer.type,
  };

}

module.exports.fetchTrailer = fetchTrailer;
