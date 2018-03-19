 'use strict';

 angular.module('lyPlayPage.directives')
     .directive('lyBanking', [
         '$lyCart',
         function(
             $lyCart
         ) {
             return {
                 restrict: 'A',
                 templateUrl: $lyCart.partialPath + 'common/templates/banking-direktive.html',
             }
         }
     ]);