'use strict'

angular.module('lyApp.filters')
    .filter('jackpot', [function() {
        return function(jackpot) {
            if (!jackpot || jackpot < 0) return ' Pending';
            var millions = jackpot / 1000000;
            return millions;
        }
    }]);