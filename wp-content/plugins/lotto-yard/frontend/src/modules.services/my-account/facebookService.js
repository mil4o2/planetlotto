 'use strict';

 angular.module('lyMyAccount.services')
     .factory('facebookService', function($q) {

         var factory = {
             getUserData: getUserData,
             getFacebookPopup: getFacebookPopup
         }

         FB.init({
             appId: '1090915267631068',
             status: true,
             cookie: true,
             xfbml: true,
             version: 'v2.4'
         });

         function getFacebookPopup(id) {
             var deferred = $q.defer();
             FB.api('/dialog/oauth?client_id=1090915267631068&redirect_uri=http://hayageek.com/examples/facebook-oauth/callback.php', 'get',
                 function(response) {
                     if (!response || response.error) {
                         deferred.reject('Error occured');
                     } else {
                         deferred.resolve(response);
                     }
                 });

             return deferred.promise;
         }

         function getUserData() {
             var deferred = $q.defer();
             FB.api('/me?fields=id,email,first_name,last_name,locale,location,gender,updated_time,about,hometown', function(response) {
                 if (!response || response.error) {
                     deferred.reject('Error occured');
                 } else {
                     deferred.resolve(response);
                 }
             });

             return deferred.promise;
         }

         return factory;
     });