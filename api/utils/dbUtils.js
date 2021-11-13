/*
* DB util file to put DB specific Operations
*/

var mongoose = require('mongoose');

module.exports = {
  dbConnection: function(dbPath, options) {
    return mongoose.createConnection(dbPath, options);
  },

  closeConnection: function (connection){
    connection.close();
    console.log("utils: closing the DB connection:",connection.readyState);// logs 0
  }
};
