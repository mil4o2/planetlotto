'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyPaymentsInactive', [
        'lyConstants',
        'lyMyAccountUserService',
        'lyAppTranslationService',
        function(
            lyConstants,
            lyMyAccountUserService,
            lyAppTranslationService
        ) {
            return {
                restrict: 'E',
                scope: true,
                templateUrl: lyConstants.partialPath + 'my-account-payment/templates/ly-payments-inative.html',
                controller: ['$scope', function($scope) {
                    $scope.inactivePayments = $scope.allPaymentMethods.filter(function(current) {
                        return current.IsExpired;
                    });


                    $scope.$on('change-payments', function(event, payments) {
                        $scope.inactivePayments = payments.filter(function(current) {
                            return current.IsExpired;
                        });
                    });
                }]
            };
        }
    ]);