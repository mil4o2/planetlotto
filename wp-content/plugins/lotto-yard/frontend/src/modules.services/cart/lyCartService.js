 'use strict';

 angular.module('lyCart.services')
     .factory('lyCartService', [
         '$q',
         '$log',
         'CacheFactory',
         '$timeout',
         '$interval',
         '$lyCart',
         'lyCacheFactory',
         'lyAppHttpService',
         'lyConstants',
         function(
             $q,
             $log,
             CacheFactory,
             $timeout,
             $interval,
             $lyCart,
             lyCacheFactory,
             lyAppHttpService,
             lyConstants
         ) {

             var service = {
                 depositFunds: depositFunds,
                 getLotteryAndProductDataCart: getLotteryAndProductDataCart,
                 prepareOrder: prepareOrder,
                 submitOrder: submitOrder,
                 validateCreditCardNumber: validateCreditCardNumber,
                 getDepositConfig: getDepositConfig,
                 getPaymentsByCountryCode: getPaymentsByCountryCode
             };

             var Products = $lyCart.products,
                 ProductRulesCacheKey = 'ProductRules',
                 AllDrawsCacheKey = 'AllDraws',
                 LotteryRulesCacheKey = 'LotteryRules',
                 PricesByBrandAndProductKey = 'PricesByBrandAndProduct';

             function getDepositConfig(data) {
                 var deferred = $q.defer();

                 var url = lyConstants.lyApiDefinitions.cashier + 'get-deposit-config';
                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         console.log("%c cashier/get-deposit-config: ", "color:red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in cashier/get-deposit-config: " + error);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             }

             function depositFunds(data) {
                 var deferred = $q.defer();
                 var params = JSON.parse(data);
                 
                 var url = lyConstants.lyApiDefinitions.cashier + "deposit-funds";
                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         console.log("%c cashier/deposit-funds: ", "color: red");
                         console.log(resp);

                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in cashier/deposit-funds: " + error);
                         deferred.reject(error);
                     });

                 return deferred.promise;
             };

             function getLotteryAndProductDataCart() {
                 var products = "";
                 var deferred = $q.defer();

                 angular.forEach(Products, function(item) {
                     products += item.id + ',';
                 });

                 if (lyCacheFactory.get(PricesByBrandAndProductKey) && lyCacheFactory.get(LotteryRulesCacheKey) && lyCacheFactory.get(ProductRulesCacheKey) && lyCacheFactory.get(AllDrawsCacheKey)) {
                     //  if (lyCacheFactory.get(LotteryRulesCacheKey) && lyCacheFactory.get(ProductRulesCacheKey) && lyCacheFactory.get(AllDrawsCacheKey)) {
                     deferred.resolve({
                         AllDraws: lyCacheFactory.get(AllDrawsCacheKey),
                         ProductRules: lyCacheFactory.get(ProductRulesCacheKey),
                         LotteryRules: lyCacheFactory.get(LotteryRulesCacheKey),
                         PricesByBrandAndProduct: lyCacheFactory.get(PricesByBrandAndProductKey)
                     });
                 } else {
                     var params = {
                         "ProductIds": products
                     };

                     var url = lyConstants.lyApiDefinitions.globalinfo + 'get-lottery-and-product-data-cart';
                     lyAppHttpService.post(url, params)
                         .then(function(resp) {
                             if (typeof(resp) === 'object') {
                                 for (var key in resp) {
                                     if (!resp.hasOwnProperty(key)) continue;

                                     var obj = resp[key];
                                     if (!(obj instanceof Array) || obj.length != 0) {
                                         lyCacheFactory.put(key, obj);
                                     } else {
                                         console.warn("Error in " + key);
                                     }
                                 }
                             }
                             console.log('%c globalinfo/get-lottery-and-product-data-cart: ', "color: red;");
                             console.log(resp);
                             console.log('%c ProductRules: ', "color: red;");
                             console.log(resp.ProductRules);
                             console.log('%c LotteryRules: ', "color: red;");
                             console.log(resp.LotteryRules);
                             console.log('%c PricesByBrandAndProduct: ', "color: red;");
                             console.log(resp.PricesByBrandAndProduct);
                             console.log('%c AllDraws: ', "color: red;");
                             console.log(resp.AllDraws);
                             deferred.resolve(resp);

                         }, function(error) {
                             console.warn("Error in globalinfo/get-lottery-and-product-data-cart: " + error);
                         });
                 }
                 return deferred.promise;
             };

             function prepareOrder(data) {
                 var deferred = $q.defer();

                 var url = lyConstants.lyApiDefinitions.cashier + 'prepare-order';
                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         console.log("%c cashier/prepare-order: ", "color:red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in cashier/prepare-order: " + error);
                         deferred.reject(error);
                     });

                 return deferred.promise;
             };

             function submitOrder(data) {
                 var deferred = $q.defer();

                 var url = lyConstants.lyApiDefinitions.cashier + 'processor-confirm-order';
                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         console.log("%c cashier/processor-confirm-order: ", "color: red");
                         console.log(resp);

                         deferred.resolve(resp);
                     }, function(error) {
                         debugger
                         console.log("Error in cashier/processor-confirm-order: " + error);
                         deferred.reject(error);
                     });

                 return deferred.promise;
             };

             function validateCreditCardNumber(cardNumber) {
                 var deferred = $q.defer();
                 var params = {
                     "CreditCardNumber": cardNumber
                 }

                 var url = lyConstants.lyApiDefinitions.userinfo + "validate-credit-card";
                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         console.log("%c userinfo/validate-card-number: ", "color: red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in userinfo/validate-card-number: " + error);
                         deferred.reject(error);
                     });

                 return deferred.promise;
             }

             function getPaymentsByCountryCode(countryCode) {
                 var deferred = $q.defer();
                 var data = {
                     "CountryCode": countryCode
                 };

                 var url = lyConstants.lyApiDefinitions.countryprocessor + 'get-country-processors';
                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         console.log("%c countryprocessor/get-country-processors: ", "color:red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in countryprocessor/get-country-processors: " + error);
                         deferred.reject(error);
                     });

                 return deferred.promise;
             }

             return service;
         }
     ])
