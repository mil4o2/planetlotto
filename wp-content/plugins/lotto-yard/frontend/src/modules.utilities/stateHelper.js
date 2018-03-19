'use strict'

angular.module('lyApp.utilities')
    .factory('stateHelper', [
        '$state',
        '$location',
        'lyConstants',
        'lySelectPageService',
        function(
            $state,
            $location,
            lyConstants,
            lySelectPageService
        ) {
            var factory = {
                goToErrorMaintenance: goToErrorMaintenance,
                goToErrorNotFound: goToErrorNotFound,
                goToCartPage: goToCartPage,
                goToHomePage: goToHomePage,
                goToThankYouPage: goToThankYouPage,
                goToMyProfile: goToMyProfile,
                goToPlayPage: goToPlayPage,
                goToBillingPage: goToBillingPage,
                goToWithdraw: goToWithdraw,
                goToBlogByTaxonomyFilter: goToBlogByTaxonomyFilter,
                goToDepositPage: goToDepositPage
            };

            function goToErrorMaintenance() {
                return $state.go('ErrorPage', {
                    errorType: 'error_maintenance'
                });
            }

            function goToDepositPage() {
                return $state.go('myAccountPage.deposit');
            }

            function goToErrorNotFound() {
                return $state.go('ErrorPage', {
                    errorType: 'error_page_not_found'
                });
            }

            function goToCartPage() {
                return $state.go('DefaultPage', {
                    pageslug: lyConstants.cartPageSlug
                });
            }

            function goToBillingPage() {
                return $state.go('DefaultPage', {
                    pageslug: lyConstants.cartPageSlug,
                    pageslug2: lyConstants.billingPageSlug,
                    billing: true
                });
            }

            function goToHomePage() {
                return $state.go('HomePage');
            }

            function goToThankYouPage(contactUs, isDeposit, pmc, sessionId) {
                return $state.go('ThankYouPage', {
                    pmc: pmc,
                    sessionid: sessionId,
                    deposit: isDeposit,
                    contactUs: contactUs
                });
            }

            function goToMyProfile() {
                return $state.go('myAccountPage.profile');
            }

            function goToPlayPage(lotteryName, isClassicTab) {
                lySelectPageService.getLotteryRulesByName(lotteryName)
                    .then(function(resp) {
                        if (!resp) {
                            return goToErrorMaintenance();
                        }

                        lySelectPageService.setActiveTab(isClassicTab, lotteryName);

                        if(isClassicTab){
                            $location.url('/' + lyConstants.selectPageSlug + '/' + lotteryName.toLowerCase() + '/#classic');
                        }
                        else{
                            $location.path('/' + lyConstants.selectPageSlug + '/' + lotteryName.toLowerCase() + '/');
                        }

                    })
            };

            function goToWithdraw() {
                return $state.go('myAccountPage.transactions', { withdraw: "with" });
            }

            function goToBlogByTaxonomyFilter(taxonomyId, taxonomyName, taxonomyTypeIsTag) {

                var _stateName = (taxonomyTypeIsTag) ? 'blog.blogTagsPage' : 'blog.blogCategoriesPage';

                var _stateParams = {
                    id : taxonomyId,
                    slug : taxonomyName
                }

                return $state.go(_stateName, _stateParams);
            }

            return factory;
        }
    ])
