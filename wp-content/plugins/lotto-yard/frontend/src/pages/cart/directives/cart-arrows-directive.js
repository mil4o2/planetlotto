'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCartArrows
     * @restrict A
     * @element ANY
     * @scope
     * @param  {item} item current item from cart
     * @param {isDraw} isDraw is optional. Needed to display properly the text for Lines/Tickets or Draws (if no isDraw passed default value is false)
     * @param {add} add function that is used for adding element
     * @param {remove} remove function that is used for removing element
     * 
     * @description
     * Holds arrows to cart page. 
     */
    .directive('lyCartArrows', [
        'lyConstants',
        'lyAppTranslationService',
        function(
            lyConstants,
            lyAppTranslationService
        ) {
            return {
                restrict: 'A',
                scope: {
                    item: '=',
                    isDraw: '=',
                    add: '&',
                    remove: '&',
                    text: '@',
                    value: "&"
                },
                templateUrl: lyConstants.partialPath + 'cart/templates/cart-arrows.html',
                link: function(scope) {
                    lyAppTranslationService.getTranslations(scope);
                }
            };
        }
    ]);