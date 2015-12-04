'use strict';

angular.module('altitudeLabsApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];
    var sample = [{
      name:'Snacks 1',
      amount: 2,
      imageUrl: 'https://www.geppettogroup.com/wp-content/uploads/2011/05/Scooby-Snacks1.jpg'
    }, {
      name:'Snacks 2',
      amount: 3,
      imageUrl: 'http://www.irvineparkrailroad.com/images/heroshots/12134826533.jpg'
    }, {
      name:'Snacks 3',
      amount: 4,
      imageUrl: 'http://www.firstuccdc.org/wp-content/uploads/2013/07/snacks.png'
    }];
    $scope.awesomeThings = sample;

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // });

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
  });
