'use strict';

angular
    .module('lyApp.directives')
    .directive('lyPlayNowBtn',
    [
        'stateHelper',
        function(stateHelper)
        {

            return {
                restrict: 'A',
                link: function(scope, element){

                    scope.goToPlayPageFromHome = function() {

                        var lotteryName = scope.$parent.allDraws[0].LotteryName.toLowerCase();
                        stateHelper.goToPlayPage(lotteryName, true);

                    };
                }
            };

        }
    ])