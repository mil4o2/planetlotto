'use strict';

angular.module('lyMyAccount.directives')
    .directive('lySignUpForm', [
        'lyConstants',
        function(
            lyConstants
        ) {
            return {
                restrict: 'A',
                scope: true,
                templateUrl: lyConstants.partialPath + 'common/templatesly-signup-form.html',
                controller: 'IndexMyAccountCtrl'
            }
        }
    ]);