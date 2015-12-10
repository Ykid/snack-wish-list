angular.module('altitudeLabsApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, selectedWishItem) {

  $scope.items = selectedWishItem || [];
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});