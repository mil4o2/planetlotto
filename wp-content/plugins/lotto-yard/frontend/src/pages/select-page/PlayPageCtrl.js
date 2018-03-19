'use strict';

angular.module('lyPlayPage')
    .controller('PlayPageCtrl', [
        '$scope',
        '$stateParams',
        'pageContent',
        'lyApp.utility',
        'lySelectPageService',
        function(
            $scope,
            $stateParams,
            pageContent,
            lyAppUtilities,
            lySelectPageService
        ) {
            lyAppUtilities.addingMetaOnScope(pageContent.data[0]);
            $scope.lottery = $stateParams.lotteryname;
            $scope.content = pageContent.data[0].acf;
            $scope.contentFaq = $scope.content;
            lySelectPageService.getLotteryRulesByName($scope.lottery)
                .then(function(resp) {
                    $scope.isClassicTab = lySelectPageService.getActiveTab($scope.lottery);
                    $scope.isClassicTab ? $scope.isClassicTab = true : $scope.isClassicTab = false;

                    if (window.screen.availWidth < 768 && $scope.groupTabShow !== 'current') {
                        $scope.isClassicTab = 'Mobile';
                    }
                });
        }
    ]);