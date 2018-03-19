 'use strict';

 angular.module('lyCart')
     .controller('EditLineDialogCtrl', [
         '$scope',
         'quickPickService',
         'lyAppTranslationService',
         function(
             $scope,
             quickPickService,
             lyAppTranslationService
         ) {
             lyAppTranslationService.getTranslations($scope);
             var _ = window._;
             $scope.items = $scope.ngDialogData.items;
             var item = $scope.ngDialogData.item;
             var line = $scope.ngDialogData.line;
             line++;

             $scope.isValidSelectLine = true;
             $scope.isValidExtraLine = true;
             $scope.line = line;
             $scope.item = item;
             $scope.picksLeft = 0;
             $scope.extraNumbersPicksLeft = 0;

             var allNumbers = item.getNumbersSantized()[line - 1].split('#');
             var selectedNumbers = allNumbers[0] ? allNumbers[0].split(',').map(function(num) {
                 return parseInt(num);
             }) : [];

             var extraNumbers = allNumbers[1] ? allNumbers[1].split(',').map(function(num) {
                 return parseInt(num);
             }) : []

             $scope.originalNumbers = {
                 slectedNumbers: _.sortBy(selectedNumbers).join(','),
                 extraNumbers: _.sortBy(extraNumbers).join(',')
             };

             changeNumbers(selectedNumbers, extraNumbers);
             line -= 1;

             initLine(item, line);

             $scope.changeLine = function(index) {
                 var newLine = $scope.line + index - 1;
                 var maxLine = $scope.item.getNumbersSantized().length;

                 if (newLine >= 0 && newLine < maxLine) {
                     $scope.line = newLine + 1;
                     $scope.picksLeft = 0;
                     initLine($scope.item, newLine);
                 }
             }

             $scope.closeThisDialog = function() {
                 $scope.ngDialogData.modalInstance.close();
             };

             $scope.clickNumber = function(number, isRegularNumber) {
                 isRegularNumber ? $scope.isValidSelectLine = false : $scope.isValidExtraLine = false;
                 var min = isRegularNumber ? item.getRules().MinSelectNumber : item.getRules().MinExtraNumber;
                 var max = isRegularNumber ? item.getRules().MaxSelectNumbers : item.getRules().MaxExtraNumbers;
                 var allNumbers = isRegularNumber ? $scope.selectedNumbers : $scope.selectedNumbersExtra;

                 var totalSelectNumbers = countSelectedNumbersInArray(allNumbers);
                 if (totalSelectNumbers < max) {
                     if (number.isSelected) {
                         number.isSelected = 0;
                         isRegularNumber ? $scope.picksLeft++ : $scope.extraNumbersPicksLeft++;
                     } else {
                         isRegularNumber ? $scope.picksLeft-- : $scope.extraNumbersPicksLeft--;
                         number.isSelected = 1;
                     }

                     changeCurrentLine(number.id, isRegularNumber);
                 } else {
                     if (number.isSelected) {
                         number.isSelected = 0;
                         isRegularNumber ? $scope.picksLeft++ : $scope.extraNumbersPicksLeft++;
                         changeCurrentLine(number.id, isRegularNumber);
                     }
                 }

                 allNumbers = isRegularNumber ? $scope.selectedNumbers : $scope.selectedNumbersExtra;
                 totalSelectNumbers = countSelectedNumbersInArray(allNumbers);

                 //  if (min !== 0) {
                 if (totalSelectNumbers == max) {
                     isRegularNumber ? $scope.isValidSelectLine = true : $scope.isValidExtraLine = true;
                 }
                 //  }
             };

             $scope.checkInput = function(_line) {
                 //imame item i line
                 var selectedNumbers = countSelectedNumbersInArray($scope.selectedNumbers);
                 var selectedExtraNumbers = countSelectedNumbersInArray($scope.selectedNumbersExtra);
                 var maxSelectNumbers = item.getRules().MaxSelectNumbers;

                 if (selectedNumbers !== maxSelectNumbers) {
                     $scope.isValidSelectLine = false;
                     return false;
                 }

                 //todo check if there is extra numvbers
                 if (selectedExtraNumbers > 0 || selectedExtraNumbers !== item.getRules().MaxExtraNumbers) {
                     if (selectedExtraNumbers !== item.getRules().MaxExtraNumbers) {
                         $scope.isValidExtraLine = false;
                         return false;
                     }
                 }

                 if ($scope.isValidSelectLine && $scope.isValidExtraLine) {
                     var currentLineToUpdate = item.getNumbersSantized()[_line];
                     console.log(currentLineToUpdate);

                     var newLine = [];

                     $scope.selectedNumbers.filter(function(value) {
                         if (value.isSelected) {
                             newLine.push(value.id);
                             return false;
                         } else {
                             return true;
                         }
                     });

                     var newLineToUpdate = newLine.join(',');

                     if ($scope.selectedNumbersExtra.length > 0) {
                         var newExtraLine = [];

                         $scope.selectedNumbersExtra.filter(function(value) {
                             if (value.isSelected) {
                                 newExtraLine.push(value.id);
                                 return false;
                             } else {
                                 return true;
                             }

                         });

                         newLineToUpdate += '#' + newExtraLine.join(',');

                         // elgordo update all lines with same special numbers
                         if (item.getLotteryType() === 10) {
                             var allLines = item.getNumbersSantized();

                             angular.forEach(allLines, function(line, index) {

                                 var splittedLine = line.split('#');
                                 var oldLine = splittedLine[0];
                                 var extraNumber = newExtraLine[0];
                                 var lineToUpdate = oldLine + '#' + extraNumber;

                                 item.updateSantizedLine(lineToUpdate, index + 1);

                             });
                         }
                     }

                     console.log(newLineToUpdate);
                     item.updateSantizedLine(newLineToUpdate, _line);
                 }

                 return true;
             };

             $scope.clearLine = function() {
                 clearSelectedNumbersInArray($scope.selectedNumbers);
                 clearSelectedNumbersInArray($scope.selectedNumbersExtra);

                 $scope.isValidSelectLine = false;
                 changeNumbers([], []);
             }

             $scope.quickpick = function() {
                 var data = quickPickService.getPersonalQuickpickData(item.getLotteryType(), item.getNumberOfDraws(), 10);
                 quickPickService.getQuickPick(data)
                     .then(function(resp) {
                         $scope.picksLeft = 0;
                         clearSelectedNumbersInArray($scope.selectedNumbers);
                         clearSelectedNumbersInArray($scope.selectedNumbersExtra);

                         var allnumbersArray = resp.QuickPick.SelectedNumbers.split('|');
                         var numbers = allnumbersArray[0].split('#');
                         var previousNumbers = $scope.currentNumbers.slectedNumbers.toString() + '#' + $scope.currentNumbers.extraNumbers.toString();
                         if (previousNumbers == allnumbersArray[0]) {
                             numbers = allnumbersArray[1].split('#');
                         }

                         var selectedNumbers = numbers[0].split(',').map(Number);
                         var selectedNumbersExtra = numbers[1].length ? numbers[1].split(',').map(Number) : [];
                         changeNumbers(selectedNumbers, selectedNumbersExtra);
                         $scope.isChanged = isValidLine($scope.currentNumbers);

                         selectedNumbers.forEach(function(number) {
                             $scope.selectedNumbers[number - 1].isSelected = 1;
                         });

                         selectedNumbersExtra.map(function(number) {
                             $scope.selectedNumbersExtra[number - 1].isSelected = 1;
                         });

                         $scope.isValidSelectLine = true;
                         $scope.isValidExtraLine = true;

                     }, function(error) {
                         console.warn("Error in QuickPick: " + error);
                     })
             };

             function changeNumbers(selected, extra) {
                 $scope.currentNumbers = {
                     slectedNumbers: selected,
                     extraNumbers: extra
                 };
             }

             function countSelectedNumbersInArray(arr) {
                 var totalSelectNumbers = 0;
                 arr.filter(function(value) {
                     if (value.isSelected) {
                         totalSelectNumbers++;
                         return false;
                     } else {
                         return true;
                     }
                 });

                 return totalSelectNumbers;
             }

             function clearSelectedNumbersInArray(arr) {
                 return arr.filter(function(value) {
                     if (value.isSelected) {
                         value.isSelected = 0;
                         return false;
                     } else {
                         return true;
                     }
                 });
             }

             function initLine(item, line) {
                 var selectNumbers = item.getRules().SelectNumbers;
                 var selectNumbersExtra = item.getRules().ExtraNumbers;

                 var selectNumberArray = [];
                 var selectNumberExtraArray = [];
                 var currentLine = item.getNumbersSantized()[line];

                 var emptyLine = false;

                 if (typeof currentLine === 'undefined') {
                     emptyLine = true;
                 }

                 var specialNumbers = '';

                 if (!emptyLine) {
                     var indexOfStartSpecialNumber = currentLine.indexOf('#');
                     if (indexOfStartSpecialNumber !== -1) {
                         console.log(currentLine);
                         specialNumbers = currentLine.substr(parseInt(currentLine.indexOf(('#')) + 1));

                         specialNumbers = specialNumbers.split(',');
                         console.log(specialNumbers);
                         specialNumbers = specialNumbers.map(function(x) {
                             return parseInt(x);
                         });
                     }
                     var currentLineSplited;
                     if (indexOfStartSpecialNumber === -1) {
                         currentLineSplited = currentLine.split(',');
                     } else {
                         currentLineSplited = currentLine.slice(0, indexOfStartSpecialNumber).split(',');
                     }

                     currentLineSplited = currentLineSplited.map(function(x) {
                         return parseInt(x);
                     });

                     console.log(currentLineSplited);
                 }

                 var startNumber = item.getRules().MinSelectNumber;

                 for (var i = startNumber; i <= selectNumbers; i++) {
                     var n = {
                         id: i,
                         isSelected: 0
                     };
                     if (!emptyLine) {
                         if (currentLineSplited.indexOf(i) >= 0) {
                             n.isSelected = 1;
                         }
                     }

                     selectNumberArray.push(n);
                 }

                 // var startExtraNumber = item.getMinExtraNumber();
                 var startExtraNumber = item.getRules().MinExtraNumber;
                 //id 10 is Elgordo
                 if (item.getRules().MaxSelectNumbers > 0) {
                     for (var j = startExtraNumber; j <= selectNumbersExtra; j++) {
                         var extra = {
                             id: j,
                             isSelected: 0
                         };
                         if (!emptyLine) {
                             if (specialNumbers.indexOf(j) >= 0) {
                                 extra.isSelected = 1;
                             }
                         }

                         selectNumberExtraArray.push(extra);
                     }
                 }

                 $scope.selectedNumbers = selectNumberArray;
                 $scope.selectedNumbersExtra = selectNumberExtraArray;
             }

             function changeCurrentLine(number, isSelectedNumber) {
                 var index = isSelectedNumber ? _.indexOf($scope.currentNumbers.slectedNumbers, number) : _.indexOf($scope.currentNumbers.extraNumbers, number);

                 if (index == -1) {
                     isSelectedNumber ? $scope.currentNumbers.slectedNumbers.push(number) : $scope.currentNumbers.extraNumbers.push(number);
                 } else {
                     isSelectedNumber ? $scope.currentNumbers.slectedNumbers.splice(index, 1) : $scope.currentNumbers.extraNumbers.splice(index, 1);
                 }

                 $scope.isChanged = isValidLine($scope.currentNumbers);
             }

             function isValidLine(currentNumbers) {
                 var selectedNumbers = _.sortBy(currentNumbers.slectedNumbers).join(',');
                 var extraNumbers = _.sortBy(currentNumbers.extraNumbers).join(',');

                 var invalidSelectNumbers = item.getRules().MinSelectNumber > currentNumbers.slectedNumbers.length || item.getRules().MaxSelectNumbers < currentNumbers.slectedNumbers.length;
                 var invalidExtraNumbers = item.getRules().MinExtraNumbers > currentNumbers.extraNumbers.length || item.getRules().MaxExtraNumbers < currentNumbers.extraNumbers.length;
                 if (invalidSelectNumbers || invalidExtraNumbers) {
                     return false
                 }

                 //  if (selectedNumbers.length < $scope.originalNumbers.slectedNumbers.length || extraNumbers.length < $scope.originalNumbers.extraNumbers.length) {
                 //      return false;
                 //  }

                 if (selectedNumbers == $scope.originalNumbers.slectedNumbers && extraNumbers == $scope.originalNumbers.extraNumbers) {
                     return false
                 }

                 return true;
             }
         }
     ]);