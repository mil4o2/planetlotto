  'use strict';

  angular.module('lyPlayPage.directives')
      .directive('lySelectPagePersonalMobile', [
          '$timeout',
          '$lyCart',
          'lySelectPageService',
          'lyAppTranslationService',
          'quickPickService',
          'stateHelper',
          function(
              $timeout,
              $lyCart,
              lySelectPageService,
              lyAppTranslationService,
              quickPickService,
              stateHelper
          ) {
              return {
                  restrict: 'A',
                  scope: {},
                  require: '^lySelectPageMain',
                  controller: ['$scope', function($scope) {
                      lyAppTranslationService.getTranslations($scope);
                      $scope.moreLines = false;
                      $scope.numbOfLines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                      var gameData = lySelectPageService.getAllGameData();
                      $scope.numbers = gameData.personal.lines;
                      $scope.lotteryRules = lySelectPageService.getLotteryRules();

                      function renderLines(numberOfLines) {
                          var lotteryId = lySelectPageService.getLotteryRules().LotteryTypeId;
                          var draws = gameData.personal.draws;

                          var data = quickPickService.getPersonalQuickpickData(lotteryId, draws, 10);
                          quickPickService.getQuickPick(data)
                              .then(function(resp) {
                                      var newNumbs = lySelectPageService.sanitizeNumbers(resp.QuickPick.SelectedNumbers);
                                      for (var i = 0; i < numberOfLines; i += 1) {
                                          gameData.personal.lines[i].extraNumbers = newNumbs[i].extraNumbers;
                                          gameData.personal.lines[i].regularNumbers = newNumbs[i].regularNumbers;
                                      }

                                      $scope.numbers = gameData.personal.lines;
                                      gameData.personal.filledLines = numberOfLines;
                                      lySelectPageService.saveTicketsInfo(gameData);
                                      $scope.$broadcast('update-line-mobile', gameData.personal.lines);
                                  },
                                  function(error) {
                                      stateHelper.goToHomePage();
                                  })
                      }
                      renderLines(5);

                      $scope.onClickMoreLessBtn = function(needMoreLines) {
                          $scope.moreLines = needMoreLines;
                          if (!needMoreLines) {
                              jQuery('.tickets-content-inner .numbersHidden .numbers').each(function(index){
                                  if (index > 4){
                                    for (var i = 0; i < this.children.length; i++) {
                                        if (jQuery(this).find('.number').hasClass('selected')) {
                                            jQuery(this).find('.number').removeClass('selected').attr('style','');
                                        }
                                    }
                                  }
                              })
                              renderLines(5);
                          }
                          lySelectPageService.saveTicketsInfo(gameData);
                          $scope.$broadcast('update-total', gameData.personal.productId, gameData.personal.draws, gameData.personal.filledLines, gameData.personal.discount);
                      };

                      clearLine = function(line) {
                          if (gameData.personal.filledLines - 1 >= $scope.lotteryRules.MinLines) {
                              gameData.personal.filledLines--;
                              gameData.personal.lines[line - 1].extraNumbers.splice(0);
                              gameData.personal.lines[line - 1].regularNumbers.splice(0);
                              lySelectPageService.saveTicketsInfo(gameData);
                              $scope.$broadcast('update-total', gameData.personal.productId, gameData.personal.draws, gameData.personal.filledLines, gameData.personal.discount);
                              return true;
                          } else {
                              return false;
                          }
                      }
                      this.clearLine = clearLine;

                      $scope.quickPickLinesAndGoToCart = function(howMuch) {
                          var ticket = lySelectPageService.getCurrentTicket();
                          var draws = ticket.draws;
                          var lotteryId = lySelectPageService.getLotteryRules().LotteryTypeId;
                          var isSubscription = ticket.drawOption == 'subscriptionDraw' ? true : false;
                          quickPickService.addPersonalQuickPickToCart(draws, howMuch, lotteryId, isSubscription)
                              .then(function() {
                                  stateHelper.goToCartPage();
                              });
                      };

                      this.onQuickPickClicked = function(lines, isMoreQuickPicks) {
                          var startIndex = isMoreQuickPicks ? 0 : lines - 1;

                          var ticket = lySelectPageService.getCurrentTicket();
                          var draws = ticket.draws;
                          var lotteryId = lySelectPageService.getLotteryRules().LotteryTypeId;

                          var data = quickPickService.getPersonalQuickpickData(lotteryId, draws, 10);

                          quickPickService.getQuickPick(data)
                              .then(function(resp) {
                                  for (var i = startIndex; i < lines; i += 1) {
                                      $scope.setQuickPickNumbers(resp.QuickPick.SelectedNumbers, i + 1);
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
                          ticket.filledLines++;
                          gameData.personal.filledLines++;
                          if ($scope.elgordoLottery == game.game) {
                              var lotteryRules = lySelectPageService.getLotteryRules();
                              lines[line - 1] = quickPickService.getRandomQuickPickLine(lotteryRules.MaxSelectNumbers, lotteryRules.SelectNumbers, 1, lotteryRules.ExtraNumbers);
                          }
                          ticket.lines[line - 1] = lines[line - 1];
                          lySelectPageService.clearTicket(line);
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
                          $scope.$broadcast("QP", { fromBig: false });
                          $scope.$broadcast('update-line-mobile', game.personal.lines);
                      }
                  }],
                  templateUrl: $lyCart.partialPath + 'select-page/templates/personal-mobile.html',
                  link: function(scope, element, attrs, mainCtrl) {
                      mainCtrl.updateTotalDirective();

                      scope.quickPick = function quickPick(line) {
                          lySelectPageService.quickPickMarkNumbers(line);
                          mainCtrl.updateTotalDirective();
                      };
                  },
              }
          }
      ])
