 'use strict';

 angular.module('lyPlayPage.directives')
     .directive('lyFaq', [
         '$lyCart',
         function(
             $lyCart
         ) {
             return {
                 restrict: 'A',
                 templateUrl: $lyCart.partialPath + 'common/templates/faq.html',
                 controller: ['$scope', function($scope) {

                     $scope.questionId = [];
                     if ($scope['contentFaq'] !== undefined) {
                         if ($scope.contentFaq['faq'] !== undefined) {
                             for (var i = 0; i < $scope.contentFaq.faq.length; i++) {
                                 $scope.questionId.push(Math.floor((Math.random() * 1000) + 1));
                             }
                         }
                     }
                 }]
             }
         }
     ]);