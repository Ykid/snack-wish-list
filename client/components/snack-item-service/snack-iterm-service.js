'use strict';

angular.module('altitudeLabsApp')
  .factory('snackItemService', function itermFactory($http, Auth) {
    var snackItemRequester = {};

    //get a list of snacks sorted by popularity
    snackItemRequester.getItems = function () {

    };

    //create a new wish item
    snackItemRequester.requestNewItem = function (data) {
      return $http.post('/api/wishItems', data);
    };

    return snackItemRequester;
  });