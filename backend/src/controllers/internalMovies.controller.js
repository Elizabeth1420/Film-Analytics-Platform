const { handleApiError } = require("../utils/apiUtils");
const  internalMoviesService  = require("../service/internalMovies.service");

async function getInternalMovies(req, res, next) {
  try {   

    const data = await internalMoviesService.fetchInternalMovies();
    res.status(200).json(data);
    
  } catch (err) {
    handleApiError(err, res, next);
  }
}

async function addInternalMovie(req, res, next) {
  try { 
    const movie = req.body;
    const data = await internalMoviesService.postOrUpdateMovie(movie);
    res.status(200).json(data);
  }
  catch (err) {
    handleApiError(err, res, next);
  }   
}

async function deleteMovie(req, res, next) {
  try {
    const movieId = req.params.id;
    const data = await internalMoviesService.deleteMovie(movieId);
    res.status(200).json(`Movie with ID ${data.id} deleted successfully.`);
  } catch (err) {
    handleApiError(err, res, next);
  }
}


module.exports = { getInternalMovies, addInternalMovie, deleteMovie };