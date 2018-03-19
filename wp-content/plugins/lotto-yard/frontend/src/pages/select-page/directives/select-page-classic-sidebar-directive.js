   'use strict';

   angular.module('lyPlayPage.directives')
       .directive('lySelectPageClassicSidebar', [
           '$lyCart',
           'lySelectPageService',
           'quickPickService',
           'lyCart',
           'lyAppTranslationService',
           'stateHelper',
           function(
               $lyCart,
               lySelectPageService,
               quickPickService,
               ngCart,
               lyAppTranslationService,
               stateHelper
           ) {
               return {
                   restrict: 'A',
                   scope: {
                       onQuickPick: '&',
                       moreLines: '=',
                       showCircleAnim: '=',
                       onAddRemoveClicked: '&'
                   },
                   templateUrl: $lyCart.partialPath + 'select-page/templates/sidebar.html',
                   link: function(scope) {
                       lyAppTranslationService.getTranslations(scope);

                       scope.onClickMoreLessBtn = function(needMoreLines) {
                           scope.onAddRemoveClicked();
                       };
                   },
                   controller: ['$scope', '$rootScope', function($scope, $rootScope) {
                       $scope.saveAndGoToCart = function() {
                           $rootScope.$broadcast('QPandGoToCart');
                       }
                   }]
               }
           }
       ])