'use strict';

angular.module('lyPlayPage.directives')
    .directive('lySelectPageTotal', [
        '$lyCart',
        'lyCart',
        'lySelectPageService',
        'lyAppTranslationService',
        'lyAppProductsServices',
        'lyMyAccountUserService',
        'quickPickService',
        'stateHelper',
        function(
            $lyCart,
            ngCart,
            lySelectPageService,
            lyAppTranslationService,
            lyAppProductsServices,
            lyMyAccountUserService,
            quickPickService,
            stateHelper
        ) {
            return {
                restrict: 'AE',
                scope: {},
                templateUrl: $lyCart.partialPath + 'select-page/templates/total.html',
                link: function(scope) {
                    lyAppTranslationService.getTranslations(scope);
                    scope.ngCart = ngCart;
                    scope.userService = lyMyAccountUserService;
                    var lotteryRules = lySelectPageService.getLotteryRules();

                    scope.$watch('userService.isLogin', function(newValue, oldValue) {
                        if (newValue) {
                            lyMyAccountUserService.getMemberMoneyBalanceByMemberId()
                                .then(function(resp) {
                                    scope.isFirstPurchase = resp.FirstPurchase;
                                }, function(error) {
                                    scope.isFirstPurchase = false;
                                });
                        }

                    });

                    scope.$on('update-total', function(e, productId, draws, productCount, discountPercentage) {
                        updateDirective(productId, draws, productCount, discountPercentage);
                    });
                    scope.$on('QPandGoToCart', function() {
                        scope.saveToCart();
                    });

                    scope.saveToCart = function() {
                        var ticket = lySelectPageService.getCurrentTicket();
                        var draws = ticket.draws;
                        var lotteryTypeId = lotteryRules.LotteryTypeId;
                        var isSubscription = ticket.isSubscription;
                        var linesNeeded = getNeededLinesCount(ticket);

                        if (linesNeeded > 0) {
                            var data = quickPickService.getPersonalQuickpickData(lotteryRules.LotteryTypeId, ticket.draws, 10);
                            quickPickService.getQuickPick(data)
                                .then(function(resp) {
                                        var quickPicks = lySelectPageService.sanitizeNumbers(resp.QuickPick.SelectedNumbers);
                                        var ticket = fillLinesIfNeeded(quickPicks, linesNeeded);
                                        saveProducts(ticket);
                                    },
                                    function(error) {
                                        stateHelper.goToHomePage();
                                    })
                        } else {
                            ticket = lySelectPageService.getCurrentTicket();
                            saveProducts(ticket);
                        }
                    };

                    function saveProducts(ticket) {
                        updateDirective(ticket.productId, ticket.draws, ticket.filledLines, ticket.discount);
                        var numbers = getLines(ticket);
                        var lotteryRules = lySelectPageService.getLotteryRules();
                        ngCart.addPersonalItem(numbers, ticket.draws, ticket.filledLines, lotteryRules.LotteryTypeId, 1, ticket.isSubscription);

                        stateHelper.goToCartPage();
                    }

                    function chekDirtyLine(line, lotteryRules) {
                        if (line.regularNumbers.length != lotteryRules.MaxSelectNumbers && line.regularNumbers.length != 0) {
                            return true;
                        }

                        if (lotteryRules.ExtraNumbers != 0 && line.extraNumbers.length != 0 && line.extraNumbers.length != lotteryRules.MaxExtraNumbers) {
                            return true;
                        }

                        if (lotteryRules.ExtraNumbers != 0 && line.extraNumbers.length == lotteryRules.MaxExtraNumbers && line.regularNumbers.length != lotteryRules.MaxSelectNumbers) {
                            return true;
                        }

                        if (line.regularNumbers.length != 0 && line.extraNumbers.length != lotteryRules.MaxExtraNumbers && line.regularNumbers.length == lotteryRules.MaxSelectNumbers) {
                            return true;
                        }

                        return false;
                    }

                    function getNeededLinesCount(ticket) {
                        var minLines = lotteryRules.MinLines;
                        var extraLines = 0;
                        var specialExtraNumber;

                        var filledLines = ticket.lines.filter(function(current) {
                            return current.extraNumbers.length > 0 || current.regularNumbers.length > 0;
                        });

                        if (lotteryRules.LotteryTypeId == 10) {
                            specialExtraNumber = filledLines.length != 0 ? filledLines[0].extraNumbers : undefined;
                        }

                        ticket.lines.forEach(function(line, $index) {
                            if (chekDirtyLine(line, lotteryRules)) {
                                var neededSelectedNumbers = lotteryRules.MaxSelectNumbers - ticket.lines[$index].regularNumbers.length;
                                if (neededSelectedNumbers > 0) {
                                    var plusSelectedNumbers = quickPickService.getRandomNumbers(neededSelectedNumbers, lotteryRules.SelectNumbers);
                                    ticket.lines[$index].regularNumbers = ticket.lines[$index].regularNumbers.concat(plusSelectedNumbers);
                                    lySelectPageService.markRandomNumbers(plusSelectedNumbers, $index + 1, true);
                                }

                                var neededExtraNumbers = lotteryRules.MaxExtraNumbers - ticket.lines[$index].extraNumbers.length;
                                if (neededExtraNumbers > 0) {
                                    var plusExtraNumbers = getExtraNumbers(lotteryRules, ticket.lines[$index].extraNumbers, specialExtraNumber);
                                    ticket.lines[$index].extraNumbers = ticket.lines[$index].extraNumbers.concat(plusExtraNumbers);
                                    lySelectPageService.markRandomNumbers(plusExtraNumbers, $index + 1, false);
                                }

                                ticket.filledLines++;
                            }
                        });

                        var allData = lySelectPageService.getAllGameData();
                        allData.personal = ticket;
                        lySelectPageService.saveTicketsInfo(allData);

                        if (ticket.filledLines == 0) {
                            extraLines = lotteryRules.EvenLinesOnly ? 4 : 5;
                        } else if (ticket.filledLines < lotteryRules.MinLines && ticket.draws < 2) {
                            extraLines = lotteryRules.MinLines - ticket.filledLines < 0 ? 0 : lotteryRules.MinLines - ticket.filledLines;
                        } else if (lotteryRules.LotteryTypeId == 14 || lotteryRules.LotteryTypeId == 11 || lotteryRules.LotteryTypeId == 8) {
                            extraLines = 2 - ticket.filledLines < 0 ? 0 : 2 - ticket.filledLines;
                        }

                        if (lotteryRules.EvenLinesOnly && (ticket.filledLines + extraLines) % 2 === 1) {
                            // if ((ticket.filledLines + extraLines) % 2 == 1) {
                            if (extraLines > 0) {
                                extraLines -= 1;
                            }

                            ticket.filledLines -= 1;
                            removeLines(ticket.filledLines);
                            // }
                        }

                        return extraLines;
                    }

                    function updateDirective(productId, draws, productCount, discountPercentage) {
                        var ticket = lySelectPageService.getCurrentTicket();
                        var lines = productCount == 0 ? 1 : productCount;
                        lyAppProductsServices.getProductPriceByParams(productId, draws, lotteryRules.LotteryTypeId, lines)
                            .then(function(priceData) {
                                scope.totalCost = productCount == 0 ? 0 : priceData.Price;
                                scope.costWithoutDisc = scope.totalCost / (1 - discountPercentage);
                                scope.personalDisc = scope.costWithoutDisc - scope.totalCost;
                                scope.lines = productCount;
                                scope.bonusMoney = scope.totalCost;
                                scope.showDiscountDiv = scope.personalDisc != 0.00 ? true : false;
                                scope.isClassicTab = lySelectPageService.getActiveTab();
                                scope.draws = draws;
                                scope.showPersonalDiscountDiv = (scope.personalDisc != 0.00) ? true : false;
                            });
                    }

                    function fillLinesIfNeeded(quickPicks, linesNeeded) {
                        var allData = lySelectPageService.getAllGameData();
                        var ticket = lySelectPageService.getCurrentTicket();
                        var lotteryRules = lySelectPageService.getLotteryRules();
                        var countLines = 0;
                        var specialExtraNumber;

                        var filledLines = ticket.lines.filter(function(current) {
                            return current.extraNumbers.length > 0 || current.regularNumbers.length;
                        });

                        if (lotteryRules.LotteryTypeId == 10) {
                            specialExtraNumber = filledLines.length != 0 ? filledLines[0].extraNumbers : undefined;
                        }

                        for (var i = 0; i < ticket.lines.length; i += 1) {
                            if (ticket.lines[i].regularNumbers.length !== lotteryRules.MaxSelectNumbers || ticket.lines[i].extraNumbers.length !== lotteryRules.MaxExtraNumbers) {
                                ticket.lines[i] = quickPicks[i];
                                if (specialExtraNumber) {
                                    ticket.lines[i].extraNumbers = getExtraNumbers(lotteryRules, ticket.lines[i].extraNumbers, specialExtraNumber);
                                }

                                lySelectPageService.markRandomNumbers(ticket.lines[i].regularNumbers, i + 1, true);
                                lySelectPageService.markRandomNumbers(ticket.lines[i].extraNumbers, i + 1, false);

                                ticket.filledLines += 1;
                                countLines += 1;
                                allData.personal = ticket;
                                lySelectPageService.saveTicketsInfo(allData);

                                if (countLines == linesNeeded) {
                                    break;
                                }
                            }
                        }

                        return allData.personal;
                    }

                    function getExtraNumbers(lotteryRules, extraNumbers, specialNumbers) {
                        if (!specialNumbers) {
                            var neededExtraNumbers = lotteryRules.MaxExtraNumbers - extraNumbers.length;
                            var plusNumbers = quickPickService.getRandomNumbers(neededExtraNumbers, lotteryRules.ExtraNumbers);
                            extraNumbers = extraNumbers.concat(plusNumbers);
                        } else {
                            extraNumbers = specialNumbers;
                        }

                        return extraNumbers;
                    }

                    function removeLines(lines) {
                        var allData = lySelectPageService.getAllGameData();
                        var ticket = lySelectPageService.getCurrentTicket();
                        ticket.filledLines = 0;

                        for (var i = 0; i < allData.personal.lines.length; i += 1) {
                            if (lines > 0 && ticket.lines[i].regularNumbers.length == lotteryRules.MaxSelectNumbers && ticket.lines[i].extraNumbers.length == lotteryRules.MaxExtraNumbers) {
                                ticket.filledLines++;
                                lines--;
                                continue;
                            }
                            if (ticket.lines[i].regularNumbers.length != 0) {
                                lySelectPageService.markRandomNumbers(ticket.lines[i].regularNumbers, i + 1, true);
                            }

                            if (ticket.lines[i].extraNumbers.length != 0) {
                                lySelectPageService.markRandomNumbers(ticket.lines[i].extraNumbers, i + 1, true);
                            }

                            ticket.lines[i].regularNumbers = [];
                            ticket.lines[i].extraNumbers = [];

                            allData.personal = ticket;
                            lySelectPageService.saveTicketsInfo(allData);
                        }
                    }

                    function getLines(ticket) {
                        var lines = ticket.lines.map(function(line) {
                            var res = '';

                            if (line.regularNumbers.length == lotteryRules.MaxSelectNumbers && line.extraNumbers.length == lotteryRules.MaxExtraNumbers) {

                                res = line.regularNumbers.join(',') + '#' + line.extraNumbers.join(',');
                            }

                            return res;
                        });

                        var linesAsString = lines.filter(function(line) {
                            return line != '';
                        }).join('|');

                        return linesAsString;
                    }
                }
            }
        }
    ])