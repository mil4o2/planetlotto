 'use strict';

 angular.module('lyPlayPage.directives')
     .directive('lySelectPagePersonal', [
         '$timeout',
         '$lyCart',
         'lySelectPageService',
         'lyAppTranslationService',
         'quickPickService',
         'lySelectPageCacheFactory',
         function(
             $timeout,
             $lyCart,
             lySelectPageService,
             lyAppTranslationService,
             quickPickService,
             lySelectPageCacheFactory
         ) {
             return {
                 restrict: 'A',
                 require: '^lySelectPageMain',
                 scope: {},
                 controller: ['$scope', function($scope) {
                     lyAppTranslationService.getTranslations($scope);

                     var ticket = lySelectPageService.getCurrentTicket();
                     var filledLines = lySelectPageService.countFilledLines(ticket.lines);
                     $scope.moreLines = filledLines > 5 ? true : false;
                     $scope.numbOfLines = [1, 2, 3, 4, 5];
                     $scope.nextLines = [6, 7, 8, 9, 10];
                     $scope.numberOfQuickPick = 5;
                     $scope.elgordoLottery = "elgordo";
                     $scope.showCircleAnim = true;
                     //  if (window.screen.availWidth >= 768 && window.screen.availWidth <= 992) {
                     //      $scope.numbOfLines = [1, 2, 3, 4, 5, 6, 7, 8];
                     //      $scope.nextLines = [9, 10];
                     //      $scope.numberOfQuickPick = 8;
                     //  }

                     $scope.onClearTicket = function(n) {
                         $scope.clearTicket(n);
                     };

                     $scope.AddRemoveLinesCLicked = function() {
                         $scope.moreLines = !$scope.moreLines;

                         //  if (window.screen.availWidth >= 768 && window.screen.availWidth <= 992) {
                         //      $scope.numberOfQuickPick = $scope.moreLines ? 8 : 4;

                         //  } else {
                         $scope.numberOfQuickPick = $scope.moreLines ? 10 : 5;
                         //  }
                         if (!$scope.moreLines) {
                             var lines = lySelectPageService.getAllGameData().personal.lines;
                             for (var i = 6; i <= lines.length; i++) {
                                 if (lines[i - 1].regularNumbers.length >= 1) {
                                     $scope.onClearTicket(i);
                                 }
                             }
                         }
                     }

                     var isRoundQPClicked = false;
                     $scope.roundQuickPickBtnClick = function(lines, isMoreQuickPicks) {
                         isRoundQPClicked = true;
                         $scope.onQuickPickClicked(lines, isMoreQuickPicks);
                     }

                     $scope.onQuickPickClicked = function(lines, isMoreQuickPicks) {
                         // jQuery('.number').removeClass('selected').attr('style', '');                       
                         if (!isMoreQuickPicks) {
                             hideQuickpickButton(lines);
                         }

                         var startIndex = isMoreQuickPicks ? 0 : lines - 1;

                         var ticket = lySelectPageService.getCurrentTicket();
                         var draws = ticket.draws;
                         var lotteryId = lySelectPageService.getLotteryRules().LotteryTypeId;

                         var data = quickPickService.getPersonalQuickpickData(lotteryId, draws, 10);

                         quickPickService.getQuickPick(data)
                             .then(function(resp) {
                                 for (var i = startIndex; i < lines; i += 1) {
                                     animateQuickPick(i, resp.QuickPick.SelectedNumbers)
                                 }
                             }, function(error) {
                                 console.warn("Error in getQuickPick: " + error);
                             })

                     };

                     $scope.setQuickPickNumbers = function(numbers, line) {
                         var game = lySelectPageService.getAllGameData();
                         var lines = lySelectPageService.sanitizeNumbers(numbers);

                         var ticket = lySelectPageService.getCurrentTicket();
                         var ticketLines = ticket.lines;
                         lySelectPageService.clearTicket(line);

                         if ($scope.elgordoLottery == game.game) {
                             var lotteryRules = lySelectPageService.getLotteryRules();
                             lines[line - 1] = quickPickService.getRandomQuickPickLine(lotteryRules.MaxSelectNumbers, lotteryRules.SelectNumbers, 1, lotteryRules.ExtraNumbers);
                         }

                         ticket.lines[line - 1] = lines[line - 1];
                         lySelectPageService.markRandomNumbers(lines[line - 1].regularNumbers, line, true);

                         var extraNumbers = lines[line - 1].extraNumbers;
                         if ($scope.elgordoLottery == game.game) {
                             var extraNumberTaken = false;
                             ticketLines.forEach(function(currentLine, index) {
                                 if (currentLine.extraNumbers.length > 0 && !extraNumberTaken && line != index + 1) {
                                     extraNumbers = currentLine.extraNumbers;
                                     ticket.lines[line - 1].extraNumbers = extraNumbers;
                                     extraNumberTaken = true;
                                 }
                             });
                             lySelectPageService.markEqualExtraNumbers(extraNumbers[0], line, ticket, true);
                         }
                         lySelectPageService.markRandomNumbers(extraNumbers, line, false);

                         game.personal = ticket;
                         lySelectPageService.saveTicketsInfo(game);
                         $scope.$broadcast("QP", { fromBig: isRoundQPClicked });
                         $scope.$broadcast('set-needed-nubers');
                         isRoundQPClicked = false;
                     }
                     this.onQuickPickClicked = $scope.onQuickPickClicked;


                     this.initializeTicket = function(line, isRegular) {
                         var allTickets = lySelectPageService.getAllGameData();
                         var ticket = allTickets.personal.lines[line - 1];

                         if (ticket.line > 5 && !$scope.moreLines &&
                             (ticket.regularNumbers.length > 0 || ticket.extraNumbers.length > 0)) {
                             $scope.onClickMoreLessBtn();
                         }
                         if (allTickets.game == "newyorklotto") {
                             $scope.numberOfQuickPick = 4;
                         }
                         if ($scope.moreLines) {
                             $scope.numberOfQuickPick = 10;
                         }
                         if (allTickets.personal.filledLines > 5) {
                             $scope.numberOfQuickPick = 10;
                         }
                         if (isRegular) {
                             var regNumbers = ticket.regularNumbers;
                             lySelectPageService.markRandomNumbers(regNumbers, line, true);
                         } else {
                             var extraNumbers = ticket.extraNumbers;
                             lySelectPageService.markRandomNumbers(extraNumbers, line, false);
                         }
                     };

                     this.onClearTicketClicked = function(line) {
                         $scope.clearTicket(line);
                     }
                     this.stopCircleAnimation = function() {
                         $scope.showCircleAnim = false;
                     }

                     function animateQuickPick(line, lines) {
                         line += 1;
                         var varCounter = 0;

                         var varName = setInterval(function() {
                             if (varCounter < 4) {
                                 //  $scope.clearTicket(line);
                                 $scope.quickPick(line);
                                 varCounter++;
                             } else {
                                 $scope.setQuickPickNumbers(lines, line);
                                 showQuickpickButton(line);
                                 clearInterval(varName);
                                 return;
                             }
                         }, 100);
                     }

                     function hideQuickpickButton(lineNumber) {
                         var lineId = "#quickpickIndex" + lineNumber;
                         var currentLine = jQuery(lineId)[0];
                         currentLine.style.pointerEvents = "none";
                         currentLine.style.opacity = "0.2";
                     }

                     function showQuickpickButton(lineNumber) {
                         var lineId = "#quickpickIndex" + lineNumber;
                         var currentLine = jQuery(lineId)[0];
                         currentLine.style.pointerEvents = "";
                         currentLine.style.opacity = "1";
                     }
                 }],
                 templateUrl: $lyCart.partialPath + 'select-page/templates/personal.html',
                 link: function(scope, element, attrs, mainCtrl) {
                     var personalArea = element.find('#select-numbers');
                     scope.showCircleAnim = true;
                     var timer = null;
                     scope.arr = [];

                     scope.stopCircleAnimation = function() {
                         scope.showCircleAnim = false;
                     }

                     if (isEmptyPersonalArea()) {
                         personalArea.addClass('show-select-numbers');
                     }

                     scope.quickPick = function quickPick(line) {
                         lySelectPageService.quickPickMarkNumbers(line);
                         mainCtrl.updateTotalDirective();
                         scope.showCircleAnim = false;
                     };

                     scope.clearTicket = function clearTicket(line) {
                         lySelectPageService.clearTicket(line);
                         mainCtrl.updateTotalDirective();
                     };

                     scope.deselectArea = function() {
                         $timeout.cancel(timer);
                         personalArea.removeClass('show-select-numbers');
                         personalArea.addClass('hide-select-numbers');
                     };

                     scope.$on('update-needed-numbers', function() {
                         scope.$broadcast('set-needed-nubers');
                     });

                     scope.selectArea = function() {
                         timer = $timeout(function() {
                             if (isEmptyPersonalArea()) {
                                 personalArea.removeClass('hide-select-numbers');
                                 personalArea.addClass('show-select-numbers');
                             }
                         }, 5000);
                     };

                     function isEmptyPersonalArea() {
                         var ticket = lySelectPageService.getCurrentTicket();
                         var isEmpty = true;

                         for (var line = 0; line < ticket.lines.length; line += 1) {
                             if (ticket.lines[line].regularNumbers.length != 0 || ticket.lines[line].extraNumbers.length != 0) {
                                 isEmpty = false;
                                 break;
                             }
                         }

                         return isEmpty;
                     }
                 }
             };
         }
     ])