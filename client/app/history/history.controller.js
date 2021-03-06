'use strict';

angular.module('altitudeLabsApp')
  .controller('HistoryCtrl', function ($scope, $http, $window, $uibModal, $log, snackItemService, snackShoppingEntryService, Modal) {
    $scope.filterName = '';
    // var sample = [{
    //   _id: '112',
    //   snackName:'Snacks Name',
    //   requestAmount: 2,
    //   snackImageUrl: 'https://www.geppettogroup.com/wp-content/uploads/2011/05/Scooby-Snacks1.jpg',
    //   likes: 5,
    //   price: 12,
    //   requester: 'Leonard',
    //   availableLocaltions: ['park and shop', 'sasa', 'joyo', 'park and shop', 'park and shop', 'park and shop'],
    //   requestedTimes: 1
    // }, {
    //   _id: '113',
    //   snackName:'Snacks 2 Name',
    //   requestAmount: 3,
    //   snackImageUrl: 'http://www.irvineparkrailroad.com/images/heroshots/12134826533.jpg',
    //   likes: 2,
    //   price: 24,
    //   requester: 'Anthony',
    //   availableLocaltions: ['711'],
    //   requestedTimes: 20
    // }, {
    //   _id: '111',
    //   snackName:'Snacks 3 Name',
    //   requestAmount: 4,
    //   snackImageUrl: 'http://www.firstuccdc.org/wp-content/uploads/2013/07/snacks.png',
    //   likes: 1,
    //   price: 13,
    //   requester: 'Andrianto',
    //   availableLocaltions: ['759'],
    //   requestedTimes: 3
    // }];
    $scope.snackList = [];
    var showError = Modal.confirm.showError();
    snackShoppingEntryService.getEntries('history').then(
      function (successResponse) {
        $scope.snackList = successResponse;
      }, function (errorMsg) {
        showError(errorMsg);
      });
    //change the display of the button according to the
    //like status
    $scope.checkLikeStatus = function (snackItem) {
      if (snackItem.isLiked) {
        return 'unlike it';
      } else {
        return 'I like it too!';
      }
    };

    $scope.myTracking = function(snackItem) {
      return snackItem._id;
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
    };

    $scope.getBackgroundImage = function(imageUrl) {
      return {
        'background-image' : 'url(' + imageUrl + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': '50% 50%'
      };
    };

    $scope.open = function (size, selectedWishItem) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/partial/create-wish-item/add-snack-wish.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          selectedWishItem: function () {
            return selectedWishItem;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

  });
