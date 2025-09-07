const { tmdbFetch, omdbFetch } = require("../utils/apiUtils");

async function fetchReviews(id, page) {
  const params = new URLSearchParams({
    language: "en-US",
    page: String(page),
  });

  const reviewsUrl = `movie/${id}/reviews?${params.toString()}`;
  const externalIdsUrl = `movie/${id}/external_ids`;

  let reviews, external_ids, ratings;
  try {
    reviews = await tmdbFetch(reviewsUrl);
    external_ids = await tmdbFetch(externalIdsUrl);
    ratings = await omdbFetch(external_ids.imdb_id);
  } catch (error) {
    throw error; // Let controller handle the error
  }

  const combinedReviewsRatings = {
    tmdb_id: reviews.id,
    imdb_id: external_ids.imdb_id,
    page: reviews.page,
    ratings: ratings.Ratings,
    reviews: reviews.results,
    total_pages: reviews.total_pages,
    total_results: reviews.total_results,
  };
  return combinedReviewsRatings;
}

module.exports.fetchReviews = fetchReviews;
