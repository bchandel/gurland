/*
* Index route file to import all application Route
*/

let gener = require('./geners/route');
let movie = require('./movies/route');


module.exports = {
  gurlandRoutes: function (app) {
    app.use('/api/geners', gener);
    app.use('/api/movie', movie);
  }
};
