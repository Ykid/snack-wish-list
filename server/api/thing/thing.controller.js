/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');

// Get list of things
exports.index = function(req, res) {
  Thing.
    find({}).
    sort({buyRepetition: -1, noOfLikes: -1}).
    lean().
    exec(function (err, things){
      if(err) { return handleError(res, err); }
      if(!things) { return res.send(404); }

      // Add key 'liked' and delete key 'likedByUserIds'
      var thingsLength = things.length;
      var newThings = [];
      for (var i = 0; i < thingsLength; i++) {
        var thing = things[i];
        // Add key 'liked'
        var liked = false;
        if (thing.likedByUserIds) {
          for (var j = 0; j < thing.likedByUserIds.length; j++) {
            if (thing.likedByUserIds[j].toString() === req.user._id.toString()) {
              liked = true;
              break;
            }
          }
          thing.likes = thing.likedByUserIds.length;
        }
        thing.liked = liked;
        // delete key 'likedByUserIds'
        delete thing.likedByUserIds;
        newThings.push(thing);
      }

      return res.json(newThings);
    });
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Like or unlike a thing
exports.likeOrUnlike = function (req, res) {
  var objectId = req.body.objectId;
  var liked = req.body.liked;

  Thing.findById(objectId, function (err, thing) {
    if (err) { return res.status(500).json({'result' : false, 'error' : 'something went wrong'}); }
    if (!thing) {return res.status(400).json({'result' : false, 'error' : 'thing not exist'});}

    var likedByUserIds = thing.likedByUserIds;

    var userIdIndex = 0;
    var alreadyLiked = false;
    for (userIdIndex = 0; userIdIndex < likedByUserIds.length; userIdIndex++) {
      if (likedByUserIds[userIdIndex].toString() === req.user._id.toString()) {
        alreadyLiked = true;
        break;
      }
    }

    // Check error
    if (liked && alreadyLiked) {
      return res.status(422).json({'result' : false, 'error' : 'User already liked this item'});
    }
    if (!liked && !alreadyLiked) {
      return res.status(422).json({'result' : false, 'error' : 'User never like this item'});
    }

    // Like / unlike item
    if (liked) {
      likedByUserIds[likedByUserIds.length] = req.user._id;
    } else {
      likedByUserIds.splice(userIdIndex, 1);
    }

    thing.markModified('likedByUserIds');
    thing.save(function(err){
        if (err) {
        return handleError(res, err);
      } else {
        return res.status(200).json({'result' : true});
      }
    });
  });
}

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
