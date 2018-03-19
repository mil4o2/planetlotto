'use strict'

angular.module('lyApp.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCreditCardPayment
     * @restrict A
     * @element ANY
     *
     * @description
     */
    .directive('lyCreditCardPayment', [
        '$state',
        '$rootScope',
        'lyConstants',
        'lyCart',
        'lyMyAccountUserService',
        'lyAppTranslationService',
        'lyCartService',
        'validationService',
        'lyCart.utility',
        function(
            $state,
            $rootScope,
            lyConstants,
            lyCart,
            lyMyAccountUserService,
            lyAppTranslationService,
            lyCartService,
            validationService,
            lyUtilities
        ) {
            return {
                restrict: 'A',
                scope: {
                    submitOrderNewCreditCard: '&',
                    errorMessage: '=',
                    showLoginLoader: '=',
                    isDeposit: '=',
                    saveCardBtn: '=',
                    creditCard: '=',
                    isUpdate: '=',
                },
                templateUrl: lyConstants.partialPath + 'cart/templates/ly-credit-card-payment.html',
                link: function(scope, element, $rootScope) {
                    lyAppTranslationService.getTranslations(scope);
                    scope.user = lyMyAccountUserService.getUserInfo();
                    scope.card = {
                        expiration: {}
                    };

                    var currentYear = new Date().getFullYear();
                    var expireYear = currentYear + 10;
                    scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    scope.years = new Array(11).join().split(',').map(function(item, index) {
                       return (expireYear - index);
                    }).reverse();
                    scope.card.expiration.month = 'Month';
                    scope.card.expiration.year = 'Year';

                    scope.$on('new-error', function(evt, args){
                        scope.errorMessage.message = lyAppTranslationService.getErrorMessage(args.message);
                    })

                    if (scope.creditCard) {
                        scope.card.number1 = '****';
                        scope.card.number2 = '****';
                        scope.card.number3 = '****';
                        scope.card.number4 = scope.creditCard.CreditCardNumber;
                        scope.card.firstName = scope.creditCard.CardHolderName.split(' ')[0];
                        scope.card.lastName = scope.creditCard.CardHolderName.split(' ')[1];
                        scope.card.expiration.month = scope.creditCard.ExpirationDate.month;
                        scope.card.expiration.year = scope.creditCard.ExpirationDate.year;
                        scope.card.Cvv = scope.creditCard.Cvv;
                    }
                    scope.depositAmount = 0;

                    var card = new Card({
                        form: 'form',
                        container: '.card-wrapper',
                        formSelectors: {
                            numberInput: 'input[name="first-numbers"], input[name="second-numbers"], input[name="third-numbers"], input[name="fourth-numbers"]',
                            nameInput: 'input[name="first-name"], input[name="last-name"]',
                            expiryInput: 'input[name="expiry-month"], input[name="expiry-year"]',
                            cvc: 'input[name="cvc"]'
                        },
                        placeholders: {
                            number: '**** **** **** ****',
                            name: 'Full Name',
                            expiry: '**/****',
                            cvc: '***'
                        }
                    });

                    scope.$watch('card.number1', function(newValue){
                        if(typeof newValue != 'undefined' && newValue.match(/\D/g)){
                            newValue.replace(/\D/g,'');
                            scope.card.number1 = scope.card.number1.replace(/[^0-9*]/g,"");
                        }
                     });
                    scope.$watch('card.number2', function(newValue){
                         if(typeof newValue != 'undefined' && newValue.match(/\D/g)){
                             newValue.replace(/\D/g,'');
                             scope.card.number2 = scope.card.number2.replace(/[^0-9*]/g,"");
                         }
                    });
                    scope.$watch('card.number3', function(newValue){
                          if(typeof newValue != 'undefined' && newValue.match(/\D/g)){
                              newValue.replace(/\D/g,'');
                              scope.card.number3 = scope.card.number3.replace(/[^0-9*]/g,"");
                          }
                    });
                    scope.$watch('card.number4', function(newValue){
                           if(typeof newValue != 'undefined' && newValue.match(/\D/g)){
                               newValue.replace(/\D/g,'');
                               scope.card.number4 = scope.card.number4.replace(/[^0-9*]/g,"");
                           }
                    });

                    scope.closeModal = function() {
                        window.$rootScope.modalInstance.close();
                        // $rootScope.$emit("CloseModal", {});
                    }

                    scope.submitForm = function(card, user, depositAmount) {
                        // ;
                        if (!validateUserData()) {
                            return;
                        }

                        if (!scope.waitingForResponse) {
                            scope.waitingForResponse = true;
                            scope.showLoginLoader.show = true;
                            card.CreditCardNumber = getCardNumber();

                            if (scope.creditcard) {
                                card.Id = scope.creditcard.Id;
                            }

                            scope.submitOrderNewCreditCard({ card: card, user: user, depositAmount: depositAmount });
                            scope.waitingForResponse = false;
                        }
                    }
                    scope.$watch('card.expiration.month', function(newValue){
                       if(typeof newValue != 'undefined'){
                           var yearValue = typeof scope.card.expiration.year != 'undefined' ? scope.card.expiration.year : "****";
                           $('.jp-card-expiry').text(newValue + "/" + yearValue);
                       }
                    });
                    scope.$watch('card.expiration.year', function(newValue){
                        if(typeof newValue != 'undefined'){
                            var monthValue = typeof scope.card.expiration.month != 'undefined' ? scope.card.expiration.month : "**";
                            $('.jp-card-expiry').text(monthValue + "/" + newValue);
                        }
                     });

                    scope.changeCardNumber = function(number, index) {
                        number = number.replace(/ /g, '');
                        if (number.trim().length == 4) {
                            goToNextInput(index, ".card-number-auto-tab");
                        } else if (number.trim().length > 13) {
                            var regExpr = new RegExp("[0-9]+");
                            if (regExpr.test(number)) {
                                scope.card.number1 = number.substr(0, 4) + ' ';
                                scope.card.number2 = ' ' + number.substr(4, 4) + ' ';
                                scope.card.number3 = ' ' + number.substr(8, 4) + ' ';
                                scope.card.number4 = ' ' + number.substr(12, number.length - 12);
                            } else {
                                scope.card.number1 = '';
                                scope.card.number2 = '';
                                scope.card.number3 = '';
                                scope.card.number4 = '';
                            }
                        } else if (number.trim().length > 4) {
                            scope.card['number' + (index + 1)] = number.substring(0, 4) + ' ';
                            goToNextInput(index, ".card-number-auto-tab");
                        }
                        /*
                        var holeNumber = getCardNumber();
                        if (holeNumber) {
                            scope.validateCardNumber();
                        }
                        */
                    }
                    scope.changeMonthValue = function(value) {
                        scope.card.expiration.month =  value;
                        scope.validateExpirationDate();
                    }
                    scope.changeYearValue = function(value) {
                        scope.card.expiration.year =  value;
                        scope.validateExpirationDate();
                    }

                    scope.validateCardNumber = function() {
                        var holeNumber = getCardNumber();
                        if (holeNumber) {
                            scope.errorMessage.message = undefined;

                            if (holeNumber.length >= 13 && holeNumber.length <= 16) {
                                lyCartService.validateCreditCardNumber(holeNumber)
                                    .then(function(resp) {
                                        if (!resp.IsCreditCardValid) {
                                            scope.errorMessage.message = lyAppTranslationService.getErrorMessage(resp.Error)
                                        } else {
                                            scope.errorMessage.message = undefined;
                                        }
                                    }, function(error) {

                                    })
                            } else {
                                scope.errorMessage.message = lyAppTranslationService.getErrorMessage("Please_insert_valid_credit_card_number");
                            }
                        } else {
                            scope.errorMessage.message = lyAppTranslationService.getErrorMessage("Please_insert_valid_credit_card_number");
                        }
                    }

                    scope.validate = function(model, message, minLenght, maxLenght) {
                        if (!validationService.validateMinMaxLenght(model, minLenght, maxLenght)) {
                            scope.errorMessage.message = lyAppTranslationService.getErrorMessage(message);
                            return false;
                        } else {
                            scope.errorMessage.message = undefined;
                            return true;
                        }
                    };

                    scope.validateExpirationDate = function() {
                        if (scope.card.expiration.month < 1) {
                            scope.card.expiration.month = 1;
                        } else if (scope.card.expiration.year < 1){
                            scope.card.expiration.year = 1;
                        }
                        if (!scope.card.expiration.month) {
                            scope.card.expiration.month = angular.element('#expiration-date-field')[0].value;
                        }

                        if (!validationService.validateExpirationDate(scope.card.expiration.month, scope.card.expiration.year)) {
                            scope.errorMessage.message = lyAppTranslationService.getErrorMessage("Please_insert_valid_expiration_cart");
                            return false;
                        }
                        scope.errorMessage.message = undefined;
                        return true;
                    };

                    scope.validateDeposit = function(amount) {
                        amount = amount ? amount : 0;
                        if (amount < 5) {
                            scope.errorMessage.message = lyAppTranslationService.getErrorMessage("Min_deposit");
                            return false;
                        } else {
                            scope.errorMessage.message = undefined;
                            return true;
                        }
                    };

                    function getCardNumber() {
                        if (scope.card.number1 && scope.card.number2 && scope.card.number3 && scope.card.number4) {
                            return scope.card.number1.trim() + scope.card.number2.trim() + scope.card.number3.trim() + scope.card.number4.trim();
                        }
                    }

                    function goToNextInput(index, selector) {
                        var inputs = element.find(selector);
                        if (inputs[index + 1]) {
                            inputs[index + 1].focus();
                        }
                    }

                    function validateUserData() {
                        scope.errorMessage = {};
                        scope.errorMessage.message = undefined;
                        var creditCard = getCardNumber();

                        if (!scope.card.number1 || !scope.card.number2 || !scope.card.number3 || !scope.card.number4) {
                            scope.errorMessage.message = lyAppTranslationService.getErrorMessage("Please_insert_valid_credit_card_number")
                            return false;
                        }

                        if (!scope.validate(creditCard, 'Please_insert_valid_credit_card_number', 13, 16)) {
                            return false;
                        }

                        if (!scope.validate(scope.card.firstName, 'Please_insert_valid_first_name', 3)) {
                            return false;
                        }

                        if (!scope.validate(scope.card.lastName, 'Please_insert_valid_last_name', 3)) {
                            return false;
                        }

                        if (!scope.validateExpirationDate()) {
                            return false;
                        }

                        if (!scope.validate(scope.card.Cvv, 'Please_insert_your_cvv_number', 3, 4)) {
                            return false;
                        }

                        if (!scope.validate(scope.user.City, 'Please_insert_valid_city', 3, 35)) {
                            return false;
                        }

                        if (!scope.validate(scope.user.Address, 'Please_insert_valid_address', 4, 35)) {
                            return false;
                        }

                        if (!scope.validate(scope.user.ZipCode, 'Please_insert_valid_postal_code', 3, 13)) {
                            return false;
                        }

                        if (!scope.validateDeposit(scope.depositAmount) && scope.isDeposit) {
                            return false;
                        }

                        scope.errorMessage.message = undefined;
                        return true;
                    }
                }
            }
        }
    ])
