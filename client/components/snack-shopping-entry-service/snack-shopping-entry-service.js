'use strict';

angular.module('altitudeLabsApp')
  .factory('snackShoppingEntryService', function snackShoppingEntryServiceFactory($http, Auth) {
    var snackShoppingEntryRequester = {};

    //get a list of snacks sorted by popularity
    snackShoppingEntryRequester.getEntries = function (option) {
      return $http.get('/api/wishItems/?listType=' + option).then(
        function (successResponse) {
          var snackShoppingEntries = [], i, singleSnackShoppingEntry;
          for (i = 0; i < successResponse.data.wishItems.length; i++) {
            singleSnackShoppingEntry = {
              _id: successResponse.data.wishItems[i]._id,
              snackName: successResponse.data.wishItems[i].name || 'no name',
              snackImageUrl: successResponse.data.wishItems[i].snackImageUrl || 'https://git.reviewboard.kde.org/media/uploaded/files/2015/07/18/a70d8ab6-1bbf-4dcc-b11f-524c2f56b14a__picture_default_cover.jpg',
              itemId: successResponse.data.wishItems[i].itemId || 'noItemId',
              requestAmount: successResponse.data.wishItems[i].quantity || 'not available',
              likes: successResponse.data.wishItems[i].likes || 0,
              price: successResponse.data.wishItems[i].price || 'missing',
              availableLocaltions: successResponse.data.wishItems[i].availableLocations || ['not available'],
              requestedTimes: successResponse.data.wishItems[i].buyRepetition || 0,
              isLiked: successResponse.data.wishItems[i].liked || false,
              isDisabled: false
            };
            snackShoppingEntries.push(singleSnackShoppingEntry);
          }
          return snackShoppingEntries;
        },
        function (errorResponse) {
          if (errorResponse && errorResponse.data && typeof errorResponse.data.message === 'string'){
            return errorResponse.data.message;
          } else {
            return JSON.stringify(errorResponse.data);
          }
        });
    };

    //create a new wish item
    snackShoppingEntryRequester.requestNewItem = function (data) {
      return $http.post('/api/wishItems', data);
    };

    snackShoppingEntryRequester.buyItems = function (ids) {
      var data = {
        objectIds: ids
      };
      return $http.put('/api/wishItems/markAsBrought', data);
    };

    return snackShoppingEntryRequester;
  });