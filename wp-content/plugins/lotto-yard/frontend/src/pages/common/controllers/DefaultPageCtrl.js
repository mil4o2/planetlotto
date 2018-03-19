'use strict'

angular.module('lyApp')
    .controller('DefaultPageCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        'lyCartService',
        'lyApp.utility',
        'raffleNumbers',
        'pageContent',
        'lyConstants',
        'lyApiData',
        '$sce',
        function(
            $rootScope,
            $scope,
            $state,
            lyCartService,
            lyAppUtility,
            raffleNumbers,
            pageContent,
            lyConstants,
            lyApiData,
            $sce
        ) {
            $scope.raffleNumbers = raffleNumbers;
            lyAppUtility.addingMetaOnScope(pageContent.data[0]);
            $scope.allBrandDraws = lyApiData.AllDraws;
            $scope.pageContent = pageContent.data[0].content.rendered;
            $scope.pageTitle = pageContent.data[0].title.rendered;
            $scope.acf = pageContent.data[0].acf;
            $scope.$parent.breadcrumb = pageContent.data[0].content.yoast_breadcrumb;
            $scope.$parent.showBreadcrumb = pageContent.data[0].acf.show_bredcrumb;
        }
    ])