const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
  nickname: String,
  scoreTime: String,
  description: String
});

module.exports = mongoose.model("Record", recordSchema);