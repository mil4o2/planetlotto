'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCartBilling
     * @restrict A
     * @element ANY
     *
     * @description
     * Shows information about payment methods
     */
    .directive('lyCartBilling', [
        '$rootScope',
        '$uibModal',
        'lyConstants',
        'lyCart.utility',
        'lyCartService',
        'lyMyAccountUserService',
        'stateHelper',
        '$location',
        function(
            $rootScope,
            $uibModal,
            lyConstants,
            lyUtilities,
            lyCartService,
            lyMyAccountUserService,
            stateHelper,
            $location
        ) {
            return {
                restrict: 'A',
                templateUrl: lyConstants.partialPath + 'cart/templates/billing.html',
                controller: 'CartCtrl',
                link: function(scope) {
                    scope.activeTab = 'billing';
                    scope.selectedmethod = scope.lyCart.getIframePaymentMethods()[0];
                    scope.creditCardExpirationYears = lyUtilities.getYearsAfterThis();
                    scope.creditCardExpirationMonths = lyUtilities.getDropdownMonts();
                    scope.birthdayYears = lyUtilities.getDropdownYears();

                    scope.paymentSystems = lyConstants.paymentSystems['default'];
                    debugger

                    if (!lyMyAccountUserService.isLogin) {
                        $rootScope.modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: lyConstants.partialPath + 'common/templates/ly-login-form.html',
                            windowClass: 'ly-login-modal',
                            backdrop: 'static',
                            controller: 'IndexMyAccountCtrl'
                        });
                    }
                    scope.showEdit = false;

                    scope.editPaymentMethods = function() {
                        scope.showEdit = !scope.showEdit;
                    };
                }
            }
        }
    ])
