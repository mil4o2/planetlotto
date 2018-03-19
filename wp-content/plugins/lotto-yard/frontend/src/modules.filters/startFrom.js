'use strict'

angular.module('lyApp.filters')
    .filter('startFrom', [function() {
        return function(input, start) {
            start = +start; //parse to int
            if (input) {
                return input.slice(start);
            }
        }
    }]);