 'use strict';

 angular.module('lyApp.directives')
     .directive('lyLotteries', [
         '$lyCart',
         '$location',
         function(
             $lyCart,
             $location
         ) {
             return {
                 restrict: 'A',
                 scope: true,
                 templateUrl: $lyCart.partialPath + 'play-lottery/templates/ly-play-lotteries.html',
                 link: function(scope, el, attrs) {
                     scope.isClassicTab = true;

                     if ($location.$$url.indexOf('#syndicate') != -1) {
                         scope.isClassicTab = false;
                     }

                     scope.$on('$locationChangeSuccess', function() {
                         if ($location.$$url.indexOf('#syndicate') != -1) {
                             scope.isClassicTab = false;
                         } else {
                             scope.isClassicTab = true;
                         }
                     });

                     scope.changeCarousel = function(isClassic) {
                         scope.isClassicTab = isClassic;
                         isClassic ? $location.url('/play-lottery/#classic') : $location.url('/play-lottery/#syndicate');
                     };

                     scope.sortValues = [{
                         displayName: 'Jackpot',
                         value: 'Jackpot'
                     }, {
                         displayName: 'Next Draw',
                         value: 'DrawDate'
                     }];

                     scope.sort = scope.sortValues[0].value;
                     scope.changeSort = function(sortType) {
                         scope.sort = sortType;
                     }

                 }
             };
         }
     ])