'use strict'

angular.module('lyApp')
    .controller('QuickpickOlapCtrl', [
        '$state',
        'lyCart',
        'lyAppProductsServices',
        'stateHelper',
        function(
            $state,
            lyCart,
            lyAppProductsServices,
            stateHelper
        ) {
            var affiliate = $state.params.affiliate;
            var hash = $state.params.hash;
            lyAppProductsServices.getOlapProduct(hash, affiliate)
                .then(function(resp) {
                    var products = JSON.parse(resp.Products);
                    products.map(function(p) {
                        lyCart.addItem(p.LotteryID,
                            p.Draws,
                            p.Lines,
                            p.SelectedNumbers,
                            p.Amount,
                            p.ProductId,
                            false,
                            false,
                            p.IsQuickPick,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            hash
                        );
                    });
                }, function(error) {
                    console.log(error)
                    
                });

            stateHelper.goToCartPage();
        }
    ])