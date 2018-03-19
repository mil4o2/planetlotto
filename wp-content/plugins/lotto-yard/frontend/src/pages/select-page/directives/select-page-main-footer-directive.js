  'use strict';

  angular.module('lyPlayPage.directives')
      .directive('lySelectPageMainFooter', [
          '$lyCart',
          'lySelectPageService',
          'lyAppTranslationService',
          'lyAppProductsServices',
          'lyCart',
          function(
              $lyCart,
              lySelectPageService,
              lyAppTranslationService,
              lyAppProductsServices,
              ngCart
          ) {
              return {
                  restrict: 'A',
                  scope: {},
                  require: '^lySelectPageMain',
                  templateUrl: $lyCart.partialPath + 'select-page/templates/mainfooter.html',
                  controller: ['$scope', function($scope) {
                      lyAppTranslationService.getTranslations($scope);
                      $scope.ngCart = ngCart;
                      $scope.isSubscription = lySelectPageService.getIsSubscription();

                      $scope.changePricePerLine = function() {
                          var ticket = lySelectPageService.getCurrentTicket();
                          var lotteryRules = lySelectPageService.getLotteryRules();
                          var lines = ticket.filledLines == 0 ? 1 : ticket.filledLines;

                          lyAppProductsServices.getProductPriceByParams(ticket.productId, ticket.draws, lotteryRules.LotteryTypeId, lines)
                              .then(function(priceData) {
                                  $scope.pricePerLine = priceData.Price / (priceData.NumOfDraws * priceData.Lines);
                              });
                      }

                      $scope.initDrawOptions = function() {
                          var ticket = lySelectPageService.getCurrentTicket();
                          $scope.multiOptions = lySelectPageService.getProductsDrawOptions(ticket.productId, false).MultiDrawOptions;

                          $scope.multiOptions = $scope.multiOptions.filter(function(current) {
                              return current.NumberOfDraws <= 52
                          });

                          $scope.selectedmultiOptions = ticket.multiDraw;
                          $scope.getDiscount($scope.selectedmultiOptions.Discount);
                          $scope.subscriptionOptions = lySelectPageService.getProductsDrawOptions(ticket.productId, true).MultiDrawOptions;
                          $scope.selectedSubscription = ticket.subscription;

                          changeCheckedValue(ticket.drawOption);
                          $scope.changePricePerLine();
                      };

                      this.changeCheckedValue = changeCheckedValue;

                      function changeCheckedValue(drawOption) {
                          $scope.checked = drawOption;
                          $scope.$broadcast('update-draw-options', drawOption);
                      }

                      $scope.getDiscount = function(discountPercentage) {
                          var ticket = lySelectPageService.getCurrentTicket();
                          var lotteryRules = lySelectPageService.getLotteryRules();
                          var lines = ticket.filledLines == 0 ? 1 : ticket.filledLines;

                          lyAppProductsServices.getProductPriceByParams(ticket.productId, ticket.draws, lotteryRules.LotteryTypeId, lines)
                              .then(function(priceData) {
                                  var totalCost = priceData.Price * ticket.filledLines;
                                  var costWithoutDisc = totalCost / (1 - discountPercentage);
                                  $scope.discount = costWithoutDisc - totalCost;
                              });
                      }

                      $scope.initDrawOptions();
                  }],
                  link: function(scope, element, attrs, mainCtrl) {
                      var drawsPerWeek = lySelectPageService.getDrawsPerWeek();
                      scope.changeDrawOption = function(option) {
                          scope.changeCheckedValue(option);
                      };

                      scope.$on('update-dropdown', function(e) {
                          scope.initDrawOptions();
                          mainCtrl.updateTotalDirective();
                          scope.changePricePerLine();

                      });

                      scope.chooseDiscount = function(discountOptions) {
                          if (!discountOptions) {
                              scope.isSubscription = false;
                              lySelectPageService.setDropDownOptions(false);

                          } else {
                              scope.isSubscription = true;
                              scope.selectedSubscription = discountOptions;
                              lySelectPageService.setDropDownOptions(true, drawsPerWeek * discountOptions.Weeks, discountOptions.Discount, discountOptions);
                          }

                          mainCtrl.updateTotalDirective();
                          scope.changePricePerLine();
                      };

                      scope.changeMultiDraw = function(index) {
                          if (!scope.isSubscription) {
                              var currentIndex = scope.multiOptions.map(function(e) {
                                  return e.NumberOfDraws;
                              }).indexOf(scope.selectedmultiOptions.NumberOfDraws);

                              var newIndex = currentIndex + index;

                              if (newIndex < 0 || newIndex >= scope.multiOptions.length) {
                                  return;
                              }

                              scope.selectedmultiOptions = scope.multiOptions[newIndex];
                              scope.getDiscount(scope.selectedmultiOptions.Discount);
                              lySelectPageService.setSelectedDropDownOption(scope.selectedmultiOptions);
                              mainCtrl.updateTotalDirective();
                          }
                          scope.updateChances();
                          scope.changePricePerLine();
                      }
                  }
              };
          }
      ])