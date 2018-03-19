 'use strict';

angular.module('lyPlayPage.directives')
    .directive('lySelectPageLineMobile', [
        '$lyCart',
        'lySelectPageService',
        'lyAppTranslationService',
        function(
            $lyCart,
            lySelectPageService,
            lyAppTranslationService
        ) {
            return {
                restrict: 'A',
                require: ['^lySelectPagePersonalMobile', '^lySelectPageMain'],
                scope: {
                    lineNumber: '=',
                    numbers: '='
                },
                templateUrl: $lyCart.partialPath + 'select-page/templates/line-mobile.html',
                link: function(scope, element, attrs, controllers) {
                    var personalCtrl = controllers[0];
                    var mainCtrl = controllers[1];
                    lyAppTranslationService.getTranslations(scope);
                    scope.lotteryRules = lySelectPageService.getLotteryRules();
                    scope.isVisibleQuickPick = false;
                    scope.showAllNumbersBool = false;
                    scope.pickedNumbers = scope.numbers[scope.lineNumber - 1].regularNumbers;
                    scope.pickedSpecialNumbers = scope.numbers[scope.lineNumber - 1].extraNumbers;
                    scope.isCorrect = isFullLine(scope.lineNumber);

                     scope.$on('update-line-mobile', function(event, newNubers) {
                         scope.numbers = newNubers;
                         scope.pickedNumbers = scope.numbers[scope.lineNumber - 1].regularNumbers;
                         scope.pickedSpecialNumbers = scope.numbers[scope.lineNumber - 1].extraNumbers;
                         alreadyDrawn = false;
                     });

                     scope.onQuickPickClicked = function() {
                        personalCtrl.onQuickPickClicked(scope.lineNumber)
                     };

                     scope.selectNumbers = new Array(scope.lotteryRules.SelectNumbers).join().split(',').map(function(item, index) {
                         return ++index;
                     });
                     var difference = scope.lotteryRules.MinExtraNumber == 0 ? 1 : 0;
                     scope.extraNumbers = new Array(scope.lotteryRules.ExtraNumbers + difference).join().split(',').map(function(item, index) {
                         return index + scope.lotteryRules.MinExtraNumber;
                     });

                    scope.clearLine = function(line) {
                        var allowClear = personalCtrl.clearLine(line);
                        if (allowClear) {
                            scope.pickedNumbers = "";
                            scope.pickedSpecialNumbers = "";
                        }
                        scope.isCorrect = isFullLine(scope.lineNumber);
                        alreadyDrawn = false;
                    }
                    scope.onNumberClicked = function(num, isRegular, $event) {
                        var lineNumb = scope.lineNumber;
                        lySelectPageService.onNumberClicked(num, isRegular, $event, lineNumb);
                        var gameData = lySelectPageService.getAllGameData();
                        scope.pickedNumbers = gameData.personal.lines[lineNumb - 1].regularNumbers;
                        scope.pickedSpecialNumbers = gameData.personal.lines[lineNumb - 1].extraNumbers;
                        mainCtrl.updateTotalDirective();
                        scope.isCorrect = isFullLine(scope.lineNumber);
                    };

                    var alreadyDrawn = false;
                    scope.showAllNumbers = function(lineNumber) {
                        scope.isCorrect = isFullLine(lineNumber);
                        if (!scope.showAllNumbersBool) {
                            scope.showAllNumbersBool = true;
                            if (!alreadyDrawn) {
                                for (var i = 0; i < scope.pickedNumbers.length; i++) {
                                    lySelectPageService.markNumberAsSelected(scope.pickedNumbers[i], true, scope.lineNumber);
                                }
                                for (var i = 0; i < scope.pickedSpecialNumbers.length; i++) {
                                    lySelectPageService.markNumberAsSelected(scope.pickedSpecialNumbers[i], false, scope.lineNumber);
                                }
                            alreadyDrawn = true;
                            }
                        } else {
                            scope.showAllNumbersBool = false;
                        }
                    }
                    function isFullLine(line) {
                        var currentLine = lySelectPageService.getCurrentTicket().lines[line - 1];
                        var lotteryRules = lySelectPageService.getLotteryRules();
                        if (currentLine.regularNumbers.length == lotteryRules.MaxSelectNumbers && currentLine.extraNumbers.length == lotteryRules.MaxExtraNumbers) {
                            return true;
                        }
                        return false;
                    }
                 }
             }
         }
     ])
