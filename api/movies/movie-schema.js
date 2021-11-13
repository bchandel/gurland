const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const gener = require('../geners/gener-schema').Gener;

const MovieSchema = new Schema(
  {
    name : {type: String, required: true }, 
    description: String,
    release_date: Date, 
    genres: [gener], 
    duration: String,
    rating: String
  },
  { timestamps: true }
);

MovieSchema.index({ name: 1 },{ unique: true });
MovieSchema.index({ rating: 1 });

module.exports = {
  Movie: MovieSchema
};
