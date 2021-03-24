'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const catSchema = new Schema({
  name: String,
  age: { type: Number, min: 0 },
  gender: { type: String, enum: ['male', 'female'] },
  color: String,
  weight: { type: Number, min: 0 },
});

module.exports = mongoose.model('Cat', catSchema);
