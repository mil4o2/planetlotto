'use strict';

angular.module('lyPlayPage.directives')
    .directive('lyWinningChances', [
        '$timeout',
        '$lyCart',
        'lySelectPageService',
        function(
            $timeout,
            $lyCart,
            lySelectPageService
        ) {
            return {
                restrict: 'CA',
                template: "<round-progress max='100' current='current'" +
                    "radius='125' semi='true'color='#e84e0e' bgcolor='#F0F0F0' clockwise='clockwise'" +
                    "responsive='responsive' duration='800' animation='easeOutCubic'></round-progress>" +
                    "<div class='percent'>{{current}}%</div>" +
                    "<div class='percent-mobile'>{{current}}% {{::translation.winningChances}}</div>",
                link: function($scope) {

                    $scope.updateChances = function() {
                        $scope.ticketInfo = lySelectPageService.getCurrentTicket();
                        var numbLines = $scope.ticketInfo.filledLines;
                        var draws = $scope.ticketInfo.draws;
                        var subsWeeks = 0;
                        $scope.current = (numbLines * 3.5) + draws | 0;
                    }
                    $scope.updateChances()

                    $scope.$on('update-total', function() {
                        $scope.updateChances()
                    });
                }
            }
        }
    ])