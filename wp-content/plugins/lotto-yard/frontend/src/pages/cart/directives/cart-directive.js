'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCart
     * @restrict A
     * @element ANY
     * 
     * @description
     */
    .directive('lyCart', [
        'lyConstants',
        'lyMyAccountUserService',
        'lyCart',
        'stateHelper',
        '$rootScope',
        '$uibModal',
        function(
            lyConstants,
            lyMyAccountUserService,
            lyCart,
            stateHelper,
            $rootScope,
            $uibModal
        ) {
            return {
                restrict: 'A',
                controller: 'CartCtrl',
                templateUrl: lyConstants.partialPath + 'cart/templates/cart.html',
                link: function() {
                    if (!lyMyAccountUserService.isLogin && lyCart.getItems().length) {
                        stateHelper.goToCartPage();
                    }
                }
            };
        }
    ]);