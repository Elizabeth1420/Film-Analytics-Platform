const supabase = require("../utils/supabaseClient");
const HTTP_STATUS = require("../utils/statusCodes");

async function fetchInternalMovies() {
  const { data, error } = await supabase.from("movies").select("*");
  if (error) {
    throw error; // Let controller handle error
  }
  return data;
}

async function postOrUpdateMovie(movie) {

  const { data, error } = await supabase
  .from('movies')
  .upsert(movie, {
    onConflict: 'title,release_date', // requires unique(title, release_date)
    returning: 'representation'
  })
  .select();

  if (error) {
    throw error; // Let controller handle error
  }
  return data;
}

async function deleteMovie(movieId) {
  const { data: movie, error: fetchError } = await supabase
    .from("movies")
    .select()
    .eq("id", movieId)
    .single();

  if (fetchError || !movie) {
    throw { status: HTTP_STATUS.NOT_FOUND, message: "Movie not found." };
  }

  const { error: deleteError } = await supabase
    .from("movies")
    .delete()
    .eq("id", movieId);

  if (deleteError) throw deleteError;

  return movie; // Return the deleted movie info
}

module.exports = {  fetchInternalMovies, postOrUpdateMovie, deleteMovie };
