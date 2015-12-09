'use strict';

angular.module('altitudeLabsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('leaderBoard', {
        url: '/leaderBoard',
        templateUrl: 'app/leader-board/leader-board.html',
        controller: 'LeaderBoardCtrl'
      });
  });