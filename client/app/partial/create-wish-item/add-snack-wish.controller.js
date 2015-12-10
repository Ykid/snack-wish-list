angular.module('altitudeLabsApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, selectedWishItem) {

  $scope.wishItem = selectedWishItem || [];

  $scope.snackImageUrl = $scope.wishItem && $scope.wishItem.snackImageUrl;
  $scope.snackName = $scope.wishItem && $scope.wishItem.snackName;
  $scope.snackShops = $scope.wishItem && $scope.wishItem.availableLocaltions && $scope.wishItem.availableLocaltions.join(', ');
  $scope.snackPrice = $scope.wishItem && $scope.wishItem.price;

  $scope.showPreviewImage = function(snackImageUrl) {
    return {
      'background-image' : 'url(' + snackImageUrl + ')',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      'background-position': '50% 50%'
    };
  };

  $scope.ok = function () {
    $uibModalInstance.close('close');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});