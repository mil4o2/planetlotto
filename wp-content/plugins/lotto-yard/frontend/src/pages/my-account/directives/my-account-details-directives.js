'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyMyAccountDetails', [
        'lyConstants',
        'lyMyAccountUserService',
        'lyAppTranslationService',
        'lyCart.utility',
        '$rootScope',
        function(
            lyConstants,
            lyMyAccountUserService,
            lyAppTranslationService,
            lyCartUtility, $rootScope
        ) {
            return {
                restrict: 'E',
                scope: true,
                templateUrl: lyConstants.partialPath + 'my-account/templates/my-account-details.html',
                controller: ['$scope', function($scope) {
                    $scope.user = lyMyAccountUserService.getUserInfo();
                    $scope.user.DateOfBirth = lyMyAccountUserService.getUserDateOfBirth($scope.user.DateOfBirth);
                    $scope.countryData = jQuery.fn.intlTelInput.getCountryData();
                    $scope.user.CountryCode = getUserCounty($scope.countryData, $scope.user.CountryCode);
                    $scope.daysInMonth = lyCartUtility.getDropdownDaysOfMonth();
                    $scope.months = lyCartUtility.getDropdownMonts();
                    $scope.birthdayYears = lyCartUtility.getDropdownYears();
                    $scope.showLoginLoader = false;

                    $scope.UpdateProfile = function($event, user) {
                        $scope.showLoginLoader = true;
                        user.CountryCode = user.CountryCode.iso2;
                        user.DateOfBirth = new Date(Date.UTC(user.DateOfBirth.year, parseInt(user.DateOfBirth.month - 1), user.DateOfBirth.day));

                        lyMyAccountUserService.updatePersonalDetails(user).then(function(resp) {
                            $scope.showLoginLoader = false;
                            $rootScope.userName = resp.FirstName + " " + resp.LastName;

                            $scope.result = user.Result;
                            $scope.user = resp;
                            $scope.user.DateOfBirth = lyMyAccountUserService.getUserDateOfBirth(resp.DateOfBirth);
                            $scope.user.CountryCode = getUserCounty($scope.countryData, $scope.user.CountryCode);
                        }, function(error) {
                            $scope.showLoginLoader = false;
                            $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                        });
                    };

                    $scope.cancel = function() {
                        $scope.user = lyMyAccountUserService.getUserInfo();
                        $scope.user.DateOfBirth = lyMyAccountUserService.getUserDateOfBirth($scope.user.DateOfBirth);
                        $scope.user.CountryCode = getUserCounty($scope.countryData, $scope.user.CountryCode);
                    }

                    function getUserCounty(countryData, currentCode) {
                        return countryData.filter(function(country) {
                            return country.iso2 == currentCode.toLowerCase();
                        })[0];
                    }
                }]
            }
        }
    ]);