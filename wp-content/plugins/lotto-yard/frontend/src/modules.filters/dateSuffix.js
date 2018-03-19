'use strict'

angular.module('lyApp.filters')
    .filter('dateSuffix', ['$filter', function($filter) {
        var suffixes = ["th", "st", "nd", "rd"];
        return function(input) {
            var dtfilter = $filter('date')(input, 'EEE, MMMM d');
            var day = parseInt(dtfilter.slice(-2));
            var relevantDigits = (day < 30) ? day % 20 : day % 30;
            var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
            return dtfilter + suffix;
        }
    }]);