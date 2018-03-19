'use strict';

angular.module('lyMyAccount.directives')
    .directive('lyMyAccountProduct', [
        'lyConstants',
        'lyAppTranslationService',
        'lyAppProductsServices',
        'lySelectPageService',
        '$uibModal',
        function(
            lyConstants,
            lyAppTranslationService,
            lyAppProductsServices,
            lySelectPageService,
            $uibModal
        ) {
            return {
                restrict: 'A',
                scope: {
                    product: '='
                },
                link: function(scope, $rootScope) {
                    lyAppTranslationService.getTranslations(scope);
                    //remove repeating lotteries
                    // for (var i = scope.product.Lotteries.length - 1; i > 0; i--) {
                    //     if (scope.product.Lotteries[i].LotteryName == scope.product.Lotteries[i - 1].LotteryName) {
                    //         scope.product.Lotteries[i].LotteryName = '';
                    //     }
                    // }

                    lyAppProductsServices.getSyndicateNumbers(scope.product.ProductId)
                        .then(function(resp) {
                            scope.viewNumbers = resp;
                        }, function(error) {
                            console.warn(error);
                        });

                    scope.showSeeNumbs = function(product, lotery, index) {
                        // index = index == 0 ? 0 : index - 1;
                        //For Bundles
                        if (product.Product.toLowerCase() == 'bundle' && lotery.lotteryName !== 'RedCrossDraw' && product.MainLottery != 'AgainstCancer') {
                            //Second button See Your Numbers for lotteries with 2 personal lines - NY lotto or Bonoloto- should be hidden for the following bundles: Millionare Club, American Dream, Six Pack.
                            if (product.MainLottery == 'MillionaireClub' || product.MainLottery == 'AmericanDream' || product.MainLottery == 'SixPack'){
                                if (lotery.lotteryName == 'BonoLoto' || lotery.lotteryName == 'NewYorkLotto') {
                                    if (index > 0 && product.Lotteries[index - 1].lotteryName == lotery.lotteryName){
                                        return false;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        //For Groups
                        } else if(product.Product.toLowerCase() != 'bundle' && lotery.selectedNumbers.length == 0) {
                            return true;
                        } else if (product.MainLottery == 'FreeTicket'){
                            return false;
                        } else {
                            return false;
                        }
                    }

                    scope.showNumbers = function(lotteryName) {
                        var lotteryTypeId = lotteryIdsByName[lotteryName];
                        scope.lotteryName = lotteryName;
                        lyAppProductsServices.getSyndicateNumbers(lotteryTypeId)
                            .then(function(resp) {
                                scope.viewNumbers = resp;
                                $rootScope.modalInstance = $uibModal.open({
                                    animation: true,
                                    template: '<div ly-select-page-show-numbers numbers="viewNumbers" lottery-name="lotteryName"></div>',
                                    scope: scope,
                                    windowClass: 'group-numbers',
                                });

                            }, function(error) {
                                console.warn(error);
                            });
                        window.$rootScope = $rootScope;
                    };

                    if (scope.product.Lotteries[0].SelectedNumbers || scope.product.Lotteries[0].LotteryName) {
                        scope.product.Lotteries = scope.product.Lotteries.map(function(lottery) {

                            var selectedNumbers = [];
                            var extraNUmbers = [];

                            if (lottery.SelectedNumbers) {
                                var numbers = lottery.SelectedNumbers.split(/#/);
                                selectedNumbers = numbers[0].split(/,/);
                                extraNUmbers = numbers.length > 1 ? numbers[1].split(/,/) : [];
                            }

                            return {
                                selectedNumbers: selectedNumbers,
                                extraNumbers: extraNUmbers,
                                lotteryName: lottery.LotteryName
                            }
                        });
                    }

                    if (scope.product.Status == 'Inactive') {
                        scope.activeLines = 0;
                    } else {
                        var linesData = scope.product.LinesLeft.split('/');
                        var inProgressLines = parseInt(linesData[0]);
                        var total = parseInt(linesData[1]);
                        if (total != 0) {
                            scope.activeLines = (inProgressLines / total) * scope.product.TotalLines;
                        } else {
                            scope.activeLines = scope.product.TotalLines;
                        }
                    }

                    scope.isRaffle = function(id){
                        if (id == 15 || id == 16 || id == 20 || id == 21 || id == 24 || id == 25 || id == 26 || id == 27 || id == 31 || id == 32 || id == 33 || id == 34 || id == 36) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    scope.productTemplate = lyConstants.partialPath + 'my-account-products/templates/products/' + scope.product.Product + '.html';
                    var lotteryIdsByName = [];
                    lotteryIdsByName['PowerBall'] = 1;
                    lotteryIdsByName['MegaMillions'] = 2;
                    lotteryIdsByName['Lotto649'] = 3;
                    lotteryIdsByName['LaPrimitiva'] = 4;
                    lotteryIdsByName['EuroMillions'] = 5;
                    lotteryIdsByName['AllLotteries'] = 7;
                    lotteryIdsByName['SuperEnalotto'] = 8;
                    lotteryIdsByName['EuroJackpot'] = 9;
                    lotteryIdsByName['ElGordo'] = 10;
                    lotteryIdsByName['BonoLoto'] = 11;
                    lotteryIdsByName['UkLotto'] = 12;
                    lotteryIdsByName['Navidad'] = 13;
                    lotteryIdsByName['NewYorkLotto'] = 14;
                    lotteryIdsByName['SummerLotto'] = 20;
                    lotteryIdsByName['ElNino'] = 24;
                    lotteryIdsByName['Valentine'] = 26;
                    lotteryIdsByName['FathersDay'] = 27;
                    lotteryIdsByName['OzLotto'] = 28;
                    lotteryIdsByName['RedCrossDraw'] = 29;
                    lotteryIdsByName['AgainstCancer'] = 31;
                },
                templateUrl: lyConstants.partialPath + 'my-account-products/templates/my-account-product.html'
            }
        }
    ]);
