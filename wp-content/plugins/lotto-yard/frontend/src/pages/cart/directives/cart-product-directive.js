'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCartProduct
     * @restrict A
     * @element ANY
     *
     * @description
     */
    .directive('lyCartProduct', [
        'lyConstants',
        'lyAppTranslationService',
        'lyAppProductsServices',
        'lyCart.utility',
        function(
            lyConstants,
            lyAppTranslationService,
            lyAppProductsServices,
            lyUtilities
        ) {
            return {
                restrict: 'A',
                scope: {
                    item: '=',
                    add: '&',
                    remove: '&',
                    showDetails: '=',
                    showDraws: '='
                },
                templateUrl: lyConstants.partialPath + 'cart/templates/cart-product.html',
                controller: 'CartCtrl',
                link: function(scope) {
                    lyAppTranslationService.getTranslations(scope);
                    scope.active = false;
                    scope.waitingForResponse = false;

                    scope.changeTickets = function(item, change) {
                        var currentIndex = lyConstants.groupTickets.indexOf(scope.item.getNumberOfTickets());

                        if (currentIndex != -1) {
                            currentIndex += change;
                            if (currentIndex >= 0 && currentIndex < lyConstants.groupTickets.length) {
                                scope.item.setNumberOfTickets(lyConstants.groupTickets[currentIndex]);
                            }
                        }
                    };

                    function getLottteryDrawsOptions(rules, lotteryId, productId, isSubscription, drawsCount) {
                        var ProductsDrawOption = rules.ProductsDrawOptions.filter(function(item) {
                            return item.IsSubscription == isSubscription && item.ProductId == productId;
                        })[0];
                        var multiDrawOption = ProductsDrawOption.MultiDrawOptions.filter(function(item) {
                            return item.NumberOfDraws == drawsCount;
                        });
                        return multiDrawOption[0];
                    }
                    scope.changeDraw = function(item, change) {
                        debugger
                        if (!scope.waitingForResponse) {
                            var currentDraws = item.getNumberOfDraws();
                            item.setNextDraw(change);
                            var nextDraws = item.getNumberOfDraws();

                            var drawOptions = getLottteryDrawsOptions(item.getRules(), item.LotteryTypeId, item.getProductType(), false, item.getNumberOfDraws());
                            if (item.getProductType() != 3 && item.getNumberOfLinesOrShares() < drawOptions.MinLines) {
                                var difference = drawOptions.MinLines - item.getNumberOfLinesOrShares();
                                for (var i = 0; i < difference; i++) {
                                    var newLine = lyUtilities.quickpick(item.getRules());
                                    item.addLine(newLine);
                                }
                            }
                            if (currentDraws != nextDraws) {
                                scope.waitingForResponse = true;
                                var linesOrShares = item.getProductType() == 14 || item.getProductType() == 3 ? 0 : item.getNumberOfLinesOrShares();

                                lyAppProductsServices.getProductPriceByParams(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType(), linesOrShares)
                                    .then(function(data) {
                                        scope.setPriceAndDiscount(item, data);
                                        scope.initCart();
                                    }, function(error) {
                                        scope.waitingForResponse = false;
                                    });
                            }
                        }
                    };

                    scope.showDetail = function() {
                        scope.active = !scope.active;
                    };
                }
            };
        }
    ]);
