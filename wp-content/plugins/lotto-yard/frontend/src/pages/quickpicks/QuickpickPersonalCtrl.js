'use strict'

angular.module('lyApp')
    .controller('QuickpickPersonalCtrl', [
        'lyApiData',
        'validationService',
        '$state',
        'stateHelper',
        'lyAppLotteriesService',
        'quickPickService',
        'lyCart',
        function(
            lyApiData,
            validationService,
            $state,
            stateHelper,
            lyAppLotteriesService,
            quickPickService,
            lyCart
        ) {
            if ($state.params.bta) {
                lyCart.setAffiliateCode($state.params.bta);
            }

            if ($state.params.promocode) {
                lyCart.setReedemCode($state.params.promocode);
            }

            var lines = +$state.params.lines;

            var lotteryRules;
            if (!$state.params.lotteryname) {
                lotteryRules = lyApiData.LotteryRules[0];
            } else {
                lotteryRules = lyApiData.LotteryRules.filter(function(item) {
                    return item.LotteryType.toLowerCase() === $state.params.lotteryname.toLowerCase()
                })[0];
            }

            if (lines < lotteryRules.MinLines) {
                lines = lotteryRules.MinLines;
            } else if (lines > lotteryRules.MaxLines) {
                lines = lotteryRules.MaxLines;
            }

            var isSubscription = false;
            var draws = +$state.params.draws;


            var data = quickPickService.getPersonalQuickpickData(lotteryRules.LotteryTypeId, draws, lines);
            quickPickService.getQuickPick(data)
                .then(function(resp) {
                    if (resp.IsValid) {
                        var numbers = $state.params.sn;

                        if (numbers == '0') {
                            numbers = resp.QuickPick.SelectedNumbers;

                        }

                        quickPickService.addPersonalQuickPickToCart(draws, lines, lotteryRules.LotteryTypeId, isSubscription, numbers)
                            .then(function() {
                                stateHelper.goToCartPage();
                            });
                    } else {
                        stateHelper.goToErrorNotFound();
                    }
                }, function(error) {
                    stateHelper.goToErrorNotFound();
                });
        }
    ])