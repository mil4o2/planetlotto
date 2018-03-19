'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyMyAccountUploadDocuments', [
        'lyConstants',
        function(
            lyConstants
        ) {
            return {
                restrict: 'E',
                scope: true,
                templateUrl: lyConstants.partialPath + 'my-account/templates/my-account-upload-documents.html'
            }
        }
    ])