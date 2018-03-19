'use strict';

angular.module('lyCart', [
        'lyCart.directives',
        'lyCart.filters',
        'lyCart.services',
        'lyCart.utilities',
        'angular-cache',
        'ui.bootstrap',
        'ngTouch',
        'lyApp.utilities',
        'lyCacheModule'
    ])
    .run([
        '$rootScope',
        'lyCart',
        'lyCartItem',
        'lyCartCacheFactory',
        function($rootScope, lyCart, lyCartItem, lyCartCacheFactory) {
            $rootScope.$on('lyCart:change', function() {
                lyCart.$save();
            });

            if (angular.isObject(lyCartCacheFactory.get('cart'))) {
                lyCart.$restore(lyCartCacheFactory.get('cart'));
            } else {
                lyCart.init();
            }
        }
    ])
    .provider('$lyCart', function() {
        var config = {
            currency: '$',
            partialPath: "",
            apiUrl: ""
        };
        return {
            set: function(settings) {
                config = settings;
            },
            $get: function() {
                return config;
            }
        };
    })