/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /wishItem              ->  index
 * POST    /wishItem              ->  create
 * GET     /wishItem/:id          ->  show
 * PUT     /wishItem/:id          ->  update
 * DELETE  /wishItem/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var WishItem = require('./wishItem.model');
var Thing = require('../thing/thing.model');


// Get list of wishItem
exports.index = function(req, res) {
  WishItem.find(function (err, wishItems) {
    if(err) { return handleError(res, err); }
    return res.json(200, wishItems);
  });
};

// Get a single wishItem
exports.show = function(req, res) {
  WishItem.findById(req.params.id, function (err, wishItem) {
    if(err) { return handleError(res, err); }
    if(!wishItem) { return res.send(404); }
    return res.json(wishItem);
  });
};

// Creates a new wishItem in the DB.
exports.create = function(req, res) {

  var snackName = req.body.name;
  var snackQuantity = req.body.quantity;
  var snackImageUrl = req.body.snackImageUrl;
  var snackPrice = req.body.price;
  var availableLocations = req.body.availableLocations;
  var requestUserId = req.user._id;

  // Check if snack has existed in db
  Thing.findOne({name: snackName}, function (err, thing) {
    if(err) { return handleError(res, err); }

    var objectIdOfThing;
    console.log('thing', thing);
    // Snack has already existed
    if (thing) {
      objectIdOfThing = thing._id;
    } else {
      // Snack not existed: create new snack
      var newThingJSON =  
      {
        "name": snackName,
        "snackImageUrl": snackImageUrl,
        "price": snackPrice,
        "buyRepetition": 0,
        "noOfLikes": 0,
        "availableLocations": availableLocations
      };
      console.log('newThingJSON', newThingJSON);
      Thing.create(newThingJSON, function (err, newThing) {
        if(err) { return handleError(res, err); }
        objectIdOfThing = newThing._id;
      });
    }

    // Create wish item
    var newWishItemJSON = 
    {
      "thing": objectIdOfThing,
      "requestUsers": 
      [{
        "userId": requestUserId,
        "requireQuantity": snackQuantity
      }],
      "hasBrought": false,
      "requireQuantity": snackQuantity
    };

    WishItem.create(newWishItemJSON, function (err, newWishItemJSON) {
      if(err) { return handleError(res, err); }
      return res.status(200).json({});
    });
  });
  // WishItem.create(req.body, function (err, wishItem) {
    // if(err) { return handleError(res, err); }
    // return res.json(201, wishItem);
  //   mongoose.model('thing').find()function()err, ;
  // });
};

// Updates an existing wishItem in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  WishItem.findById(req.params.id, function (err, wishItem) {
    if (err) { return handleError(res, err); }
    if(!wishItem) { return res.send(404); }
    var updated = _.merge(wishItem, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, wishItem);
    });
  });
};

// Deletes a wishItem from the DB.
exports.destroy = function(req, res) {
  WishItem.findById(req.params.id, function (err, wishItem) {
    if(err) { return handleError(res, err); }
    if(!wishItem) { return res.send(404); }
    wishItem.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}