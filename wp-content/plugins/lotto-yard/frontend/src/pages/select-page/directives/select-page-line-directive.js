 'use strict';

 angular.module('lyPlayPage.directives')
     .directive('lySelectPageLine', [
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
                 require: '^lySelectPagePersonal',
                 scope: {
                     lineNumber: '=',
                     stopCircleAnim: '='
                 },
                 templateUrl: $lyCart.partialPath + 'select-page/templates/line.html',
                 link: function(scope, element, attrs, personalCtrl) {

                     lyAppTranslationService.getTranslations(scope);
                     scope.isCorrect = isFullLine(scope.lineNumber);
                     scope.isEmpty = isEmptyLine(scope.lineNumber);
                     scope.lotteryRules = lySelectPageService.getLotteryRules();
                     scope.isVisibleQuickPick = false;
                     scope.specialBalls = [];
                     scope.specialBalls['EuroMillions1'] = 'Lucky Numbers';
                     scope.specialBalls['EuroMillions'] = 'Lucky Number';
                     scope.specialBalls['EuroJackpot'] = 'Eurostar';
                     scope.specialBalls['EuroJackpot1'] = 'Eurostars';
                     scope.specialBalls['MegaMillions'] = ' Mega Ball';
                     scope.specialBalls['ElGordo'] = 'Number';
                     scope.specialBalls['PowerBall'] = ' Powerball';

                     setNeededNumbers();

                     scope.$on('set-needed-nubers', function() {
                         setNeededNumbers();
                     });

                     scope.hoverLine = function(isHovered) {
                         scope.isVisibleQuickPick = isHovered;
                         if (isHovered) {
                             scope.isCorrect = false;
                             scope.isEmpty = true;
                         } else {
                             scope.isCorrect = isFullLine(scope.lineNumber);
                             scope.isEmpty = isEmptyLine(scope.lineNumber);
                         }

                         if (scope.isCorrect === true) {
                             personalCtrl.stopCircleAnimation()
                         }
                     };

                     scope.selectNumbers = new Array(scope.lotteryRules.SelectNumbers).join().split(',').map(function(item, index) {
                         return ++index;
                     });

                     var difference = scope.lotteryRules.MinExtraNumber == 0 ? 1 : 0;
                     scope.extraNumbers = new Array(scope.lotteryRules.ExtraNumbers + difference).join().split(',').map(function(item, index) {
                         return index + scope.lotteryRules.MinExtraNumber;
                     });

                     scope.onQuickPickClicked = function() {
                         personalCtrl.onQuickPickClicked(scope.lineNumber);
                         qpClicked = true;
                     };

                     scope.onClearTicket = function() {
                         personalCtrl.onClearTicketClicked(scope.lineNumber);
                         setNeededNumbers();
                         scope.isCorrect = false;
                         scope.isEmpty = true;
                     };

                     var qpClicked = false;
                     scope.$on("QP", function(event, args) {
                         if (qpClicked || args.fromBig) {
                             scope.isCorrect = true;
                             scope.isEmpty = false;
                             qpClicked = false;
                         }
                     })

                     function isEmptyLine(line) {
                         var currentLine = lySelectPageService.getCurrentTicket().lines[line - 1];
                         if (currentLine.regularNumbers.length == 0 && currentLine.extraNumbers.length == 0) {
                             return true;
                         }
                         return false;
                     }

                     function setNeededNumbers() {
                         var ticket = lySelectPageService.getCurrentTicket();
                         var currentLine = ticket.lines[scope.lineNumber - 1];
                         scope.neededNormalNumbers = scope.lotteryRules.MaxSelectNumbers - currentLine.regularNumbers.length;
                         scope.neededExtraNumbers = scope.lotteryRules.MaxExtraNumbers - currentLine.extraNumbers.length;
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
             };
         }
     ])