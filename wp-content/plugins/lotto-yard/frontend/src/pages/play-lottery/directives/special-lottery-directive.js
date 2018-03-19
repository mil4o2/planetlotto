'use strict';

angular.module('lyPlayPage.directives')
    .directive('lySpecialLottery', [
        '$uibModal',
        'lyAppProductsServices',
        'lyCart',
        'lyAppTranslationService',
        'stateHelper',
        'lyConstants',
        function(
            $uibModal,
            lyAppProductsServices,
            lyCart,
            lyAppTranslationService,
            stateHelper,
            lyConstants
        ) {
            return {
                restrict: 'A',
                scope: {
                    product: '='
                },
                templateUrl: lyConstants.partialPath + 'play-lottery/templates/ly-special-lottery.html',
                link: function(scope) {
                    lyAppTranslationService.getTranslations(scope);
                    scope.currency = lyConstants.currency;
                    getProductPrice();

                    scope.viewMoreShowHide = function() {
                        scope.$root.modalInstance = $uibModal.open({
                            animation: true,
                            template: '<div ly-popup-special-lottery product="product" save-to-cart="saveToCart(draws)"></div>',
                            scope: scope,
                            windowClass: 'modal-info-special-lotteries'
                        });
                    }

                    scope.saveToCart = function(draws) {
                        scope.product.AllLotteries.forEach(function(currentLottery, index) {
                            if (!draws) {
                                getProductPriceByLotteryId(scope.product.initialDraws, currentLottery.LotteryTypeId);
                            } else {
                                lyCart.addItem(currentLottery.LotteryTypeId, draws, 1, undefined, currentLottery.Price, scope.product.ProductId, false);
                                scope.$root.modalInstance.dismiss('cancel');
                            }

                            stateHelper.goToCartPage();
                        })
                    }

                    function getProductPrice() {
                        if (scope.product.isClassicLottery) {
                            lyAppProductsServices.getProductPriceByParams(scope.product.ProductId, scope.product.initialDraws, scope.product.LotteryTypeId)
                                .then(function(resp) {
                                    scope.defaultPrice = resp.Price;
                                });
                        }
                    }

                    function getProductPriceByLotteryId(draws, lotteryTypeId) {
                        lyAppProductsServices.getProductPriceByParams(scope.product.ProductId, draws, lotteryTypeId)
                            .then(function(resp) {
                                scope.product.AllLotteries.forEach(function(currentProduct, index) {
                                    if (resp.LotteryId == currentProduct.LotteryTypeId) {
                                        scope.product.AllLotteries[index].Price = resp.Price;
                                        lyCart.addItem(currentProduct.LotteryTypeId, draws, 1, undefined, resp.Price, scope.product.ProductId, false);
                                    }
                                })
                            });
                    }
                }
            }
        }
    ])