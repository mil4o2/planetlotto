'use strict';

angular.module('lyCart.filters')
    .filter('translate', ['$rootScope', 'ErrorMessages', function($rootScope, ErrorMessages) {
        return function(items) {
            var filtered = [];
            var currentLangErrorsArr = ErrorMessages[$rootScope.language];
            if (items !== null && typeof(items) !== "undefined" && items.length > 0) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item[item.length - 1] === ".")
                        item = item.slice(0, -1);
                    var err = currentLangErrorsArr.filter(function(x) {
                        if (x.error === item.ErrorMessage) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    if (err.length > 0) {
                        filtered.push(err[0].text);
                    } else {

                        filtered.push(item.ErrorMessage);
                    }
                }
            } else {
                return items;
            }

            return filtered;
        }
    }]);