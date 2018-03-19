 'use strict';

 angular.module('lyPlayPage.services')
     .factory('lySelectPageService', [
         '$q',
         'lySelectPageCacheFactory',
         'quickPickService',
         'lyCartService',
         function(
             $q,
             lySelectPageCacheFactory,
             quickPickService,
             lyCartService
         ) {
             var elgordoLottery = "elgordo";

             var lotteryRules;
             var lotteryJackpot;
             var lotteryCurrency;

             var factory = {
                 getLotteryRulesByName: getLotteryRulesByName,
                 getProductsDrawOptions: getProductsDrawOptions,
                 getAllGameData: getAllGameData,
                 getLotteryRules: getLotteryRules,
                 getDrawsPerWeek: getDrawsPerWeek,
                 getCurrentTicket: getCurrentTicket,
                 saveTicketsInfo: saveTicketsInfo,
                 markRandomNumbers: markRandomNumbers,
                 markNumberAsSelected: markNumberAsSelected,
                 onNumberClicked: onNumberClicked,
                 clearTicket: clearTicket,
                 quickPickMarkNumbers: quickPickMarkNumbers,
                 getActiveTab: getActiveTab,
                 setActiveTab: setActiveTab,
                 setSelectedDropDownOption: setSelectedDropDownOption,
                 getIsSubscription: getIsSubscription,
                 setDropDownOptions: setDropDownOptions,
                 setLotteryJackpot: setLotteryJackpot,
                 getLotteryJackpot: getLotteryJackpot,
                 setLotteryCurrency: setLotteryCurrency,
                 getLotteryCurrency: getLotteryCurrency,
                 sanitizeNumbers: sanitizeNumbers,
                 markEqualExtraNumbers: markEqualExtraNumbers,
                 countFilledLines: countFilledLines
             };

             function setLotteryCurrency(currency) {
                 lotteryCurrency = currency;
             }

             function getLotteryCurrency() {
                 return lotteryCurrency;
             }

             function setLotteryJackpot(jackpot) {
                 lotteryJackpot = jackpot;
             }

             function getLotteryJackpot() {
                 return lotteryJackpot;
             }

             function getAllLotteryRules() {
                 var idcache = 'LotteryRules';
                 var deferred = $q.defer();

                 if (lySelectPageCacheFactory.get(idcache)) {
                     var cached = lySelectPageCacheFactory.get(idcache);
                     if (!Array.isArray(cached)) {
                         cached = JSON.parse(cached);
                     }

                     deferred.resolve(cached);
                 } else {
                     return lyCartService.getLotteryAndProductDataCart();
                 }

                 return deferred.promise;
             }


             function getLotteryRulesByName(lotteryname) {
                 var idcache = 'LotteryRules';
                 var deferred = $q.defer();

                 getAllLotteryRules()
                     .then(function(resp) {
                         var result = resp.LotteryRules.filter(function(item) {
                             if (item.LotteryType.toLowerCase() === lotteryname.toLowerCase()) return true;
                         });
                         lotteryRules = result[0];

                         deferred.resolve(result[0]);
                     }, function(error) {
                         deferred.reject(error);
                     })

                 return deferred.promise;
             }

             function getProductsDrawOptions(productId, isSubscription) {
                 if (lotteryRules) {
                     return lotteryRules.ProductsDrawOptions.filter(function(it) {
                         if (it.ProductId === productId && it.IsSubscription === isSubscription) {
                             return true;
                         }
                     })[0];
                 }
             }

             function getAllGameData(lottery) {
                 lottery = lottery ? lottery : lotteryRules.LotteryType;

                 if (!lotteryRules) {
                     getLotteryRulesByName(lottery)
                         .then(function(resp) {
                             lotteryRules = resp;
                         });
                 } else {

                 }

                 var data = lySelectPageCacheFactory.get('tickets');

                 if (!data) {
                     var game = createNewGameObject();
                     data = [];
                     data.push(game);
                     lySelectPageCacheFactory.put('tickets', data);

                     return game;
                 }

                 var all = data;
                 var currentGame = all.filter(function(current) {
                     return current.game == lotteryRules.LotteryType.toLowerCase();
                     //return current.game == lottery.toLowerCase();
                 });

                 if (currentGame.length == 0) {
                     currentGame = createNewGameObject();
                     all.push(currentGame);
                     lySelectPageCacheFactory.put('tickets', all);
                 } else {
                     currentGame = currentGame[0];
                 }

                 return currentGame;
             }

             function getLotteryRules(lotteryname) {

                 if (lotteryRules) {
                     return lotteryRules;
                 } else {
                     //lotteryname = 'megamillions';
                     getLotteryRulesByName(lotteryname)
                         .then(function(resp) {
                             lotteryRules = resp;
                             return resp;
                         })
                 }
             }

             function getDrawsPerWeek() {
                 return lotteryRules.DrawsPerWeek;
             }

             function getCurrentTicket() {
                 var currentGame = getAllGameData();

                 if (currentGame.isClassicActiveTab) {
                     return currentGame.personal;
                 } else {
                     return currentGame.group;
                 }
             }

             function saveTicketsInfo(ticket) {
                 var allGames = lySelectPageCacheFactory.get('tickets');
                 if (!allGames) {
                     allGames = [];
                     allGames.push(createNewGameObject());
                 }

                 for (var i = 0; i < allGames.length; i += 1) {
                     if (allGames[i].game == lotteryRules.LotteryType.toLowerCase()) {
                         allGames[i] = ticket;
                         break;
                     }
                 }

                 lySelectPageCacheFactory.put('tickets', allGames);
             }

             function markRandomNumbers(numbers, line, isReg) {
                 for (var i = 0, len = numbers.length; i < len; i++) {
                     var num = numbers[i];
                     markNumberAsSelected(num, isReg, line);
                 }
             }

             function markNumberAsSelected(number, isReg, line) {
                 var currentLine;

                 if (isReg) {
                     currentLine = jQuery("[is-regular-number=true]")[line - 1];
                 } else {
                     currentLine = jQuery("[is-regular-number=false]")[line - 1];
                     if (lotteryRules.LotteryType.toLowerCase() == elgordoLottery) {
                         number++;
                     }
                 }
                 var group = jQuery(currentLine).children()[number - 1];

                 if (group.className.indexOf(' selected') == -1) {
                     //  group.style.backgroundColor = '#3079BE';
                     group.className += ' selected';
                 } else {
                     group.style.backgroundColor = '';
                     group.classList.remove('selected');
                 }
             }

             function markClickedNumber(target) {
                 if (target.className.indexOf(' selected') > -1) {
                     target.style.backgroundColor = '';
                     target.classList.remove('selected');
                 } else {
                     //  target.style.backgroundColor = '#3079BE';
                     target.className += ' selected';
                 }
             }

             function clearTicket(line) {
                 var ticket = getAllGameData();

                 var isLineFull = (ticket.personal.lines[line - 1].regularNumbers.length == lotteryRules.MaxSelectNumbers && ticket.personal.lines[line - 1].extraNumbers.length == lotteryRules.MaxExtraNumbers);
                 checkIfErrInLocalStor(ticket);


                 for (var i = 0; i < ticket.personal.lines[line - 1].regularNumbers.length; i++) {
                     markNumberAsSelected(ticket.personal.lines[line - 1].regularNumbers[i], true, line);
                 }

                 for (var i = 0; i < ticket.personal.lines[line - 1].extraNumbers.length; i++) {
                     markNumberAsSelected(ticket.personal.lines[line - 1].extraNumbers[i], false, line);
                 }

                 ticket.personal.lines[line - 1].regularNumbers = [];
                 ticket.personal.lines[line - 1].extraNumbers = [];

                 if (ticket.personal.filledLines > 0 && isLineFull) {
                     ticket.personal.filledLines -= 1;
                 }


                 saveTicketsInfo(ticket);
             }

             function checkIfErrInLocalStor(ticket) {
                 var hasPrevSelected = jQuery('.number.selected');

                 var isCachEmpty = ticket.personal.lines.filter(function(current) {
                     return (current.regularNumbers.length > 0 || current.extraNumbers.length > 0);
                 });

                 if (!isCachEmpty.length && hasPrevSelected.length > 0) {
                     jQuery('.number').removeClass('selected').attr('style', '');
                 }
             }

             function quickPickMarkNumbers(line) {
                 clearTicket(line);
                 var ticket = getAllGameData();
                 ticket.personal.lines[line - 1].regularNumbers = quickPickService.getRandomNumbers(lotteryRules.MaxSelectNumbers, lotteryRules.SelectNumbers);
                 ticket.personal.lines[line - 1].extraNumbers = quickPickService.getRandomNumbers(lotteryRules.MaxExtraNumbers, lotteryRules.ExtraNumbers);
                 ticket.personal.filledLines = countFilledLines(ticket.personal.lines);
                 saveTicketsInfo(ticket);

                 var ticket = getAllGameData();
                 markRandomNumbers(ticket.personal.lines[line - 1].regularNumbers, line, true);
                 markRandomNumbers(ticket.personal.lines[line - 1].extraNumbers, line, false);
             };

             function markEqualExtraNumbers(number, lineNumber, playTicket, shouldMark) {
                 playTicket.lines.forEach(function(line, index) {
                     if (line.extraNumbers.length > 0) {
                         markNumberAsSelected(line.extraNumbers[0], false, index + 1);
                         playTicket.lines[index].extraNumbers.splice(0, 1);

                         if (shouldMark) {
                             markNumberAsSelected(number, false, index + 1);
                             playTicket.lines[index].extraNumbers.push(number);
                         }
                     } else if (lineNumber == index + 1 || line.regularNumbers.length > 0) {
                         if (shouldMark) {
                             markNumberAsSelected(number, false, index + 1);
                             playTicket.lines[index].extraNumbers.push(number);
                         }
                     }
                 });
             }

             function onNumberClicked(num, isRegular, $event, lineNumber) {
                 var allData = getAllGameData();
                 var playTicket = getCurrentTicket();
                 var target = $event.currentTarget;

                 checkIfErrInLocalStor(allData);

                 if (isRegular) {
                     var regularNumbers = playTicket.lines[lineNumber - 1].regularNumbers;
                     var index = regularNumbers.indexOf(num);

                     if (index != -1) {
                         playTicket.lines[lineNumber - 1].regularNumbers.splice(index, 1);
                         markClickedNumber(target, isRegular);
                     } else if (playTicket.lines[lineNumber - 1].regularNumbers.length < lotteryRules.MaxSelectNumbers) {
                         playTicket.lines[lineNumber - 1].regularNumbers.push(num);
                         markClickedNumber(target, isRegular);


                         if (allData.game == elgordoLottery) {
                             playTicket.lines.forEach(function(line, index) {
                                 if (line.extraNumbers.length > 0) {
                                     markEqualExtraNumbers(line.extraNumbers[0], lineNumber, playTicket, true);
                                 }
                             });
                         }
                     }
                 } else {
                     var extraNumbers = playTicket.lines[lineNumber - 1].extraNumbers;
                     var index = extraNumbers.indexOf(num);

                     if (index != -1) {
                         if (allData.game == elgordoLottery) {
                             markEqualExtraNumbers(num, lineNumber, playTicket, false);
                         } else {
                             playTicket.lines[lineNumber - 1].extraNumbers.splice(index, 1);
                             markClickedNumber(target, isRegular);
                         }
                     } else if (playTicket.lines[lineNumber - 1].extraNumbers.length < lotteryRules.MaxExtraNumbers) {
                         if (allData.game == elgordoLottery) {
                             markEqualExtraNumbers(num, lineNumber, playTicket, true);
                         } else {
                             playTicket.lines[lineNumber - 1].extraNumbers.push(num);
                             markClickedNumber(target, isRegular);
                         }
                     }
                 }

                 playTicket.filledLines = countFilledLines(playTicket.lines);
                 allData.personal = playTicket;
                 saveTicketsInfo(allData);
             }

             function setActiveTab(isPersonalTab, lotteryName) {
                 var game = getAllGameData(lotteryName);
                 game.isClassicActiveTab = isPersonalTab;
                 saveTicketsInfo(game);
             }

             function getActiveTab(lotteryName) {
                 var game;
                 if (!lotteryRules) {
                     game = getAllGameData(lotteryName);
                 } else {
                     game = getAllGameData();
                 }

                 return game.isClassicActiveTab;
             }

             function setSelectedDropDownOption(drawOption) {
                 var ticket = getAllGameData();
                 var current = getCurrentTicket();

                 current.multiDraw = drawOption;
                 current.draws = current.multiDraw.NumberOfDraws;
                 current.discount = current.multiDraw.Discount;

                 if (current.productId == 1) {
                     ticket.personal = current;
                 } else {
                     ticket.group = current;
                 }

                 saveTicketsInfo(ticket);
             }

             function getIsSubscription() {
                 var current = getCurrentTicket();
                 return current.isSubscription;
             }

             function setDropDownOptions(isSubscription, draws, discount, subscriptionOption) {
                 var ticket = getAllGameData();
                 var current = getCurrentTicket();

                 current.isSubscription = isSubscription;
                 current.draws = draws ? draws : current.multiDraw.NumberOfDraws;
                 current.discount = discount ? discount : current.multiDraw.Discount;
                 if (subscriptionOption) {
                     current.subscription = subscriptionOption;
                 }


                 if (current.productId == 1) {
                     ticket.personal = current;
                 } else {
                     ticket.group = current;
                 }

                 saveTicketsInfo(ticket);
             }

             function sanitizeNumbers(numbersAsString) {
                 var linesAsString = numbersAsString.split('|');

                 return linesAsString.map(function(current) {
                     if (current != "") {
                         var numbers = current.split('#');
                         var result = {
                             regularNumbers: numbers[0].split(',').map(Number),
                             extraNumbers: numbers[1].length ? numbers[1].split(',').map(Number) : []
                         }
                         return result;
                     }
                 })
             }

             function countFilledLines(lines) {
                 var counter = 0;

                 lines.forEach(function(line) {
                     if (line.extraNumbers.length == lotteryRules.MaxExtraNumbers && line.regularNumbers.length == lotteryRules.MaxSelectNumbers) {
                         counter++;
                     }
                 });

                 return counter;
             };

             function createNewGameObject() {
                 var newObj = {
                     game: lotteryRules.LotteryType.toLowerCase(),
                     isClassicActiveTab: true,
                     personal: {
                         lines: new Array(10),
                         filledLines: 0,
                         draws: 1,
                         isSubscription: false,
                         discount: 0,
                         productId: 1,
                         multiDraw: getProductsDrawOptions(1, false).MultiDrawOptions[0],
                         subscription: getProductsDrawOptions(1, true).MultiDrawOptions[0],
                     },
                     group: {
                         shares: 1,
                         draws: 1,
                         isSubscription: false,
                         discount: 0,
                         productId: 3,
                         multiDraw: getProductsDrawOptions(3, false).MultiDrawOptions[0],
                         subscription: getProductsDrawOptions(3, true).MultiDrawOptions[0]
                     }
                 };

                 for (var i = 0; i < newObj.personal.lines.length; i += 1) {
                     newObj.personal.lines[i] = {
                         regularNumbers: [],
                         extraNumbers: []
                     }
                 }

                 return newObj;
             }

             return factory
         }
     ]);