'use strict';

angular.module('lyCart.directives')
    .directive('onlyAlphabets', [function() {
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
                    var transformedInput = val.replace(/([^а-яА-ЯёЁ |a-zA-Z-_]+$)/, '');
                    if (transformedInput !== val) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
    }])