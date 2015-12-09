'use strict';

angular.module('altitudeLabsApp')
  .controller('LeaderBoardCtrl', function ($scope, $http, $window) {
    // $scope.snackList = [];
    $scope.filterName = '';
    var sample = [{
      _id: '112',
      snackName:'Snacks Name',
      requestAmount: 2,
      snackImageUrl: 'https://www.geppettogroup.com/wp-content/uploads/2011/05/Scooby-Snacks1.jpg',
      likes: 5,
      price: 12,
      requester: 'Leonard',
      availableLocaltions: ['park and shop', 'sasa', 'joyo', 'park and shop', 'park and shop', 'park and shop'],
      requestedTimes: 1
    }, {
      _id: '113',
      snackName:'Snacks 2 Name',
      requestAmount: 3,
      snackImageUrl: 'http://www.irvineparkrailroad.com/images/heroshots/12134826533.jpg',
      likes: 2,
      price: 24,
      requester: 'Anthony',
      availableLocaltions: ['711'],
      requestedTimes: 20
    }, {
      _id: '111',
      snackName:'Snacks 3 Name',
      requestAmount: 4,
      snackImageUrl: 'http://www.firstuccdc.org/wp-content/uploads/2013/07/snacks.png',
      likes: 1,
      price: 13,
      requester: 'Andrianto',
      availableLocaltions: ['759'],
      requestedTimes: 3
    }];
    $scope.snackList = sample;

    //change the display of the button according to the
    //like status
    $scope.checkLikeStatus = function (snackItem) {
      if (snackItem.isLiked) {
        return 'unlike it';
      } else {
        return 'I like it too!';
      }
    };

    //TBD: send to the server to update the item status
    $scope.updateLikeStatus = function (snackItem) {
      if (snackItem.isLiked) {
        $window.alert("unlike it");
      } else {
        $window.alert("like it");
      }
      snackItem.isLiked = !snackItem.isLiked;
    };

    $scope.updateMarkStatus = function (snackItem) {
      if (snackItem.isMarked) {
        snackItem.isMarked = !snackItem.isMarked;
      } else {
        snackItem.isMarked = true;
      }
      return;
    }

    $scope.checkMarkedStatus = function (snackItem) {
      if (snackItem.isMarked) {
        return 'deselect'
      } else {
        return 'select';
      }
    }

    $scope.addOne = function(snackItem) {
      snackItem.requestAmount = snackItem.requestAmount + 1;
    }

    $scope.minusOne = function(snackItem) {
      snackItem.requestAmount = snackItem.requestAmount - 1;
    }

    $scope.getSubtotal = function() {
      var i,
          sum = 0;
      for (i = 0; i < $scope.snackList.length; i++) {
          if ($scope.snackList[i].price && $scope.snackList[i].isMarked) {
            sum = sum + $scope.snackList[i].price;
          }
      }
      return sum + '';
    }

    $scope.showSummary = function() {
      var i;
      for (i = 0; i < $scope.snackList.length; i++) {
        if ($scope.snackList[i].isMarked) {
          return true;
        }
      }
      return false;
    }

    $scope.myTracking = function(snackItem) {
      return snackItem._id;
    }

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.getLocations = function (snackItem) {
      var i,
          location = '';
      for (i = 0; i < snackItem.availableLocaltions.length; i++) {
        location = location + snackItem.availableLocaltions[i];
        if (i !== snackItem.availableLocaltions.length - 1) {
          location = location + ', '
        }
      }
      return location;
    }

    $scope.getBackgroundImage = function(imageUrl) {
      return {
        'background-image' : 'url(' + imageUrl + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': '50% 50%'
      };
    }
  });
