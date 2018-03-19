'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCartPayment
     * @restrict A
     * @element ANY
     * 
     * @description
     */
    .directive('lyCartPayment', [
        'lyConstants',
        function(
            lyConstants
        ) {
            return {
                restrict: 'A',
                scope: {
                    fieldText: '@',
                    processor: "=",
                },
                controller: 'CartCtrl',
                templateUrl: lyConstants.partialPath + 'cart/templates/paymentWay.html',
                link: function(scope) {
                    scope.$on('update-iframe', function(event, iframe) {
                        scope.iframe = iframe;
                    });
                }
            };
        }
    ]);