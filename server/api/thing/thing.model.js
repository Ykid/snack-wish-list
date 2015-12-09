'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  snackImageUrl: String,
  price: Number,
  buyRepetition: Number,
  noOfLikes: Number,
  availableLocations: [String]
});

module.exports = mongoose.model('Thing', ThingSchema);