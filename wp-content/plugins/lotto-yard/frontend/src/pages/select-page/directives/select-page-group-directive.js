 'use strict';

 angular.module('lyPlayPage.directives')
     .directive('lySelectPageGroup', [
         '$lyCart',
         'lyConstants',
         function(
             $lyCart,
             lyConstants
         ) {
             return {
                 restrict: 'A',
                 scope: {},
                 templateUrl: $lyCart.partialPath + 'select-page/templates/group.html',
                 link: function(scope) {
                     scope.groupViews = lyConstants.playPageGroupViews;
                     scope.isCurrent = true;

                     scope.changeCurrent = function(show) {
                         jQuery('.current').removeClass('current');
                         scope.isCurrent = show;
                     }
                 }
             };
         }
     ])
