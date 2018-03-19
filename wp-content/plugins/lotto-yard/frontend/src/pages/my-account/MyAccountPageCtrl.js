
'use strict';

angular.module('lyApp')
    .controller('MyAccountPageCtrl', [
        '$scope',
        '$state',
        'lyMyAccountUserService',
        'lyApp.utility',
        'lyCart.utility',
        'lyMyAccoutContentACFData',
        'pageContent',
        '$stateParams',
        '$rootScope',
        'stateHelper',
        function(
            $scope,
            $state,
            lyMyAccountUserService,
            lyAppUtility,
            lyCartUtility,
            lyMyAccoutContentACFData,
            pageContent,
            $stateParams,
            $rootScope,
            stateHelper
        ) {
            lyAppUtility.addingMetaOnScope({
                title: lyMyAccoutContentACFData.data.acf.my_profile_title
            });
            $scope.$parent.breadcrumb = pageContent.data[0].content.yoast_breadcrumb;
            $scope.$parent.showBreadcrumb = pageContent.data[0].acf.show_bredcrumb;
            $scope.user = lyMyAccountUserService.getUserInfo();

            // $scope.userBalanceData = $rootScope.userBalance;
            // $scope.allMoney = $rootScope.userBalance.AccountBalance + $rootScope.userBalance.BonusAmount;

            $scope.userBalanceData = $rootScope.userBalance;
            $scope.allMoney = $scope.userBalance ? $scope.userBalance.AccountBalance + $scope.userBalance.BonusAmount + $scope.userBalanceData.WinningAmount : 0;

            var vipStatuses = [{
                name: "None",
                discount: "0%",
                cashback: "0%",
                // iconPosition: "background-position: 0 0;"
            }, {
                name: "Bronze",
                discount: "0%",
                cashback: "5%",
                // iconPosition: "background-position: -36px 0;"
            }, {
                name: "Silver",
                discount: "1%",
                cashback: "10%",
                // iconPosition: "background-position: -71px 0;"
            }, {
                name: "Gold",
                discount: "2%",
                cashback: "15%",
                // iconPosition: "background-position: -108px 0;"
            }, {
                name: "Platinum",
                discount: "4%",
                cashback: "25%",
                // iconPosition: "background-position: -143px 0"
                // iconPosition: "background-position: -71px 0;"
            }, ]
            var index;
            if ($scope.userBalanceData) {
                for (var i = 0; i < vipStatuses.length; i++) {
                    if (vipStatuses[i].name == $scope.userBalanceData.VipLevel) {
                        index = i;
                        break;
                    }
                }
            }


            $scope.nextVip = vipStatuses[index + 1];
            $scope.currentVip = vipStatuses[index];
            $scope.daysInMonth = lyCartUtility.getDropdownDaysOfMonth();
            $scope.months = lyCartUtility.getDropdownMonts();
            $scope.birthdayYears = lyCartUtility.getDropdownYears();
            $scope.showAll = true;
            $scope.currentSubState = $state.current.name;

            $scope.vipPercentage = 100 * ($scope.userBalanceData.Points / $scope.userBalanceData.EndPoints);
            $scope.vipPercentageMinusThree = $scope.vipPercentage - 3;

            $scope.isCurrent = function(state) {
                if (state === $scope.currentSubState) {
                    return 'current'
                }
            }

            $scope.changeCurrent = function(newState) {
                $scope.currentSubState = newState;
            }

            $scope.goToWithdraw = function() {
                stateHelper.goToWithdraw();
            }

            $scope.goToDepositPage = function() {
                stateHelper.goToDepositPage();
                $scope.$broadcast('init-deposit-page');
            }

            // $scope.$on('$viewContentLoaded', function() {
            //     userService.getProducts(1);
            //     userService.getTickets(1);
            // });
        }
    ])
