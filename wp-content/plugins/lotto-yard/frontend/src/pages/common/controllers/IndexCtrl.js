'use strict';

angular.module('lyApp')
    .controller('IndexCtrl', [
        '$scope',
        '$state',
        '$window',
        'lyCartService',
        'lyAppHttpService',
        'lyCart',
        'lyMyAccountUserService',
        '$rootScope',
        '$uibModal',
        'lyConstants',
        'stateHelper',
        function(
            $scope,
            $state,
            $window,
            lyCartService,
            lyAppHttpService,
            lyCart,
            lyMyAccountUserService,
            $rootScope,
            $uibModal,
            lyConstants,
            stateHelper 
        ) {
            $scope.lyCart = lyCart;
            $scope.homeUrl = lyConstants.homeUrl;
            $scope.languages = lyConstants.siteLanguages;
            $scope.userService = lyMyAccountUserService;
            $scope.selectPageSlug = lyConstants.selectPageSlug;
            $scope.translation = lyConstants.translationObject;
            $scope.breadcrumb = "";
            $scope.showBreadcrumb = false;
            $scope.showMenu = false;

            lyCart.setFastProcessingTax(0.79);
            lyCart.setAffiliateCode(lyConstants.affiliateId);
            lyCart.setCurrency(lyConstants.currency);
            lyMyAccountUserService.getCountryCode()
                .then(function(countryCode) {
                    lyConstants.countryCode = countryCode;
                }, function(error) {
                    console.warn("Error in geoip2.country: " + error);
                });

            $scope.isCurrentLang = function(lang) {
                return lang === lyConstants.currentLanguage;
            };

            $scope.langRedirect = function(lang_url) {
                $window.location.replace(lyConstants.siteUrl + '/' + lang_url + '/');
            };

            $scope.loginModal = function() {
                $rootScope.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: lyConstants.partialPath + 'common/templates/ly-login-form.html',
                    windowClass: 'ly-login-modal',
                    backdrop: 'static',
                    controller: 'IndexMyAccountCtrl'
                });
            };

            $rootScope.$on("CallSignUpModal", function() {
                $scope.signupModal();
            });

            $scope.signupModal = function() {
                $rootScope.modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: lyConstants.partialPath + 'common/templates/ly-signup-form.html',
                    windowClass: 'ly-sign-up-modal',
                    controller: 'IndexMyAccountCtrl'
                });
            };

            // $scope.setPromoCode = function(code) {
            //     lyCart.setReedemCode(code);
            //     $rootScope.$broadcast('lyCart:change', {});
            // };

            $scope.clearCart = function() {
                lyCart.setAmountToPay(0);
                lyCart.setIframePaymentMethods([]);
                lyCart.setIsFastProcessing(false);
                lyCart.setPaymentMethodId(null);
                lyCart.setPhoneOrEmail(null);
                lyCart.setProcessor(null);

                $rootScope.$broadcast('lyCart:change', {});
            };

            $scope.emptyCart = function() {
                lyCart.empty();
            }

            $scope.doMagic = function(open) {
                if (open) {
                    jQuery('.cover-all').show()
                } else {
                    jQuery('.cover-all').hide()
                }
            }
            $scope.reloadRoute = function(){
                stateHelper.goToHomePageReload();
            }
        }
    ])
