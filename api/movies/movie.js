const moment = require('moment');

/*
* Movie service to handel the Movies realated business logic
*/

class MovieService {
  constructor(db) {
    this.db = db;
  }

  async getAllMovies() {
    
    let data = await this.db.Movie.find({});
    return data; 
  }

  async addMovie(payload) {
    try{
      let movieData = {
        name : payload.name,
        description: payload.description ? payload.description : '',
        release_date: payload.release_date ? moment(payload.release_date, 'DD-MM-YYYY').toDate() : '', 
        genres: payload.genres ? payload.genres : [], 
        duration: payload.duration ? payload.duration : '',
        rating: payload.rating ? payload.rating : '' 
      }
      let data = await this.db.Movie.create(movieData);
      return data; 
    }catch(err){
      throw err;
    }
  }

  async removeMovieByName(name) {
    
    let data = await this.db.Movie.deleteOne({name: name});
    return data; 
  }


};

module.exports = {
  movieService: function (db) {
    return new MovieService(db);
  }
};
