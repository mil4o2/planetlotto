'use strict';

angular.module('lyCart.filters')
    .filter('floor', [function() {
        return function(input) {
            return Math.floor(input);
        }
    }]);