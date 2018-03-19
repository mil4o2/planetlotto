'use strict';

angular.module('lyPlayPage.directives')
    .directive('lySelectPageGroupNumbers', [
        '$lyCart',
        '$timeout',
        'lySelectPageService',
        function(
            $lyCart,
            $timeout,
            lySelectPageService
        ) {
            return {
                restrict: 'A',
                scope: {
                    arr: '=',
                    line: '=',
                    isRegularNumber: '=',
                    neededNumbers: '='
                },
                require: ['^lySelectPageMain', '^lySelectPagePersonal'],
                templateUrl: $lyCart.partialPath + 'select-page/templates/group-number.html',
                link: function(scope, element, attrs, controllers) {
                    var mainCtrl = controllers[0];
                    var personalCtrl = controllers[1];
                    scope.lotteryRules = lySelectPageService.getLotteryRules();

                    scope.onNumberClicked = function(num, isRegular, $event) {
                        var lineNumber = this.$parent.line;
                        lySelectPageService.onNumberClicked(num, isRegular, $event, lineNumber);
                        scope.$emit('update-needed-numbers');
                        mainCtrl.updateTotalDirective();
                    };

                    $timeout(function() {
                        var ticket = lySelectPageService.getAllGameData();
                        if (ticket.isClassicActiveTab) {
                            personalCtrl.initializeTicket(scope.line, scope.isRegularNumber);
                        }

                        mainCtrl.updateTotalDirective();
                    }, 0);
                    scope.onQuickPickClicked = function() {
                        personalCtrl.onQuickPickClicked(scope.lineNumber);
                    };
                }
            };
        }
    ])