 'use strict';

 angular.module('lyApp.directives')
     .controller('SinglePromotionsPageCtrl', [
         '$scope',
         'lyApp.utility',
         'promotionContent',
         'draws',
         function(
             $scope,
             lyAppUtility,
             promotionContent,
             draws
         ) {
             lyAppUtility.addingMetaOnScope(promotionContent.data[0]);
             $scope.$parent.breadcrumb = promotionContent.data[0].content.yoast_breadcrumb;
             $scope.$parent.showBreadcrumb = promotionContent.data[0].acf.show_bredcrumb;
             $scope.promoContent = promotionContent.data[0];
             $scope.pageWidget = promotionContent.data[0].acf;
             $scope.widgetList = $scope.pageWidget.add_widget;
             $scope.faq = promotionContent.data[0].acf.content;
             $scope.draws = draws;
         }
     ])
