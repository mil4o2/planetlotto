'use strict';

angular.module('lyApp.directives')
    .directive('lyLatestWinners', [
        '$lyCart',
        '$timeout',
        'lyAppHttpService',
        'lyConstants',
        function(
            $lyCart,
            $timeout,
            lyAppHttpService,
            lyConstants
        ) {
            return {
                restrict: 'EC',
                templateUrl: $lyCart.partialPath + 'home/templates/ly-latest-winners.html',
                link: function(scope) {
                    lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAlllatestWinners).then(function(winners) {
                        scope.latestWinners = winners;

                        var total = 0;
                        for (var i = 0; i < winners.data.length; i++) {
                            total += parseFloat(winners.data[i].acf.won_price);
                        }

                        scope.getTotalSum = total;
                        $timeout(function() {
                            jQuery('#marquee').marquee({
                                duration: 20000,
                                gap: 0,
                                delayBeforeStart: 0,
                                direction: 'up',
                                duplicated: true,
                                pauseOnHover: true
                            });
                        });
                    });
                }
            }
        }
    ])