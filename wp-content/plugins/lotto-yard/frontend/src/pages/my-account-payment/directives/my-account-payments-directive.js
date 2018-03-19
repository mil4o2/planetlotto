'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyMyAccountPayments', [
        'lyConstants',
        function(
            lyConstants
        ) {
            return {
                restrict: 'A',
                templateUrl: lyConstants.partialPath + 'my-account-payment/templates/my-account-payments.html',
                link: function(scope) {

                }
            }
        }
    ])