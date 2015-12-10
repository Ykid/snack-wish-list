'use strict';

angular.module('altitudeLabsApp')
  .controller('MainCtrl', function ($scope, $http, $window, $location, $uibModal, $log, snackItemService, snackShoppingEntryService, Modal) {
    $scope.filterName = '';
    $scope.snackList = [];
    var showError = Modal.confirm.showError();
    var init = function() {
      snackShoppingEntryService.getEntries('outstanding').then(
        function (successResponse) {
          $scope.snackList = successResponse;
        }, function (errorMsg) {
          showError(errorMsg);
        });
    };
    init();

    $scope.updateLike = function(snackItem) {
      snackItem.isDisabled = true;
      var data = {
        objectId: snackItem.itemId,
        liked: !snackItem.isLiked
      }
      snackItemService.likeOrUnlike(data).then(
        function (successResponse) {
          snackItem.isLiked = !snackItem.isLiked;
          snackItem.isDisabled = false;
          if (snackItem.isLiked === true) {
            snackItem.likes = parseInt(snackItem.likes) + 1 ;
          } else {
            snackItem.likes = parseInt(snackItem.likes) - 1 ;
          }
        }, function (errorResponse) {
          snackItem.isDisabled = false;
          if (errorResponse && errorResponse.data && typeof errorResponse.data.message === 'string'){
            showError(errorResponse.data.message);
          } else {
            showError(JSON.stringify(errorResponse.data));
          }
        });
    };
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

    $scope.goToLeaderBoard = function () {
      $location.path('/leaderBoard');
    }

    $scope.getBackgroundImage = function(imageUrl) {
      return {
        'background-image' : 'url(' + imageUrl + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': '50% 50%'
      };
    };

    $scope.buyItems = function() {
      var i, itemsToBeBought = [];
      for (i = 0; i < $scope.snackList.length; i++) {
        if ($scope.snackList[i].isMarked) {
          itemsToBeBought.push($scope.snackList[i]._id);
        }
      }

      snackShoppingEntryService.buyItems(itemsToBeBought).then(
        function (successResponse) {
          init();
        },
        function (errorResponse) {
          if (errorResponse && errorResponse.data && typeof errorResponse.data.message === 'string') {
            showError(errorResponse.data.message);
          } else {
            showError(JSON.stringify(errorResponse.data));
          }
        });
    };

  });
