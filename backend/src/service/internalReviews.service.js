const supabase = require("../utils/supabaseClient");

async function fetchInternalReviews(movie_id) {
  // 1. Get all reviews for the movie
  const { data: reviews, error: reviewsError } = await supabase.rpc('get_reviews_for_movie', { p_movie_id: movie_id });

  if (reviewsError) throw reviewsError;

  // 2. Get all ratings for the movie
  const { data: ratings, error: ratingsError } = await supabase
    .from('ratings')
    .select('imdb, rotten_tomato, metacritic')
    .eq('movie_id', movie_id);

  if (ratingsError) throw ratingsError;

  // 3. Aggregate scores
  const aggregate = {
    imdb: null,
    rotten_tomato: null,
    metacritic: null,
  };

  if (ratings.length > 0) {
    aggregate.imdb =
      ratings.reduce((sum, r) => sum + (r.imdb || 0), 0) / ratings.length;
    aggregate.rotten_tomato =
      ratings.reduce((sum, r) => sum + (r.rotten_tomato || 0), 0) / ratings.length;
    aggregate.metacritic =
      ratings.reduce((sum, r) => sum + (r.metacritic || 0), 0) / ratings.length;
  }

  return {
    reviews,
    aggregateRatings: aggregate,
  };
}

async function postReview(movieId, review, imdb_rating, rotten_tomatoes_rating, metacritic_rating) {

  // 1) Get current user from supabase auth
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;


  // 2) Verify that public_user_id belongs to this user
  const { data: profileData, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, user_id")
    .eq("user_id", data.user.id)
    .single();

  if (profileError) throw profileError;

  if (!profileData) {
    throw { status: 403, message: "User profile not found." };
  }
 

  // 3) Insert review
  const { data: reviewData, error: reviewError } = await supabase
    .from("reviews")
    .insert([
      {
        movie_id: movieId,
        review,        
      },
    ])
    .select();

  if (reviewError) throw reviewError;

  const { data: ratingData, error: ratingError } = await supabase
    .from("ratings")
    .insert([
      {
        movie_id: movieId,
        imdb: imdb_rating,
        rotten_tomato: rotten_tomatoes_rating,
        metacritic: metacritic_rating,
      },
    ])
    .select();
  if (ratingError) throw ratingError;



  // 5) Record user rating
  const { data: userRatingData, error: userRatingError } = await supabase
    .from("user_ratings_reviews")
    .insert([
      {
        public_user_id: profileData.id,
        review_id: reviewData[0].id,
        rating_id: ratingData[0].id,
      },
    ]);

  if (userRatingError) throw userRatingError;



  return reviewData;
}

module.exports = { fetchInternalReviews, postReview };
