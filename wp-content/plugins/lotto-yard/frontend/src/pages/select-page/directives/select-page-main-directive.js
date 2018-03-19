 'use strict';

 angular.module('lyPlayPage.directives')
     .directive('lySelectPageMain', [
         '$lyCart',
         'lySelectPageService',
         'lyAppTranslationService',
         function(
             $lyCart,
             lySelectPageService,
             lyAppTranslationService
         ) {
             return {
                 restrict: 'A',
                 scope: {
                     lottery: '=',
                     isClassicTab: '=',
                     content: '=',
                 },
                 controller: ['$scope', function($scope) {
                     lyAppTranslationService.getTranslations($scope);

                     lySelectPageService.getLotteryRulesByName($scope.lottery)
                         .then(function(resp) {
                             $scope.lotteryRules = resp;
                         });

                     this.updateTotalDirective = updateTotalDirective;

                     function updateTotalDirective() {
                         var data = lySelectPageService.getCurrentTicket();

                         setTimeout(function() {
                             $scope.$apply(function() {
                                 $scope.$broadcast('update-total', data.productId, data.draws, data.filledLines, data.discount);
                             });
                         }, 100);
                     }
                 }],
                 templateUrl: $lyCart.partialPath + 'select-page/templates/main.html'
             };
         }
     ])
