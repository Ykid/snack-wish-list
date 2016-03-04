'use strict';
angular.module('altitudeLabsApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, selectedWishItem, snackShoppingEntryService, Modal) {

  $scope.wishItem = selectedWishItem || [];

  $scope.snackImageUrl = $scope.wishItem && $scope.wishItem.snackImageUrl;
  $scope.snackName = $scope.wishItem && $scope.wishItem.snackName;
  $scope.snackShops = $scope.wishItem && $scope.wishItem.availableLocaltions && $scope.wishItem.availableLocaltions.join(', ');
  $scope.snackPrice = $scope.wishItem && $scope.wishItem.price;
  var showError = Modal.confirm.showError();
  $scope.showPreviewImage = function(snackImageUrl) {
    if (typeof snackImageUrl === 'string' &&  snackImageUrl !== '') {
      return {
        'background-image' : 'url(' + snackImageUrl + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': '50% 50%',
        'padding-bottom': '37.5%',
      };
    } else {
      return {};
    }
  };

  $scope.createNewItem = function() {
    var locations = typeof $scope.snackShops === 'string' ? $scope.snackShops.split(',') : ['not available'];
    locations.forEach(function (val, index) {
      locations[index] = val.trim();
    });
    var data = {
      name: $scope.snackName,
      quantity: $scope.snackAmount,
      snackImageUrl: $scope.snackImageUrl,
      price: $scope.snackPrice,
      availableLocations: locations
    }

    snackShoppingEntryService.requestNewItem(data).then(
      function (successResponse) {
        $uibModalInstance.close('close');
      },
      function (errorResponse) {
        if (errorResponse && errorResponse.data && typeof errorResponse.data.message === 'string'){
          showError(errorResponse.data.message);
        } else {
          showError(JSON.stringify(errorResponse.data));
        }
      });
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});