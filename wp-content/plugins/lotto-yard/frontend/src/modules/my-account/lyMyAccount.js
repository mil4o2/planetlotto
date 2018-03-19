angular.module('lyMyAccount', [
        'lyMyAccount.directives',
        'lyMyAccount.services',
        'lyCart.services',
        'lyApp.services',
        'ui.router',
        'angular-loading-bar',
        'ui.bootstrap',
        'ngTouch',
        'ngCookies'
    ])
    .config([
        '$stateProvider',
        'lyConstants',
        function(
            $stateProvider,
            lyConstants
        ) {
            $stateProvider
                .state('myAccountPage.profile', {
                    url: '',
                    authenticate: true,
                    resolve: {
                        lyMyAccoutContentACFData: ['lyAppHttpService', function(lyAppHttpService) {
                            return lyAppHttpService.getDataFromCMS(lyConstants.wpApiDefinitions.getAcfOptions);
                        }]
                    },
                    templateUrl: lyConstants.partialPath + 'my-account/templates/my-account-profile.html',
                    controller: 'MyAccountPageCtrl'
                })
                .state('myAccountPage.payment', {
                    url: '/payment',
                    authenticate: true,
                    resolve: {
                        allPaymentMethods: ['lyMyAccountUserService', function(lyMyAccountUserService) {
                            return lyMyAccountUserService.getPaymentMethod();
                        }]
                    },
                    template: '<div ly-my-account-payments></div>',
                    controller: 'PaymentCtrl'
                })
                .state('myAccountPage.transactions', {
                    url: '/transactions',
                    authenticate: true,
                    resolve: {
                        transactions: ['lyMyAccountUserService', function(lyMyAccountUserService) {
                            var dateNow = new Date();
                            var startDate = new Date(Date.UTC(dateNow.getFullYear(), dateNow.getMonth() - 1, dateNow.getDate()));
                            dateNow.setDate(dateNow.getDate() + 1);

                            return lyMyAccountUserService.getTransactions(1, 10, [''], startDate, dateNow);
                        }]
                    },
                    templateUrl: lyConstants.partialPath + 'my-account-transactions/templates/my-account-transactions-menu.html',
                    controller: 'TransactionsCtrl'
                })
                .state('myAccountPage.tickets', {
                    url: '/tickets',
                    authenticate: true,
                    resolve: {
                        tickets: ['lyMyAccountUserService', function(lyMyAccountUserService) {
                            return lyMyAccountUserService.getTickets(1);
                        }]
                    },
                    templateUrl: lyConstants.partialPath + 'my-account-tickets/templates/my-account-tickets.html',
                    controller: 'TicketsCtrl'
                })
                .state('myAccountPage.deposit', {
                    url: '/deposit',
                    authenticate: true,
                    templateUrl: lyConstants.partialPath + 'my-account-deposit/templates/my-account-deposit.html',
                    controller: 'DepositCtrl'
                })
                .state('myAccountPage.products', {
                    url: '/products',
                    authenticate: true,
                    resolve: {
                        products: ['lyMyAccountUserService', function(lyMyAccountUserService) {
                            return lyMyAccountUserService.getProducts(1);
                        }]
                    },
                    templateUrl: lyConstants.partialPath + 'my-account-products/templates/my-account-products.html',
                    controller: 'ProductsCtrl'
                })
        }
    ])
    .provider(
        '$lyMyAccount',
        function() {
            var config = {
                partialPath: "",
                apiUrl: "",
            };
            return {
                set: function(settings) {
                    config = settings;
                },
                $get: function() {
                    return config;
                }
            };
        });