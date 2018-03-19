'use strict';

angular.module('lyCart.filters')
    .filter('round', [function() {
        return function(input) {
            return Math.round(input);
        }
    }]);