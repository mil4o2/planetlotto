'use strict';

angular.module('lyPlayPage.directives')
    .directive('lySpecialLotteries', [
        '$lyCart',
        'lyAppProductsServices',
        function(
            $lyCart,
            lyAppProductsServices
        ) {
            return {
                restrict: 'A',
                scope: {
                    lotteries: '='
                },
                templateUrl: $lyCart.partialPath + 'play-lottery/templates/ly-special-lotteries.html',
                link: function(scope) {
                    var classicLotteryInitialDraws = 4;
                    var specialLotteryInitialDraws = 2;
                    scope.products = takeLotteriesWithHighestJackpot();
                    scope.products.forEach(function(lottery) {
                        lottery.ProductId = 3;
                        lottery.isClassicLottery = true;
                        lottery.initialDraws = classicLotteryInitialDraws;
                        lottery.AllLotteries = [{
                            "LotteryTypeId": lottery.LotteryTypeId,
                            "Price": 0
                        }];
                    });

                    scope.products.splice(1, 0, getSpecialProduct("Euro Group", 'eu'))
                    scope.products.splice(3, 0, getSpecialProduct("American Group", 'us'))
                    scope.products.push(getTopJackpot());

                    function takeLotteriesWithHighestJackpot() {
                        return scope.lotteries.slice(0, 3);
                    }

                    function getSpecialProduct(productName, countryCode) {
                        var product = {
                            "LotteryName": productName,
                            "Jackpot": 0,
                            "LotteryCurrency2": "",
                            "ProductId": 3,
                            "AllLotteries": [],
                            "isClassicLottery": false,
                            "initialDraws": specialLotteryInitialDraws
                        };

                        scope.lotteries.filter(function(lottery) {
                            if (lottery.CountryCode == countryCode) {
                                product.Jackpot += lottery.Jackpot;
                                product.LotteryCurrency2 = lottery.LotteryCurrency2;
                                product.AllLotteries.push({
                                    "LotteryTypeId": lottery.LotteryTypeId,
                                    "Price": 0
                                });
                            }
                        });

                        return product;
                    }

                    function getTopJackpot() {
                        var product = {
                            "LotteryName": "Jackpot Hunter",
                            "Jackpot": scope.lotteries[0].Jackpot,
                            "LotteryCurrency2": "$",
                            "ProductId": 14,
                            "AllLotteries": [{
                                "LotteryTypeId": 7,
                                "Price": 0
                            }],
                            "isClassicLottery": false,
                            "initialDraws": specialLotteryInitialDraws
                        };

                        return product;
                    }
                }
            }
        }
    ])
