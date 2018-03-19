'use strict'

angular.module('lyApp.directives')
    .directive('lyLotteryResult', [
        '$timeout',
        '$location',
        'lyConstants',
        'lyAppLotteriesService',
        'stateHelper',
        function(
            $timeout,
            $location,
            lyConstants,
            lyAppLotteriesService,
            stateHelper
        ) {
            return {
                restrict: 'A',
                templateUrl: lyConstants.partialPath + 'lottery-results/templates/single-results-directive.html',
                link: function(scope) {
                    var _ = window._;
                    var currentMonth = -1;
                    var separatedUrl = $location.url().split('-')[0];
                    scope.lotteryName = separatedUrl.substring(1);
                    scope.lotteryId = lyAppLotteriesService.getLotteryIdByLotteryName(scope.lotteryName);
                    scope.format = "dd/MM/yyyy";
                    scope.result = {
                        'drawDate': '',
                        'winningNumbers': {
                            selectedNumbers: '',
                            extraNumbers: ''
                        },
                        drawPrices: ''
                    };

                    scope.dateOptions = {
                        'showWeeks': false,
                        'year-format': "'yy'",
                        'starting-day': 1,
                        'maxDate': new Date(),
                        'dateDisabled': function(date) {
                            if (date.date.getDate() == 1 && currentMonth == -1) {
                                currentMonth = date.date.getMonth();
                            }

                            var index = _.indexOf(scope.lotteryDays, date.date.getDay());
                            var isDisabled = ((date.mode === 'day' && index == -1) || currentMonth != date.date.getMonth());

                            var today = new Date().setHours(0, 0, 0);
                            if ((currentMonth != date.date.getMonth() && currentMonth != -1) || today <= date.date) {
                                currentMonth = -1;
                            }

                            return isDisabled;
                        }
                    };

                    lyAppLotteriesService.getLotteryResultsNoRaffles()
                        .then(function(resp) {
                            scope.allLotteries = resp.map(function(current) {
                                if (current.LotteryName.toLowerCase() == scope.lotteryName) {
                                    scope.lotteryInfo = current;
                                    scope.lotteryName = current.LotteryName;
                                }

                                return current.LotteryName;
                            });
                        }, function(error) {
                            stateHelper.goToErrorMaintenance();
                        });

                    lyAppLotteriesService.getLotteriesLastResultsByBrand()
                        .then(function(resp) {
                            if (!Array.isArray(resp)) {
                                return;
                            }

                            scope.currentLotteryResuls = getCurrentLotteryData(resp);
                            scope.selectedDraw = scope.currentLotteryResuls[0];
                            // scope.result.drawDate = getDrawDateWithTimeZoneDifference(new Date(scope.currentLotteryResuls[0].DrawDate));
                            scope.result.drawDate = new Date(scope.currentLotteryResuls[0].DrawDate);
                            setWinnings(scope.selectedDraw.WinningResult, scope.selectedDraw.BonusNumber);

                            lyAppLotteriesService.getLotteriesLastResultsPrizes()
                                .then(function(resp) {
                                    scope.prices = getCurrentLotteryData(resp);
                                    setPrices(scope.selectedDraw.DrawId);
                                }, function(error) {
                                    stateHelper.goToErrorMaintenance();
                                })
                        }, function(error) {
                            stateHelper.goToErrorMaintenance();
                        })

                    lyAppLotteriesService.getAllBrandDraws()
                        .then(function(resp) {
                            if (!Array.isArray(resp)) {
                                return;
                            }

                            scope.nextDrawInfo = _.filter(resp, function(current) {
                                return current.LotteryName.toLowerCase() == scope.lotteryName.toLowerCase();
                            })[0];
                            scope.currency = scope.nextDrawInfo.LotteryCurrency2;
                        }, function(error) {
                            stateHelper.goToErrorMaintenance();
                        });

                    lyAppLotteriesService.getLotteryRulesByLotteryName(scope.lotteryName)
                        .then(function(resp) {

                            scope.lotteryDays = resp.DrawDaysWeekly.map(function(current) {
                                if(scope.lotteryName == "LaPrimitiva"){
                                       current.Day++;
                                } else if (scope.lotteryName == "Lotto649") {
                                    current.Day--;
                                }
                                return current.Day == 7 ? 0 : current.Day;
                            });

                        }, function(error) {
                            console.warn('error in lyAppLotteriesService.getLotteryRulesByLotteryName', error);
                        });


                    scope.changeResultPrices = function(drawDate) {
                        scope.result.drawDate = drawDate;
                        var current = getCurrentDrawByDate(scope.result.drawDate);

                        if (current) {
                            scope.selectedDraw = current;
                            setWinnings(scope.selectedDraw.WinningResult, scope.selectedDraw.BonusNumber);
                            setPrices(scope.selectedDraw.DrawId);
                        } else {
                            var startDate = drawDate.toISOString().substring(0, 10);
                            drawDate.setDate(drawDate.getDate() + 2);
                            var endDate = drawDate.toISOString().substring(0, 10);

                            lyAppLotteriesService.getLotteriesResultsByDate(startDate, endDate)
                                .then(function(resp) {
                                    scope.currentLotteryResuls = getCurrentLotteryData(resp);
                                    scope.selectedDraw = scope.currentLotteryResuls[0];
                                    // scope.result.drawDate = getDrawDateWithTimeZoneDifference(new Date(scope.currentLotteryResuls[0].DrawDate));
                                    scope.result.drawDate = new Date(scope.currentLotteryResuls[0].DrawDate);
                                    setWinnings(scope.selectedDraw.WinningResult, scope.selectedDraw.BonusNumber);
                                    setPrices(scope.selectedDraw.DrawId);
                                }, function(error) {
                                    stateHelper.goToErrorMaintenance();
                                });
                        }
                    };

                    scope.changeResults = function(lotteryName) {
                        $location.path('/' + lotteryName.toLowerCase() + '-results/');
                    };

                    scope.openDatepicker = function() {

                        $timeout(function() {
                            scope.opened = true;
                        }, 1) ;
                    }

                    scope.goToPlayPage = function(lotteryName) {
                        stateHelper.goToPlayPage(lotteryName, true);
                    }

                    function getCurrentLotteryData(allLotteriesData) {
                        if (!Array.isArray(allLotteriesData)) {
                            return;
                        }

                        return _.filter(allLotteriesData, function(current) {
                            return current.LotteryTypeId == scope.lotteryId;
                        });
                    }

                    function getCurrentDrawByDate(date) {
                        var current = _.filter(scope.currentLotteryResuls, function(current) {
                            var drawDate = new Date(current.DrawDate);
                            var currentDateAfterTimeDifference = getDrawDateWithTimeZoneDifference(drawDate);
                            return currentDateAfterTimeDifference.getDate() == date.getDate() && currentDateAfterTimeDifference.getMonth() == date.getMonth() && currentDateAfterTimeDifference.getFullYear() == date.getFullYear();
                        });

                        return current[0];
                    }

                    function getDrawDateWithTimeZoneDifference(drawDate) {
                        // Fix for startsWith on older browsers like IE

                        if (!String.prototype.startsWith) {
                            String.prototype.startsWith = function(searchString, position) {
                                position = position || 0;
                                return this.indexOf(searchString, position) === position;
                            };

                        }
                        if (scope.selectedDraw.LotteryCurrency.toLowerCase().startsWith('us')) {
                            drawDate.setDate(drawDate.getDate() - 1);
                        }

                        return drawDate;
                    }

                    function setPrices(drawId) {
                        var prices = _.filter(scope.prices, {
                            'DrawId': drawId
                        });

                        if (prices.length) {
                            scope.result.drawPrices = prices;
                        } else {
                            var drawIdRange = [];
                            drawIdRange.push(drawId);
                            lyAppLotteriesService.getLotteriesLastResultsPrizesByDrawidRange(drawIdRange)
                                .then(function(resp) {
                                    scope.result.drawPrices = _.filter(resp, {
                                        'DrawId': drawId
                                    });
                                }, function(error) {
                                    stateHelper.goToErrorMaintenance();
                                });
                        }
                    }

                    function setWinnings(winningNumbers, bonusNumbers) {
                        winningNumbers = winningNumbers + bonusNumbers;
                        var winnings = winningNumbers.split('#');
                        scope.result.winningNumbers = {
                            selectedNumbers: winnings[0].split(','),
                            extraNumbers: winnings[1] ? winnings[1].split(',') : []
                        }
                    }
                }
            };
        }
    ])
