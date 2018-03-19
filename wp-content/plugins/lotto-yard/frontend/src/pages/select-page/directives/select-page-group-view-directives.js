  'use strict';

  angular.module('lyPlayPage.directives')
      .directive('lySelectPageGroupView', [
          '$lyCart',
          '$uibModal',
          '$rootScope',
          'lyConstants',
          'lyCart',
          'lyAppTranslationService',
          'lySelectPageService',
          'lyAppProductsServices',
          'stateHelper',
          function(
              $lyCart,
              $uibModal,
              $rootScope,
              lyConstants,
              ngCart,
              lyAppTranslationService,
              lySelectPageService,
              lyAppProductsServices,
              stateHelper
          ) {
              return {
                  restrict: 'A',
                  templateUrl: $lyCart.partialPath + 'select-page/templates/group-view.html',
                  scope: {
                      view: '=',
                      chances: '@'
                  },
                  link: function(scope) {
                      if (scope.chances == 0) {
                          scope.current = 28;
                      } else if (scope.chances == 1) {
                          scope.current = 56;
                      } else {
                          scope.current = 68;
                      }

                      var ticket = lySelectPageService.getCurrentTicket(),
                          drawsPerWeek = lySelectPageService.getDrawsPerWeek(),
                          lotteryRules = lySelectPageService.getLotteryRules();

                      scope.shares = lyConstants.sharesOptions.map(function(current) {
                          return getViewObject(current, 0);
                      });

                      lyAppProductsServices.getSyndicateNumbers(lotteryRules.LotteryTypeId)
                          .then(function(resp) {
                              scope.viewNumbers = resp;
                          }, function(error) {
                              console.warn(error);
                          });

                      scope.otherOption = getViewObject(1, 0);
                      lyAppTranslationService.getTranslations(scope);
                      scope.selectedShares = scope.shares[0];
                      scope.lotteryName = lotteryRules.LotteryType;
                      scope.jackpot = lySelectPageService.getLotteryJackpot();
                      scope.currency = lySelectPageService.getLotteryCurrency();
                      scope.isSubscription = lySelectPageService.getIsSubscription();
                      scope.selectedSubscription = ticket.subscription;
                      scope.isOneTimeEntry = false;
                      //   scope.subscriptionOptions = lySelectPageService.getProductsDrawOptions(ticket.productId, true).MultiDrawOptions;

                      scope.multiDrawOptions = lySelectPageService.getProductsDrawOptions(ticket.productId, false).MultiDrawOptions;
                      scope.selectedMultiDrawOption = scope.multiDrawOptions[2];
                      scope.draws = scope.selectedMultiDrawOption.NumberOfDraws;
                      setPrice();

                      scope.changeShare = function(share) {
                          if (share) {
                              scope.showOther = false;
                          } else {
                              scope.showOther = true;
                          }

                          scope.selectedShares = share;
                      };

                      scope.showNumbers = function() {
                          $rootScope.modalInstance = $uibModal.open({
                              animation: true,
                              template: '<div ly-select-page-show-numbers numbers="viewNumbers" lottery-name="lotteryName"></div>',
                              scope: scope,
                              windowClass: 'group-numbers',
                          });
                      };

                      scope.changeOtherShares = function(change) {
                          var newShare = scope.otherOption.share + change;
                          if (newShare > 0 && newShare <= lyConstants.sharesMaxValue) {
                              scope.otherOption.share = newShare;
                              scope.otherOption.price = scope.price * newShare;
                          }
                          scope.changeShare();
                      };

                      scope.changeMultiDraw = function(option) {
                          scope.selectedMultiDrawOption = option;
                      };

                      scope.changeDraw = function(isOneTimeEntry) {
                          scope.isOneTimeEntry = isOneTimeEntry;
                          isOneTimeEntry ? scope.draws = 1 : scope.draws = scope.selectedMultiDrawOption.NumberOfDraws;
                          setPrice();
                      };

                      scope.saveToCart = function() {
                          var lotteryTypeId = lotteryRules.LotteryTypeId;
                          var shares = scope.selectedShares ? scope.selectedShares.share : scope.otherOption.share;
                          ngCart.addGroupItem(scope.draws, shares, lotteryTypeId, 3, scope.isSubscription, scope.view.tickets);

                          stateHelper.goToCartPage();
                      };

                      function getViewObject(share, price) {
                          return {
                              "share": share,
                              "price": price
                          };
                      }

                      function setPrice() {
                          lyAppProductsServices.getProductPriceByParams(3, scope.draws, lotteryRules.LotteryTypeId, 0)
                              .then(function(data) {
                                  scope.price = data.Price;
                                  scope.otherOption.price = scope.price * scope.otherOption.share;
                                  lyConstants.sharesOptions.forEach(function(current, $index) {
                                      scope.shares[$index].price = scope.price * current;
                                  });

                              }, function(error) {});
                      }

                      //   scope.changeSubscription = function(option) {
                      //       if (!option) {
                      //           scope.isSubscription = false;
                      //           lySelectPageService.setDropDownOptions(false);
                      //       } else {
                      //           scope.isSubscription = true;
                      //           scope.selectedSubscription = option;
                      //           lySelectPageService.setDropDownOptions(true, drawsPerWeek * option.Weeks, option.Discount, option);
                      //       }
                      //   };
                  }
              };
          }
      ]);