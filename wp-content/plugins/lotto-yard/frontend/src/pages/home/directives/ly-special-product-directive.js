'use strict';

angular.module('lyApp.directives')
    .directive('lySpecialProduct', [
        'lyCart',
        'lyAppLotteriesService',
        'quickPickService',
        'lyConstants',
        'stateHelper',
        'lyAppTranslationService',
        function(
            lyCart,
            lyAppLotteriesService,
            quickPickService,
            lyConstants,
            stateHelper,
            lyAppTranslationService
        ) {
            return {
                restrict: 'A',
                templateUrl: lyConstants.partialPath + 'home/templates/ly-special-product.html',
                scope: {
                    product: '=',
                    isClassicTab: '=',
                    lotteriesResults: '='
                },
                controller: ['$scope', function($scope) {
                    lyAppTranslationService.getTranslations($scope);
                    if (!Array.isArray($scope.lotteriesResults)) {
                        return;
                    }
                    $scope.lastResults = $scope.lotteriesResults.filter(function(current) {
                        return current.LotteryName.toLowerCase() == $scope.product.LotteryName.toLowerCase();
                    })[0];

                    if ($scope.lastResults && $scope.lastResults.WinningResult) {
                        var allNumbers = $scope.lastResults.WinningResult.split('#');
                        $scope.selectedNumbes = allNumbers[0].split(',');
                        $scope.extraNumbers = allNumbers[1] ? allNumbers[1].split(',') : [];
                    }

                    lyAppLotteriesService.getAllLotteriesRules()
                        .then(function(resp) {
                            if (!Array.isArray(resp)) {
                                return;
                            }

                            $scope.lotteryRules = resp.filter(function(current) {
                                return current.LotteryType.toLowerCase() == $scope.product.LotteryName.toLowerCase();
                            })[0];
                        }, function(error) {
                            stateHelper.goToErrorMaintenance();
                        });

                    var currentLottery = lyConstants.lotteriesInfo.filter(function(lottery) {
                        return lottery.id == $scope.product.LotteryTypeId;
                    });

                    $scope.quickPicks = !currentLottery.length ? 0 : currentLottery[0].quickPicks;

                    $scope.buyQuickPick = function() {
                        if ($scope.isClassicTab) {
                            quickPickService.addPersonalQuickPickToCart(1, parseInt($scope.quickPicks), $scope.product.LotteryTypeId, false)
                                .then(function() {
                                    stateHelper.goToCartPage();
                                });
                        } else {
                            quickPickService.addGroupQuickPickToCart(1, 1, $scope.product.LotteryTypeId, false);
                            stateHelper.goToCartPage();
                        }
                    };

                    $scope.goToPlayPage = function() {
                        stateHelper.goToPlayPage($scope.product.LotteryName, $scope.isClassicTab);
                    };
                }]
            }
        }
    ])