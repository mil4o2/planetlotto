'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCartOrderSummary
     * @restrict A
     * @element ANY
     *
     * @description
     */
    .directive('lyCartOrderSummary', [
        '$rootScope',
        'lyConstants',
        'lyCartService',
        'lyMyAccountUserService',
        'lyCart.utility',
        '$window',
        'stateHelper',
        'lyAppTranslationService',
        '$uibModal',
        '$location',
        'lyCart',
        function(
            $rootScope,
            lyConstants,
            lyCartService,
            lyMyAccountUserService,
            lyUtilities,
            $window,
            stateHelper,
            lyAppTranslationService,
            $uibModal,
            $location,
            lyCart
        ) {
            return {
                restrict: 'A',
                controller: 'CartCtrl',
                templateUrl: lyConstants.partialPath + 'cart/templates/order-summary.html',
                link: function(scope, element, attrs) {
                    scope.showLoaderPlaceOrder = false;
                    scope.showSecureLoader = false;
                    scope.userService = lyMyAccountUserService;
                    scope.extraInfo = "creditcard";
                    scope.activeTab = attrs.active ? attrs.active : 'cart';
                    lyAppTranslationService.getTranslations(scope);
                    scope.bonusAmount = lyCart.getBonusAmountToUse();
                    scope.useBonusMoney = true;
                    scope.required = {
                        terms: false
                    };

                    if ($rootScope.userBalance && $rootScope.userBalance.BonusAmount > 0 && lyCart.getIframePaymentMethods().length == 0 && scope.activeTab == 'billing') {
                        scope.errorPlaceOrder = lyAppTranslationService.getErrorMessageByKey("Add_At_least_One_Card");
                    }

                    scope.$watch('userService.isLogin', function(newValue, oldValue) {
                        if (lyMyAccountUserService.isLogin) {

                            scope.accountBalance = $rootScope.userBalance.AccountBalance + $rootScope.userBalance.WinningAmount;
                            scope.$on('balanceUpdated', function(){
                                scope.userBalanceData = $rootScope.userBalance;
                                setAccountDebit();
                            })
                            if (newValue != oldValue) {
                                scope.initCart();
                            }
                        } else {
                            scope.userBalanceData = {
                                AccountBalance: 0,
                                BonusAmount: 0,
                                CashBack: 0,
                                Discount: 0.0,
                                FirstPurchase: true,
                                WinningAmount: 0
                            };
                            scope.accountBalance = 0;
                            scope.lyCart.setVipDiscount(0);
                            scope.lyCart.setBonusAmountToUse(0);
                        }
                    });

                    scope.$on('change-dropdown-amounts', function(event, args) {
                        if ((scope.getAmountToPay().toFixed(2) != scope.lyCart.getAmountToPay()) && scope.userBalanceData) {
                            scope.initCart();
                        } else {
                            setDropDownValues();
                        }
                    });

                    scope.$on('secure-checkout', function(event, args) {
                        if (scope.lyCart.getAmountToPay() > 0) {
                            $location.path("/" + lyConstants.cartPageSlug + "/" + lyConstants.billingPageSlug + "/");
                        } else {
                            confirmOrder();
                        }
                    });

                    $rootScope.changeIsUsingBonusMoney = function(makeTrue) {
                        scope.initCart();
                        scope.bonusAmount = lyCart.getBonusAmountToUse();
                        if (makeTrue) {
                            scope.useBonusMoney = true;
                        } else {
                            scope.useBonusMoney = !scope.useBonusMoney;
                        }
                    };

                    scope.changeTerms = function() {
                        scope.agreeTermsError = undefined;
                    }
                    if (lyMyAccountUserService.isLogin && scope.activeTab == 'billing' && (scope.user.Address.length <= 0 || scope.user.ZipCode.length <= 0 || scope.user.City.length <= 0 )) {
                         scope.showAdressForm = true;
                         scope.AdressErr = lyAppTranslationService.getErrorMessageByKey("Need_Adress");
                    }

                    scope.submitOrder = function() {
                        if (scope.user.Address.length <= 0 || scope.user.ZipCode.length <= 0 || scope.user.City.length <= 0 ) {
                             scope.showAdressForm = true;
                             return;
                         }
                        if (scope.lyCart.getItems().length === 0) {
                            return;
                        }

                        if (!scope.required.terms) {
                            scope.agreeTermsError = lyAppTranslationService.getErrorMessageByKey("Please_accept_our_terms_and_conditions");
                            return;
                        }

                        scope.showLoaderPlaceOrder = true;
                        scope.waitForRespose = true;

                        if (scope.required.selectedAmount != scope.amounts[0]) {
                            var depositData = lyMyAccountUserService.getDepositData(scope.required.selectedAmount);
                            lyCartService.depositFunds(JSON.stringify(depositData)).then(function(resp) {
                                if (resp.IsSuccess) {
                                    scope.showLoaderPlaceOrder = false;
                                    confirmOrder();
                                } else {
                                    scope.showLoaderPlaceOrder = false;
                                    scope.errorMessage = lyAppTranslationService.getErrorMessage(resp.ErrorMessage);
                                    scope.waitForRespose = false;
                                }
                            });
                        } else {
                            confirmOrder();
                        }
                    };
                    scope.isPercantageReedemCode = function() {
                        if (typeof scope.lyCart.getReedemCode() == 'undefined') {
                            return false;
                        }
                        var temp = new RegExp('^' + 'PCM').test(scope.lyCart.getReedemCode())

                        return temp;
                    };
                    // scope.youSave = lyCart.getProductDiscount() + lyCart.getVipDiscount() + (scope.isPercantageReedemCode() ? scope.lyCart.getReedemBonusAmount() :0) ;
                    scope.getAmountToPay = function() {

                        var bonusMoney = scope.bonus.isUsingBonusMoney ? scope.lyCart.getBonusAmountToUse() : 0;
                        var balance = $rootScope.userBalance ? ($rootScope.userBalance.AccountBalance + $rootScope.userBalance.WinningAmount) : 0;
                        // setAccountDebit();
                        var reedemBonus = scope.lyCart.getReedemBonusAmount() < 0 ? 0 : scope.lyCart.getReedemBonusAmount();
                        var total = scope.lyCart.getAmountToPay();
                        var userBalanceAfterDiscount = balance - scope.lyCart.getTotalAfterDiscount() - reedemBonus;

                        if (!scope.isPercantageReedemCode()) {
                            //for bonus money
                            if(lyMyAccountUserService.isLogin && scope.bonus.isUsingBonusMoney && $rootScope.userBalance.BonusAmount > bonusMoney) {
                                if (scope.lyCart.getTotalAfterDiscount() - bonusMoney <= balance) {
                                    total = 0;
                                } else {
                                    total = scope.lyCart.getTotalAfterDiscount() - (balance + bonusMoney);
                                }
                            //bouns + real money
                        } else if(lyMyAccountUserService.isLogin && scope.bonus.isUsingBonusMoney && $rootScope.userBalance.BonusAmount <= bonusMoney) {
                                if(scope.lyCart.getTotalAfterDiscount() - $rootScope.userBalance.BonusAmount <= balance) {
                                    total = 0;
                                } else {
                                    total = scope.lyCart.getTotalAfterDiscount() - (balance + bonusMoney);
                                }
                            //normal buy
                            } else {
                                if (scope.lyCart.getTotalAfterDiscount() <= balance) {
                                    total = 0;
                                } else {
                                    total = scope.lyCart.getTotalAfterDiscount() - balance;
                                }
                            }
                        } else if(scope.isPercantageReedemCode()){
                            total = scope.lyCart.getAmountToPay();
                            // scope.youSave += scope.lyCart.getReedemBonusAmount();
                        }

                        return total < 0 ? 0 : total;
                    }

                    scope.getReedemBonus = function() {
                        var reededmBonus = 0;
                        if (!scope.isPercantageReedemCode()) {
                            reededmBonus = scope.lyCart.getReedemBonusAmount() < 0 ? 0 : scope.lyCart.getReedemBonusAmount();
                        }

                        if (scope.userBalanceData && scope.userBalanceData.FirstPurchase && lyMyAccountUserService.isLogin) {
                            reededmBonus += scope.lyCart.getTotalAfterDiscount();
                        }

                        return reededmBonus;
                    };

                    scope.secureCheckout = function() {
                        scope.agreeTermsError = undefined;
                        scope.showSecureLoader = true;

                        if (!lyMyAccountUserService.isLogin) {
                            scope.showSecureLoader = false;
                            $rootScope.modalInstance = $uibModal.open({
                                animation: true,
                                templateUrl: lyConstants.partialPath + 'common/templates/ly-login-form.html',
                                windowClass: 'ly-login-modal',
                                backdrop: 'static',
                                controller: 'IndexMyAccountCtrl'
                            });
                        } else if (scope.lyCart.getAmountToPay() > 0 || lyCart.getIframePaymentMethods().length == 0 || lyCart.getReedemCode()) {
                            scope.showSecureLoader = false;
                            stateHelper.goToBillingPage();
                        } else {
                            scope.showSecureLoader = false;

                            if (!scope.required.terms) {
                                scope.agreeTermsError = lyAppTranslationService.getErrorMessageByKey("Please_accept_our_terms_and_conditions");
                                return;
                            }
                            scope.waitForRespose = true;
                            scope.initCart(true);
                        }
                    };

                    scope.getCashback = function() {
                        var cashBackAmount = 0;

                        if (scope.userBalance && scope.userBalance.CashBack > 0.00) {
                            cashBackAmount = scope.lyCart.getTotalAfterDiscount();

                            if (scope.userBalance.AccountBalance < cashBackAmount) {
                                cashBackAmount -= scope.bonus.isUsingBonusMoney ? lyCart.getBonusAmountToUse() : 0;

                                if (scope.userBalance.AccountBalance < cashBackAmount) {
                                    cashBackAmount -= scope.userBalance.WinningAmount;
                                }
                            }

                            cashBackAmount = cashBackAmount * scope.userBalance.CashBack;
                        }

                        return cashBackAmount;
                    }

                    function confirmOrder() {

                        var purchaseObject = {
                            MemberId: lyMyAccountUserService.getUserMemberId(),
                            MethodId: scope.lyCart.getPaymentMethodId(),
                            ProcessorApi: scope.lyCart.getProcessor(),
                            PhoneOrEmail: scope.lyCart.getPhoneOrEmail(),
                            ReedemCode: scope.lyCart.getReedemCode(),
                            AffiliateId: scope.lyCart.getAffiliateCode(),
                            OrderData: lyUtilities.getProducts(scope.lyCart.getItems(), lyMyAccountUserService.getUserMemberId()),
                            SessionId: lyMyAccountUserService.getUserSessionId(),
                            ActionType: lyConstants.processActionTypes.DepositAndPurchase,
                            BonusAmountToUse: 0
                        };

                        if (scope.useBonusMoney) {
                            purchaseObject.BonusAmountToUse = lyCart.getBonusAmountToUse();
                        } else {
                            purchaseObject.BonusAmountToUse = 0;
                        }
                        lyCartService.submitOrder(purchaseObject)
                            .then(function(resp) {
                                lyCart.setReedemCode();
                                stateHelper.goToThankYouPage(false, false, resp.Pmc, lyMyAccountUserService.getUserSessionId());
                            }, function(error) {
                                scope.showLoaderPlaceOrder = false;
                                scope.waitForRespose = false;
                                scope.errorPlaceOrder = lyAppTranslationService.getErrorMessageByKey(error);
                            });
                    }

                    // function setAccountDebit() {
                    //     var balance = scope.userBalanceData ? (scope.userBalanceData.AccountBalance + scope.userBalanceData.WinningAmount) : 0;
                    //     scope.accountBalance = balance > scope.lyCart.getTotalAfterDiscount() ? scope.lyCart.getTotalAfterDiscount() : balance;
                    //     scope.accountBalance = scope.accountBalance < 0 ? 0 : scope.accountBalance;
                    // }

                    function setDropDownValues() {
                        var amount;
                        if (scope.lyCart.getReedemCode) {
                            amount = scope.getAmountToPay();
                        } else {
                            amount = scope.lyCart.getAmountToPay()
                        }

                        var data = {
                            affiliatedId: scope.lyCart.getAffiliateCode(),
                            actionType: lyConstants.processActionTypes.Order,
                            amount: amount
                        };

                        lyCartService.getDepositConfig(data)
                            .then(function(resp) {

                                scope.required.selectedAmount = resp[0];
                                scope.amounts = resp;
                            }, function(error) {
                                console.log(error);
                                stateHelper.goToHomePage();
                            });
                    }
                }
            };
        }
    ])
