'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCartProductTemplate
     * @restrict A
     * @element ANY
     *
     * @description
     */
    .directive('lyCartProductTemplate', [function() {
        return {
            restrict: 'A',
            template: '<ng-include src="template">',
            link: function(scope) {
                if (!scope.item) {
                    scope.template = '/wp-content/plugins/lotto-yard/frontend/src/pages/cart/templates/product-templates/freeproduct.html';
                    return;
                }
                var productName = scope.item.getProductName();

                if (!productName) {
                    productName = 'undefined';
                }
                if (productName.toLowerCase() == "sproduct") {
                    scope.template = '/wp-content/plugins/lotto-yard/frontend/src/pages/cart/templates/product-templates/personal.html';
                } else {
                    scope.template = '/wp-content/plugins/lotto-yard/frontend/src/pages/cart/templates/product-templates/' + productName.toLowerCase() + '.html';

                }
            }
        }
    }])
