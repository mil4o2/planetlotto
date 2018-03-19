 'use strict';

 angular.module('lyMyAccount')
     .controller('IndexMyAccountCtrl', [
         '$scope',
         'lyAppTranslationService',
         '$rootScope',
         'lyMyAccountUserService',
         'lyCart',
         'lyUserCacheFactory',
         'lyCart.utility',
         'lyApp.utility',
         'lyConstants',
         '$uibModal',
         '$timeout',
         '$window',
         function(
             $scope,
             lyAppTranslationService,
             $rootScope,
             lyMyAccountUserService,
             lyCart,
             lyUserCacheFactory,
             lyCartUtility,
             lyAppUtility,
             lyConstants,
             $uibModal,
             $timeout,
             $window
         ) {
             $scope.showLoginLoader = false;
             $scope.forgotPasswordLoader = false;

             var currentYear = new Date().getFullYear();
             var legalAgeOfPlay = currentYear - 18;

             $scope.daysInMonth = lyCartUtility.makeArrayOfNumbers(lyCartUtility.daysInMonth(1, currentYear));
             $scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
             $scope.birthdayYears = new Array(90).join().split(',').map(function(item, index) {
                 return (legalAgeOfPlay - index);
             });

             $scope.user = {
                 birthday: {}
             };
             $scope.registrationBday;

             $scope.translation = lyConstants.translationObject;

            //  console.log($stateParams);
             /*
             //facebook login

             function statusChangeCallback(response) {
                 if (response.status === 'connected') {
                     facebookService.getUserData()
                         .then(function(resp) {

                             var user = {
                                 Uid: resp.id,
                                 FirstName: resp.first_name,
                                 LastName: resp.last_name,
                                 IsMale: resp.gender == "male" ? true : false,
                                 Email: resp.email
                             };

                         }, function(error) {

                         })

                 } else {
                     FB.login(function(response) {
                         if (response.authResponse && response.authResponse.userID) {
                             statusChangeCallback(response);
                         }
                     });
                 }
             }

             $scope.checkLoginState = function() {
                 FB.getLoginStatus(function(response) {
                     statusChangeCallback(response);
                 });
             };

             */

             $scope.closeModal = function() {
                 $rootScope.modalInstance.dismiss('cancel');
             };


             $scope.updateUserBirthdayDate = function(value, option) {
                 $scope.user.birthday[option] = value;
                 console.log($scope.user.birthday);
             }

             $scope.forgotPasswordModal = function() {

                 $scope.closeModal();
                 $rootScope.modalInstance = $uibModal.open({
                     animation: true,
                     templateUrl: lyConstants.partialPath + 'common/templates/ly-forgot-password.html',
                     windowClass: 'ly-login-modal',
                     backdrop: 'static',
                     controller: 'IndexMyAccountCtrl'
                 })
             };
             $scope.registerModal = function() {
                 $scope.closeModal();
                 $rootScope.$emit("CallSignUpModal", {});

             };
            $scope.$watch('user.email', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.errorMessage = '';
                    $scope.successMessage = '';
                }
            })
             $scope.forgotPassword = function(userEmail) {
                 $scope.forgotPasswordLoader = true;
                 lyMyAccountUserService.sendResetPassword(userEmail).then(function(resp) {

                         if (resp == "Member not found") {
                             $scope.errorMessage = lyAppTranslationService.getErrorMessage(resp);
                         } else if (resp == "Email sent") {
                             $scope.successMessage = lyAppTranslationService.getErrorMessage(resp);
                         }
                             $scope.forgotPasswordLoader = false;
                             return;
                     },
                     function(error) {
                         $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                     });
             };

             $scope.verifyResetPasswordLinkWithOutput = function(token) {
                 lyMyAccountUserService.verifyResetPasswordLinkWithOutput(token).then(function(resp) {
                         console.log(resp);
                     },
                     function(error) {
                         $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                     });
             };

             $scope.signin = function($event, user) {
                 delete user.birthday;
                 $scope.errorMessage = undefined;
                 $scope.showLoginLoader = true;
                 user.CountryCode = lyConstants.countryCode;
                 lyMyAccountUserService.signIn(user).then(function(resp) {
                         $scope.showLoginLoader = false;
                         $rootScope.userName = resp.FirstName + " " + resp.LastName;
                         $rootScope.userInfo = resp;
                         $rootScope.memberId = resp.MemberId;

                         lyMyAccountUserService.getMemberMoneyBalanceByMemberId().then(function(resp) {
                             $rootScope.userBalance = resp;
                             $rootScope.$broadcast('balanceUpdated');
                         });

                         if ($rootScope.modalInstance) {
                             $rootScope.modalInstance.dismiss('cancel');
                         }

                         lyMyAccountUserService.clearPersonalInfo();
                     },
                     function(error) {
                         $scope.showLoginLoader = false;
                         $scope.errorMessage = lyAppTranslationService.getErrorMessageByKey(error);
                     });
             };
             $scope.signUp = function($event, user) {
                 $scope.showLoginLoader = true;
                 delete $scope.errorMessage;
                 var splitedName = user.fullname.split(' ');
                 user.firstName = splitedName[0];
                 if (splitedName.length > 1) {
                     user.lastName = splitedName[1];
                 }

                 user.birthday.month = $scope.registrationBday - 1;
                 user.birthday.day = $scope.registrationBdayDay + 1;
                 user.affiliateId = lyCart.getAffiliateCode();
                 user.CountryCode = lyConstants.countryCode;

                 lyMyAccountUserService.signUp(user).then(function(resp) {
                        var memberId = resp.MemberId;
                         $scope.showLoginLoader = false;
                         if (resp == "Email already exists.") {
                             $scope.errorMessage = lyAppTranslationService.getErrorMessage(resp);
                             return;
                         }

                         if ($rootScope.modalInstance) {
                             $rootScope.modalInstance.close(resp);
                         }

                         $rootScope.userName = resp.FirstName + " " + resp.LastName;
                         $rootScope.userInfo = resp;
                         $rootScope.memberId = resp.MemberId;

                         lyMyAccountUserService.insertFreeTicket(memberId).then(function(resp) {
                         });

                         lyMyAccountUserService.getMemberMoneyBalanceByMemberId().then(function(resp) {
                             $rootScope.userBalance = resp;
                         });
                     },
                     function(error) {
                         debugger
                         $scope.showLoginLoader = false;
                         $scope.errorMessage = lyAppTranslationService.getErrorMessage(error);
                     });
             };

             //  $scope.checkForErr = function() {
             //      var hasErr;
             //      var isCorr;
             //      $timeout(function() {
             //          var hasErr = angular.element('.birthdate').find('.select-box-arrow').hasClass('has-error');
             //          var isCorr = angular.element('.birthdate').find('.select-box-arrow').hasClass('has-success');
             //
             //          if (hasErr) {
             //              $scope.showErrorMsg = true;
             //          } else if (isCorr) {
             //              $scope.showErrorMsg = false;
             //          }
             //      }, 0);
             //
             //  }
            $scope.check = function($event, form) {

                if (form.phone1.$viewValue || form.phone2.$viewValue) {
                    form.phone1.$setValidity('required', true);
                    form.phone2.$setValidity('required', true);
                } else {
                    form.phone1.$setValidity('required', false);
                    form.phone2.$setValidity('required', false);
                }

                $timeout(function() {
                     var hasErr = angular.element('.birthdate').find('.select-box-arrow').hasClass('has-error');
                     var isCorr = angular.element('.birthdate').find('.select-box-arrow').hasClass('has-success');
                     if (hasErr) {
                         $scope.showErrorMsg = true;
                     } else if (isCorr) {
                         $scope.showErrorMsg = false;
                     }
                }, 10);
             }
             $scope.openLoginForm = function() {
                 $rootScope.modalInstance.dismiss('cancel');
                 $rootScope.modalInstance = $uibModal.open({
                     animation: true,
                     templateUrl: lyConstants.partialPath + 'common/templates/ly-login-form.html',
                     windowClass: 'ly-login-modal',
                     controller: 'IndexMyAccountCtrl'
                 });
             };

             //  $scope.$on('$viewContentLoaded', function() {
             //      userService.getProducts(1);
             //      userService.getTickets(1);
             //  });
         }
     ]);
