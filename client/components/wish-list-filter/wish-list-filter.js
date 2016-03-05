'use strict';

angular.module('altitudeLabsApp')
  .filter('wishListFilter', function snackFilter() {

    var filterSnack = function (inputSnacks, criteria, filterField) {
      if (!criteria){
        return inputSnacks;
      }
      var regex = new RegExp(criteria.toLowerCase(), 'i');
      var filteredSnacks = [],
          i;
      angular.forEach(inputSnacks, function(singleSnack){
        if (filterField === 'location') {
          for (i = 0; i < singleSnack.availableLocaltions.length; i++) {
            if (regex.test(singleSnack.availableLocaltions[i])) {
              filteredSnacks.push(singleSnack);
              break;
            }
          }
        } else {
          if(regex.test(singleSnack.snackName)){
            filteredSnacks.push(singleSnack)
          }
        }
      });
      return filteredSnacks;
    };

    return filterSnack;
  });
