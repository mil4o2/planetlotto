'use strict';

angular.module('lyApp.directives')
    .directive('lyLottery', [
        '$lyCart',
        'lyAppLotteriesService',
        'quickPickService',
        'lyConstants',
        'stateHelper',
        function(
            $lyCart,
            lyAppLotteriesService,
            quickPickService,
            lyConstants,
            stateHelper
        ) {
            return {
                restrict: 'A',
                scope: {
                    lottery: '=',
                    isClassicTab: '='
                },
                templateUrl: $lyCart.partialPath + 'play-lottery/templates/ly-play-lottery.html',
                link: function(scope) {
                    var currentLottery = lyConstants.lotteriesInfo.filter(function(current) {
                        return current.id == scope.lottery.LotteryTypeId;
                    });

                    scope.quickPicks = !currentLottery.length ? 0 : currentLottery[0].quickPicks;

                    lyAppLotteriesService.getAllLotteriesRules()
                        .then(function(resp) {
                            if (!Array.isArray(resp)) {
                                return;
                            }

                            scope.lotteryRules = resp.filter(function(current) {
                                return current.LotteryType.toLowerCase() == scope.lottery.LotteryName.toLowerCase();
                            })[0];
                        }, function(error) {
                            stateHelper.goToErrorMaintenance();
                        });

                    scope.buyQuickPick = function() {
                        if (scope.isClassicTab) {
                            quickPickService.addPersonalQuickPickToCart(1, parseInt(scope.quickPicks), scope.lottery.LotteryTypeId, false)
                                .then(function() {
                                    stateHelper.goToCartPage();
                                });
                        } else {
                            quickPickService.addGroupQuickPickToCart(1, 1, scope.lottery.LotteryTypeId, false)
                                .then(function(){
                                    stateHelper.goToCartPage();
                                });
                        }
                    };

                    scope.goToPlayPage = function() {
                        stateHelper.goToPlayPage(scope.lottery.LotteryName, scope.isClassicTab);
                    };
                }
            };
        }
    ])
