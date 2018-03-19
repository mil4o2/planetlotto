'use strict';

angular.module('lyCart.utilities')
    .factory('lyCart.utility', function() {

        var service = {
            // isNumeric: isNumeric,
            IsJsonString: IsJsonString,
            quickpick: quickpick,
            // quickpickByLines: quickpickByLines,
            // getRandomInt: getRandomInt,
            linesChecker: linesChecker,
            getCreditCardType: getCreditCardType,
            validateEighteenYearsAge: validateEighteenYearsAge,
            validateCreditCard: validateCreditCard,
            cartItemsMapToProductsArray: cartItemsMapToProductsArray,
            daysInMonth: daysInMonth,
            makeArrayOfNumbers: makeArrayOfNumbers,
            getProducts: getProducts,
            getDropdownDaysOfMonth: getDropdownDaysOfMonth,
            getDropdownMonts: getDropdownMonts,
            getDropdownYears: getDropdownYears,
            getYearsAfterThis: getYearsAfterThis
        };

        function getProducts(products, memberId) {
            var res = '';

            products.forEach(function(product) {
                res += 'productCounter=1&numOfDraws=' + product.getNumberOfDraws() + '&numOfLines=' + product.getNumberOfLinesOrShares() + '&'

                if (!!product.getNumbers()) {
                    var numbers = product.getNumbersSantized();
                    numbers.forEach(function(nums) {
                        res += 'MemberId=' + memberId + '&LotteryTypeID=' + product.getLotteryType() + '&SelectedNumbers=' + nums + '&';
                        res += 'IsVIP=' + product.getIsFastProcessing() + '&IsCash=true&isOnline=1&ProductID=' + product.getProductType() + '|';
                        //isCash = product.getIsSubscription()
                    })
                } else {
                    res += 'MemberId=' + memberId + '&LotteryTypeID=' + product.getLotteryType() + '&SelectedNumbers=&';
                    res += 'IsVIP=' + product.getIsFastProcessing() + '&IsCash=true&isOnline=1&ProductID=' + product.getProductType() + '|';
                }
            });

            res = res.slice(0, -1);
            return res;
        }

        function makeArrayOfNumbers(numbers) {
            return new Array(numbers).join().split(',')
                .map(function(item, index) {
                    return ++index;
                });
        }

        function daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }

        function validateEighteenYearsAge(date) {
            var currentDate = new Date();
            var dateToCheck = new Date(date);

            //checking years
            if ((currentDate.getFullYear() - dateToCheck.getFullYear()) > 18) {
                return true;
            }
            if ((currentDate.getFullYear() - dateToCheck.getFullYear()) === 18) {
                if (dateToCheck.getMonth() < currentDate.getMonth()) {
                    return true;
                }
                if (dateToCheck.getMonth() === currentDate.getMonth()) {
                    if ((currentDate.getDate() >= dateToCheck.getDate())) {
                        return true;
                    }
                }
            }

            return false;
        }

        function cartItemsMapToProductsArray(items) {
            return items.map(function(item) {
                var obj = {};
                var productId = item.getGuid() ? 999 : item.getProductType();
                obj.ProductId = productId;
                obj.LotteryID = item.getLotteryType();
                obj.Lines = item.getNumberOfLinesOrShares();
                if (item.getIsRaffle()) {
                    obj.SelectedNumbers = item.getProductExpireId();
                } else {
                    obj.SelectedNumbers = item.getNumbers();
                }

                obj.Draws = item.getNumberOfDraws();
                obj.Amount = item.getTotalCost();
                obj.IsCash = item.getIsSubscription(); //is sub
                obj.IsVip = item.getIsFastProcessing(); //fast processing
                obj._isQuickPick = item._isQuickPick
                return obj;

            });
        }

        // function isNumeric(n) {
        //     return !isNaN(parseFloat(n)) && isFinite(n);
        // };

        function IsJsonString(str) {
            try {
                var o = JSON.parse(str);
                if (o && typeof o === "object" && o !== null) {
                    return o;
                }
            } catch (e) {
                return false;
            }
            return true;
        }

        function quickpickByLines(rules, lines) {
            var generatedLines = "";
            for (var i = 0; i < lines; i++) {
                if (rules.LotteryType.toLowerCase() === "elgordo") {
                    if (i === 0) {
                        generatedLines += quickpick(rules) + "|";
                    } else {
                        var getFirstLine, specialNumber;
                        getFirstLine = generatedLines.split("|");
                        specialNumber = getFirstLine[0].split('#')[1];
                        generatedLines += quickpick(rules, specialNumber) + "|";
                    }
                } else {
                    generatedLines += quickpick(rules) + "|";
                }
            }
            return generatedLines;
        }

        function quickpick(rules, specialNumber) {
            var generatedNumbers = [];
            var generatedExtraNumbers = [];
            var line = "";

            var maxSelectExtraNumbers = rules.MaxExtraNumbers; // kolko extra number to generate
            var startNumber = rules.MinSelectNumber; //otkolko da startirame chislata
            var endNumber = rules.SelectNumbers;
            var maxSelectNumbers = rules.MaxSelectNumbers; //kolko chisla da se generirat
            var startExtraNumber = rules.MinExtraNumber;
            var endExtraNumbers = rules.ExtraNumbers;

            while (generatedNumbers.length < maxSelectNumbers) {
                var number = getRandomInt(startNumber, endNumber);
                if (generatedNumbers.indexOf(number) === -1) {
                    generatedNumbers.push(number);
                }
            }
            line += generatedNumbers.join(',');

            if (maxSelectExtraNumbers > 0) {
                if (typeof specialNumber !== 'undefined') {
                    generatedExtraNumbers.push(specialNumber);
                } else {
                    while (generatedExtraNumbers.length < maxSelectExtraNumbers) {
                        var number = getRandomInt(startExtraNumber, endExtraNumbers);
                        if (generatedExtraNumbers.indexOf(number) === -1) {
                            generatedExtraNumbers.push(number);
                            console.log(number);
                        }
                    }
                }
                line += '#' + generatedExtraNumbers.join(',');
            }
            return line;
        };

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        function linesChecker(numbers) {
            var numberSeperator = ',';
            var linesSeperator = '|';
            var specialNumberSeperator = "#";

            var arrLength = numbers.length;

            var numbersSanitized = "";
            var currentNumbersInline = 1;

            for (var i = 0; i < arrLength; i++) {
                var currentElement = numbers[i];
                var nextElement = numbers[i + 1];

                if (i === 0) {
                    if (isNumeric(currentElement)) {
                        numbersSanitized += currentElement;
                        currentNumbersInline++;
                        continue;
                    } else {
                        continue;
                    }
                }

                if (isNumeric(currentElement)) {
                    numbersSanitized += currentElement;
                    currentNumbersInline++;
                    continue;
                }

                if (currentElement === numberSeperator || currentElement === linesSeperator || currentElement === specialNumberSeperator) {
                    if (typeof nextElement !== 'undefined') {
                        if (isNumeric(nextElement)) {
                            numbersSanitized += currentElement;
                            continue;
                        }
                    }
                }
            }
            return numbersSanitized;
        }

        function validateCreditCard(creditcard, expirationDate) {

            if (!creditcard.expiration || !creditcard.expiration.year || !creditcard.expiration.month) {
                return false;
            }

            var lastDay = new Date(parseInt(creditcard.expiration.year), parseInt(creditcard.expiration.month), 0).getDate();
            var expirationDate = creditcard.expiration.year + "-" + creditcard.expiration.month + "-" + lastDay;

            var today = new Date();
            today.setHours(0, 0, 0, 0);

            var creditCardDate = new Date(expirationDate);
            creditCardDate.setHours(0, 0, 0, 0);

            if (creditCardDate < today) {
                //$scope.creditCard = true;
                // $scope.creditCardErrorArr.push({
                //     ErrorMessage: "Please enter valid card expiration date"
                // });
                return false;
            }
            return true;
        }

        function getCreditCardType(number) {
            // visa
            var re = new RegExp("^4");
            if (number.match(re) != null)
                return "Visa";

            // Mastercard
            re = new RegExp("^5[1-5]");
            if (number.match(re) != null)
                return "Mastercard";

            // AMEX
            re = new RegExp("^3[47]");
            if (number.match(re) != null)
                return "AMEX";

            // Discover
            re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
            if (number.match(re) != null)
                return "Discover";

            // Diners
            re = new RegExp("^36");
            if (number.match(re) != null)
                return "Diners";

            // Diners - Carte Blanche
            re = new RegExp("^30[0-5]");
            if (number.match(re) != null)
                return "Diners - Carte Blanche";

            // JCB
            re = new RegExp("^35(2[89]|[3-8][0-9])");
            if (number.match(re) != null)
                return "JCB";

            // Visa Electron
            re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
            if (number.match(re) != null)
                return "Visa Electron";

            return "Visa";
        };

        function getDropdownDaysOfMonth(month) {
            month = month ? month : 1;
            var currentYear = new Date().getFullYear();
            return makeArrayOfNumbers(daysInMonth(month, currentYear));
        }

        function getDropdownMonts() {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }


        function getDropdownYears() {
            var currentYear = new Date().getFullYear();
            var legalAgeOfPlay = currentYear - 18;
            return new Array(90).join().split(',').map(function(item, index) {
                return (legalAgeOfPlay - index);
            });
        }

        function getYearsAfterThis(count) {
            count = count ? count : 50;
            var currentYear = new Date().getFullYear();

            return new Array(count).join().split(',').map(function(item, index) {
                return (currentYear + index);
            });
        }

        return service;
    });
