'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyUserInfoMoney', [
        '$rootScope',
        'lyConstants',
        'lyMyAccountUserService',
        'stateHelper',
        function(
            $rootScope,
            lyConstants,
            lyMyAccountUserService,
            stateHelper
        ) {
            return {
                restrict: 'A',
                templateUrl: lyConstants.partialPath + 'my-account/templates/ly-user-info-money.html',
                controller: ['$scope', '$location', function($scope, $location) {
                    if (lyMyAccountUserService.isLogin) {
                        $rootScope.memberId = lyMyAccountUserService.getUserMemberId();
                        $rootScope.userName = lyMyAccountUserService.getUserInfo().FirstName + ' ' + lyMyAccountUserService.getUserInfo().LastName;
                        lyMyAccountUserService.getMemberMoneyBalanceByMemberId().then(function(resp) {
                            $rootScope.totalBalance = resp.AccountBalance + resp.BonusAmount;
                        });
                        $rootScope.$watch.totalBalance;
                    }

                    $scope.closePopup = function() {
                        angular.element('.dropdown.user-info').removeClass('open');
                    };

                    $scope.goMyAccount = function() {

                        $scope.closePopup();
                        stateHelper.goToMyProfile();
                    };

                    $scope.logout = function() {
                        $scope.userService.logOut();
                        var currentUrl = $location.url();
                        if (currentUrl.indexOf(lyConstants.myAccountPageSlug) != -1) {
                            stateHelper.goToHomePage();
                        } else if (currentUrl.indexOf(lyConstants.billingPageSlug) != -1) {
                            $location.path("/" + lyConstants.cartPageSlug + "/");
                        }
                    };
                }]
            }
        }
    ])
