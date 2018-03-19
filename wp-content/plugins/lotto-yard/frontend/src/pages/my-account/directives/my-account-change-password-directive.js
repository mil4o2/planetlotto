'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyMyAccountChangePassword', [
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
                templateUrl: lyConstants.partialPath + 'my-account/templates/my-account-change-password.html',
                controller: ['$scope', function($scope) {
                    $scope.typeInput = "password";
                    $scope.isPassVisible = true;
                    $scope.showLoginLoader = false;

                    $scope.showPassword = function($event) {
                        $event.preventDefault();
                        if ($scope.isPassVisible) {
                            $scope.typeInput = "text";
                        } else {
                            $scope.typeInput = "password";
                        }
                        $scope.isPassVisible = !$scope.isPassVisible;
                    }

                    $scope.user = {
                        email: lyMyAccountUserService.getUserInfo().Email
                    };

                    $scope.reset = function() {
                        $scope.typeInput = "password";
                        $scope.user.oldPassword = null;
                        $scope.user.password = null;
                        $scope.user.retypePassword = null;
                        $scope.updateProfileForm.$setPristine();
                        $scope.updateProfileForm.$setUntouched();
                    }

                    $scope.$watchGroup(['user.password', 'user.retypePassword', 'user.oldPassword'], function(newValue, oldValue, scope) {
                        if (newValue != oldValue) {
                            $scope.errorMessage = '';
                            $scope.resultMessage = '';
                        }
                    });

                    $scope.changePassword = function(event, user) {
                        $scope.showLoginLoader = true;
                        lyMyAccountUserService.updateUserPassword(user).then(function(resp) {
                            
                            $scope.showLoginLoader = false;
                            if (resp.Result == "Password NOT updated - wrong old password") {
                                $scope.errorMessage = lyAppTranslationService.getErrorMessage(resp.Result);
                            } else {
                                $scope.resultMessage = lyAppTranslationService.getErrorMessage(resp.Result);
                            }
                        }, function(error) {
                            $scope.showLoginLoader = false;
                            $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                        });
                    }
                }]
            }
        }
    ])
