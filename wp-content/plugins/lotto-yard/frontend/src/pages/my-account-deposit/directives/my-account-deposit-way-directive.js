'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyMyAccountDepositWay', [
        'lyConstants',
        '$sce',
        'depositHepler',
        'lyCartService',
        'lyAppTranslationService',
        'stateHelper',
        'lyMyAccountUserService',
        function(
            lyConstants,
            $sce,
            depositHepler,
            lyCartService,
            lyAppTranslationService,
            stateHelper,
            lyMyAccountUserService
        ) {
            return {
                restrict: 'A',
                scope: {
                    fieldTitle: '@',

                },
                templateUrl: lyConstants.partialPath + 'my-account-deposit/templates/my-account-deposit-way.html',
                link: function(scope) {
                    lyAppTranslationService.getTranslations(scope);

                    scope.paymentSelectMoreInfo = function($event, phoneOrEmail, amountToDeposit) {
                        depositHepler.paymentSelectMoreInfo($event, phoneOrEmail, amountToDeposit);
                        var data = lyMyAccountUserService.getDepositData(amountToDeposit);

                        lyCartService.depositFunds(JSON.stringify(data)).then(function(resp) {
                            if (resp.IsSuccess) {
                                if (resp.Url) {
                                    if (resp.StatusCode === 0) {
                                        scope.iframeSrc = $sce.trustAsResourceUrl(resp.Url);
                                    }
                                } else {
                                    stateHelper.goToThankYouPage(false, true);
                                }
                            } else {
                                scope.errorMessage = lyAppTranslationService.getErrorMessage(resp.ErrorMessage);
                            }
                        }, function(error) {
                            scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                        });
                    };
                }
            }
        }
    ]);