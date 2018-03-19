'use strict'

angular.module('lyApp.services')
    .factory('lyAppLotteriesService', [
        'lyCacheFactory',
        '$q',
        'lyAppHttpService',
        'lyConstants',
        function(
            lyCacheFactory,
            $q,
            lyAppHttpService,
            lyConstants
        ) {
            var AllDrawsCacheKey = 'AllDraws';
            var LotteryRulesCacheKey = 'LotteryRules';
            var LotteriesResults = 'LotteriesResults';
            var LotteryResults = 'LotteryResults';
            var LotteryResultsPrizes = "LotteryResultsPrizes";

            var service = {
                getAllBrandDraws: getAllBrandDraws,
                getAllLotteriesRules: getAllLotteriesRules,
                getLotteries: getLotteries,
                getLotteryFromArrayById: getLotteryFromArrayById,
                getLotteryIdByLotteryName: getLotteryIdByLotteryName,
                getLotteriesResults: getLotteriesResults,
                getLotteryResultsNoRaffles: getLotteryResultsNoRaffles,
                getLotteriesLastResultsByBrand: getLotteriesLastResultsByBrand,
                getLotteriesLastResultsPrizes: getLotteriesLastResultsPrizes,
                getLotteriesResultsByDate: getLotteriesResultsByDate,
                getLotteriesLastResultsPrizesByDrawidRange: getLotteriesLastResultsPrizesByDrawidRange,
                getLotteryRulesByLotteryName: getLotteryRulesByLotteryName
            };

            function getLotteryResultsNoRaffles() {
                var deferred = $q.defer();

                getLotteriesResults()
                    .then(function(resp) {
                        if (!Array.isArray(resp)) {
                            return;
                        }

                        var lotteryResults = [];
                        resp.forEach(function(current) {
                            if (current.WinningResult != null && current.WinningResult.indexOf('#') > -1) {
                                var numbers = (current.WinningResult + current.BonusNumber).split('#');
                                var selectedNumbers = numbers[0].split(',');
                                var extraNumbers = numbers[1].split(',');
                                current.WinningResult = {
                                    SelectedNumbers: selectedNumbers,
                                    ExtraNumbers: extraNumbers
                                }

                                lotteryResults.push(current);
                            }
                        });

                        deferred.resolve(lotteryResults);

                    }, function(error) {
                        deferred.reject(error);
                    })

                return deferred.promise;
            }

            function getLotteryIdByLotteryName(lotteryName) {
                var allLoterries = lyCacheFactory.get(AllDrawsCacheKey);

                for (var i = 0, len = allLoterries.length; i < len; i += 1) {
                    if (allLoterries[i].LotteryName.toLowerCase() == lotteryName.toLowerCase()) {
                        return allLoterries[i].LotteryTypeId;
                    }
                }

                return null;
            }

            function getAllBrandDraws() {
                var deferred = $q.defer();
                if (lyCacheFactory.get(AllDrawsCacheKey)) {
                    var cached = lyCacheFactory.get(AllDrawsCacheKey);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }
                    deferred.resolve(cached);
                } else {
                    var url = lyConstants.lyApiDefinitions.globalinfo + "get-all-brand-draws";
                    lyAppHttpService.post(url)
                        .then(function(resp) {
                            console.log('%c globalinfo/get-all-brand-draws: ', 'color: red');
                            console.log(resp);
                            lyCacheFactory.put(AllDrawsCacheKey, resp);
                            deferred.resolve(resp);
                        }, function(error) {
                            console.warn("Error in globalinfo/get-all-brand-draws: " + resp);
                            deferred.reject('There was an error');
                        });
                }

                return deferred.promise;
            }

            function getAllLotteriesRules() {
                var deferred = $q.defer();
                if (lyCacheFactory.get(LotteryRulesCacheKey)) {
                    var cached = lyCacheFactory.get(LotteryRulesCacheKey);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }
                    deferred.resolve(cached);
                } else {
                    var url = lyConstants.lyApiDefinitions.globalinfo + 'lottery-rules';
                    lyAppHttpService.post(url)
                        .then(function(resp) {
                            console.log("%c globalinfo/lottery-rules", "color: red");
                            console.log(resp);
                            lyCacheFactory.put(LotteryRulesCacheKey, resp);
                            deferred.resolve(resp);
                        }, function(error) {
                            console.warn("Error in globalinfo/lottery-rules: " + error);
                            deferred.reject('There was an error');
                        });
                }

                return deferred.promise;
            }

            function getLotteries() {
                var deferred = $q.defer();
                if (lyCacheFactory.get(LotteryRulesCacheKey)) {

                    var cached = lyCacheFactory.get(LotteryRulesCacheKey);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }

                    deferred.resolve(cached);
                } else {
                    return getAllLotteriesRules();
                }

                return deferred.promise;
            }

            function getLotteryRulesByLotteryName(lotteryName) {
                var deferred = $q.defer();

                getAllLotteriesRules()
                    .then(function(resp) {
                        var result = resp.filter(function(item) {
                            if (item.LotteryType.toLowerCase() === lotteryName.toLowerCase()) return true;
                        });

                        deferred.resolve(result[0]);
                    }, function(error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function getLotteryFromArrayById(array, id) {
                if (!Array.isArray(array)) {
                    array = JSON.parse(array);
                }
                var lottery = array.filter(function(obj) {
                    if ('LotteryTypeId' in obj && typeof(obj.LotteryTypeId) === 'number' && obj.LotteryTypeId === id) {
                        return true;
                    }
                    return false;
                });

                return lottery;
            }

            function getLotteriesResults() {
                var deferred = $q.defer();
                if (lyCacheFactory.get(LotteriesResults)) {
                    var cached = lyCacheFactory.get(LotteriesResults);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }

                    deferred.resolve(cached);
                } else {
                    var url = lyConstants.lyApiDefinitions.globalinfo + "get-lotteries-results-by-brand";
                    lyAppHttpService.post(url)
                        .then(function(resp) {
                            console.log('%c globalinfo/get-lotteries-results-by-brand: ', 'color: red');
                            console.log(resp);
                            lyCacheFactory.put(LotteriesResults, resp);
                            deferred.resolve(resp);
                        }, function(error) {
                            console.warn("Error in globalinfo/get-lotteries-results-by-brand: " + error);
                            deferred.reject('There was an error');
                        });
                }

                return deferred.promise;
            }

            function getLotteriesLastResultsByBrand() {
                var deferred = $q.defer();
                if (lyCacheFactory.get(LotteryResults)) {
                    var cached = lyCacheFactory.get(LotteryResults);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }
                    deferred.resolve(cached);
                } else {
                    var url = lyConstants.lyApiDefinitions.globalinfo + "get-last-draw-results";
                    var params = {
                        "NumberOfResults": 10
                    };

                    lyAppHttpService.post(url, params)
                        .then(function(resp) {
                            lyCacheFactory.put(LotteryResults, resp.Draws);
                            deferred.resolve(resp.Draws);
                        }, function(error) {
                            console.warn("Error in action=lottery_data&m=globalinfo/get-last-draw-results: " + error);
                            deferred.reject('There was an error');
                        });
                }
                return deferred.promise;
            }

            function getLotteriesLastResultsPrizes() {
                var deferred = $q.defer();
                if (lyCacheFactory.get(LotteryResultsPrizes)) {
                    var cached = lyCacheFactory.get(LotteryResultsPrizes);
                    if (!Array.isArray(cached)) {
                        cached = JSON.parse(cached);
                    }
                    deferred.resolve(cached);
                } else {
                    var url = lyConstants.lyApiDefinitions.globalinfo + "get-lotteries-last-results-prizes";
                    lyAppHttpService.post(url)
                        .then(function(resp) {
                            lyCacheFactory.put(LotteryResultsPrizes, resp);
                            deferred.resolve(resp);
                        }, function(error) {
                            console.warn("Error in globalinfo/get-lotteries-last-results-prizes: " + error);
                            deferred.reject('There was an error');
                        });
                }

                return deferred.promise;
            }

            function getLotteriesResultsByDate(startDate, endDate) {
                var deferred = $q.defer();
                var url = lyConstants.lyApiDefinitions.globalinfo + "get-lotteries-results-by-date";
                var params = {
                    "StartDate": startDate,
                    "EndDate": endDate
                }

                lyAppHttpService.post(url, params)
                    .then(function(resp) {
                        deferred.resolve(resp);
                    }, function(error) {
                        console.warn("Error in globalinfo/get-lotteries-results-by-date: " + error);
                        deferred.reject('There was an error');
                    });

                return deferred.promise;
            }

            function getLotteriesLastResultsPrizesByDrawidRange(drawIds) {
                var deferred = $q.defer();
                // var url = lyConstants.lyApiDefinitions.globalinfo + "get-lotteries-last-results-prizes-by-drawid-range";
                var url = lyConstants.lyApiDefinitions.globalinfo + "get-lotteries-last-results-prizes-by-drawid-list";
                var params = {
                    "DrawIdList": drawIds
                };

                lyAppHttpService.post(url, params)
                    .then(function(resp) {
                        deferred.resolve(resp);
                    }, function(error) {
                        console.warn("Error in globalinfo/get-lotteries-last-results-prizes: " + error);
                        deferred.reject('There was an error');
                    });

                return deferred.promise;
            }

            return service;
        }
    ])