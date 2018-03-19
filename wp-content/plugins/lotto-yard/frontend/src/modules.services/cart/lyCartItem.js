 'use strict';

 angular.module('lyCart.services')
     .factory('lyCartItem', [
         '$rootScope',
         'lyConstants',
         function(
             $rootScope,
             lyConstants
         ) {

             var item = function(id,
                 lotteryType,
                 draws,
                 linesOrShares,
                 numbersForPersonal,
                 price,
                 discount,
                 lotteryname,
                 isFastProcessing,
                 isSubscription,
                 isQuickPick,
                 numberOfTickets,
                 ticketsNumbers,
                 productType,
                 productExpire,
                 productIdSpecial,
                 guid,
                 isRaffle,
                 rules,
                 evenLinesOnly,
                 productName) {

                 this.setId(id);
                 this.setLotteryType(lotteryType);
                 this.setNumberOfDraws(draws);
                 this.setNumberOfLinesOrShares(linesOrShares);
                 this.setNumbers(numbersForPersonal);
                 //Helper numbers
                 this.setTotalCost(price);
                 this.setDiscount(discount);
                 this.setLotteryName(lotteryname);
                 this.setIsFastProcessing(isFastProcessing);
                 this.setIsSubscription(isSubscription);
                 this.setIsQuickPick(isQuickPick);
                 this.setTicketsNumbersId(ticketsNumbers);
                 this.setProductType(productType);
                 this.setProductExpire(productExpire);
                 this.setProductIdSpecial(productIdSpecial);
                 this.setGuid(guid);
                 this.setIsRaffle(isRaffle);
                 this.setEvenLinesOnly(evenLinesOnly);
                 this.setRules(rules);
                 this.setProductName(productName);
                 this.setNumberOfTickets(numberOfTickets)
             };

             item.prototype.setId = function(id) {
                 if (id) this._id = id;
                 else {
                     this._id = generateUid();
                     console.log('An ID is auto generated:' + this._id);
                 }
             };

             item.prototype.getId = function() {
                 return this._id;
             };

             item.prototype.setLotteryType = function(lotteryType) {
                 this._lotteryType = lotteryType;
             };

             item.prototype.getLotteryType = function() {
                 return this._lotteryType;
             };

             item.prototype.setNumberOfDraws = function(noofdraws) {
                 this._draws = noofdraws;
             };

             item.prototype.getNumberOfDraws = function() {
                 return this._draws;
             };

             item.prototype.getNumberOfDrawsToShow = function() {
                 if (this._productType == 3) {
                     return this._draws * lyConstants.groupTickets[0];
                 }

                 return this._draws;
             };

             item.prototype.getNumberOfTickets = function() {
                 return this._tickets;
             };

             item.prototype.setNumberOfTickets = function(numberOfTickets) {
                 this._tickets = numberOfTickets;
             };

             item.prototype.setNumberOfLinesOrShares = function(nooflines) {
                 this._linesOrShares = nooflines;
             };

             item.prototype.getNumberOfLinesOrShares = function() {
                 return this._linesOrShares;
             };

             item.prototype.setNumbers = function(numbersForPersonal) {
                 this._numbersForPersonal = numbersForPersonal;
             };

             item.prototype.getNumbers = function() {
                 return this._numbersForPersonal;
             };

             item.prototype.getNumbersSantized = function() {
                 var lines = this.getNumbers();
                 var sanitized = lines.split('|');

                 return sanitized;
             };

             item.prototype.setTotalCost = function(totalCost) {
                 this._totalCost = totalCost;
             };

             item.prototype.getTotalCost = function() {
                 return this._totalCost;
             };

             item.prototype.setTotalDiscount = function(dis) {
                 this._totalDiscount = dis;
             }

             item.prototype.getTotalDiscount = function() {
                 return this._totalDiscount;
             }

             item.prototype.setLotteryName = function(lotteryname) {
                 if (lotteryname === 'NavidadPersonal') {
                     this._lotteryName = 'Navidad';
                 } else {
                     this._lotteryName = lotteryname;
                 }
             };

             item.prototype.getLotteryName = function() {
                 return this._lotteryName;
             };

             item.prototype.setIsFastProcessing = function(isFastProcessing) {
                 if (typeof(isFastProcessing) === 'undefined') {
                     isFastProcessing = false;
                 }
                 this._isFastProcessing = isFastProcessing;
             };

             item.prototype.getIsFastProcessing = function() {
                 return this._isFastProcessing;
             };

             item.prototype.setIsSubscription = function(isSubscription) {
                 if (typeof(isSubscription) === 'undefined') {
                     isSubscription = false;
                 }
                 this._isSubscription = isSubscription;
             };

             item.prototype.getIsSubscription = function() {
                 return this._isSubscription;
             };

             item.prototype.setIsQuickPick = function(isQuickPick) {
                 if (typeof(isQuickPick) === 'undefined') {
                     isQuickPick = false;
                 }
                 this._isQuickPick = isQuickPick;
             };

             item.prototype.getIsQuickPick = function() {
                 return this._isQuickPick;
             };

             item.prototype.setTicketsNumbersId = function(ticketsNumbers) {
                 this._ticketsNumbersId = ticketsNumbers;
             };

             item.prototype.setProductType = function(productType) {
                 this._productType = productType;
             };

             item.prototype.getProductType = function() {
                 return this._productType;
             };

             item.prototype.setProductExpire = function(productExpire) {
                 this._productExpire = productExpire;
             };

             item.prototype.getProductExpire = function() {
                 if (typeof this._productExpire !== "undefined" && this._productExpire !== null && this._productExpire.length > 0) {
                     var countDown = this._productExpire[0].exp;
                     var future = new Date(countDown);
                     var diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);

                     return diff;
                 } else {
                     return 0;
                 }

             };

             item.prototype.getProductExpireId = function() {
                 return this._productExpire[0].id;

             };

             item.prototype.setProductIdSpecial = function(productIdSpecial) {
                 this._productIdSpecial = productIdSpecial;
             }

             item.prototype.getProductIdSpecial = function() {
                 return this._productIdSpecial;
             }

             item.prototype.setGuid = function(guid) {
                 this._guid = guid;
             }

             item.prototype.getGuid = function() {
                 return this._guid;
             }

             item.prototype.setIsRaffle = function(isRaffle) {
                 this._isRaffle = isRaffle;
             }

             item.prototype.getIsRaffle = function() {
                 return this._isRaffle;
             };

             item.prototype.setRules = function(rules) {
                 this._rules = rules;
             }

             item.prototype.getRules = function() {
                 return this._rules;
             }

             item.prototype.getEvenLinesOnly = function() {
                 return this._evenLinesOnly;
             }

             item.prototype.setEvenLinesOnly = function(evenLinesOnly) {
                 this._evenLinesOnly = evenLinesOnly || false;
             }

             item.prototype.getProductName = function() {
                 return this._productName;
             };

             item.prototype.setProductName = function(productName) {
                 this._productName = productName;
             };

             item.prototype.setDiscount = function(discount) {
                 this._discount = discount;
             };

             item.prototype.getDiscount = function() {
                 return this._discount;
             };

             item.prototype.removeLastLine = function() {
                 var lastLine = this._numbersForPersonal.lastIndexOf('|');
                 var newNumbers = this._numbersForPersonal.substring(0, lastLine);
                 this._numbersForPersonal = newNumbers;
                 this.setNumberOfLinesOrShares(this.getNumberOfLinesOrShares() - 1);
             };


             item.prototype.addLine = function(line) {
                 if (this.getNumbersSantized().length <= this.getRules().MaxLines) {
                     this.setNumbers(this.getNumbers() + '|' + line);
                     this.setNumberOfLinesOrShares(this.getNumberOfLinesOrShares() + 1);
                 }
             }

             item.prototype.updateSantizedLine = function(numbers, line) {
                 var all = this.getNumbersSantized();
                 all[line - 1] = numbers;
                 this._numbersForPersonal = all.join('|');
                 $rootScope.$broadcast('lyCart:change', {});
             };

             item.prototype.getTotal = function() {
                 return +parseFloat(this.getTotalCost()).toFixed(2);
             };

             item.prototype.setNextDraw = function(change) {
                 var nextDraw = getNextDrawOption(this, change);

                 if (nextDraw) {
                     this.setNumberOfDraws(nextDraw.NumberOfDraws);
                     this.setDiscount(nextDraw.Discount);
                 }
             };

             item.prototype.addRemoveTickets = function(change) {
                 var drawChangePerGroupProducts = lyConstants.groupTickets[0];
                 var currentDraws = this.getNumberOfDraws() * drawChangePerGroupProducts;
                 var index = lyConstants.groupTickets.indexOf(currentDraws);
                 var nextIndex = index + change;

                 if (nextIndex >= 0 && nextIndex < lyConstants.groupTickets.length) {
                     var draws = lyConstants.groupTickets[nextIndex];
                     this.setNumberOfDraws(draws / drawChangePerGroupProducts);
                 }
             }

             function generateUid() {
                 return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
             }

             function getNextDrawOption(item, change) {
                 var drawOptions = item.getRules().ProductsDrawOptions.filter(function(opt) {
                     return opt.ProductId == item.getProductType() && opt.IsSubscription == item.getIsSubscription();
                 })[0].MultiDrawOptions;

                 var currentDraw = item.getNumberOfDraws();
                 var nextDraw;

                 if (change) {
                     for (var i = 0, len = drawOptions.length; i < len; i += 1) {
                         var index = i + change;
                         if (drawOptions[i].NumberOfDraws == currentDraw && index >= 0 && index < drawOptions.length) {
                             nextDraw = drawOptions[index];
                             break;
                         }
                     }
                 } else {
                     nextDraw = closest(currentDraw, drawOptions);
                 }

                 return nextDraw;
             }

             function closest(num, arr) {
                 var curr = arr[0];
                 var diff = Math.abs(num - curr.NumberOfDraws);
                 for (var val = 0; val < arr.length; val++) {
                     var newdiff = Math.abs(num - arr[val].NumberOfDraws);
                     if (newdiff < diff) {
                         diff = newdiff;
                         curr = arr[val];
                     }
                 }
                 return curr;
             }

             return item;
         }
     ])
