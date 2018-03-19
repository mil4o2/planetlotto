'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lySubscriptionOption
     * @restrict A
     * @element ANY
     * 
     * @description
     */
    .directive('lySubscriptionOption', [
        'lyConstants',
        function(
            lyConstants
        ) {
            return {
                restrict: 'A',
                controller: 'CartCtrl',
                templateUrl: lyConstants.partialPath + 'cart/templates/subscription-template.html',
                link: function(scope) {
                    scope.showHideSubcriptionInfo = function(value) {
                        scope.showSubscriptionInfo = value;
                    };
                }
            }
        }
    ])