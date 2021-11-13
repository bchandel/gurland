const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GenerSchema = new Schema(
  {
    name : {type: String, required: true }, 
    description: String
  },
  { timestamps: true }
);

GenerSchema.index({ name: 1 });

module.exports = {
  Gener: GenerSchema
};
