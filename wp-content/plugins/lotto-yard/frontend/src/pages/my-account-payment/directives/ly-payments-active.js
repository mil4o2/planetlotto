'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyPaymentsActive', [
        'lyConstants',
        'lyMyAccountUserService',
        'lyAppTranslationService',
        function(
            lyConstants,
            lyMyAccountUserService,
            lyAppTranslationService
        ) {
            return {
                restrict: 'AE',
                scope: true,
                templateUrl: lyConstants.partialPath + 'my-account-payment/templates/ly-payments-ative.html',
                controller: ['$scope', function($scope) {
                    $scope.activePayments = $scope.allPaymentMethods.filter(function(current) {
                        return !current.IsExpired;
                    });

                    $scope.$on('change-payments', function(event, payments) {
                        $scope.activePayments = payments.filter(function(current) {
                            return !current.IsExpired;
                        });
                    });
                }]
            }
        }
    ])
