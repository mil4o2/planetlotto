'use strict'

angular.module('lyApp')
    .controller('SQuickpickCtrl', [
        'lyApiData',
        '$state',
        'stateHelper',
        'lyAppLotteriesService',
        'quickPickService',
        'lyAppProductsServices',
        'lyCart',
        function(
            lyApiData,
            $state,
            stateHelper,
            lyAppLotteriesService,
            quickPickService,
            lyAppProductsServices,
            lyCart
        ) {

            var draws = 1;
            var productId = 666;
            var isSubscription = false;

            if (isSubscription) {
                isSubscription = false;
            }

            var lines;
            if ($state.params.lines) {
                lines = +$state.params.lines;
            } else {
                lines = $state.params.sn.split('|').length;
            }

            var lotteryRules = lyApiData.LotteryRules.filter(function(item) {
                return item.LotteryType.toLowerCase() === $state.params.lotteryname.toLowerCase()
            })[0];
            try {
                var data = quickPickService.getPersonalQuickpickData(lotteryRules.LotteryTypeId, draws, lines);
                //disabling OZlotto
                if (data.LotteryType !== 28) {
                    quickPickService.getQuickPick(data)
                        .then(function(resp) {
                            debugger
                            if (resp.IsValid) {
                                var numbers = resp.QuickPick.SelectedNumbers;
                                lyAppProductsServices.getProductPriceByParams(productId, draws, lotteryRules.LotteryTypeId, lines)
                                    .then(function(priceObject) {
                                        if (priceObject) {
                                            debugger
                                            // lyCart.addItem(lotteryRules.LotteryTypeId, draws, lines, numbers, priceObject.Price, 1, isSubscription, false, true);
                                            lyCart.addPersonalItem(numbers, draws, lines, lotteryRules.LotteryTypeId, productId, isSubscription);
                                            stateHelper.goToCartPage();
                                        } else {
                                            stateHelper.goToErrorNotFound();
                                        }
                                    }, function(error) {
                                        stateHelper.goToErrorNotFound();
                                    });
                            } else {
                                stateHelper.goToErrorNotFound();
                            }
                        }, function(error) {
                            stateHelper.goToErrorNotFound();
                        });
                } else {
                    stateHelper.goToHomePage();
                }
            } catch (e) {
                stateHelper.goToErrorNotFound();
            }
        }
    ])
