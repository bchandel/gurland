const moment = require('moment');

/*
* Gener service to handel the geners business logic
*/

class GenerService {
  constructor(db) {
    this.db = db;
  }

  async getAllGeners() {

    let data = await this.db.Gener.find({});
    return data; 
  }

  async addGener(payload) {
    let movieData = {
      name : payload.name,
      description: payload.description ? payload.description : ''
    }
    let data = await this.db.Gener.create(movieData);
    return data; 
  }

  async removeGenerByName(name) {
    
    let data = await this.db.Gener.deleteOne({name: name});
    return data; 
  }

}
module.exports = {
  generService: function (db) {
    return new GenerService(db);
  }
};
