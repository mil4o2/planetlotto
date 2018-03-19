'use strict'

angular.module('lyApp.directives')
    .directive('lyResetPassword', [
        'lyMyAccountUserService',
        'lyAppTranslationService',
        'lyConstants',
        '$state',
        '$location',
        'stateHelper',
        function(
            lyMyAccountUserService,
            lyAppTranslationService,
            lyConstants,
            $state,
            $location,
            stateHelper
        ) {
            return {
                restrict: 'A',
                controller: 'IndexMyAccountCtrl',
                link: function(scope) {
                    scope.newpasswords = {};
                    scope.showLoader = false;


                    scope.resetPassword = function() {

                        if (scope.newpasswords.newpassword !== scope.newpasswords.confirmpassword) {
                            scope.errorMessage = lyAppTranslationService.getErrorMessage("Passwords doesnt match.");
                            return;
                        } else {
                            scope.showLoader = true;
                            var data = {
                                "email": $state.params.verifyedUser.Email,
                                "password": scope.newpasswords.newpassword,
                                "MemberId": $state.params.verifyedUser.MemberId

                            }
                            lyMyAccountUserService.updateUserPassword(data).then(function(resp) {
                                    if (resp.Result) {
                                        scope.succesMessage = lyAppTranslationService.getErrorMessage(resp.Result);
                                        scope.signin(null, data);
                                        stateHelper.goToHomePage();
                                    }
                                    scope.showLoader = false;
                                    
                                },
                                function(error) {
                                    scope.showLoader = false;
                                    scope.errorMessage = lyAppTranslationService.getErrorMessage(resp);
                                });
                        }
                    }
                },
                templateUrl: lyConstants.partialPath + 'reset-password/templates/reset-password.html'
            }
        }
    ])