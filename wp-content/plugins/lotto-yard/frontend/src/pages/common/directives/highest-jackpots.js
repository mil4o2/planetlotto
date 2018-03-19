'use strict';

angular.module('lyPlayPage.directives')
    .directive('lyHighestJackpots', [
        '$lyCart',
        function(
            $lyCart
        ) {
            return {
                restrict: 'AE',
                templateUrl: $lyCart.partialPath + 'common/templates/highest-jackpots.html',
                controller: ['$scope', function($scope) {
                    $scope.draws = $scope.draws.sort(function(a, b) {
                        return b.Jackpot - a.Jackpot;
                    });
                }]
            }
        }
    ]);