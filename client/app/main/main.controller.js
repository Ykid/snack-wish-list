'use strict';

angular.module('altitudeLabsApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];
    var sample = [{
      snackName:'Snacks Name',
      requestAmount: 2,
      snackImageUrl: 'https://www.geppettogroup.com/wp-content/uploads/2011/05/Scooby-Snacks1.jpg',
      likes: 5,
      price: 12,
      requester: 'Leonard',
      availableLocaltions: ['park and shop'],
      requestedTimes: 1
    }, {
      snackName:'Snacks 2 Name',
      requestAmount: 3,
      snackImageUrl: 'http://www.irvineparkrailroad.com/images/heroshots/12134826533.jpg',
      likes: 2,
      price: 24,
      requester: 'Anthony',
      availableLocaltions: ['711'],
      requestedTimes: 20
    }, {
      snackName:'Snacks 3 Name',
      requestAmount: 4,
      snackImageUrl: 'http://www.firstuccdc.org/wp-content/uploads/2013/07/snacks.png',
      likes: 1,
      price: 13,
      requester: 'Andrianto',
      availableLocaltions: ['759'],
      requestedTimes: 3
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

    $scope.getBackgroundImage = function(imageUrl) {
      return {
        'background-image' : 'url(' + imageUrl + ')',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-position': '50% 50%'
      };
    }
  });
