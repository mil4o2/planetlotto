'use strict';

angular.module('lyApp')
    .controller('PromotionsPageCtrl', [
        '$scope',
        'lyApp.utility',
        'pageContent',
        'draws',
        function(
            $scope,
            lyAppUtility,
            pageContent
        ) {
            lyAppUtility.addingMetaOnScope(pageContent.data[0]);
            $scope.pageContent = pageContent.data[0].content.rendered;
            $scope.$parent.breadcrumb = pageContent.data[0].content.yoast_breadcrumb;
            $scope.$parent.showBreadcrumb = pageContent.data[0].acf.show_bredcrumb;
            $scope.pageTitle = pageContent.data[0].title.rendered;
            $scope.acf = pageContent.data[0].acf;
        }
    ])
