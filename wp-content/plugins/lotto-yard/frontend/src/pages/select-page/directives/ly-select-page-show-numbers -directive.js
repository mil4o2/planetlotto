  'use strict';

  angular.module('lyPlayPage.directives')
      .directive('lySelectPageShowNumbers', ['$rootScope', 'lyConstants', function($rootScope, lyConstants) {
          return {
              restrict: 'A',
              templateUrl: lyConstants.partialPath + 'select-page/templates/show-numbers.html',
              scope: {
                  numbers: '=',
                  lotteryName: "="
              },
              link: function(scope) {
                  scope.numbers = scope.numbers.map(function(current) {
                      var line = current.split('#');
                      var selected = line[0].split(',').map(Number);
                      var extra = line[1] ? line[1].split(',').map(Number) : [];

                      return {
                          selectedNumbers: selected,
                          extraNumbers: extra
                      };
                  });

                  scope.numbersLenght = scope.numbers[0].selectedNumbers.length + scope.numbers[0].extraNumbers.length;

                  scope.closeModal = function() {
                      window.$rootScope.modalInstance.close();
                  };
              }
          };
      }]);