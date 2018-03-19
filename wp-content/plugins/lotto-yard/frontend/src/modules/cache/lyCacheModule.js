angular.module('lyCacheModule', ['angular-cache'])
    .service('lyCacheFactory', ['CacheFactory', function(CacheFactory) {
        if (!CacheFactory.get('lyApi')) {
            return CacheFactory('lyApi', {
                maxAge: 20 * 60 * 1000, // Items added to this cache expire after 60 minutes
                cacheFlushInterval: 20 * 60 * 1000, // This cache will clear itself every 60 minutes
                deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
                storageMode: 'localStorage' // This cache will use `localStorage`.
            });
        }
    }])
    .service('lySelectPageCacheFactory', ['CacheFactory', function(CacheFactory) {
        if (!CacheFactory.get('lySelectPage')) {
            return CacheFactory('lySelectPage', {
                storageMode: 'localStorage' // This cache will use `localStorage`.
            });
        }
    }])
    .service('lyUserCacheFactory', ['CacheFactory', function(CacheFactory) {
        if (!CacheFactory.get('user')) {
            return CacheFactory('user', {
                storageMode: 'localStorage'
            });
        }
    }])
    .service('lyCartCacheFactory', [
        'CacheFactory',
        function(
            CacheFactory
        ) {

            var dataCache = CacheFactory('cart', {
                maxAge: 60 * 60 * 1000, // Items added to this cache expire after 60 minutes
                // cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every 60 minutes
                deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
                storageMode: 'localStorage' // This cache will use `localStorage`.
            });

            return {
                get: function(key) {
                    if (dataCache.get(key)) {
                        var cart = angular.fromJson(dataCache.get(key));
                        return JSON.parse(cart);
                    }
                    return false;
                },

                set: function(key, val) {
                    if (val === undefined) {
                        dataCache.remove(key);
                    } else {
                        dataCache.put(key, angular.toJson(val));
                    }
                    return dataCache.get(key);
                },

                emptyCart: function() {
                    CacheFactory.destroy('cart');
                }
            }
        }
    ]);
