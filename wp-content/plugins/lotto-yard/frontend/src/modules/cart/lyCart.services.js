angular.module('lyCart.services', ['lyCacheModule', 'lyCart.utilities'])
    .run(['$rootScope', '$http', function($rootScope, $http) {
        $http.defaults.transformRequest.push(function(data) {
            return data;
        });
        $http.defaults.transformResponse.push(function(data) {
            return data;
        });
    }]);