/*
* Establish conection to MongoDB and create the schema model 
*/

let mongoose = require('mongoose');
let cache = require('memory-cache');
let utils = require('../api/utils/dbUtils');
let generSchema = require('../api/geners/gener-schema').Gener;
let movieSchema = require('../api/movies/movie-schema').Movie;
let config = require('./config.json');
let envConfig = config[config.env];

module.exports = {

  loadSchemasPluginsTemplates: function(req, gtDB) {
    req.db = {
      Gener: gtDB.model('Gener', generSchema),
      Movie: gtDB.model('Movie', movieSchema)
    };
  },

  getDBConnection: function (req, resp, next) {
    let dbPath = req.dbPath;
    let gtDB = cache.get(dbPath);
    if (!gtDB) {
      let options = {
        poolSize: 50,
        connectTimeoutMS: 30000,
        keepAlive: 300000,
        useNewUrlParser: true
      };
      
      gtDB = utils.dbConnection(dbPath, options);
      gtDB
        .once('openSet', () => console.log('Connected to db'))
        .on('error', function (err) {
          console.error(err);
          console.error('connection error:', envConfig.dbName);
          resp.status(500).send('connection error:',err);
        })
        .on('disconnected', function () {
          console.error('connection disconnected:', envConfig.dbName);
        });
      cache.put(dbPath, gtDB, 60 * 60 * 1000, function (dbPath, dxDB) {
        utils.closeConnection(req, resp, dxDB);
      });
      this.loadSchemasPluginsTemplates(req, gtDB);
    } else {
      gtDB = cache.get(dbPath);
      this.loadSchemasPluginsTemplates(req, gtDB);
    }
    req.db =  gtDB.models;
    next();
  }
 
};
