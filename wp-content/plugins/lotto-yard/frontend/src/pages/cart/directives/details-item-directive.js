'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyDetailsItem
     * @restrict A
     * @element ANY
     *
     * @description
     */
    .directive('lyDetailsItem', [
        'lyConstants',
        'lyAppProductsServices',
        'stateHelper',
        'lyCart',
        '$uibModal',
        function(
            lyConstants,
            lyAppProductsServices,
            stateHelper,
            lyCart,
            $uibModal
        ) {
            return {
                restrict: 'A',
                scope: {
                    active: '=',
                    item: '='
                },
                templateUrl: lyConstants.partialPath + 'cart/templates/show-details.html',
                link: function(scope) {
                    scope.getNavidatTicketParts = function(numbersAsString) {
                        return numbersAsString.split("-");
                    };
                    scope.$watch('item.getNumbers()', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            scope.lines = scope.item.getNumbersSantized();
                        }
                    });
                    scope.$watch('active', function(newValue, oldValue) {
                        getIsGroup();
                    });
                    function getIsGroup(){
                        if (scope.item && scope.item.getProductType() == 3) {
                            scope.isSyndicate = true;
                            var lotteryID = scope.item.getLotteryType();
                            lyAppProductsServices.getSyndicateNumbers(lotteryID)
                                .then(function(resp) {
                                    scope.lines = resp;
                                }, function(error) {
                                    stateHelper.goToPlayPage(scope.item.getLotteryName(), false);
                                });
                        } else if(scope.item) {
                            scope.isSyndicate = false;
                            scope.lines = scope.item.getNumbersSantized();
                        }
                    }
                    getIsGroup();

                    scope.getSanitizedNumbers = function(numbers, index) {
                        var splittedNumbers = numbers.split('#');

                        if (splittedNumbers[index]) {
                            return splittedNumbers[index].split(',');
                        }
                        return [];
                    };

                    scope.editLine = function editLine(index, item) {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: lyConstants.partialPath + 'cart/templates/editLine.html',
                            controller: 'EditLineDialogCtrl',
                            scope: scope
                        });

                        scope.ngDialogData = {
                            item: item,
                            line: index,
                            items: lyCart.getItems(),
                            modalInstance: modalInstance
                        };

                        console.log(index, " ", item);
                    };
                }
            }
        }
    ])
