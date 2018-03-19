'use strict';

angular.module('lyApp')
    .controller('ContactPageCtrl', [
        '$scope',
        '$state',
        'pageContent',
        'lyApp.utility',
        'lyApiData',
        'lyConstants',
        '$timeout',
        'stateHelper',
        function(
            $scope,
            $state,
            pageContent,
            lyAppUtility,
            lyApiData,
            lyConstants,
            $timeout,
            stateHelper
        ) {
            //if ($state.params.s && $state.params.m) {
            //    $state.go('quickpick.olap', {
            //        hash: $state.params.m,
            //        affiliate: $state.params.s
            //    });
            //}

            lyAppUtility.addingMetaOnScope(pageContent.data[0]);
            $scope.allRules = lyApiData.LotteryRules;
            $scope.allDraws = lyApiData.AllDraws;
            $scope.contact_information = pageContent.data[0].acf.contact_information;

            $scope.pageContent = pageContent.data[0].content.rendered;
            //$scope.playWidget = pageContent.data[0].acf.play_widget;
            //$scope.playWidgetLink = pageContent.data[0].acf.play_widget_link;

            $scope.showFixedCart = function() {
                angular.element('#fixed-cart-popup')[0].style.display = "block";
                $timeout(function() {
                    angular.element('#fixed-cart-popup')[0].style.opacity = 1;
                }, 100);
            }
            //$scope.$parent.breadcrumb = pageContent.data[0].content.yoast_breadcrumb;
            //$scope.$parent.showBreadcrumb = pageContent.data[0].acf.show_bredcrumb;

            //$scope.goToPlayPageFromHome = function() {
            //    var lotteryName = $scope.allDraws[0].LotteryName.toLowerCase();
            //    stateHelper.goToPlayPage(lotteryName, false);
            //}
        }
    ])
