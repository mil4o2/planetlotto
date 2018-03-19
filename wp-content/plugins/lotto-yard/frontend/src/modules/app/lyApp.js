lySite = typeof lySite === 'undefined' ? {} : lySite;

lySite.init = function() {

    $ = jQuery; // TODO fix

    'use strict';

    angular.module('lyApp', [
            'ui.router',

            'angular-svg-round-progressbar',
            'angularCharts',
            'countTo',

            'ngSanitize',
            'ngIntlTelInput',

            'slickCarousel',
            'jcs-autoValidate',

            'ngAnimate',
            'angular-loading-bar',
            'anim-in-out',
            'alexjoffroy.angular-loaders',

            'lyCacheModule',

            'lyApp.services',
            'lyApp.directives',
            'lyApp.utilities',
            'lyApp.filters',
            'lyApp.constants',

            'lyMyAccount',
            'lyMyAccount.services',

            'lyCart',
            'lyPlayPage'
        ])
        .config([
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider',
            '$urlMatcherFactoryProvider',
            '$lyCartProvider',
            'ngIntlTelInputProvider',
            '$lyMyAccountProvider',
            'cfpLoadingBarProvider',
            '$httpProvider',
            'lyConstants',
            function(
                $stateProvider,
                $urlRouterProvider,
                $locationProvider,
                $urlMatcherFactoryProvider,
                $lyCartProvider,
                ngIntlTelInputProvider,
                $lyMyAccountProvider,
                cfpLoadingBarProvider,
                $httpProvider,
                lyConstants
            ) {
                $lyMyAccountProvider.set({
                    partialPath: lyConstants.partialPath,
                    apiUrl: lyConstants.apiUrl,
                    paymentSystems: lyConstants.paymentSystems,
                    currency: lyConstants.currency
                });

                //cfpLoadingBarProvider.includeSpinner = false;
                //cfpLoadingBarProvider.spinnerTemplate = '<div class="wrap-loading-spinner"><span class="loading-spinner"></span></div>';

                ngIntlTelInputProvider.set({
                    initialCountry: 'auto',
                    customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
                        return "+" + selectedCountryData.dialCode;
                    },
                    geoIpLookup: function(callback) {
                        callback(lyConstants.countryCode);
                    }
                });

                $lyCartProvider.set(lyConstants);

                // $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

                $locationProvider.html5Mode(true);
                $urlMatcherFactoryProvider.strictMode(false);

                $urlRouterProvider.otherwise(function($injector, $location) {
                    $injector.invoke(['$state', function($state) {
                        $state.go('ErrorPage', {
                            errorType: 'error_page_not_found'
                        });
                    }]);
                });

                $urlRouterProvider.rule(function($injector, $location) {
                    var path = $location.path();
                    var hasTrailingSlash = path[path.length - 1] === '/';
                    if (!hasTrailingSlash) {
                        return path + '/';
                    }
                });

                // Now set up the states
                $stateProvider
                    .state('squickpick', {
                        url: '/squickpick/:lotteryname/personal/:lines/:draws/:subscription/:bta/',
                        resolve: {
                            lyApiData: ['lyCartService', function(lyCartService) {
                                return lyCartService.getLotteryAndProductDataCart();
                            }]
                        },
                        controller: 'SQuickpickCtrl'
                    })
                    .state('quickpick', {
                        url: '/quickpick',
                        abstract: true,
                        resolve: {
                            lyApiData: ['lyCartService', function(lyCartService) {
                                return lyCartService.getLotteryAndProductDataCart();
                            }]
                        },
                        template: "<ui-view/>"
                    })
                    .state('quickpick.olap', {
                        url: "/:hash/:affiliate",
                        controller: 'QuickpickOlapCtrl'
                    })
                    .state('quickpick.raffle', {
                        url: "/:raffle/raffle/:shares/:ticket/:promocode/:bta/",
                        controller: 'QuickpickRaffleCtrl'
                    })
                    .state('quickpick.personal', {
                        url: "/:lotteryname/personal/:lines/:draws/:subscription/:promocode/:bta/",
                        controller: 'QuickpickPersonalCtrl'
                    })
                    .state('quickpick.personal-numbers', {
                        url: "/:lotteryname/personal/:draws/:subscription/:promocode/:bta/:sn/",
                        controller: 'QuickpickPersonalCtrl'
                    })
                    .state('quickpick.top-personal', {
                        url: "/top-personal/:lines/:draws/:subscription/:promocode/:bta/",
                        controller: 'QuickpickPersonalCtrl'
                    })
                    .state('quickpick.top-group', {
                        url: "/top-group/:shares/:draws/:subscription/:promocode/:bta/",
                        controller: 'QuickpickGroupCtrl'
                    })
                    .state('quickpick.group', {
                        url: "/:lotteryname/group/:shares/:draws/:subscription/:promocode/:bta/",
                        controller: 'QuickpickGroupCtrl'
                    })
                    .state('HomePage', {
                        url: '/?m&s/:sysSessionID',
                        resolve: {
                            autoLogin: ['lyMyAccountUserService', '$stateParams', function(lyMyAccountUserService, $stateParams) {
                                if($stateParams.sysSessionID){
                                    return lyMyAccountUserService.autoSignIn($stateParams.sysSessionID);
                                }
                            }],
                            pageContent: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + 'home-page');
                            }],
                            lyApiData: ['lyCartService', function(lyCartService) {
                                return lyCartService.getLotteryAndProductDataCart();
                            }],
                            testimonials: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAllTestimonials);
                            }],
                            lotteriesResults: ['lyAppLotteriesService', function(lyAppLotteriesService) {
                                return lyAppLotteriesService.getLotteriesResults();
                            }]
                        },
                        onEnter: ['stateHelper', 'lyApiData', 'autoLogin', function(stateHelper, lyApiData, autoLogin) {
                            if (!(lyApiData.LotteryRules instanceof Array) || lyApiData.LotteryRules.length == 0) {
                                stateHelper.goToErrorMaintenance();
                            }

                        }],
                        templateUrl: lyConstants.partialPath + 'home/templates/home-page-template.html',
                        controller: 'HomePageCtrl'
                    })
                    .state('ContactPage', {
                        url: '/contact-us',
                        resolve: {
                            pageContent: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName  + "contact-us");
                            }],
                            lyApiData: ['lyCartService', function(lyCartService) {
                                return lyCartService.getLotteryAndProductDataCart();
                            }]
                        },
                        onEnter: ['stateHelper', 'lyApiData', function(stateHelper, lyApiData) {
                            if (!(lyApiData.LotteryRules instanceof Array) || lyApiData.LotteryRules.length == 0) {
                                stateHelper.goToErrorMaintenance();
                            }
                        }],
                        templateUrl: lyConstants.partialPath + 'contact/templates/contact-template.html',
                        controller: 'ContactPageCtrl'
                    })
                    .state('AutoLogin', {
                        url: '/autologin/:bta/:sessionId/:brandid/',
                        resolve: {
                            autoLogin: ['lyMyAccountUserService', '$stateParams', function(lyMyAccountUserService, $stateParams) {
                                return lyMyAccountUserService.autoSignIn($stateParams.sessionId);
                            }]
                        },
                        onEnter: ['$rootScope', 'autoLogin', 'stateHelper', function($rootScope, autoLogin, stateHelper) {
                            if (autoLogin.MemberId) {
                                $rootScope.userInfo = autoLogin;
                                $rootScope.userName = autoLogin.FirstName;
                            }

                            stateHelper.goToHomePage();
                        }]
                    })
                    .state('myAccountPage', {
                        url: '/' + lyConstants.myAccountPageSlug,
                        authenticate: true,
                        abstract: true,
                        params: {
                            withdraw: null
                        },
                        resolve: {
                            pageContent: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + 'home-page');
                            }],
                            lyMyAccoutContentACFData: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAcfOptions);
                            }]
                        },
                        templateUrl: lyConstants.partialPath + 'my-account/templates/sidebar.html',
                        controller: 'MyAccountPageCtrl'
                    })
                    .state('blog', {
                        url: '/' + lyConstants.blogPageSlug,
                        abstract: true,
                        resolve: {
                            allCategories: ['lyAppHttpService', 'lyConstants', function(lyAppHttpService, lyConstants) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAllCategories);
                            }],
                            allTags: ['lyAppHttpService', 'lyConstants', function(lyAppHttpService, lyConstants) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAllTags);
                            }],
                            testimonials: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAllTestimonials);
                            }],
                            draws: ['lyAppLotteriesService', function(lyAppLotteriesService) {
                                return lyAppLotteriesService.getAllBrandDraws();
                            }],
                            lyApiData: ['lyCartService', function(lyCartService) {
                                return lyCartService.getLotteryAndProductDataCart();
                            }]
                        },
                        onEnter: ['stateHelper', 'lyApiData', function(stateHelper, lyApiData) {
                            if (!(lyApiData.LotteryRules instanceof Array) || lyApiData.LotteryRules.length == 0) {
                                stateHelper.goToErrorMaintenance();
                            }
                        }],
                        template: "<ui-view/>"
                    })
                    .state('blog.blogPage', {
                        url: '/',
                        resolve: {
                            pageContent: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + lyConstants.blogPageSlug);
                            }],
                            allBlogs: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAllPosts)
                            }],
                        },
                        onEnter: ['stateHelper', 'pageContent', function(stateHelper, pageContent) {
                            if (!(pageContent.data instanceof Array) || pageContent.data.length == 0) {
                                stateHelper.goToErrorNotFound();
                            }
                        }],
                        templateUrl: lyConstants.partialPath + 'blog/templates/blog-template.html',
                        controller: 'BlogPageCtrl'
                    })
                    .state('blog.blogCategoriesPage', {
                        url: '/category/:slug?/',
                        params: {
                            id: null
                        },
                        resolve: {
                            pageContent: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + lyConstants.blogPageSlug);
                            }],
                            allBlogs: ['lyAppHttpService', '$stateParams', function(lyAppHttpService, $stateParams) {
                                if ($stateParams.id) {
                                    return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPostsByCategories + $stateParams.id);
                                }
                            }],
                        },
                        onEnter: ['stateHelper', 'pageContent', function(stateHelper, pageContent) {
                            if (!(pageContent.data instanceof Array) || pageContent.data.length == 0) {
                                stateHelper.goToErrorNotFound();
                            }
                        }],
                        templateUrl: lyConstants.partialPath + 'blog/templates/blog-template.html',
                        controller: 'BlogPageCtrl'
                    })
                    .state('blog.blogTagsPage', {
                        url: '/tag/:slug?/',
                        params: {
                            id: null
                        },
                        resolve: {
                            pageContent: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + lyConstants.blogPageSlug);
                            }],
                            allBlogs: ['lyAppHttpService', '$stateParams', function(lyAppHttpService, $stateParams) {
                                if ($stateParams.id) {
                                    return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPostsByTags + $stateParams.id);
                                }
                            }],
                        },
                        onEnter: ['stateHelper', 'pageContent', function(stateHelper, pageContent) {
                            if (!(pageContent.data instanceof Array) || pageContent.data.length == 0) {
                                stateHelper.goToErrorNotFound();
                            }
                        }],
                        templateUrl: lyConstants.partialPath + 'blog/templates/blog-template.html',
                        controller: 'BlogPageCtrl'
                    })
                    .state('blog.singleBlogPage', {
                        url: "/:blogSlug?/",
                        resolve: {
                            pageContent: ['lyAppHttpService', '$stateParams', 'lyConstants', function(lyAppHttpService, $stateParams, lyConstants) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getSinglePostByName + $stateParams.blogSlug);
                            }],
                            blogPage: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + lyConstants.blogPageSlug);
                            }],
                            allBlogs: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAllPosts)
                            }],
                        },
                        onEnter: ['stateHelper', 'pageContent', function(stateHelper, pageContent) {
                            if (!(pageContent.data instanceof Array) || pageContent.data.length == 0) {
                                stateHelper.goToErrorNotFound();
                            }
                        }],
                        templateUrl: lyConstants.partialPath + 'single-blog/single-blog.html',
                        controller: 'SingleBlogCtrl'
                    })
                    /*
                    //TODO
                    .state('PromotionsPage', {
                        url: '/' + lyConstants.promotionsPageSlug,
                        resolve: {
                            pageContent: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + lyConstants.promotionsPageSlug);
                            }],
                            draws: ['lyAppLotteriesService', function(lyAppLotteriesService) {
                                return lyAppLotteriesService.getAllBrandDraws();
                            }],
                        },
                        templateUrl: lyConstants.partialPath + 'promotions/templates/promotions-template.html',
                        controller: 'PromotionsPageCtrl'
                    })
                    .state('SinglePromotionPage', {
                        url: '/' + lyConstants.promotionsPageSlug + '/:promotionId?/',
                        resolve: {
                            promotionContent: ['lyAppHttpService', '$stateParams', function(lyAppHttpService, $stateParams) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getSinglePromotionByName + $stateParams.promotionId);
                            }],
                            draws: ['lyAppLotteriesService', function(lyAppLotteriesService) {
                                return lyAppLotteriesService.getAllBrandDraws();
                            }],
                        },
                        onEnter: ['stateHelper', 'promotionContent', function(stateHelper, promotionContent) {
                            if (!(promotionContent.data instanceof Array) || promotionContent.data.length == 0) {
                                stateHelper.goToErrorMaintenance();
                            }
                        }],
                        templateUrl: lyConstants.partialPath + 'single-promotion/single-promotion.html',
                        controller: 'SinglePromotionsPageCtrl'
                    })
                    */
                    .state('ThankYouPage', {
                        url: '/' + lyConstants.thankYouPageSlug + '/:pmc/:sessionid/:deposit/:contactUs',
                        params: {
                            pmc: null,
                            sessionid: null,
                            deposit: null,
                            contactUs: null
                        },
                        resolve: {
                            pageContent: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + lyConstants.thankYouPageSlug);
                            }],
                            purchaseItems: ['lyMyAccountUserService', '$stateParams', function(lyMyAccountUserService, $stateParams) {
                                if ($stateParams.pmc && $stateParams.pmc > 0) {
                                    return lyMyAccountUserService.getMemberPurchaseCompleteDetails($stateParams.pmc);
                                }
                            }]
                        },
                        onEnter: ['$stateParams', 'stateHelper', 'pageContent', function($stateParams, stateHelper, pageContent) {
                            debugger
                            if ($stateParams.pmc == 0 && $stateParams.sessionid == null && $stateParams.deposit == null ) {
                                debugger
                                stateHelper.goToHomePage();
                            }
                            if (!(pageContent.data instanceof Array) || pageContent.data.length == 0) {
                                stateHelper.goToErrorNotFound();
                            }
                        }],
                        templateUrl: lyConstants.partialPath + 'thank-you-page/templates/thank-you-template.html',
                        controller: 'ThankYouPageCtrl'
                    })
                    .state('PlayPage', {
                        url: "/" + lyConstants.selectPageSlug + "/:lotteryname?/",
                        resolve: {
                            pageContent: ['lyAppHttpService', '$stateParams', function(lyAppHttpService, $stateParams) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + $stateParams.lotteryname)
                            }],
                            lyApiData: ['lyCartService', function(lyCartService) {
                                return lyCartService.getLotteryAndProductDataCart();
                            }],
                        },
                        onEnter: ['stateHelper', 'lyApiData', '$stateParams', 'pageContent', function(stateHelper, lyApiData, $stateParams, pageContent) {
                            if ($stateParams.lotteryname == "") {
                                stateHelper.goToHomePage();
                            }

                            if (!(pageContent.data instanceof Array) || pageContent.data.length == 0) {
                                stateHelper.goToErrorNotFound();
                            }

                            if (!(lyApiData.LotteryRules instanceof Array) || lyApiData.LotteryRules.length == 0) {
                                stateHelper.goToErrorMaintenance();
                            }
                        }],
                        templateUrl: lyConstants.partialPath + 'select-page/templates/select-template.html',
                        controller: 'PlayPageCtrl'
                    })
                    .state('ErrorPage', {
                        url: '/error',
                        params: {
                            errorType: null
                        },
                        resolve: {
                            lyErrorPageData: ['lyAppHttpService', function(lyAppHttpService) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAcfOptions);
                            }],
                            lyApiData: ['lyCartService', '$stateParams', function(lyCartService, $stateParams) {
                                if ($stateParams.errorType != "error_maintenance") {
                                    return lyCartService.getLotteryAndProductDataCart();
                                }
                                return;
                            }],
                        },
                        templateUrl: lyConstants.partialPath + 'error/templates/ly-error-template.html',
                        controller: 'ErrorCtrl'
                    })
                    .state('DefaultPage', {
                        url: "/:pageslug/:pageslug2?/",
                        params: {
                            billing: null
                        },
                        resolve: {
                            pageContent: ['lyAppHttpService', '$stateParams', function(lyAppHttpService, $stateParams) {
                                return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getPageByName + ($stateParams.pageslug2 ? $stateParams.pageslug2 : $stateParams.pageslug));
                            }],
                            lyApiData: ['lyCartService', function(lyCartService) {
                                return lyCartService.getLotteryAndProductDataCart();
                            }],
                            raffleNumbers: ['lyAppProductsServices', '$stateParams', function(lyAppProductsServices, $stateParams) {
                                var productData = lyAppProductsServices.getProductAndLotteryIds($stateParams.pageslug2 ? $stateParams.pageslug2 : $stateParams.pageslug);
                                return productData ? lyAppProductsServices.getRaffleNumbers(productData.id) : undefined;
                            }],
                            resetPasswordToken: ['$stateParams', 'lyMyAccountUserService', '$location', function($stateParams, lyMyAccountUserService, $location) {
                                if ($stateParams.pageslug == 'reset-password') {
                                    var token = '?lang=' + lyConstants.currentLanguage + '&' + $location.$$url.split("/?")[1];

                                    return lyMyAccountUserService.verifyResetPasswordLinkWithOutput(token);
                                }
                            }]
                        },
                        onEnter: ['pageContent', 'raffleNumbers', '$stateParams', 'stateHelper', 'resetPasswordToken', 'lyMyAccountUserService', 'lyCart', '$location', '$uibModal', '$rootScope',
                            function(pageContent, raffleNumbers, $stateParams, stateHelper, resetPasswordToken, lyMyAccountUserService, lyCart, $location, $uibModal, $rootScope) {

                                if ($stateParams.pageslug == 'signup') {
                                    debugger
                                    $rootScope.modalInstance = $uibModal.open({
                                        animation: true,
                                        templateUrl: lyConstants.partialPath + 'common/templates/ly-signup-form.html',
                                        windowClass: 'ly-sign-up-modal',
                                        backdrop: 'static',
                                        controller: 'IndexMyAccountCtrl'
                                    });
                                    stateHelper.goToHomePage();
                                }

                                if ($stateParams.pageslug == 'signin' && !lyMyAccountUserService.isLogin) {
                                    $rootScope.modalInstance = $uibModal.open({
                                        animation: true,
                                        templateUrl: lyConstants.partialPath + 'common/templates/ly-login-form.html',
                                        windowClass: 'ly-login-modal',
                                        backdrop: 'static',
                                        controller: 'IndexMyAccountCtrl'
                                    });
                                    stateHelper.goToHomePage();
                                }

                                if ($stateParams.pageslug2 == lyConstants.billingPageSlug && $stateParams.billing != true) {
                                    (!lyCart.getItems().length) ? stateHelper.goToHomePage(): stateHelper.goToCartPage();
                                }

                                if (resetPasswordToken && resetPasswordToken[0] && resetPasswordToken[0]['ErrorMessage']) {
                                    stateHelper.goToHomePage();
                                } else if ($stateParams.pageslug == 'reset-password') {
                                    $stateParams.verifyedUser = resetPasswordToken;
                                }

                                if (!(pageContent.data instanceof Array) || pageContent.data.length == 0) {
                                    if ($stateParams.pageslug != 'signup' && $stateParams.pageslug != 'signin') {
                                        stateHelper.goToErrorNotFound();
                                    }
                                }
                                if (raffleNumbers == "Not more tickets to sold") {
                                    stateHelper.goToHomePage();
                                }
                            }
                        ],
                        templateUrl: function(element) {
                            var tempUrl = 'common/templates/default-template';

                            if (lyConstants.pageTemplates[element.pageslug2 ? element.pageslug2 : element.pageslug]) {
                                tempUrl = lyConstants.pageTemplates[element.pageslug2 ? element.pageslug2 : element.pageslug];
                            }

                            return lyConstants.partialPath + tempUrl + '.html';
                        },
                        controller: 'DefaultPageCtrl'
                    })
            }
        ])
        .run([
            '$rootScope',
            'defaultErrorMessageResolver',
            'lyAppTranslationService',
            'lyMyAccountUserService',
            '$templateCache',
            '$document',
            'lyConstants',
            'stateHelper',
            function($rootScope,
                defaultErrorMessageResolver,
                lyAppTranslationService,
                lyMyAccountUserService,
                $templateCache,
                $document,
                lyConstants,
                stateHelper
            ) {
                defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
                    angular.forEach(lyAppTranslationService.getErrorMessages(), function(value, key) {
                        errorMessages[key] = value;
                    })
                });

                $rootScope.$on('animStart', function($event, element, speed) {
                    $('.shell').removeClass('shell-fade-in');
                    $('.loader').show();
                });

                $rootScope.$on('animEnd', function($event, element, speed) {
                    $('.loader').hide();
                    $('.shell').addClass('shell-fade-in');
                });

                $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
                    if (lyMyAccountUserService.isLogin) {
                        lyMyAccountUserService.getMemberMoneyBalanceByMemberId()
                            .then(function(resp) {
                                $rootScope.userBalance = resp;
                            }, function() {
                                stateHelper.goToErrorMaintenance();
                            });
                    }

                    // console.clear();
                    console.log('%c AngularJS - Version ' + angular.version.full, 'color: red; font-size: 18px');

                    console.log('$stateChangeStart to ' + toState.name + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
                    if (lyConstants.maintenanceMode && toState.name != 'ErrorPage') {
                        stateHelper.goToErrorMaintenance();
                        event.preventDefault();
                    }

                    if (toState.authenticate && !lyMyAccountUserService.isLogin) {
                        stateHelper.goToHomePage();
                        event.preventDefault();
                    }

                    if (toParams.pageslug == 'signin' && lyMyAccountUserService.isLogin) {
                        stateHelper.goToHomePage();
                        event.preventDefault();
                    }

                    // console.log("%c Template Cache:", "color: red");
                    // console.log($templateCache);
                    //$templateCache.removeAll();
                });

                $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
                    console.log('$stateChangeError - fired when an error occurs during transition.');
                    console.log(arguments);
                });

                $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                    $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
                    console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
                    $('.ls-wp-container').hide();
                    $('.shell').addClass('shell-fade-in'); //double case
                });

                $rootScope.$on('$viewContentLoaded', function(event) {
                    console.log('$viewContentLoaded - fired after dom rendered', event);
                });

                $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
                    console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
                    console.log(unfoundState, fromState, fromParams);
                });
            }
        ])
        .value('version', '2.5.0');
}

lySite.init();
