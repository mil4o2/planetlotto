'use strict'

angular.module('lyApp.utilities')
    .factory('lyApp.utility', [
        '$rootScope',
        'lyAppMetaService',
        function(
            $rootScope,
            lyAppMetaService
        ) {
            function addingMetaOnScope(page) {
                $rootScope.MetaService = lyAppMetaService;
                if (page.yoast) {
                    page.yoast.title = page.yoast.title || page.title.rendered;
                    $rootScope.MetaService.set(page.yoast);
                } else {
                    $rootScope.MetaService.set(page);
                }
            }

            function checkIfValidData(data) {
                if (!(data instanceof Array) || data.length == 0) {
                    return false;
                }

                return true;
            }

            return {
                addingMetaOnScope: addingMetaOnScope,
                checkIfValidData: checkIfValidData
            }
        }
    ])