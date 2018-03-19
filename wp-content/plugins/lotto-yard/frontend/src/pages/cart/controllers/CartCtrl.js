 'use strict';

 angular.module('lyCart')
     .controller('CartCtrl', [
         '$scope',
         '$sce',
         'lyCart',
         '$uibModal',
         '$controller',
         '$rootScope',
         'lyCartService',
         '$lyCart',
         'lyAppTranslationService',
         'lyCart.utility',
         'lyMyAccountUserService',
         'lyAppProductsServices',
         'quickPickService',
         'stateHelper',
         'lyConstants',
         function(
             $scope,
             $sce,
             lyCart,
             $uibModal,
             $controller,
             $rootScope,
             lyCartService,
             $lyCart,
             lyAppTranslationService,
             lyUtilities,
             lyMyAccountUserService,
             lyAppProductsServices,
             quickPickService,
             stateHelper,
             lyConstants
         ) {
             $scope.activeTab = 'cart';
             $scope.userService = lyMyAccountUserService;
             $scope.lyCart = lyCart;
             $scope.vipPoints = 0;
             $scope.bonusMoney = 0;
             $scope.isFirstTimePurchase = true;
             $scope.promoCode = "";
             $scope.creditcard = {};
             $scope.paymentMethodError = false;
             $scope.terms = false;
             $scope.fastProcessing = lyCart.getIsFastProcessing();
             $scope.redeemCodeOk = false;
             $scope.redeemCodeWrong = false;
            //  $scope.promoCode = lyCart.getReedemCode();
             $scope.showLoadingPayments = false;
             $scope.showRedirectMsg = false;

            $scope.cartItems = lyCart.getItems();
            $scope.$watch('cartItems', function() {
               $scope.cartItems.forEach(function(item){
                   if ($rootScope.changeIsUsingBonusMoney  && item._productName == "Group") {
                       $rootScope.changeIsUsingBonusMoney(true);
                   }
               })
           });
             var items = lyCart.getItems();
             items = items.filter(function(current) {
                 return current.getProductType() != 1;
             });

             $scope.bonus = {
                 isUsingBonusMoney: items.length > 0 ? true : false,
                 vipDiscount: 0
             };

             $scope.user = lyMyAccountUserService.getUserInfo() || {};
             $scope.showPromoLoader = false;
             $scope.showLoginLoader = { "show": false };
             $scope.errorMessage = { "message": '' };

             if (lyMyAccountUserService.isLogin) {
                 $scope.user = lyMyAccountUserService.getUserInfo() || {};
                 $scope.user.DateOfBirth = lyMyAccountUserService.getUserDateOfBirth($scope.user.DateOfBirth);
                 $scope.daysInMonth = lyUtilities.getDropdownDaysOfMonth($scope.user.DateOfBirth.month);
             }

             if (lyMyAccountUserService.isLogin) {
                 var data = $rootScope.userBalance || {};
                 $scope.isFirstTimePurchase = data.FirstPurchase;
                 $scope.vipPoints = data.Points;
                 $scope.bonusMoney = data.BonusAmount;
                 $scope.user.balance = data.AccountBalance;
             }

             $rootScope.$watch('userBalance', function(newValue, oldValue) {
                 if (newValue) {
                     var data = newValue;
                     $scope.user = lyMyAccountUserService.getUserInfo() || {};
                     $scope.isFirstTimePurchase = data.FirstPurchase;
                     $scope.vipPoints = data.Points;
                     $scope.bonusMoney = data.BonusAmount;
                     $scope.user.balance = data.AccountBalance;
                 }
             });

             lyAppTranslationService.getTranslations($scope);

             if (!lyMyAccountUserService.isLogin) {
                 lyMyAccountUserService.clearPersonalInfo();
             }

             $scope.redirectToCart = function($event) {
                 $event.preventDefault();
                 stateHelper.goToCartPage();
                 angular.element('#toggle-cart-popup').removeClass('open');
             };

             $scope.initCart = function(checkSecureCheckout) {
                 if (!lyCart.isEmpty()) {
                     lyCartService.prepareOrder(prepareOrderObject()).then(function(resp) {

                         lyCart.setTotalAfterDiscount(resp.TotalAfterDiscount);
                         lyCart.setBonusAmountToUse(resp.BonusAmountAvailable);
                         lyCart.setVipDiscount(resp.Total - resp.TotalAfterDiscount);
                         prepareOrderResponse(resp);
                         $scope.waitingForResponse = false;

                         if ($scope.activeTab == 'billing') {
                             $rootScope.$broadcast('change-dropdown-amounts');
                         }

                         if (checkSecureCheckout) {
                             $rootScope.$broadcast('secure-checkout');
                         }
                     });
                 } else {
                     lyCart.setBonusAmountToUse(0);
                     lyCart.setVipDiscount(0);
                     lyCart.setTotalAfterDiscount(0);
                     $scope.waitingForResponse = false;
                 }
             };
             $scope.initCart();

             $scope.removeItem = function(itemId) {
                 var item = itemId;
                 if (typeof itemId !== "object") {
                     item = lyCart.getItemById(itemId);
                 }

                 if ((typeof item === "object") && (item !== null)) {
                     var guid = item.getGuid();
                     if (typeof guid !== 'undefined') {
                         var items = lyCart.getItems();
                         var itemToRemove = [];
                         angular.forEach(items, function(item) {
                             if (item.getGuid() === guid) {
                                 itemToRemove.push(item.getId());
                             }
                         });
                         for (var i = 0; i < itemToRemove.length; i++) {
                             lyCart.removeItemById(itemToRemove[i]);
                         }
                     } else {
                         lyCart.removeItemById(item.getId());
                     }
                 }
                 $scope.initCart();
             }
             $scope.currentSelectedPayment = 'CreditCard';
             $scope.paymentSelect = function(payment) {
                 $scope.currentSelectedPayment = payment.name;
                 $scope.iframeSrc = undefined;
                 $scope.extraInfo = payment.name.toLowerCase();
                 $scope.payment = payment;
                 lyCart.setProcessor(payment.id);

                 if (payment.name.toLowerCase() == "creditcard" || $scope.translation['Label_Payment_' + payment.name.toLowerCase()]) {
                      $scope.showRedirectMsg = false;
                     return
                 }

                 paymentSelect();
             }

             $scope.paymentSelectMoreInfo = function($event, phoneOrEmail, processor) {
                 $event.preventDefault();
                 lyCart.setProcessor(processor);
                 lyCart.setPhoneOrEmail(phoneOrEmail);

                 paymentSelect();
             }

             $scope.paymentMethodSelected = function paymentMethodSelected(_methodId, _processor, _selectedmethod) {
                 $scope.selectedmethod = _selectedmethod;

                 if (typeof(_methodId) !== 'undefined' && typeof(_processor) !== 'undefined') {
                     lyCart.setPaymentMethodId(_methodId);
                     lyCart.setProcessor(_processor);

                     $rootScope.$broadcast('lyCart:change', {});
                     console.log('methodId', _methodId);
                 }
             };

             $scope.subscriptionChanged = function(_id) {
                 var item = lyCart.getItemById(_id);
                 if (item.getIsSubscription()) {
                     item.setIsSubscription(false);
                 } else {
                     item.setIsSubscription(true);
                 }

                 $rootScope.$broadcast('lyCart:change', {});

                 $scope.$broadcast('lyCart:itemSubscriptionChanged', {
                     itemid: _id
                 });
                 console.log("Cart object", lyCart);
             }

             $scope.fastProcessingChanged = function() {
                 lyCart.setIsFastProcessing(!lyCart.getIsFastProcessing());
                 $scope.fastProcessing = lyCart.getIsFastProcessing();
                 var items = lyCart.getItems();
                 angular.forEach(items, function(item) {

                     item.setIsFastProcessing(lyCart.getIsFastProcessing());
                     if (lyCart.getIsFastProcessing()) {
                         item.setTotalCost(item.getTotalCost() + lyCart.getFastProcessingTax());
                         if (lyCart.getAmountToPay() > 0) {
                             lyCart.setAmountToPay(lyCart.getAmountToPay() + lyCart.getFastProcessingTax());
                         }
                     } else {
                         item.setTotalCost(item.getTotal() - lyCart.getFastProcessingTax());
                         if (lyCart.getAmountToPay() > 0) {
                             lyCart.setAmountToPay(lyCart.getAmountToPay() - lyCart.getFastProcessingTax());
                         }
                     }
                 });

                 $rootScope.$broadcast('lyCart:change', {});
             };

             $scope.beforeCheckout = function($event) {
                 $event.preventDefault();
                 beforeCheckOutCall();
                 //TODO redirect to cart page
             }

             $scope.changeQuantity = function addQuantity(item, change) {

                 if (!$scope.waitingForResponse) {
                     if (item.getNumberOfLinesOrShares() + change < 1) {
                         return;
                     }

                     $scope.waitingForResponse = true;
                     item.setNumberOfLinesOrShares(item.getNumberOfLinesOrShares() + change);
                     lyAppProductsServices.getProductPriceByParams(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType(), 0)
                         .then(function(data) {
                             item.setTotalCost(data.Price * item.getNumberOfLinesOrShares());
                             $scope.initCart();
                         });
                 }
             };

             $scope.changeShare = function(item, change) {

                 if (item._productType !== 3) {
                     $scope.changeLine(item, change);
                     return
                 }
                 if (!$scope.waitingForResponse) {
                     $scope.waitingForResponse = true;

                     var currentShares = item.getNumberOfLinesOrShares() + change;
                     if (currentShares > 0 && currentShares <= lyConstants.sharesMaxValue) {
                         item.setNumberOfLinesOrShares(currentShares);
                         lyAppProductsServices.getProductPriceByParams(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType())
                             .then(function(data) {
                                 $scope.setPriceAndDiscount(item, data);
                                 $scope.initCart();
                             }, function(error) {
                                 $scope.waitingForResponse = false;
                             });
                     }
                 }
             };

             $scope.changeShareNavidad = function(item, change) {
                 if (!$scope.waitingForResponse) {
                     var rules = item.getRules();
                     var currentShares = item.getNumberOfLinesOrShares() + change;

                     if (rules.MaxLines >= currentShares && rules.MinLines <= currentShares) {
                         $scope.waitingForResponse = true;
                         var originalPrice = item.getTotalCost() / item.getNumberOfLinesOrShares();
                         item.setNumberOfLinesOrShares(currentShares);

                         var price = item.getTotalCost() + originalPrice * change;

                         item.setTotalCost(price);
                         $scope.initCart();
                         $rootScope.$broadcast('lyCart:change', {});
                     }
                 }
             };
             function getLottteryDrawsOptions(rules, lotteryId, productId, isSubscription, drawsCount) {
                 var ProductsDrawOption = rules.ProductsDrawOptions.filter(function(item) {
                     return item.IsSubscription == isSubscription && item.ProductId == productId;
                 })[0];
                 var multiDrawOption = ProductsDrawOption.MultiDrawOptions.filter(function(item) {
                     return item.NumberOfDraws == drawsCount;
                 });
                 return multiDrawOption[0];
             }

             $scope.changeLine = function(item, change, lines) {

                 if (item._productType == 3) {
                     $scope.changeShare(item, change);
                     return;
                 }
                 if (typeof lines === 'undefined') {
                     lines = item.getEvenLinesOnly() ? 2 : 1;
                 }

                 var rules = item.getRules();
                 var linesCount = item.getNumberOfLinesOrShares() + (lines * change);
                 var drawOptions = getLottteryDrawsOptions(rules, item.LotteryTypeId, item.getProductType(), false, item.getNumberOfDraws());

                 if (drawOptions.MinLines <= linesCount && drawOptions.MaxLines >= linesCount) {
                     if (!$scope.waitingForResponse) {
                         $scope.waitingForResponse = true;
                         for (var i = 0; i < lines; i += 1) {
                             if (change < 0) {
                                 item.removeLastLine();
                             } else {
                                 var newLines;

                                 if (item.getLotteryType() === 10) {
                                     var getFirstLine = item.getNumbersSantized()[0];
                                     var specialNumber = getFirstLine.split('#')[1];
                                     newLines = lyUtilities.quickpick(rules, specialNumber);
                                 } else {
                                     newLines = lyUtilities.quickpick(rules);
                                 }
                                 item.addLine(newLines);
                             }
                         }
                         lyAppProductsServices.getProductPriceByParams(item.getProductType(), item.getNumberOfDraws(), item.getLotteryType(), item.getNumberOfLinesOrShares())
                             .then(function(data) {
                                 $scope.setPriceAndDiscount(item, data);
                                 $scope.initCart();
                             });
                     }
                 }
             };
             $scope.promoCodeErr = false;
             $scope.submitPromoCode = function($event, tempCode) {

                 var promoCode;
                 var promoCodeStarFort = "STARFORT"
                 if (tempCode.toLowerCase() == promoCodeStarFort.toLowerCase()) {
                     promoCode = "PCA-123-EBE97A";
                 } else {
                     promoCode = tempCode;
                 }
                 if (!$scope.waitingForResponse) {
                     $scope.showPromoLoader = true;
                     $scope.waitingForResponse = true;

                     if (validatePromoCode(promoCode)) {
                         $event.preventDefault();
                         lyCart.setReedemCode(promoCode);
                         $scope.showPromoLoader = false;
                         $scope.promoCodeErr = false;
                     } else {
                         lyCart.setReedemCode();
                         $scope.showPromoLoader = false;
                     }

                     $scope.initCart();
                     $rootScope.$broadcast('lyCart:change', {});
                 }
             };

             $scope.$on('lyCart:itemSubscriptionChanged', function(event, data) {
                 var item = lyCart.getItemById(data.itemid);
                 $scope.changeDraw(item);
             });

             $scope.submitOrderNewCreditCard = function(card, user) {
                 var lastDay = new Date(parseInt(card.expiration.year), parseInt(card.expiration.month), 0).getDate();
                 var expirationDate = card.expiration.year + "-" + card.expiration.month + "-" + lastDay;
                 var cardNumber = card.CreditCardNumber;
                 lyCartService.validateCreditCardNumber(cardNumber).then(function(resp) {
                    if (resp.IsCreditCardValid) {
                        var creditCardForSend = {
                            CardHolderName: card.firstName + ' ' + card.lastName,
                            CreditCardNumber: cardNumber,
                            Cvv: card.Cvv,
                            CardType: lyUtilities.getCreditCardType(cardNumber),
                            ExpirationDate: expirationDate
                        };

                        lyCart.setProcessor("CreditCard");

                        var currentUserInfo = lyMyAccountUserService.getUserInfo();
                        if (currentUserInfo.hasOwnProperty('Address') &&  currentUserInfo.Address == '') {
                            lyMyAccountUserService.updatePersonalDetails(user).then(function(resp) {
                                $scope.user.Address = resp.Address;
                                $scope.user.ZipCode = resp.ZipCode;
                                $scope.user.City = resp.City;
                            }, function(error) {
                                $scope.showLoginLoader = false;
                                $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                            });
                        }

                        lyMyAccountUserService.addPaymentMethod(creditCardForSend).then(function(resp) {
                            if (resp.hasOwnProperty("Result")) {
                                lyCartService.prepareOrder(prepareOrderObject()).then(function(resp) {
                                if(resp.hasOwnProperty('IframePaymentMethods') && resp.IframePaymentMethods.length > 0) {
                                    var _ = window._;
                                    var lastAddedCreditCart = _.last(resp.IframePaymentMethods);

                                    $scope.showLoginLoader.show = false;
                                    $scope.showEdit = false;

                                    lyCart.setIframePaymentMethods(resp.IframePaymentMethods);

                                    for (var i = 0; i < resp.IframePaymentMethods.length; i++) {
                                        $scope.$watch('lyPayments[' + i + ']', function (newValue, oldValue) {
                                            //newValie, oldValue
                                        }, true);
                                    }

                                    $scope.cartAdded = true;

                                    lyCart.setPaymentMethodId(lastAddedCreditCart.MethodId);
                                    lyCart.setProcessor(lastAddedCreditCart.Processor);
                                    $scope.selectedmethod = lastAddedCreditCart;
                                }
                                });
                            } else {
                                $scope.showLoginLoader.show = false;
                                $rootScope.$broadcast('new-error', {message: resp[0].ErrorMessage});
                            }
                        }, function(error) {
                            $scope.showLoginLoader.show = false;
                            $rootScope.$broadcast('new-error', {message: error});
                        })
                    } else {
                        $scope.showLoginLoader.show = false;
                        $rootScope.$broadcast('new-error', {message: resp.Error});
                    }
                }, function(error) {
                    $scope.showLoginLoader.show = false;
                    $rootScope.$broadcast('new-error', {message:error});
                });
             };

             function prepareOrderObject() {
                 var productsArray = lyUtilities.cartItemsMapToProductsArray(lyCart.getItems());
                 var sanitized = [];
                 if ($rootScope.userBalance && lyCart.getAmountToPay() <= $rootScope.userBalance.BonusAmount && $scope.bonus.isUsingBonusMoney) {
                   lyCart.setBonusAmountToUse($rootScope.userBalance.BonusAmount);
                    }
                 productsArray.forEach(function(product) {
                     var quantity = product.ProductId == 14 ? product.Lines : 1;
                     for (var i = 0; i < quantity; i++) {
                         var data = loadPrepareOrderData(product);
                         sanitized.push(data);
                     }
                 });

                 return {
                     MemberId: lyMyAccountUserService.getUserMemberId(),
                     ReedemCode: lyCart.getReedemCode() == "0" ? "" : lyCart.getReedemCode(),
                     ProductNumsLottery: sanitized.join('|'),
                     BonusAmountToUse: $scope.bonus.isUsingBonusMoney ? lyCart.getBonusAmountToUse() : 0
                 };
             }

             function sanitizeLines(numbers) {
                 var num = numbers.split('|');
                 return num.join(',');
             }

             function loadPrepareOrderData(product) {
                 var data = 'MemberId=' + lyMyAccountUserService.getUserMemberId() + '&ProductId=' + product.ProductId + '&LotteryTypeID=' + product.LotteryID + '&numOfDraws=' + product.Draws;
                 data += '&numOfLines=' + product.Lines + '&externalId=' + '&isVip=' + product.IsVip + '&isCash=' + product.IsCash + '&Amount=' + product.Amount;

                 var selectedNumbers = !!product.SelectedNumbers ? sanitizeLines(product.SelectedNumbers.toString()) : '';
                 data += '&selectedNumbers=' + selectedNumbers;

                 return data;
             }

             function prepareOrderResponse(resp) {
                 if (typeof resp.IframePaymentMethods !== 'undefined' && resp.IframePaymentMethods.length > 0) {
                     $scope.selectedmethod = resp.IframePaymentMethods[0];
                     lyCart.setIframePaymentMethods(resp.IframePaymentMethods);
                     lyCart.setPaymentMethodId(resp.IframePaymentMethods[0].MethodId);
                     lyCart.setProcessor(resp.IframePaymentMethods[0].Processor);
                 }

                 var totalAmount = lyCart.getTotal();
                 if (totalAmount !== resp.AmountToPay) {
                     lyCart.setAmountToPay(resp.AmountToPay);
                 } else {
                     lyCart.setAmountToPay(lyCart.getTotal());
                 }

                 var reedemBonus = resp.ReedemBonusAmount < 0 ? 0 : resp.ReedemBonusAmount;
                 lyCart.setReedemBonusAmount(reedemBonus);
                 if (resp.ReedemBonusAmount > 0) {
                     $scope.redeemCodeOk = true;
                     $scope.redeemCodeWrong = false;
                     $scope.promoCodeErr = false;
                 } else {
                     if (lyCart.getReedemCode() != "" && resp.ReedemBonusAmount < 0) {
                         $scope.promoCodeErr = true;
                     } else {
                         $scope.promoCodeErr = false;
                     }
                     $scope.redeemCodeWrong = true;
                     $scope.redeemCodeOk = false;
                 }

                 $rootScope.$broadcast('lyCart:change', {});
             }

             $scope.setPriceAndDiscount = function setPriceAndDiscount(item, data) {
                 var priceObject = {
                     price: 0,
                     discount: 0
                 };

                 if (item.getProductType() === 3) {
                     if (item.getDiscount() > 0) {
                         priceObject.price = item.getNumberOfLinesOrShares() * (data.Price + ((data.Price / (1 - item.getDiscount())) * item.getDiscount()));
                         priceObject.discount = item.getDiscount() * priceObject.price;
                     } else {
                         priceObject.price = item.getNumberOfLinesOrShares() * data.Price;
                     }
                 } else if (item.getProductType() === 2 || item.getProductType() === 4 || item.getProductType() === 14) {
                     priceObject.price = data.Price * item.getNumberOfLinesOrShares();
                     priceObject.discount = 0;
                 } else {
                     if (item.getDiscount() > 0) {
                         priceObject.price = data.Price + ((data.Price / (1 - item.getDiscount())) * item.getDiscount());
                         priceObject.discount = item.getDiscount() * priceObject.price;
                     } else {
                         priceObject.price = data.Price;
                     }
                 }

                 item.setTotalCost(priceObject.price - priceObject.discount);
                 item.setTotalDiscount(priceObject.discount);
             }
             $scope.user = lyMyAccountUserService.getUserInfo();
             $scope.showAdressForm = false;

             function paymentSelect() {

                 var products = lyUtilities.getProducts(lyCart.getItems(), lyMyAccountUserService.getUserMemberId());
                 var purchaseObject = {
                     MemberId: lyMyAccountUserService.getUserMemberId(),
                     ProcessorApi: lyCart.getProcessor(),
                     PhoneOrEmail: lyCart.getPhoneOrEmail(),
                     ReedemCode: lyCart.getReedemCode(),
                     AffiliateId: lyCart.getAffiliateCode(),
                     SessionId: lyMyAccountUserService.getUserSessionId(),
                     OrderData: products,
                     CancelUrl: lyConstants.homeUrl,
                     ThankYouUrl: lyConstants.homeUrl + "/" + lyConstants.thankYouPageSlug + "/"
                 };

                 $scope.showLoadingPayments = true;

                 lyCartService.submitOrder(purchaseObject).then(function(resp) {
                    $scope.showRedirectMsg = false;
                     if (resp.IsSuccess) {
                         var user = lyMyAccountUserService.getUserInfo();
                         stateHelper.goToThankYouPage(false, false, resp.Pmc, user.UserSessionId);
                     } else if (resp.Url) {
                         if (resp.StatusCode == 0) {

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
                         $scope.errorMessage = lyAppTranslationService.getErrorMessageByKey(resp);
                         $scope.creditCard = true;
                     }
                     $scope.showLoadingPayments = false;
                 });
             }
             $scope.user = lyMyAccountUserService.getUserInfo();
            $scope.showAdressForm = false;

            if (lyMyAccountUserService.isLogin && $scope.activeTab == 'billing' && ($scope.user.Address.length <= 0 || $scope.user.ZipCode.length <= 0 || $scope.user.City.length <= 0 )) {
                 $scope.showAdressForm = true;
                 $scope.errorPlaceOrder = lyAppTranslationService.getErrorMessageByKey("Need_Adress");
            }
             $scope.UpdateProfile = function($event, user) {
                 if ($scope.user.Address.length <= 0 || $scope.user.ZipCode.length <= 0 || $scope.user.City.length <= 0 ) {
                      return;
                  }
                 $scope.showLoginLoader = true;
                 user.CountryCode = user.CountryCode.iso2;
                 user.DateOfBirth = new Date(Date.UTC(user.DateOfBirth.year, parseInt(user.DateOfBirth.month - 1), user.DateOfBirth.day));

                 lyMyAccountUserService.updatePersonalDetails(user).then(function(resp) {
                     $scope.showLoginLoader = false;
                     $rootScope.userName = resp.FirstName + " " + resp.LastName;

                     $scope.result = user.Result;
                     $scope.user = resp;
                     $scope.showAdressForm = false;
                     $scope.user.DateOfBirth = lyMyAccountUserService.getUserDateOfBirth(resp.DateOfBirth);
                     $scope.user.CountryCode = getUserCounty($scope.countryData, $scope.user.CountryCode);
                 }, function(error) {
                     $scope.showLoginLoader = false;
                     $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                 });
             };

             function validatePromoCode(code) {
                 var regex = new RegExp(/[A-z]+-[A-z0-9]+-[A-z0-9]+/);
                 return regex.test(code);
             }
         }
     ])
