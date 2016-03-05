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
  var listType = req.query.listType;
  // Request db
  if (listType === "outstanding") {
    WishItem.find({hasBrought: false}).
    populate('requestUsers.userId').
    populate('thing').
    exec(function (err, docs) {
      handleGetWishItems(err, docs, req, res);
    });

  } else if (listType === "history") {
    WishItem.find({hasBrought: true}).
    populate('requestUsers.userId').
    populate('thing').
    exec(function (err, docs) {
      handleGetWishItems(err, docs, req, res);
    });

  } else if (listType === "all") {
    WishItem.find({}).
    populate('requestUsers.userId').
    populate('thing').
    exec(function (err, docs) {
      handleGetWishItems(err, docs, req, res);
    });

  }
  // WishItem.find(function (err, wishItems) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, wishItems);
  // });
};

function handleGetWishItems(err, wishItems, req, res) {
  if(err) { return handleError(res, err); }

  var jsonItems = [];

  var wishItemsLength = wishItems.length;
  for (var i = 0; i < wishItemsLength; i++) {
    var wishItem = wishItems[i];
    var thing = wishItem.thing;

    var likedByUserIds = (thing && thing.likedByUserIds) || []; //default value
    var liked = likedByUserIds.indexOf(req.user._id) !== -1;
    jsonItems[i] =
    {
      "_id": wishItem._id,
      "itemId": thing._id,
      "name": thing.name,
      "quantity": wishItem.requireQuantity,
      "hasBrought": wishItem.hasBrought,
      "buyRepetition": thing.buyRepetition,
      "likes": thing.likedByUserIds.length || 0,
      "liked": liked,
      "snackImageUrl": thing.snackImageUrl,
      "price": thing.price,
      "requesterName": wishItem.requestUsers[0].userId && wishItem.requestUsers[0].userId.name,
      "availableLocations": thing.availableLocations
    };
  } // End of for loop

  var result = {"wishItems": jsonItems};
  return res.status(200).json(result);
}

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

    // Snack has already existed
    if (thing) {
      objectIdOfThing = thing._id;
      createNewWishItem(objectIdOfThing, requestUserId, snackQuantity, req, res);
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

      Thing.create(newThingJSON, function (err, newThing) {
        if(err) { return handleError(res, err); }
        objectIdOfThing = newThing._id;
        createNewWishItem(objectIdOfThing, requestUserId, snackQuantity, req, res);
      });
    }

  });
  // WishItem.create(req.body, function (err, wishItem) {
    // if(err) { return handleError(res, err); }
    // return res.json(201, wishItem);
  //   mongoose.model('thing').find()function()err, ;
  // });
};

function createNewWishItem(objectIdOfThing, requestUserId, snackQuantity, req, res) {
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
}

// Mark wish item as brought
exports.markAsBrought = function(req, res) {
  var objectIds = req.body.objectIds;
  var updateData = {_id: {$in: objectIds}};

  WishItem.update(updateData,
    { hasBrought: true },
    { multi: true },
    function (err, noOfWishItemsUpdated) {
      WishItem.
        find(updateData).
        select('thing -_id').
        lean().
        exec(function(err, items) {
          if(err) { console.log('err', err); }
          var query = {_id: {$in:[]}};
          for (var i = 0; i < items.length; i++) {
            query._id.$in.push(items[i].thing.toString());
          }
          Thing.update(query,
            { $inc: {buyRepetition : 1}},
            { multi: true },
            function (err, noOfItemsUpdated) {
              if(err) { return handleError(res, err); }
              return res.status(200).json({});
          });
        });
  });


  // WishItem.findByIdAndUpdate(objectId, updateData, function(err, wishItem){
  //   if (err) { return handleError(res, err); }
  //   if(!wishItem) { return res.send(404); }
  //   return res.status(200).json(wishItem);
  // });
}

// Update quantity of a wishitem
exports.updateQuantity = function(req, res) {
  var objectId = req.body.objectId;
  var addOrMinus = req.body.addOrMinus;
  WishItem.findById(objectId, function (err, wishItem) {
    if(err) { return handleError(res, err); }
    if(!wishItem) { return res.send(404); }

    // Get new quantity
    var quantity = wishItem.requireQuantity;
    if (addOrMinus === "add") {
      addOneItem(req.user, wishItem, res);
    } else {
      minusOneItem(req.user, wishItem, res);
    }

  });

//userId is objectId
function userHasOrderItem(wishItem, userId) {
  var entry,i;
  for (i=0; i<wishItem.requestUsers.length; i++) {
    entry = wishItem.requestUsers[i];
    if (entry.userId.toString() === userId.toString()) {
      return i;
    }
  }
  return -1;
}

function addOneItem(user, wishItem, res) {
  var userIndex = userHasOrderItem(wishItem, user._id);
  if (userIndex !== -1) {
    wishItem.requestUsers[userIndex].requireQuantity += 1;
    wishItem.requireQuantity += 1;
    wishItem.markModified('requestUsers');
  } else {
    wishItem.requestUsers.push({
      userId: user._id,
      requireQuantity: 1
    });
    wishItem.markModified('requestUsers');
    wishItem.requireQuantity += 1;
  }

  wishItem.save(function (err) {
    if(err) { return handleError(res, err); }
    return res.status(200).json({});
  });
}

function minusOneItem(user, wishItem, res) {
  var userIndex = userHasOrderItem(wishItem, user._id);

  if (userIndex !== -1) {
    if (wishItem.requestUsers[userIndex].requireQuantity <= 1) {
      wishItem.requestUsers.splice(userIndex, 1);
    } else {
      wishItem.requestUsers[userIndex].requireQuantity -= 1;
    }
    wishItem.requireQuantity -= 1;
    wishItem.markModified('requestUsers');

    if (wishItem.requireQuantity <= 0) {//no more people want this item, delete
      wishItem.remove(function (err, doc) {
        if(err) { return handleError(res, err); }
        return res.status(200).json({});
      });
    } else {
      wishItem.save(function (err) {
        if(err) { return handleError(res, err); }
        return res.status(200).json({});
      });
    }

  } else {
    res.status(400).json({'message': 'You did not order any of these so you cannot reduce the quantity'});
  }
}
  // Delete item
  // if (quantity <= 0) {
  //   WishItem.findByIdAndRemove(objectId, function (err, doc){
  //     if(err) { return handleError(res, err); }
  //     return res.status(200).json({});
  //   });
  // } else {
  //   // Update quanity of item
  //   WishItem.findByIdAndUpdate(objectId, {requireQuantity: quantity}, {"new": true}, function (err, doc){
  //     if(err) { return handleError(res, err); }
  //     return res.status(200).json(doc);
  //   });
  // }
}

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

