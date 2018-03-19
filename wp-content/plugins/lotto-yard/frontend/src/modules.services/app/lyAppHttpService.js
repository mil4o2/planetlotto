'use strict'

angular.module('lyApp.services')
    .factory('lyAppHttpService', [
        '$q',
        '$http',
        function(
            $q,
            $http
        ) {
            return {
                post: function(urlDefinition, params, ignoreLoadingBar) {
                    ignoreLoadingBar = ignoreLoadingBar || false;
                    params = params || {};
                    var deferred = $q.defer();
                    $http({
                        async: true,
                        url: urlDefinition,
                        method: 'POST',
                        data: JSON.stringify(params),
                        ignoreLoadingBar: ignoreLoadingBar
                    }).success(function(resp) {
                        if (resp == 'null') {
                            deferred.reject('There was an error');
                            return;
                        }
                        
                        if (resp instanceof Array && resp.length > 0) {
                            if (resp[0].hasOwnProperty('ErrorMessage') && resp[0].ErrorMessage.length > 0) {
                                deferred.reject(resp[0].ErrorMessage);
                                return;
                            }
                        }

                        if (resp.hasOwnProperty('ErrorMessage') && resp.ErrorMessage != "None" && resp.ErrorMessage != null && resp.ErrorMessage != "") {
                            deferred.reject(resp.ErrorMessage);
                            return;
                        }

                        deferred.resolve(resp);
                    }).error(function(error) {
                        deferred.reject('There was an error');
                    });

                    return deferred.promise;
                },
                getDataFromCMS: function(urlDefinition, isCache) {
                    isCache = isCache || true;
                    return $http.get(urlDefinition, {
                        cache: isCache
                    }).success(function(res) {
                        console.log('%c Successed response from ' + urlDefinition, 'color: red;');
                        console.log(res);
                    });
                },
                postDataToCMS: function(urlDefinition, data) {
                    return $http.post(urlDefinition, data)
                        .success(function(res) {
                            console.log('%c Successed response from ' + urlDefinition, 'color: red;');
                            console.log(res);
                        });
                },
            }
        }
    ])
