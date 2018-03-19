angular.module('lyMyAccount.directives')
    .directive('lyLoginForm', [
        'lyConstants',
        function(
            lyConstants
        ) {
            return {
                restrict: 'A',
                scope: true,
                templateUrl: lyConstants.partialPath + 'common/templates/ly-login-form.html',
                controller: 'IndexMyAccountCtrl'
            }
        }
    ])