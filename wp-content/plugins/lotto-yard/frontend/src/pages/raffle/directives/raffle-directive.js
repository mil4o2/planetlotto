'use strict'

angular.module('lyApp.directives')
    .directive('lyRaffle', [
        '$lyCart',
        'lyCartService',
        'lyCart',
        'lyAppLotteriesService',
        'lyAppProductsServices',
        'lyConstants',
        'stateHelper',
        function(
            $lyCart,
            lyCartService,
            ngCart,
            lyAppLotteriesService,
            lyAppProductsServices,
            lyConstants,
            stateHelper
        ) {
            return {
                restrict: 'A',
                controller: ['$scope', '$state', function($scope, $state) {
                    if (!$scope.raffleNumbers) {
                        stateHelper.goToHomePage();
                        return;
                    }

                    $scope.Ids = $scope.raffleNumbers.map(function(n) {
                        return n.Id;
                    });

                    $scope.minShares = 1;
                    $scope.maxShares = $scope.raffleNumbers.length;
                    $scope.ticketNumber = Math.floor($scope.raffleNumbers[0].Number / 10);
                    $scope.lineTicket = $scope.raffleNumbers[0].Ticket;
                    $scope.lineSeat = $scope.raffleNumbers[0].Seat;
                    $scope.productExpire = [];
                    $scope.ticketInfo = $scope.ticketNumber + '-' + $scope.lineSeat + '-' + $scope.lineTicket;
                    $scope.shares = 1;
                    $scope.raffleNumbers.forEach(function(item) {
                        var current = new Date();
                        current.setMinutes(current.getMinutes() + 5);
                        var currentTime = {
                            id: item.Id,
                            exp: current
                        };

                        $scope.productExpire.push(currentTime);
                    });

                    var productData = lyAppProductsServices.getProductAndLotteryIds($state.params.pageslug);
                    var priceObject = lyAppProductsServices.getProductPriceByIds(productData.id, $scope.shares, productData.lotteryTypeId);

                    if (priceObject) {
                        $scope.price = priceObject.Price;
                    } else {
                        $scope.price = 0;
                    }

                    $scope.totalCost = $scope.price * $scope.shares;

                    $scope.changeShares = function(share) {
                        var current = $scope.shares + share;

                        if (current > $scope.maxShares) {
                            current--;
                        } else if (current < $scope.minShares) {
                            current++;
                        }

                        $scope.shares = current;
                        $scope.totalCost = $scope.price * $scope.shares;
                    };

                    $scope.saveToCart = function() {
                        ngCart.addRaffle(productData.lotteryTypeId, $scope.shares, $scope.ticketInfo, productData.id, $scope.productExpire.slice(0, 1), $scope.Ids);
                        stateHelper.goToCartPage();
                    }
                }],
                templateUrl: lyConstants.partialPath + 'raffle/templates/ly-raffle.html'
            }
        }
    ])