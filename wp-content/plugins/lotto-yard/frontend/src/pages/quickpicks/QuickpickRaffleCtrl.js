'use strict'

angular.module('lyApp')
    .controller('QuickpickRaffleCtrl', [
        '$state',
        '$location',
        'lyAppProductsServices',
        'lyCart',
        'stateHelper',
        function(
            $state,
            $location,
            lyAppProductsServices,
            lyCart,
            stateHelper
        ) {
            var shares = +$state.params.shares;
            var ticket = +$state.params.ticket;
            var productDataObject = lyAppProductsServices.getProductAndLotteryIds($state.params.raffle);

            if (!productDataObject) {
                stateHelper.goToErrorMaintenance();
            }

            if ($state.params.bta) {
                lyCart.setAffiliateCode($state.params.bta);
            }

            if ($state.params.promocode) {
                lyCart.setReedemCode($state.params.promocode);
            }

            lyAppProductsServices.getRaffleNumbers(productDataObject.lotteryTypeId).then(function(resp) {
                if (resp == "\"Not more tickets to sold\"" || resp.length < shares) {
                    stateHelper.goToErrorMaintenance();
                }

                var ticketNumberIds = resp.map(function(item) {
                    return item.Id;
                });
                var numbers = resp[0].Number.toString();

                var timestamp = [];
                ticketNumberIds.forEach(function(ticketId) {
                    var now = new Date();
                    now.setMinutes(now.getMinutes() + 5);
                    item.timestamp.push({
                        exp: now,
                        id: ticketId
                    });
                });

                lyCart.addRaffle(productDataObject.lotteryTypeId, shares, numbers, productDataObject.id, timestamp, ticketNumberIds);
                stateHelper.goToCartPage();
            })
        }
    ])