 'use strict';

 angular.module('lyPlayPage.directives')
     .directive('lySelectPageHeader', [
         '$lyCart',
         'lyAppLotteriesService',
         'lySelectPageService',
         'lyAppTranslationService',
         function(
             $lyCart,
             lyAppLotteriesService,
             lySelectPageService,
             lyAppTranslationService
         ) {
             return {
                 restrict: 'A',
                 scope: {
                     lottery: '=',
                     isClassicTab: '='
                 },
                 templateUrl: $lyCart.partialPath + 'select-page/templates/header.html',
                 link: function(scope) {
                     scope.fullWindowWidth = true;
                     if (window.screen.availWidth < 770) {
                         scope.fullWindowWidth = false;
                     }
                     lyAppTranslationService.getTranslations(scope);
                     lyAppLotteriesService.getAllBrandDraws().then(function(data) {
                         angular.forEach(data, function(item) {
                             if (item.LotteryName.toLowerCase() == scope.lottery.toLowerCase()) {
                                 scope.Jackpot = item.Jackpot;
                                 scope.DrawDate = item.DrawDate;
                                 scope.LotteryCurrency = item.LotteryCurrency2;
                                 scope.LotteryName = item.LotteryName;
                                 lySelectPageService.setLotteryJackpot(item.Jackpot);
                                 lySelectPageService.setLotteryCurrency(item.LotteryCurrency2)
                             }
                         });
                     });

                     scope.changeCarousel = onClickActiveTab;

                     function onClickActiveTab(tab) {
                         scope.isClassicTab = tab;

                         if (tab) {
                             scope.pesonalTabShow = 'current';
                             scope.groupTabShow = '';
                             window.location.hash = 'classic';
                         } else {
                            scope.pesonalTabShow = '';
                             scope.groupTabShow = 'current';
                            window.location.hash = 'group';
                        }

                         lySelectPageService.setActiveTab(tab);
                    }

                        
                         scope.$broadcast('update-dropdown');
                 }
             };
         }
     ])