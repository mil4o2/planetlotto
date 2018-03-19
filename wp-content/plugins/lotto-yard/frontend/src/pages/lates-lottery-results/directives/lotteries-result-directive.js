'use strict'

angular.module('lyApp.directives')
    .directive('lyLotteriesResultGrid', [
        '$location',
        '$lyCart',
        'lyConstants',
        'lyAppLotteriesService',
        'lyAppTranslationService',
        'stateHelper',
        function(
            $location,
            $lyCart,
            lyConstants,
            lyAppLotteriesService,
            lyAppTranslationService,
            stateHelper
        ) {
            return {
                restrict: 'A',
                templateUrl: lyConstants.partialPath + 'lates-lottery-results/templates/lotteries-grid.html',
                link: function(scope) {
                    lyAppTranslationService.getTranslations(scope);
                    scope.sortValues = [{
                        displayName: 'Last draw',
                        value: 'DrawDate'
                    }, {
                        displayName: 'Lottery A-Z',
                        value: 'LotteryName'
                    }];
                    scope.sortBy = scope.sortValues[0];

                    scope.changeSort = function(sortType) {
                        scope.sortBy = sortType;
                        debugger
                        scope.lotteryResults.sort(function(a, b) {
                            if (sortType.value == 'DrawDate') {
                                var textA = new Date(a[sortType.value]).getTime();
                                var textB = new Date(b[sortType.value]).getTime();
                                return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
                            } else {
                                var textA = a[sortType.value];
                                var textB = b[sortType.value];
                                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                            }
                        });
                    }

                    scope.goToPlayPage = function(lotteryName) {
                        stateHelper.goToPlayPage(lotteryName, true);
                    }

                    scope.goToPastResultsPage = function(lotteryName) {
                        $location.path('/' + lotteryName.toLowerCase() + '-results/');
                    }

                    scope.goToInfoPage = function(lotteryName) {
                        $location.path('/' + lotteryName.toLowerCase() + '-info/');
                    }

                    lyAppLotteriesService.getLotteryResultsNoRaffles()
                        .then(function(resp) {
                            for (var i = 0; i < resp.length; i++) {

                                if (resp[i].LotteryTypeId == 2 || resp[i].LotteryTypeId == 1 || resp[i].LotteryTypeId == 3 || resp[i].LotteryTypeId == 14) {
                                    var date = new Date(resp[i].DrawDate).getDate();
                                    var month = new Date(resp[i].DrawDate).getMonth();
                                    var year = new Date(resp[i].DrawDate).getFullYear();
                                    date--;
                                    resp[i].DrawDate = new Date(year, month, date);
                                }
                            }
                            scope.lotteryResults = resp;
                            scope.changeSort(scope.sortBy);

                        }, function(error) {
                            console.warn('error in lyAppLotteriesService.getLotteryResultsNoRaffles', error);
                        })
                }
            }
        }
    ])
