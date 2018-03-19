 'use strict';

 angular.module('lyMyAccount.services')
     .factory('lyMyAccountUserService', [
         '$lyMyAccount',
         'lyUserCacheFactory',
         '$rootScope',
         '$q',
         'lyCart',
         '$cookies',
         'lyAppHttpService',
         'lyConstants',
         function($lyMyAccount,
             lyUserCacheFactory,
             $rootScope,
             $q,
             lyCart,
             $cookies,
             lyAppHttpService,
             lyConstants) {

             var factory = {
                 addPaymentMethod: addPaymentMethod,
                 clearPersonalInfo: clearPersonalInfo,
                 deletePaymentMethod: deletePaymentMethod,
                 getMemberMoneyBalanceByMemberId: getMemberMoneyBalanceByMemberId,
                 getMemberPurchaseCompleteDetails: getMemberPurchaseCompleteDetails,
                 getPaymentMethod: getPaymentMethod,
                 getProducts: getProducts,
                 getTickets: getTickets,
                 getFreeTicket: getFreeTicket,
                 getTransactions: getTransactions,
                 getUserDateOfBirth: getUserDateOfBirth,
                 getUserInfo: getUserInfo,
                 logOut: logOut,
                 signIn: signIn,
                 signUp: signUp,
                 updatePersonalDetails: updatePersonalDetails,
                 updateUserPassword: updateUserPassword,
                 getUserSessionId: getUserSessionId,
                 getUserMemberId: getUserMemberId,
                 setDefaultCreditCard: setDefaultCreditCard,
                 setCredentials: setCredentials,
                 autoSignIn: autoSignIn,
                 addWithdraw: addWithdraw,
                 getDepositData: getDepositData,
                 sendResetPassword: sendResetPassword,
                 verifyResetPasswordLinkWithOutput: verifyResetPasswordLinkWithOutput,
                 getCountryCode: getCountryCode,
                 facebookSignUp: facebookSignUp,
                 insertFreeTicket: insertFreeTicket
             };

             var Base64 = {

                 keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

                 encode: function(input) {
                     var output = "";
                     var chr1, chr2, chr3 = "";
                     var enc1, enc2, enc3, enc4 = "";
                     var i = 0;

                     do {
                         chr1 = input.charCodeAt(i++);
                         chr2 = input.charCodeAt(i++);
                         chr3 = input.charCodeAt(i++);

                         enc1 = chr1 >> 2;
                         enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                         enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                         enc4 = chr3 & 63;

                         if (isNaN(chr2)) {
                             enc3 = enc4 = 64;
                         } else if (isNaN(chr3)) {
                             enc4 = 64;
                         }

                         output = output +
                             this.keyStr.charAt(enc1) +
                             this.keyStr.charAt(enc2) +
                             this.keyStr.charAt(enc3) +
                             this.keyStr.charAt(enc4);
                         chr1 = chr2 = chr3 = "";
                         enc1 = enc2 = enc3 = enc4 = "";
                     } while (i < input.length);

                     return output;
                 },

                 decode: function(input) {
                     var output = "";
                     var chr1, chr2, chr3 = "";
                     var enc1, enc2, enc3, enc4 = "";
                     var i = 0;

                     // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                     var base64test = /[^A-Za-z0-9\+\/\=]/g;
                     if (base64test.exec(input)) {
                         window.alert("There were invalid base64 characters in the input text.\n" +
                             "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                             "Expect errors in decoding.");
                     }
                     input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                     do {
                         enc1 = this.keyStr.indexOf(input.charAt(i++));
                         enc2 = this.keyStr.indexOf(input.charAt(i++));
                         enc3 = this.keyStr.indexOf(input.charAt(i++));
                         enc4 = this.keyStr.indexOf(input.charAt(i++));

                         chr1 = (enc1 << 2) | (enc2 >> 4);
                         chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                         chr3 = ((enc3 & 3) << 6) | enc4;

                         output = output + String.fromCharCode(chr1);

                         if (enc3 != 64) {
                             output = output + String.fromCharCode(chr2);
                         }
                         if (enc4 != 64) {
                             output = output + String.fromCharCode(chr3);
                         }

                         chr1 = chr2 = chr3 = "";
                         enc1 = enc2 = enc3 = enc4 = "";

                     } while (i < input.length);

                     return output;
                 }
             };

             function facebookSignUp(user) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + "facebook-signup-login";
                 lyAppHttpService.post(url, user)
                     .then(function(resp) {
                         //  if (resp.MemberId) {
                         //      factory.setCredentials(resp);
                         //      console.log("%c userinfo/facebook-signup-login: ", "color: red");
                         //      console.log(resp);
                         //      deferred.resolve(resp);
                         //  } else {
                         //      deferred.reject(resp);
                         //  }
                     }, function(error) {
                         console.warn("Error in userinfo/facebook-signup-login: " + error);
                         deferred.reject(error);
                     });

                 return deferred.promise;
             }

             function setCredentials(response) {
                 var authdata = Base64.encode(response.FirstName + ':' + response.UserSessionId);

                 if (response.Password) {
                     delete response.Password;
                 }

                 factory.isLogin = true;

                 // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
                 var cookieExp = new Date();
                 cookieExp.setDate(cookieExp.getDate() + 7);
                 $cookies.putObject('globals', { username: response.FirstName, authdata: authdata }, { expires: cookieExp });
                 delete response.BrandId;

                 lyUserCacheFactory.put('UserData', response);
             }

             factory.isLogin = ($cookies.get('globals') && lyUserCacheFactory.get('UserData')) ? true : false;

             function addPaymentMethod(data) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + "add-update-credit-card";
                 data.MemberId = getUserMemberId();
                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         ;
                         console.log('%c userinfo/add-update-credit-card: ', "color: red");
                         console.log(resp);

                         deferred.resolve(resp);
                     }, function(error) {
                         deferred.reject(error);
                         $rootScope.$broadcast('new-error', {message: error});
                         console.warn("Error in userinfo/add-update-credit-card: " + error);
                     });

                 return deferred.promise;
             };

             function clearPersonalInfo() {
                 lyCart.setAmountToPay(0);
                 lyCart.setIframePaymentMethods([]);
                 lyCart.setIsFastProcessing(false);
                 lyCart.setPaymentMethodId("");
                 lyCart.setPhoneOrEmail("");
                 lyCart.setProcessor("");

                 $rootScope.$broadcast('lyCart:change', {});
             }

             function deletePaymentMethod(paymentId) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + 'delete-credit-card';
                 var params = {
                     "MemberId": getUserMemberId(),
                     "Id": paymentId
                 };

                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         console.log('%c userinfo/delete-credit-card: ', "color: red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in userinfo/delete-credit-card: " + resp);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             };

             function getMemberMoneyBalanceByMemberId() {
                 var deferred = $q.defer();

                 var url = lyConstants.lyApiDefinitions.userinfo + "get-member-money-balance";
                 var params = {
                     "MemberId": getUserMemberId()
                 };
                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         if (!Array.isArray(resp)) {
                             console.log("%c userinfo/get-member-money-balance: ", "color: red");
                             console.log(resp);
                             lyUserCacheFactory.put('MemberMoneyBalance', resp);
                             //update money balance in index.php at the Top menu
                             $rootScope.totalBalance = resp.AccountBalance + resp.BonusAmount + resp.WinningAmount;

                             deferred.resolve(resp);
                         } else {
                             console.warn("%c Response from userinfo/get-member-money-balance: ", "color: red", resp[0].ErrorMessage);
                             deferred.reject('There was an error');
                         }
                     }, function(error) {
                         console.warn("Error in userinfo/get-member-money-balance: " + error);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             }

             function getMemberPurchaseCompleteDetails(pmc) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + 'get-member-purchase-complete-details-for-cart-wp';
                 var params = {
                     "SessionId": getUserSessionId(),
                     "ProductManagementCounter": pmc
                 };
                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         console.log("%c userinfo/get-member-purchase-complete-details-for-cart-wp: ", "color: red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in userinfo/get-member-purchase-complete-details-for-cart-wp: " + error);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             };

             function getPaymentMethod() {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + "get-credit-card-methods-by-memberid";
                 var params = {
                     "MemberId": getUserMemberId(),
                     "IncludeNotActive": true
                 };
                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         console.log('%c userinfo/get-credit-card-methods-by-memberid: ', "color: red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in userinfo/get-credit-card-methods-by-memberid: " + resp);
                         deferred.reject('There was an error:');
                     });

                 return deferred.promise;
             };

             function getProducts(pageNumber) {
                 var deferred = $q.defer();
                 var Products = 'Products';
                 var ignoreLoadingBar = (pageNumber === 1) ? true : false;

                 if (lyUserCacheFactory.get(Products) && pageNumber === 1) {
                     var cached = lyUserCacheFactory.get(Products);
                     if (!Array.isArray(cached)) {
                         cached = JSON.parse(cached);
                     }
                     deferred.resolve(cached);
                 } else {
                     var url = lyConstants.lyApiDefinitions.playlottery + 'get-products-by-memberid';
                     var params = {
                         "PageNumber": pageNumber,
                         "MemberId": getUserMemberId()
                     };
                     lyAppHttpService.post(url, params)
                         .then(function(resp) {
                             console.log("%c playlottery/get-products-by-memberid&PageNumber=" + pageNumber, "color: red");
                             console.log(resp);

                             if (resp.length > 0 && resp[0].ErrorMessage) {
                                 deferred.reject(resp.errorMessage);
                             } else {
                                 if (pageNumber === 1) {
                                     lyUserCacheFactory.put(Products, resp);
                                 }
                                 deferred.resolve(resp);
                             }
                         }, function(error) {
                             console.warn("Error in playlottery/get-products-by-memberid&PageNumber=" + pageNumber + ": " + error);
                             deferred.reject('There was an error');
                         });
                 }

                 return deferred.promise;
             }

             function getTickets(pageNumber) {
                 var deferred = $q.defer();
                 var Tickets = 'Tickets';
                 var ignoreLoadingBar = (pageNumber === 1) ? true : false;

                 if (lyUserCacheFactory.get(Tickets) && pageNumber === 1) {
                     var cached = lyUserCacheFactory.get(Tickets);
                     if (!Array.isArray(cached)) {
                         cached = JSON.parse(cached);
                     }
                     deferred.resolve(cached);
                 } else {
                     var url = lyConstants.lyApiDefinitions.playlottery + 'get-draws-tickets-by-memberid';
                     var params = {
                         "PageNumber": pageNumber,
                         "MemberId": getUserMemberId()
                     };
                     lyAppHttpService.post(url, params)
                         .then(function(resp) {
                             console.log("%c playlottery/get-draws-tickets-by-memberid&PageNumber=" + pageNumber, "color: red");
                             console.log(resp);

                             if (resp.length > 0 && resp[0].ErrorMessage) {
                                 deferred.reject(resp.errorMessage);
                             } else {
                                 if (pageNumber === 1) {
                                     lyUserCacheFactory.put(Tickets, resp);
                                 }
                                 deferred.resolve(resp);
                             }
                         }, function(error) {
                             console.warn("Error in playlottery/get-draws-tickets-by-memberid&PageNumber=" + pageNumber + ": " + error);
                             deferred.reject('There was an error');
                         });
                 }
                 return deferred.promise;
             }
             function getFreeTicket() {
               var deferred = $q.defer();
               var url = lyConstants.lyApiDefinitions.playlottery + 'get-member-free-ticket';
               var params = {
                   "MemberId": getUserMemberId()
               };

               lyAppHttpService.post(url, params)
               .then(function(resp) {
                   console.log("%c playlottery/get-member-free-ticket", "color: red");
                   console.log(resp);

                   if (resp.length > 0 && resp[0].ErrorMessage) {
                       deferred.reject(resp.errorMessage);
                   } else {
                       deferred.resolve(resp);
                   }
               }, function(error) {
                  console.warn("Error in playlottery/get-member-free-ticket :" + error);
                  deferred.reject('There was an error');
               });

               return deferred.promise;
            }
             function getTransactions(pageNumber, pageSize, types, startDate, endDate) {
                 var deferred = $q.defer();
                 startDate = startDate ? startDate.toISOString().substring(0, 10) : '';
                 endDate = endDate ? endDate.toISOString().substring(0, 10) + ' 23:59' : '';

                 var url = lyConstants.lyApiDefinitions.userinfo + "get-member-transactions";
                 var params = {
                     "PageNumber": pageNumber,
                     "PageSize": pageSize,
                     "Types": types,
                     "StartDate": startDate,
                     "EndDate": endDate,
                     "MemberId": getUserMemberId()
                 };
                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         console.log('%c userinfo/get-member-transactions: ', "color: red");
                         console.log(resp);
                         if (resp.length > 0 && resp[0].ErrorMessage) {
                             deferred.reject(resp.errorMessage);
                         } else {
                             deferred.resolve(resp);
                         }
                     }, function(error) {
                         console.warn("Error in userinfo/get-member-transactions: " + error);
                         deferred.reject('There was an error');
                     })

                 return deferred.promise;
             }

             function getUserDateOfBirth(date) {
                 var dateOfBirth = new Date(date);

                 return {
                     day: dateOfBirth.getDate(),
                     month: dateOfBirth.getMonth() + 1,
                     year: dateOfBirth.getFullYear()
                 }
             }

             function getUserInfo() {
                 return lyUserCacheFactory.get('UserData');
             }

             function logOut() {
                 factory.isLogin = false;
                 lyUserCacheFactory.removeAll();
                 lyUserCacheFactory.removeAll();
                 $rootScope.$broadcast('loggingOut');
                 $cookies.remove('globals');
             }

             //It sends email to the user with link to the reset password page
             function sendResetPassword(userEmail) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.mailservice + "send-reset-password";

                 var data = {
                     "Email": userEmail,
                     "ActionLink": lyConstants.siteUrl + "/reset-password/?"
                 }

                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         if (resp) {
                             deferred.resolve(resp);
                         }

                     }, function(error) {
                         console.warn("Error in mailservice/send-reset-password: " + error);
                         deferred.reject('There was an error');
                     })
                 return deferred.promise;
             }

             function verifyResetPasswordLinkWithOutput(link) {
                 // verify reset password link with userinfo/verify-reset-password-link-with-output
                 // param: EncryptedQueryString

                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + "verify-reset-password-link-with-output";

                 var data = {
                     "EncryptedQueryString": link
                 }

                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         if (resp) {
                             console.log(resp);
                             deferred.resolve(resp);
                         } else {
                             deferred.reject(resp);
                         }
                     }, function(error) {
                         console.warn("Error in userinfo/verify-reset-password-link-with-output: " + error);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;

             }

             function signIn(data) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + "login";

                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         if (resp.MemberId) {
                             $rootScope.userName = resp.FirstName + " " + resp.LastName;
                             $rootScope.userInfo = resp;
                             $rootScope.memberId = resp.MemberId;
                             
                             factory.setCredentials(resp);
                             $rootScope.$broadcast('loggingIn');

                             console.log("%c userinfo/login: ", "color: red");
                             console.log(resp);
                             deferred.resolve(resp);
                         } else {
                             deferred.reject(resp);
                         }
                     }, function(error) {
                         console.warn("Error in userinfo/login: " + error);
                         deferred.reject(error);
                     });

                 return deferred.promise;
             }

             function autoSignIn(data) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + "get-personal-details-by-sessionid";
                 var params = {
                     "SessionId": data
                 };

                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                          if (resp.MemberId) {
                             signIn(resp).then(function(resp) {
                                 debugger
                                 factory.setCredentials(resp);

                                 getMemberMoneyBalanceByMemberId().then(function(resp) {
                                     $rootScope.userBalance = resp;
                                     $rootScope.$broadcast('balanceUpdated');
                                 });
                             },
                             function(error) {
                                 $scope.showLoginLoader = false;
                                 $scope.errorMessage = lyAppTranslationService.getErrorMessageByKey(error);
                             });

                             console.log("%c userinfo/autoLogin: ", "color: red");
                             console.log(resp);
                         }

                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in userinfo/autoLogin: " + error);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             }

             function signUp(data) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + "signup";
                 data.dateOfBirth = new Date(data.birthday.year, data.birthday.month, data.birthday.day);
                 //  delete data.birthday;
                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         if (resp.MemberId) {
                             factory.setCredentials(resp);
                             console.log("%c userinfo/signup: ", "color: red");
                             console.log(resp);

                             deferred.resolve(resp);
                         } else {
                             deferred.reject(resp);
                         }
                     }, function(error) {
                         console.warn("Error in userinfo/signup: " + error);
                         deferred.reject(error);
                     });

                 return deferred.promise;
             }

             function updatePersonalDetails(data) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + "update-personal-details";
                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         if (resp.MemberId) {
                             lyUserCacheFactory.remove('UserData');
                             lyUserCacheFactory.put('UserData', resp);

                             console.log("%c userinfo/update-personal-details: ", "color: red");
                             console.log(resp);
                             deferred.resolve(resp);
                         } else {
                             deferred.reject(resp);
                         }
                     }, function(error) {
                         console.warn("Error in userinfo/update-personal-details: " + error);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             }

             function updateUserPassword(data) {
                 var deferred = $q.defer();

                 var url = lyConstants.lyApiDefinitions.userinfo + "update-password";
                 if (!data.MemberId) {
                     data.MemberId = getUserMemberId();
                 }
                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         console.log("%c userinfo/update-password: ", "color: red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in userinfo/update-password: " + error);
                         deferred.reject('There was an error');
                     })

                 return deferred.promise;
             }

             function getUserSessionId() {
                 var userData = lyUserCacheFactory.get('UserData');
                 return userData.UserSessionId ? userData.UserSessionId : userData.Result.UserSessionId;
             }

             function getUserMemberId() {
                 if (factory.isLogin) {
                     return lyUserCacheFactory.get('UserData').MemberId;
                 }

                 return 0;
             }

             function setDefaultCreditCard(paymentId) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.userinfo + 'set-default-credit-card';
                 var params = {
                     "MemberId": getUserMemberId(),
                     "Id": paymentId
                 };

                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         console.log('%c userinfo/set-default-credit-card: ', "color: red");
                         console.log(resp);
                         deferred.resolve(resp);
                     }, function(error) {
                         console.warn("Error in userinfo/set-default-credit-card: " + error);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             }

             function addWithdraw(data) {
                 var deferred = $q.defer();
                 var url = lyConstants.lyApiDefinitions.cashier + 'add-member-withdraw';
                 data.MemberId = getUserMemberId();

                 lyAppHttpService.post(url, data)
                     .then(function(resp) {
                         if (!Array.isArray(resp)) {
                             console.log('%c cashier/add-member-withdraw: ', "color: red");
                             console.log(resp);
                             deferred.resolve(resp);
                         } else {
                             console.log('%c cashier/add-member-withdraw: ', "color: red", resp[0].ErrorMessage);
                             deferred.reject(resp[0].ErrorMessage);
                         }
                     }, function(error) {
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             }

             function getDepositData(amountToDeposit) {
                 if (typeof(amountToDeposit) === 'undefined') {
                     amountToDeposit = 0;
                 }

                 var paymentMethodId = lyCart.getPaymentMethodId();

                 if (typeof(paymentMethodId) === 'undefined' || paymentMethodId == null || paymentMethodId === "") {
                     paymentMethodId = 0;
                 }

                 var data = {
                     MemberId: getUserMemberId(),
                     SessionId: getUserSessionId(),
                     PaymentMethodId: paymentMethodId,
                     Amount: amountToDeposit,
                     ProcessorApi: lyCart.getProcessor(),
                     PhoneOrEmail: lyCart.getPhoneOrEmail()
                 };

                 return data;
             }

             function getCountryCode() {
                 var deferred = $q.defer();
                 var ip = lyConstants.ipAddress;

                 if (ip == '127.0.0.1') {
                     ip = '84.21.203.106';
                 }

                 var countryCode = $cookies.get(ip);

                 if (countryCode) {
                     countryCode = countryCode.replace(/['"]+/g, '');
                     deferred.resolve(countryCode);
                 } else {
                     geoip2.country(function(location) {
                         var cookieExp = new Date();
                         cookieExp.setDate(cookieExp.getDate() + 7);
                         $cookies.putObject(location.traits.ip_address, location.country.iso_code, { expires: cookieExp });
                         deferred.resolve(location.country.iso_code);
                     }, function(error) {
                         console.warn("Error in geoip2.country: " + error);
                         deferred.reject(error);
                     });
                 }

                 return deferred.promise;
             }
             function insertFreeTicket(memberId) {
                 var deferred = $q.defer();

                 var url = lyConstants.lyApiDefinitions.playlottery + "insert-member-free-product";
                 var params = {
                     "MemberId": memberId
                 };
                 lyAppHttpService.post(url, params)
                     .then(function(resp) {
                         if (!Array.isArray(resp)) {
                             console.log("%c playlottery/insert-member-free-product  : ", "color: red");
                             console.log(resp);
                            //  lyUserCacheFactory.put('MemberMoneyBalance', resp);
                            //  //update money balance in index.php at the Top menu
                            //  $rootScope.totalBalance = resp.AccountBalance + resp.BonusAmount + resp.WinningAmount;

                             deferred.resolve(resp);
                         } else {
                             console.warn("%c Response from userinfo/get-member-money-balance: ", "color: red", resp[0].ErrorMessage);
                             deferred.reject('There was an error');
                         }
                     }, function(error) {
                         console.warn("Error in userinfo/get-member-money-balance: " + error);
                         deferred.reject('There was an error');
                     });

                 return deferred.promise;
             }
             return factory;
         }
     ])
