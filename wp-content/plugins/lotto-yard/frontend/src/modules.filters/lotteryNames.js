'use strict'

angular.module('lyApp.filters')
    .filter('lotteryNames', [function() {
        return function(lottery) {
            switch (lottery.LotteryTypeId) {
                case 16:
                    return '';
                default:
                    return lottery.LotteryName
            }
        }
    }]);