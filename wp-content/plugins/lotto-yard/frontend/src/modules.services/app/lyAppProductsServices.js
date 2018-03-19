'use strict'

angular.module('lyApp.services')
    .factory('lyAppProductsServices', [
        'lyCacheFactory',
        '$q',
        '$http',
        '$lyCart',
        'lyConstants',
        'lyAppHttpService',
        function(
            lyCacheFactory,
            $q,
            $http,
            $lyCart,
            lyConstants,
            lyAppHttpService
        ) {

            var ProductRulesCacheKey = 'ProductRules';
            var PricesByBrandAdnProduct = 'PricesByBrandAndProduct';
            var Products = lyConstants.products;

            var service = {
                getAllProductsRules: getAllProductsRules,
                getOlapProduct: getOlapProduct,
                getProductAndLotteryIds: getProductAndLotteryIds,
                getProductById: getProductById,
                getProductNameById: getProductNameById,
                //getProductPriceByIds: getProductPriceByIds,
                getRaffleNumbers: getRaffleNumbers,
                getSyndicateNumbers: getSyndicateNumbers,
                getProductPriceByParams: getProductPriceByParams
            };

            function getSyndicateNumbers(lotteryTypeId) {
                var deferred = $q.defer();
                var data = {
                    LotteryTypeId: lotteryTypeId
                };

                var url = lyConstants.lyApiDefinitions.globalinfo + 'get-syndicate-numbers';
                lyAppHttpService.post(url, data)
                    .then(function(resp) {
                        console.log("%c globalInfo/get-syndicate-numbers: ", "color:red");
                        deferred.resolve(resp);
                    }, function(error) {
                        console.warn("Error in globalInfo/get-syndicate-numbers: " + error);
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function getProductAndLotteryIds(productName) {
                var products = lyConstants.products;
                var productData = products.filter(function(product) {
                    return product.Name.toLowerCase() === productName.toLowerCase();
                });

                return productData[0] ? productData[0] : undefined;
            }

            function getAllProductsRules() {
                var deferred = $q.defer();

                if (lyCacheFactory.get(ProductRulesCacheKey)) {
                    var cached = lyCacheFactory.get(ProductRulesCacheKey);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }

                    deferred.resolve(cached);
                } else {
                    var url = lyConstants.lyApiDefinitions.globalinfo + "product-rules";
                    return lyAppHttpService.post(url);
                }

                return deferred.promise;
            }

            function getOlapProduct(hash, affiliate) {
                var deferred = $q.defer();
                var url = lyConstants.lyApiDefinitions.backoffice + "get-olap-product";
                var data = {
                    "hash": encodeURIComponent(hash),
                    "affiliate": encodeURIComponent(affiliate),
                    "Product": ""
                };

                lyAppHttpService.post(url, data)
                    .then(function(resp) {
                        if (typeof resp !== "object") {
                            console.warn("Error in backoffice/get-olap-product: " + resp);
                            deferred.reject(resp);
                        } else {
                            console.log("%c backoffice/get-olap-product: ", "color: red");
                            console.log(resp);
                            deferred.resolve(resp);
                        }
                    }, function(error) {
                        console.warn("Error in backoffice/get-olap-product: " + error);
                        deferred.reject(error);
                    })

                return deferred.promise;
            }

            function getProductById(id) {
                if (lyCacheFactory.get(ProductRulesCacheKey)) {
                    var cached = lyCacheFactory.get(ProductRulesCacheKey);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }
                    return getProductFromArrayById(cached, id)[0];
                } else {
                    return this.getAllProductsRules().then(function(resp) {
                        return getProductFromArrayById(resp, id)[0];
                    }, function(err) {
                        console.warn('error in getAllProductsRules', err);
                    });
                }
            }

            function getProductNameById(id) {
                var productData = lyConstants.products.filter(function(product) {
                    return product.id == id
                });

                return productData[0] ? productData[0].Name : undefined;
            }

            // function getProductPriceByIds(lotteryId, productId) {
            //     var deferred = $q.defer();
            //     if (lyCacheFactory.get(PricesByBrandAdnProduct)) {
            //         var cached = lyCacheFactory.get(PricesByBrandAdnProduct);
            //         if (!Array.isArray(cached)) {
            //             cached = JSON.parse(cached);
            //         }

            //         deferred.resolve(cached);
            //     } else {
            //         return getProductPrices(lotteryId, productId);
            //     }

            //     return deferred.promise;
            // }

            // OLD VERSION
            function getProductPrices() {
                var products = "";
                angular.forEach(Products, function(item) {
                    products += item.id + ',';
                });

                var deferred = $q.defer();
                if (lyCacheFactory.get(PricesByBrandAdnProduct)) {
                    var cached = lyCacheFactory.get(PricesByBrandAdnProduct);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }
                    deferred.resolve(cached);
                } else {
                    var url = lyConstants.lyApiDefinitions.globalinfo + "get-prices-by-brand-and-productid";
                    var params = {
                        "ProductIds": products
                    }
                    deferred.resolve(lyAppHttpService.post(url, params));
                }
                return deferred.promise;
            }

            // OLD VERSION
            function getProductPriceByParams(productId, draws, lotteryType, lines) {
                lines = lines ? lines : 0;
                var deferred = $q.defer();

                getProductPrices(lotteryType, productId).then(function(resp) {
                    var result = getProductPriceFromArrayByIds(resp, productId, draws, lotteryType, lines)[0];
                    deferred.resolve(result);

                }, function(error) {

                    deferred.reject(error);
                });

                return deferred.promise;
            }

            // NEW PRICES
            // function getProductPrices(lotteryId, productId) {
            //     var deferred = $q.defer();

            //     var allCache = lyCacheFactory.get(PricesByBrandAdnProduct) || {};
            //     var pricesByLottery = allCache[lotteryId];

            //     if (pricesByLottery && pricesByLottery[productId]) {
            //         deferred.resolve(pricesByLottery[productId]);
            //     } else {
            //         var url = lyConstants.lyApiDefinitions.globalinfo + "get-lottery-price";
            //         var params = {
            //             LotteryId: lotteryId,
            //             ProductId: productId
            //         };

            //         deferred.resolve(lyAppHttpService.post(url, params));
            //     }

            //     return deferred.promise;
            // }

            // NEW PRICES
            // function getProductPriceByParams(productId, draws, lotteryType, lines) {
            //     lines = lines ? lines : 0;
            //     var deferred = $q.defer();

            //     getProductPrices(lotteryType, productId).then(function(resp) {
            //         var allCache = lyCacheFactory.get(PricesByBrandAdnProduct) || {};
            //         var pricesByLottery = allCache[lotteryType];

            //         if (!pricesByLottery || !pricesByLottery[productId]) {
            //             allCache[lotteryType] = {
            //                 [productId]: resp.DrawDiscounts
            //             };

            //             lyCacheFactory.put(PricesByBrandAdnProduct, allCache);

            //         }
            //         resp = resp.DrawDiscounts || resp;


            //         var result = resp.filter(function(current) {
            //             return current.NumOfDraws == draws;
            //         });

            //         if (result.length) {
            //             deferred.resolve(result[0]);
            //         } else {
            //             deferred.reject();
            //         }

            //     }, function(error) {
            //         deferred.reject(error);
            //     });

            //     return deferred.promise;
            // }

            function getRaffleNumbers(productId, releaseIds) {
                releaseIds = releaseIds || 1;

                var data = {
                    releaseNumbers: releaseIds,
                    productID: productId
                };

                var url = lyConstants.lyApiDefinitions.playlottery + 'get-navidad-numbers';

                return lyAppHttpService.post(url, data);
            }

            function getProductFromArrayById(array, id) {
                if (!Array.isArray(array)) {
                    array = JSON.parse(array);
                }
                var lottery = array.filter(function(obj) {
                    if ('ProductId' in obj && typeof(obj.ProductId) === 'number' && obj.ProductId === id) {
                        return true;
                    }
                    return false;
                });

                return lottery;
            }

            function getProductPriceFromArrayByIds(array, productId, draws, lotteryType, lines) {
                return array.filter(function(x) {
                    if (x.ProductId === productId && x.NumOfDraws === draws && x.LotteryId === lotteryType && x.Lines === lines) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }

            return service;
        }
    ])