'use strict';

angular.module('lyApp')
    .controller('ErrorCtrl', [
        '$scope',
        '$stateParams',
        'lyErrorPageData',
        'lyApp.utility',
        'lyApiData',
        function(
            $scope,
            $stateParams,
            lyErrorPageData,
            lyAppUtility,
            lyApiData
        ) {
            if ($stateParams.errorType == 'error_maintenance') {
                $scope.isActiveMaintenance = true;
            }

            lyAppUtility.addingMetaOnScope({
                title: lyErrorPageData.data.acf[$stateParams.errorType + '_title']
            });

            $scope.isClassicTab = true;
            if (lyApiData) {
                $scope.allDraws = lyApiData.AllDraws;
            }
            $scope.content = lyErrorPageData.data.acf[$stateParams.errorType];
        }
    ])