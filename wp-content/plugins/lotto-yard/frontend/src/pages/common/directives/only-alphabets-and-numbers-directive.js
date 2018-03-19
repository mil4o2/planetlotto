'use strict';

angular.module('lyCart.directives')
    .directive('onlyAlphabetsAndNumbers', [function() {
        return {
            require: '?ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                ngModelCtrl.$parsers.push(function(val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }
                    var transformedInput = val.replace(/[^а-яА-ЯёЁa-zA-Z-0-9,.№-\s-]+/, '');
                    if (transformedInput !== val) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
    }]);