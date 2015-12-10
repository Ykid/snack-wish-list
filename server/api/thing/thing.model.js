'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  name: String,
  snackImageUrl: String,
  price: Number,
  buyRepetition: Number,
  likedByUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  availableLocations: [String]
});

module.exports = mongoose.model('Thing', ThingSchema);