'use strict';

angular.module('lyMyAccount')
    .controller('PaymentCtrl', [
        '$scope',
        '$state',
        'allPaymentMethods',
        'lyMyAccountUserService',
        '$uibModal',
        'lyAppTranslationService',
        'lyCart.utility',
        'lyApp.utility',
        'lyMyAccoutContentACFData',
        '$rootScope',
        function(
            $scope,
            $state,
            allPaymentMethods,
            lyMyAccountUserService,
            $uibModal,
            lyAppTranslationService,
            lyCartUtility,
            lyAppUtility,
            lyMyAccoutContentACFData,
            $rootScope
        ) {
            lyAppUtility.addingMetaOnScope({
                title: lyMyAccoutContentACFData.data.acf.my_payment_method_title
            });

            lyAppTranslationService.getTranslations($scope);
            $scope.allPaymentMethods = sortPayments(allPaymentMethods);
            $scope.creditCardExpirationMonths = lyCartUtility.getDropdownMonts();
            $scope.creditCardExpirationYears = lyCartUtility.getYearsAfterThis(20);
            $scope.creditcard = {};
            $scope.error = { "message": '' };
            $scope.showLoginLoader = { "show": false };
            $scope.isUpdate = false;
            var modalInstance;


             $rootScope.$on("CloseModal", function(){
                $scope.closeModal();
            });

            $scope.closeModal = function() {
                if (modalInstance) {
                    modalInstance.close();
                }
            }

            $scope.update = function(payment) {
                $scope.payment = payment;
                // if (!payment.IsDefault) {
                    $scope.creditcard = payment;
                    $scope.isUpdate = true;

                    if (!$scope.creditcard.ExpirationDate.month && !$scope.creditcard.ExpirationDate.year) {
                        var expiration = new Date(payment.ExpirationDate);
                        setCreditCardExpirationDate(expiration);
                    }

                    $rootScope.modalInstance = $uibModal.open({
                        animation: true,
                        template: '<div ly-credit-card-payment class="modal-add-new-cc-content" show-login-loader="showLoginLoader" error-message="error" submit-order-new-credit-card="editAddCreditCard(card, user)" is-update="true" is-deposit="false" credit-card="payment"></div>',
                        scope: $scope
                    });
                    window.$rootScope = $rootScope;
                // }
            };

            $scope.popUpAddPayment = function() {
                var expiration = new Date();
                setCreditCardExpirationDate(expiration);

                $rootScope.modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    windowClass: 'modal-add-new-cc',
                    template: '<div ly-credit-card-payment save-card-btn="true" class="modal-add-new-cc-content" show-login-loader="showLoginLoader" error-message="error" submit-order-new-credit-card="editAddCreditCard(card, user)" is-deposit="false"></div>',
                });
                window.$rootScope = $rootScope;
            };

            $scope.editAddCreditCard = function(creditcard, user) {
                if ($scope.isUpdate) {
                    creditcard.CardType = lyCartUtility.getCreditCardType(creditcard.CreditCardNumber);

                    creditcard.CreditCardNumber = undefined;
                    creditcard.Id = $scope.creditcard.Id;
                } else {
                    creditcard.CardType = lyCartUtility.getCreditCardType(creditcard.CreditCardNumber);
                }

                var lastDay = new Date(Date.UTC(creditcard.expiration.year, creditcard.expiration.month - 1, 0)).getDate();
                creditcard.ExpirationDate = new Date(creditcard.expiration.year, creditcard.expiration.month - 1, lastDay);
                creditcard.CardHolderName = creditcard.firstName + ' ' + creditcard.lastName;
                creditcard.number = creditcard.CreditCardNumber;

                lyMyAccountUserService.addPaymentMethod(creditcard).then(function(resp) {
                    if (resp.hasOwnProperty("Result")) {
                        $scope.resultMessage = '';

                        //CHANGE ADDRESS
                        lyMyAccountUserService.updatePersonalDetails(user).then(function(resp) {
                            console.log("Personal Details Updated");
                        },  function(error) {
                            console.warn("Error in updatePersonalDetails: " + error);
                        });

                        lyMyAccountUserService.getPaymentMethod({}).then(function(payments) {
                            $scope.allPaymentMethods = payments;
                            $scope.showLoginLoader.show = false;
                            $scope.resultMessage = lyAppTranslationService.getErrorMessage(resp.Result);

                            $scope.$broadcast('change-payments', payments);

                            window.$rootScope.modalInstance.close();

                            if ($scope.creditcard.IsDefault) {
                                $scope.creditcard.IsDefault = false;
                                $scope.setDefaultCreditCard($scope.creditcard);
                            }

                        }, function(error) {
                            $scope.showLoginLoader.show = false;
                            $scope.error.message = lyAppTranslationService.getErrorMessage(error);
                        });

                    } else {
                        $scope.showLoginLoader.show = false;
                        $scope.error.message = lyAppTranslationService.getErrorMessage(resp[0].ErrorMessage);
                    }
                }, function(error) {
                    $scope.showLoginLoader.show = false;
                    $scope.error.message = lyAppTranslationService.getErrorMessage(error);
                });
            };

            $scope.deletePaymentMethod = function(payment) {
                if (!payment.IsDefault) {
                    lyMyAccountUserService.deletePaymentMethod(payment.Id).then(function(resp) {
                        if (resp.hasOwnProperty("Result")) {
                            lyMyAccountUserService.getPaymentMethod()
                                .then(function(resp) {
                                    $scope.allPaymentMethods = resp;
                                    $scope.$broadcast('change-payments', resp);
                                }, function(error) {
                                    $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                                });

                        } else {
                            return;
                        }
                    }, function(err) {
                        $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                    });
                }
            };

            $scope.setDefaultCreditCard = function(payment) {
                if (!payment.IsDefault) {
                    lyMyAccountUserService.setDefaultCreditCard(payment.Id)
                        .then(function(resp) {
                            lyMyAccountUserService.getPaymentMethod()
                                .then(function(payments) {
                                    $scope.allPaymentMethods = sortPayments(payments);
                                    $rootScope.$broadcast('change-payments', payments);
                                }, function(error) {
                                    console.log(error)
                                });

                        }, function(err) {
                            console.warn('error in lyMyAccountUserService.setDefaultCreditCard', error);
                        });
                }
            };

            function setCreditCardExpirationDate(expiration) {
                $scope.creditCardExpirationYears = lyCartUtility.getYearsAfterThis();

                $scope.creditcard.ExpirationDate = {
                    month: expiration.getMonth() + 1,
                    year: expiration.getFullYear()
                };
            }

            function sortPayments(payments) {
                return payments.sort(function(current, next) {
                    return (next.IsDefault - current.IsDefault) || (current.IsExpired - next.IsExpired);
                });
            }
        }
    ])
