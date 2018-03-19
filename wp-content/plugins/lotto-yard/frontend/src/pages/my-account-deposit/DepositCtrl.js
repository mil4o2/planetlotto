 'use strict'

 angular.module('lyMyAccount')
     .controller('DepositCtrl', [
         '$rootScope',
         '$scope',
         'lyCart',
         'lyCartService',
         'lyAppTranslationService',
         '$lyMyAccount',
         'lyCart.utility',
         'lyApp.utility',
         'lyMyAccountUserService',
         'depositHepler',
         'stateHelper',
         'lyMyAccoutContentACFData',
         'validationService',
         'lyCart.utility',
         '$sce',
         'lyConstants',
         function(
             $rootScope,
             $scope,
             lyCart,
             lyCartService,
             lyAppTranslationService,
             $lyMyAccount,
             lyCartUtility,
             lyAppUtility,
             lyMyAccountUserService,
             depositHepler,
             stateHelper,
             lyMyAccoutContentACFData,
             validationService,
             lyUtilities,
             $sce,
             lyConstants
         ) {
             lyAppUtility.addingMetaOnScope({
                 title: lyMyAccoutContentACFData.data.acf.my_deposit_title
             });

             $scope.showLoginLoader = false;
             $scope.errorMessage = { "message": '' };
             $scope.showDepositLoader = false;
             $scope.lyCart = lyCart;
             $scope.paymentSystems = $lyMyAccount.paymentSystems;

             $scope.terms = false;
             $scope.section = {
                 selectionPaymentTemplate: ""
             };
             $scope.extraInfo = "creditcard";
             $scope.creditCardExpirationYears = lyCartUtility.getYearsAfterThis();
             $scope.creditCardExpirationMonths = lyCartUtility.getDropdownMonts();
             $scope.birthdayYears = lyCartUtility.getDropdownYears();

             $scope.updatePaymentMethod = false;
             $scope.methodId = 0;

             lyAppTranslationService.getTranslations($scope);

             $scope.initDepositPage = function() {
                 if (lyMyAccountUserService.isLogin) {

                     lyMyAccountUserService.getPaymentMethod().then(function(resp) {
                         var activePayments = resp.filter(function(current) {
                             return current.IsActive;
                         });
                         $scope.allActiveCards = activePayments.slice();
                         lyCart.setIframePaymentMethods(activePayments);
                         //setting up default method id for drop down
                         if (activePayments.length > 0) {
                             $scope.selectedmethod = activePayments[0];
                             lyCart.setPaymentMethodId(activePayments[0].Id);
                             lyCart.setProcessor(activePayments[0].ProcessorType);
                         }

                         if (lyMyAccountUserService.isLogin && lyCart.getIframePaymentMethods().length === 0) {
                             $scope.section.selectionPaymentTemplate = 'new';
                         } else if (lyMyAccountUserService.isLogin && lyCart.getIframePaymentMethods().length > 0) {
                             $scope.section.selectionPaymentTemplate = 'exist';
                         }
                     }, function(error) {
                         $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                     });
                 } else {
                     $scope.section.selectionPaymentTemplate = 'signup';
                 }
             };

             $rootScope.initPaymentUpdate = function(methodId) {
                 $scope.methodId = methodId;
                 lyCartService.getPaymentMethod().then(function(resp) {
                     lyCart.setIframePaymentMethods(resp);
                     if (resp.length > 0) {
                         $scope.setPaymentMethod(resp, methodId);
                     }
                 });
             };

             $scope.setPaymentMethod = function(response, methodId) {
                 angular.forEach(response, function(obj, index) {
                     if (obj.Id == methodId) {
                         $scope.updatePaymentMethod = true;
                         $scope.creditcard.expiration = {};
                         $scope.creditcard.CardHolderName = obj.CardHolderName;
                         $scope.creditcard.CreditCardNumber = "************" + obj.CreditCardNumber;
                         $scope.creditcard.ExpirationDate = obj.ExpirationDate;
                         var date = new Date(obj.ExpirationDate);
                         $scope.creditcard.expiration.year = date.getFullYear();
                         $scope.creditcard.expiration.month = ("0" + (date.getMonth() + 1)).slice(-2);
                         $scope.creditcard.Cvv = obj.Cvv;
                     }
                 });
             };

             $scope.paymentMethodSelected = function(_methodId, _processor) {
                 depositHepler.paymentMethodSelected(_methodId, _processor);
                 $rootScope.$broadcast('lyCart:change', {});
             };
             $scope.depositViaProccessor = function(payment) {
                 debugger
                 if (payment.name == "CreditCard" && lyCart.getIframePaymentMethods().length === 0) {
                     $scope.section.selectionPaymentTemplate = "new";
                 } else if (payment.name != "CreditCard") {
                     $scope.section.selectionPaymentTemplate = "exist";
                 } else {
                     $scope.section.selectionPaymentTemplate = "exist";
                 }
                 lyCart.setProcessor(payment.id);
                 $scope.extraInfo = payment.name.toLowerCase();
             };

             $scope.user = lyMyAccountUserService.getUserInfo();
             $scope.showAdressForm = false;

             if ($scope.user.Address.length <= 0 || $scope.user.ZipCode.length <= 0 || $scope.user.City.length <= 0 ) {
                  $scope.showAdressForm = true;
                  $scope.errorDeposit = lyAppTranslationService.getErrorMessageByKey("Need_Adress");
             }

             $scope.agreeToTerms = false;
            $scope.depositFunds = function(depositAmount, agreeToTerms) {
                if ($scope.showAdressForm) {
                    $scope.errorDeposit = lyAppTranslationService.getErrorMessageByKey("Need_Adress");
                    return;
                }
                var minDepositValid = $scope.validateDeposit(depositAmount)
                  if ($scope.extraInfo == "creditcard" && $scope.agreeToTerms == false || minDepositValid == false) {
                    //  $scope.errorDeposit = lyAppTranslationService.getErrorMessageByKey("Please_accept_our_terms_and_conditions");
                     return;
                 } else if(minDepositValid == false){
                     return;
                 }

                if (!$scope.waitingForResoponse) {
                     $scope.waitingForResoponse = true;
                     $scope.showDepositLoader = true;
                     paymentSelect(depositAmount, true);
                }
            };

             $scope.validateDeposit = function(amount) {
                 if (amount < 10) {

                     $scope.errorDeposit = lyAppTranslationService.getErrorMessageByKey("Min_deposit");
                     return false;
                 } else {
                     $scope.errorDeposit = "";
                     return true;
                 }
             };

             $scope.paymentSelect = function(payment) {
                 depositHepler.paymentSelect(payment);
                 $scope.extraInfo = payment.name;
             };

             $scope.submitOrderNewCreditCard = function(creditcard, user, depositAmount) {
                 lyCartService.validateCreditCardNumber(creditcard.CreditCardNumber).then(function(resp) {
                     if (resp.IsCreditCardValid) {

                         var personalDetails = depositHepler.getPersonalDetailsData(user);
                         user.MemberId = lyMyAccountUserService.getUserMemberId();
                         lyMyAccountUserService.updatePersonalDetails(user).then(function(resp) {
                             if (resp.MemberId) {
                                 var data = depositHepler.getCardData(depositAmount, creditcard, resp.MemberId, resp.UserSessionId);
                                 lyCartService.depositFunds(JSON.stringify(data)).then(function(resp) {

                                     if (resp.IsSuccess) {
                                         stateHelper.goToThankYouPage(false, true);
                                     }
                                 }, function(error) {
                                     $rootScope.$broadcast('new-error', {message: error});
                                     console.warn("Error in depositFunds: " + error);
                                 });
                             }
                         }, function(error) {
                             $rootScope.$broadcast('new-error', {message: error});
                             console.warn("Error in updatePersonalDetails: " + error);
                         });
                     } else {
                         $rootScope.$broadcast('new-error', {message: resp.Error});
                         console.warn("Error in IsCreditCardValid: " + error);
                     }
                 }, function(error) {
                     $rootScope.$broadcast('new-error', {message: error});
                     console.warn("Error in validateCreditCardNumber: " + error);
                 })
             };

             $scope.paymentSelectMoreInfo = function($event, phoneOrEmail, amountToDeposit) {
                 depositHepler.paymentSelectMoreInfo($event, phoneOrEmail, amountToDeposit);
                 paymentSelect(amountToDeposit);
             };

             $scope.editPaymentMethods = function() {
                 $scope.section.selectionPaymentTemplate = 'new';
             };
             $scope.selectPayment = function(payment){
                 $scope.currentSelectedPayment = payment.name;
                 $scope.iframeSrc = undefined;
                 $scope.extraInfo = payment.name.toLowerCase();
                 $scope.payment = payment;
                 lyCart.setProcessor(payment.id);

                 if (payment.name.toLowerCase() == "creditcard" || $scope.translation['Label_Payment_' + payment.name.toLowerCase()]) {
                     return
                 }
                 var products = lyUtilities.getProducts(lyCart.getItems(), lyMyAccountUserService.getUserMemberId());
                 var purchaseObject = {
                     MemberId: lyMyAccountUserService.getUserMemberId(),
                     ProcessorApi: lyCart.getProcessor(),
                     PhoneOrEmail: lyCart.getPhoneOrEmail(),
                     ReedemCode: lyCart.getReedemCode(),
                     AffiliateId: lyCart.getAffiliateCode(),
                     SessionId: lyMyAccountUserService.getUserSessionId(),
                     OrderData: products,
                     CancelUrl: lyConstants.homeUrl + lyConstants.myAccountPageSlug + "/deposit/",
                     ThankYouUrl: lyConstants.homeUrl + "/" + lyConstants.thankYouPageSlug + "/"
                 };

                 $scope.showLoadingPayments = true;

                 lyCartService.submitOrder(purchaseObject).then(function(resp) {
                    $scope.showRedirectMsg = false;
                    $scope.showDepositLoader = false;
                     if (resp.IsSuccess) {
                         var user = lyMyAccountUserService.getUserInfo();
                         stateHelper.goToThankYouPage(false, false, resp.Pmc, user.UserSessionId);
                     } else if (resp.Url) {
                         if (resp.StatusCode == 0) {
                             debugger
                             if (lyCart.getProcessor() == 9 || resp.Url.indexOf('upaysafe') >= 0) {
                                 var url = resp.Url.replace("watch?v=", "v/");
                                 $scope.showRedirectMsg = true;
                                 window.location.replace(url);
                             } else {
                                 var url = resp.Url.replace("watch?v=", "v/");
                                 //if payment method is NOT skrill
                                 if (lyCart.getProcessor() != 15) {
                                    $scope.showRedirectMsg = true;
                                 }
                                 $scope.$broadcast('update-iframe', $sce.trustAsResourceUrl(url));
                             }
                         }
                     } else {
                         $scope.errorDeposit = lyAppTranslationService.getErrorMessageByKey(resp.ErrorMessage);
                         $scope.creditCard = true;
                     }
                     $scope.showLoadingPayments = false;
                 });
             }

             function paymentSelect(amountToDeposit, isDeosit) {
                 var data = lyMyAccountUserService.getDepositData(amountToDeposit);
                 data.CancelUrl = lyConstants.homeUrl + lyConstants.myAccountPageSlug + "/deposit/";
                 data.ThankYouUrl = lyConstants.homeUrl + "/" + lyConstants.thankYouPageSlug + "/";
                 debugger
                 lyCartService.depositFunds(JSON.stringify(data)).then(function(resp) {
                     if(resp.Url){
                         if (resp.StatusCode == 0) {
                             if (lyCart.getProcessor() == 9  || resp.Url.indexOf('upaysafe') >= 0) {
                                 var url = resp.Url.replace("watch?v=", "v/");
                                 $scope.showRedirectMsg = true;
                                 window.location.replace(url);
                             } else {
                                 var url = resp.Url.replace("watch?v=", "v/");
                                 //if payment method is NOT skrill
                                 if (lyCart.getProcessor() != 15) {
                                    $scope.showRedirectMsg = true;
                                 }
                                 $scope.$broadcast('update-iframe', $sce.trustAsResourceUrl(url));
                             }
                         }
                     } else if (resp.IsSuccess) {
                         $scope.showLoginLoader = false;
                         stateHelper.goToThankYouPage(false, isDeosit);
                     } else {
                         $scope.showLoginLoader = false;
                         $scope.errorDeposit = lyAppTranslationService.getErrorMessageByKey(resp.ErrorMessage);
                     }
                     $scope.showLoadingPayments = false;
                     $scope.waitingForResoponse = false;
                     $scope.showDepositLoader = false;
                 }, function(error) {
                     $scope.showLoginLoader = false;
                     $scope.waitingForResoponse = false;
                     $scope.showDepositLoader = false;
                    //  $scope.errorDeposit = lyAppTranslationService.getErrorMessageByKey(error);
                     $scope.errorDeposit = error;
                     console.warn('error in lyCartService.depositFunds', error);
                 });
             }

             $scope.$on('init-deposit-page', function() {
                 $scope.section.selectionPaymentTemplate = 'exist';
             })
         }
     ]);
