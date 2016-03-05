'use strict';

angular.module('altitudeLabsApp')
  .factory('snackItemService', function itermFactory($http, Auth) {
    var snackItemRequester = {};

    //get a list of snacks sorted by popularity
    snackItemRequester.getItems = function () {
      return $http.get('/api/things').then(
        function (successResponse) {
          var snacks = [], i, singleSnack;
          for (i = 0; i < successResponse.data.length; i++) {
            singleSnack = {
              _id: successResponse.data[i]._id,
              snackName: successResponse.data[i].name || 'no name',
              snackImageUrl: successResponse.data[i].snackImageUrl || 'https://git.reviewboard.kde.org/media/uploaded/files/2015/07/18/a70d8ab6-1bbf-4dcc-b11f-524c2f56b14a__picture_default_cover.jpg',
              likes: successResponse.data[i].likes || 0,
              price: successResponse.data[i].price || 'missing',
              availableLocaltions: successResponse.data[i].availableLocations || ['not available'],
              requestedTimes: successResponse.data[i].buyRepetition || 0,
              isLiked: successResponse.data[i].liked || false,
              isDisabled: false
            };
            snacks.push(singleSnack);
          }
          return snacks;
        },
        function (errorResponse) {
          if (errorResponse && errorResponse.data && typeof errorResponse.data.message === 'string'){
            return errorResponse.data.message;
          } else {
            return JSON.stringify(errorResponse.data);
          }
        });
    };

    //likes/unlikes a snack item
    snackItemRequester.likeOrUnlike = function (data) {
      return $http.put('/api/things/likeOrUnlike', data);
    };

    return snackItemRequester;
  });