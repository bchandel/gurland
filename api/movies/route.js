const router = require('express').Router();
const movie = require('./movie');

/*
* Route file to add all RestAPI end-point related to Movies 
*/


const getAllMovies = async (req, res) => {
  try {
    let data = await movie.movieService(req.db).getAllMovies();
    return res.status(200).json({success: true,  data: data});
  } catch (err) {
    
    return res.status(500).json({success: false, message: err.message });
  }
};

const addMovie = async (req, res) => {
  try {
    let data = await movie.movieService(req.db).addMovie(req.body);
    return res.status(200).json({success: true,  data: data});
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({ succes: false, message: `Movie with name ${req.body.name} already exist!` });
    }
    if (err.message == "Movie validation failed: name: Path `name` is required.") {
      return res.status(500).send({ succes: false, message: 'Movie name is required field!' });
    }
    return res.status(500).json({succes: false, message: err.message });
  }
};

const removeMovieByName = async (req, res) => {
  try {
    if(!req.params.name){
      return res.status(400).json({message: 'Bad request please provide Movie Name'});
    }
    let data = await movie.movieService(req.db).removeMovieByName(req.params.name);
    if(data.deletedCount ==1 & data.ok){
      return res.status(200).json({succes: true,  message: `Movie deleted!`});
    }
    return res.status(200).json({succes: false,  data: data});
  } catch (err) {
    return res.status(500).json({succes: false, message: err.message });
  }
};

router
  .post('/add-movie',addMovie)
  .delete('/remove-movie/:name',removeMovieByName)
  .get('/get-all-movies', getAllMovies);
  
module.exports = router;
