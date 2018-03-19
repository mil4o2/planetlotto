'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCartItems
     * @restrict A
     * @element ANY
     * 
     * @description
     */
    .directive('lyCartItems', [
        'lyConstants',
        'lyCart',
        function(
            lyConstants,
            lyCart
        ) {
            return {
                restrict: 'A',
                // controller: 'CartCtrl',
                templateUrl: lyConstants.partialPath + 'cart/templates/cart-items.html',
                link: function(scope) {
                    scope.lyCart = lyCart;
                }
            }
        }
    ])