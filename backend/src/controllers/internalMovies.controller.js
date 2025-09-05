const { handleApiError } = require("../utils/apiUtils");
const internalMoviesService = require("../service/internalMovies.service");
const validation = require("../utils/validation");

async function getInternalMovies(req, res, next) {
  try {
    const data = await internalMoviesService.fetchInternalMovies();
    res.status(200).json(data);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

async function addInternalMovie(req, res, next) {
  const movie = req.body;
  const error = validation.validateMovieBody(movie);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const data = await internalMoviesService.postOrUpdateMovie(movie);
    res.status(200).json(data);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

async function deleteMovie(req, res, next) {
  const movieId = req.params.id;
  if (!validation.isValidPositiveInteger(movieId)) {
    return res.status(400).json({ error: "A valid movie ID is required." });
  }

  try {
    const data = await internalMoviesService.deleteMovie(movieId);
    res.status(200).json(`Movie with ID ${data.id} deleted successfully.`);
  } catch (err) {
    handleApiError(err, res, next);
  }
}

module.exports = { getInternalMovies, addInternalMovie, deleteMovie };
