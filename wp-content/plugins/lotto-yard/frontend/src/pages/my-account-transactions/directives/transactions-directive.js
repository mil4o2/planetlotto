 'use strict';

 angular.module('lyMyAccount.directives')
     .directive('lyMyAccountTransactions', [
         'lyConstants',
         'lyAppTranslationService',
         'lyMyAccountUserService',
         'anchorSmoothScroll',
         function(
             lyConstants,
             lyAppTranslationService,
             lyMyAccountUserService,
             anchorSmoothScroll
         ) {
             return {
                 restrict: 'A',
                 scope: {
                     transactions: '='
                 },
                 templateUrl: lyConstants.partialPath + 'my-account-transactions/templates/my-account-transactions.html',
                 link: function(scope) {
                     lyAppTranslationService.getTranslations(scope);
                     scope.filtersOptions = [{
                         value: [''],
                         text: 'All'
                     }, {
                         value: ['deposit'],
                         text: "Deposit"
                     }, {
                         value: ['charged'],
                         text: "Purchase"
                     }, {
                         value: ['win'],
                         text: "Winnings"
                     }, {
                         value: ['bonus'],
                         text: "Bonus"
                     }, {
                         value: ['chb', 'ref'],
                         text: 'Withdrawals'
                     }];

                     var dateNow = new Date();

                     scope.sinceMenu = [{
                         period: {
                             from: new Date(Date.UTC(dateNow.getFullYear(), dateNow.getMonth() - 1, dateNow.getDate())),
                             to: new Date()
                         },
                         text: 'Last Month'
                     }, {
                         period: {
                             from: new Date(dateNow.setDate(dateNow.getDate() - dateNow.getDay() + 1)),
                             to: new Date()
                         },
                         text: 'This Week'
                     }, {
                         period: {
                             from: new Date(Date.UTC(dateNow.getFullYear(), 0, 1)),
                             to: new Date()
                         },
                         text: 'This Year'
                     }, {
                         period: {
                             from: new Date(Date.UTC(dateNow.getFullYear() - 1, 0, 1)),
                             to: new Date(Date.UTC(dateNow.getFullYear() - 1, 12, 0)),
                         },
                         text: 'Last Year'
                     }, {
                         period: '',
                         text: 'Custom'
                     }];

                     scope.itemsPerPage = lyConstants.transactionItemsPerPage;
                     scope.since = scope.sinceMenu[0];
                     scope.currentPage = 1;

                     scope.filters = {
                         type: scope.filtersOptions[0].value,
                         itemsCount: scope.itemsPerPage[0],
                         period: scope.sinceMenu[0].period
                     }

                    scope.gotoElement = function (eID){
                        anchorSmoothScroll.scrollTo(eID);
                    };
                    //set initial values for filters
                    scope.fillterBy = scope.filtersOptions[0].text;
                    scope.sinceBy = scope.sinceMenu[0].text;
                    scope.itemsBy =  scope.itemsPerPage[0];
                     scope.changeDatePeriod = function(since, sortOption) {
                         if (sortOption) {
                             scope.filters.type = sortOption.value;
                             scope.fillterBy = sortOption.text;
                         }
                         if (since.text) {
                             scope.sinceBy = since.text
                         }
                         scope.isCustom = since.period == "" ? true : false;
                         if (scope.isCustom) {
                             scope.currentPage = 1;
                         } else {
                             var dates = since.period;
                             scope.filters.period = {
                                 from: new Date(dates.from),
                                 to: new Date(dates.to)
                             };
                         }

                         scope.changePage(scope.currentPage);
                     }

                     scope.changePage = function(page, itemsCount) {
                         if (itemsCount) {
                             scope.filters.itemsCount = itemsCount;
                             scope.itemsBy = itemsCount;
                         }
                         var pageSize = parseInt(scope.filters.itemsCount);
                         var type = scope.filters.type;
                         var startDate = scope.filters.period.from;
                         var endDate = scope.filters.period.to;

                         lyMyAccountUserService.getTransactions(page, pageSize, type, startDate, endDate)
                             .then(function(resp) {
                                 scope.gotoElement('my-transactions');
                                 scope.transactions = resp;
                             }, function(error) {})
                     }

                     // Datepickers Settings:
                     scope.format = 'dd/MM/yyyy';

                     scope.popupFrom = {
                         opened: false
                     };

                     scope.popupTo = {
                         opened: false
                     };

                     scope.dateOptionsFrom = {
                         dateDisabled: disabled,
                         formatYear: 'yy',
                         maxDate: new Date(),
                         startingDay: 1
                     };

                     scope.dateOptionsTo = {
                         dateDisabled: disabled,
                         formatYear: 'yy',
                         maxDate: new Date(),
                         startingDay: 1
                     };

                     scope.openPicker = function(picker) {
                         if (scope.isCustom) {
                             scope.popupFrom.opened = picker == "from" ? true : false;
                             scope.popupTo.opened = picker == "to" ? true : false;
                         }
                     }

                     function disabled(data) {
                         var date = data.date,
                             mode = data.mode;
                         return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                     }
                 }
             }
         }
     ])
