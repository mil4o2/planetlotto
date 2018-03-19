'use strict';

angular.module('lyApp.directives')
    .directive('lyPromotions', [
        '$lyCart',
        'lyAppHttpService',
        'lyConstants',
        function(
            $lyCart,
            lyAppHttpService,
            lyConstants
        ) {
            return {
                restrict: 'CE',
                templateUrl: $lyCart.partialPath + 'promotions/templates/ly-promotions.html',
                link: function(scope, element) {
                    scope.today = new Date().toJSON().slice(0, 10).split('-').join('');
                    lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPromotionsPerPage + 20).then(function(promotions) {
                        scope.promotionList = promotions.data;
                        scope.promotionList = scope.promotionList.slice().reverse();
                    })
                }
            }
        }
    ])