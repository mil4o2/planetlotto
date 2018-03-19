  'use strict';

  angular.module('lyMyAccount.directives')
      .directive('lyMyAccountWithdraw', [
          'lyConstants',
          'lyMyAccountUserService',
          '$rootScope',
          function(
              lyConstants,
              lyMyAccountUserService,
              $rootScope
          ) {
              return {
                  restrict: 'A',
                  templateUrl: lyConstants.partialPath + 'my-account-transactions/templates/my-account-withdraw.html',
                  link: function(scope) {
                      scope.withdraw = {
                          value: 0,
                          comment: ""
                      };
                      scope.showLoginLoader = false;
                      scope.currency = lyConstants.currency;
                      scope.balance = $rootScope.userBalance.AccountBalance + $rootScope.userBalance.WinningAmount;
                    //
                      scope.changeAmount = function() {
                          if (scope.withdraw.value) {
                              var digits = scope.withdraw.value.replace(/[^0-9.]/g, '');

                              if (digits.split('.').length > 2) {
                                  digits = digits.substring(0, digits.length - 1);
                              }

                              if (digits !== scope.withdraw.value) {
                                  scope.withdraw.value = digits;
                              }
                          }
                      };

                      scope.withdrawMoney = function() {
                          if (scope.withdraw.value < 10 || scope.withdraw.comment.length > 256) {
                              scope.showErrorMessage = true;
                              scope.showSuccessMessage = false;
                              return;
                          } else if (parseFloat(scope.withdraw.value) > scope.balance) {
                            scope.showErrorMessageTwo = true;
                            scope.showSuccessMessage = false;
                            return;
                        }
                          scope.waitingForResponse = true;
                          scope.showLoginLoader = true;

                          var data = {
                              "Amount": scope.withdraw.value,
                              "Comment": scope.withdraw.comment
                          };

                          lyMyAccountUserService.addWithdraw(data)
                              .then(function(resp) {
                                      scope.waitingForResponse = false;
                                      scope.showErrorMessage = false;
                                      scope.showSuccessMessage = true;
                                      scope.withdraw = {
                                          value: 0,
                                          comment: ""
                                      };
                                      scope.showLoginLoader = false;
                                  },
                                  function(error) {
                                      scope.waitingForResponse = false;
                                      scope.showLoginLoader = false;
                                      scope.showErrorMessage = true;
                                      scope.showSuccessMessage = false;
                                  });
                      };
                  }
              };
          }
      ]);
