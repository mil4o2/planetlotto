'use strict'

angular.module('lyApp.utilities')
    .factory('quickPickService', [
        '$q',
        'lyCart',
        'lyConstants',
        'lyAppHttpService',
        function(
            $q,
            lyCart,
            lyConstants,
            lyAppHttpService
        ) {
            var service = {
                getRandomNumbers: getRandomNumbers,
                getQuickPick: getQuickPick,
                addPersonalQuickPickToCart: addPersonalQuickPickToCart,
                addGroupQuickPickToCart: addGroupQuickPickToCart,
                getPersonalQuickpickData: getPersonalQuickpickData,
                getRandomQuickPickLine: getRandomQuickPickLine
            };

            function addPersonalQuickPickToCart(draws, lines, lotteryId, isSubscription, numbers) {
                var deferred = $q.defer();
                isSubscription = isSubscription ? isSubscription : false;

                if (!numbers) {
                    var data = getPersonalQuickpickData(lotteryId, draws, lines);

                    getQuickPick(data)
                        .then(function(resp) {
                            if (resp.IsValid) {
                                lyCart.addPersonalItem(resp.QuickPick.SelectedNumbers, resp.QuickPick.Draws, resp.QuickPick.Lines, resp.QuickPick.LotteryType, resp.QuickPick.ProductId, isSubscription);
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }
                        }, function(error) {
                            deferred.reject();
                        });
                } else {
                    lyCart.addPersonalItem(numbers, draws, lines, lotteryId, 1, isSubscription);
                    deferred.resolve();
                }

                return deferred.promise;
            }

            function addGroupQuickPickToCart(draws, shares, lotteryId, isSubscription) {
                var deferred = $q.defer();
                isSubscription = isSubscription ? isSubscription : false;
                var data = {
                    "LotteryType": lotteryId,
                    "ProductId": 3,
                    "Draws": draws,
                    "Shares": shares
                };

                getQuickPick(data)
                    .then(function(resp) {
                        if (resp.IsValid) {
                            var numberOfTickets = lyConstants.groupTickets[0];
                            lyCart.addGroupItem(resp.QuickPick.Draws, resp.QuickPick.Shares, resp.QuickPick.LotteryType, resp.QuickPick.ProductId, isSubscription, numberOfTickets);
                            deferred.resolve();
                        } else {
                            console.log(resp)
                            deferred.reject();
                        }
                    }, function(error) {
                        console.warn("Error in getQuickPick: " + error);
                        deferred.reject();
                    })
                return deferred.promise;
            }

            function getRandomNumbers(count, maxNumber) {
                var arr = [];
                if (count > 0) {
                    while (true) {
                        var num = Math.floor((Math.random() * maxNumber) + 1);
                        var index = arr.indexOf(num);

                        if (index > -1) {
                            continue;
                        }

                        arr.push(num);

                        if (arr.length == count) {

                            return arr;
                        }
                    }
                }

                return arr;
            }

            function getQuickPick(data) {
                var deferred = $q.defer();

                var url = lyConstants.lyApiDefinitions.playlottery + 'quick-pick-select';
                lyAppHttpService.post(url, data)
                    .then(function(resp) {
                        console.log("%c playlottery/quick-pick-select: ", "color:red");
                        console.log(resp);
                        deferred.resolve(resp);
                    }, function(error) {
                        console.warn("Error in playlottery/quick-pick-select: " + error);
                        deferred.reject('There was an error');
                    });

                return deferred.promise;

            }

            function getPersonalQuickpickData(lotteryId, draws, lines) {
                return {
                    "LotteryType": lotteryId,
                    "ProductId": 1,
                    "Draws": draws,
                    "Lines": lines
                };
            }

            function getRandomQuickPickLine(regularNumbersCount, regularNumbersMaxNumber, extraNumbersCount, extraNumbersMaxNumber) {
                var regularNumbers = getRandomNumbers(regularNumbersCount, regularNumbersMaxNumber);
                var extraNumbers = getRandomNumbers(extraNumbersCount, extraNumbersMaxNumber);

                return {
                    "regularNumbers": regularNumbers,
                    "extraNumbers": extraNumbers
                };
            }

            return service;
        }
    ])
