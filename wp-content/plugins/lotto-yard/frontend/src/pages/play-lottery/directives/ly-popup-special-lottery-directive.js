'use strict';

angular.module('lyPlayPage.directives')
    .directive('lyPopupSpecialLottery', [
        'lyConstants',
        '$uibModal',
        'lyAppLotteriesService',
        'lyAppProductsServices',
        function (
            lyConstants,
            $uibModal,
            lyAppLotteriesService,
            lyAppProductsServices
        ) {
            return {
                restrict: 'A',
                scope: {
                    product: '=',
                    saveToCart: '&'
                },
                templateUrl: lyConstants.partialPath + 'play-lottery/templates/ly-popup-special-lottery.html',
                link: function (scope) {
                    scope.currency =lyConstants.currency;
                    var groupProductId = 3;
                    var allProductsRules;
                    loadProductDrawOptions();

                    scope.closeModal = function () {
                        scope.$root.modalInstance.dismiss('cancel');
                    }

                    scope.changeDraw = function (numberOfSelectedDraw) {
                        updateProductData(numberOfSelectedDraw);
                    }

                    function loadProductDrawOptions(products) {
                        lyAppLotteriesService.getAllLotteriesRules()
                            .then(function (resp) {
                                if (!Array.isArray(resp)) {
                                    return;
                                }
                                
                                allProductsRules = resp;
                                resp.forEach(function (currentLottery) {
                                    scope.product.AllLotteries.forEach(function(productData) {
                                        if(productData.LotteryTypeId == currentLottery.LotteryTypeId) {
                                            getDrawOptions(currentLottery);
                                        }
                                    })
                                })

                                if(!scope.product.drawOptions) {
                                    getDrawOptions(allProductsRules[0]);
                                }

                                updateProductData(scope.product.initialDraws);
                            }, function (error) {
                                stateHelper.goToErrorMaintenance();
                            });
                    }

                    function getDrawOptions(currentLottery) {
                        scope.product.drawOptions = currentLottery.ProductsDrawOptions.filter(function (currentOption) {
                            return currentOption.ProductId == groupProductId && !currentOption.IsSubscription;
                        })[0].MultiDrawOptions;
                    }

                    function getProductDraws(draws) {
                        return scope.product.drawOptions.filter(function (currentOption) {
                            return currentOption.NumberOfDraws == draws;
                        })[0];
                    }

                    function updateProductData(draws) {
                        scope.currentDraw = getProductDraws(draws);
                        scope.selected = scope.currentDraw;
                        scope.totalPrice = 0;
                        scope.discount = 0;

                        scope.product.AllLotteries.forEach(function(currentProduct) {
                            getProductDataByLotteryId(draws, currentProduct.LotteryTypeId);
                        });
                    }

                    function getProductDataByLotteryId(draws, lotteryTypeId) {
                        lyAppProductsServices.getProductPriceByParams(scope.product.ProductId, draws, lotteryTypeId)
                            .then(function (resp) {
                                scope.product.AllLotteries.forEach(function(currentProduct, index) {
                                    if(resp.LotteryId == currentProduct.LotteryTypeId) {
                                        scope.product.AllLotteries[index].Price = resp.Price;
                                    }
                                })
                                
                                scope.totalPrice += resp.Price;
                                scope.discount += resp.ProductId == 14 ? 0 : (resp.Price / (1 - scope.currentDraw.Discount)) - resp.Price;
                            });
                    }
                }
            }
        }
    ])