'use strict'

angular.module('lyApp')
    .controller('QuickpickGroupCtrl', [
        '$state',
        '$location',
        'lyCart',
        'lyAppLotteriesService',
        'lyApiData',
        'validationService',
        'quickPickService',
        'stateHelper',
        function(
            $state,
            $location,
            lyCart,
            lyAppLotteriesService,
            lyApiData,
            validationService,
            quickPickService,
            stateHelper
        ) {
            if (!validationService.isValidQuickpickData($state.params.shares, $state.params.draws, $state.params.subscription)) {
                stateHelper.goToErrorMaintenance();
            }

            if ($state.params.bta) {
                lyCart.setAffiliateCode($state.params.bta);
            }

            if ($state.params.promocode) {
                lyCart.setReedemCode($state.params.promocode);
            }

            var lotteryTypeId;

            if (!$state.params.lotteryname) {
                lotteryTypeId = lyApiData.LotteryRules[0].LotteryTypeId;
            } else {
                lotteryTypeId = lyAppLotteriesService.getLotteryIdByLotteryName($state.params.lotteryname);
            }

            var draws = +$state.params.draws;
            var shares = +$state.params.shares;
            var isSubscription = Boolean(+$state.params.subscription);

            quickPickService.addGroupQuickPickToCart(draws, shares, lotteryTypeId, isSubscription);

            stateHelper.goToCartPage();
        }
    ]);