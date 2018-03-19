  'use strict';

  angular.module('lyCart.services')
      .service('lyCart', [
          '$rootScope',
          'lyCartItem',
          'lyCartCacheFactory',
          'lyCartService',
          'lyCart.utility',
          'lyAppLotteriesService',
          'lyAppProductsServices',
          function(
              $rootScope,
              lyCartItem,
              lyCartCacheFactory,
              lyCartService,
              lyUtilities,
              lyAppLotteriesService,
              lyAppProductsServices
          ) {
              this.init = function() {
                  this.$cart = {
                      shipping: 0,
                      taxRate: 0,
                      tax: 0,
                      paymentMethodId: "",
                      processor: "",
                      fastProcessingTax: 0,
                      amountToPay: 0,
                      reedemCode: "",
                      isFastProcessing: false,
                      phoneOrEmail: "",
                      iframePaymentMethods: [],
                      currency: "$",
                      raffleExpiresInMin: 5,
                      items: [],
                      bonusAmountToUse: 0,
                      vipDiscount: 0
                  };
              };
              var cartObject = this;

              this.addPersonalItem = function(numbers, draws, lines, lotteryTypeId, productId, isSubscription) {
                  if (isSubscription) {
                      isSubscription = false;
                  }

                  try {
                      lyAppProductsServices.getProductPriceByParams(productId, draws, lotteryTypeId, lines)
                          .then(function(priceObject) {
                              cartObject.addItem(lotteryTypeId, draws, lines, numbers, priceObject.Price, productId, isSubscription, false);
                          }, function(error) {
                              //TODO DO SOMETHING!
                          });
                  } catch (e) {
                      //TODO GO TO ERROR PAGE
                  }
              };

              this.addGroupItem = function(draws, shares, lotteryTypeId, productType, isSubscription, numberOfTickets) {
                  if (isSubscription) {
                      isSubscription = false;
                  }

                  try {
                      lyAppProductsServices.getProductPriceByParams(productType, draws, lotteryTypeId, 0)
                          .then(function(priceObject) {
                              var price = priceObject.Price * shares;
                              var numbersForPersonal;

                              cartObject.addItem(
                                  lotteryTypeId,
                                  draws,
                                  shares,
                                  numbersForPersonal,
                                  price,
                                  productType,
                                  isSubscription,
                                  false,
                                  false,
                                  numberOfTickets
                              );
                          });
                  } catch (e) {
                      //TODO GO TO ERROR PAGE
                  }

              };

              this.addRaffle = function(lotteryTypeId, lines, numbers, productType, productExpire, ticketsNumbers) {
                  var draws = 1;
                  var isSubscription = false;
                  var isQuickPick = false;
                  var numberOfTickets;

                  if (isSubscription) {
                      isSubscription = false;
                  }

                  try {
                      lyAppProductsServices.getProductPriceByParams(productType, draws, lotteryTypeId, 0)
                          .then(function(priceObject) {
                              var price = priceObject.Price;
                              cartObject.addItem(
                                  lotteryTypeId,
                                  draws,
                                  lines,
                                  numbers,
                                  price,
                                  productType,
                                  isSubscription,
                                  false,
                                  numberOfTickets,
                                  isQuickPick,
                                  ticketsNumbers,
                                  productExpire
                              );
                          });

                  } catch (e) {
                      //TODO GO TO ERROR PAGE
                  }
              };

              this.addItem = function(lotteryType,
                  draws,
                  linesOrShares,
                  numbersForPersonal,
                  price,
                  productType,
                  isSubscription,
                  isFastProcessing,
                  isQuickPick,
                  numberOfTickets,
                  ticketsNumbers,
                  productExpire,
                  productIdSpecial,
                  guid,
                  isRaffle) {
                  if (this.$cart.items.length === 10) {
                      //todo remove first element
                      this.$cart.items.shift();
                  }

                  lyAppLotteriesService.getLotteries()
                      .then(function(allLoteries) {
                          var rules = lyAppLotteriesService.getLotteryFromArrayById(allLoteries, lotteryType)[0];
                          var lotteryname = "";
                          var discount = 0;

                          if (rules) {
                              lotteryname = rules.LotteryType;
                              if (!guid) {
                                  angular.forEach(rules.ProductsDrawOptions, function(item) {
                                      if (item.ProductId === productType && item.IsSubscription === isSubscription) {
                                          angular.forEach(item.MultiDrawOptions, function(drawOpt) {
                                              if (drawOpt.NumberOfDraws === draws) {
                                                  discount = drawOpt.Discount;
                                              }
                                          });
                                      }
                                  });
                              }

                          } else {
                              rules = {
                                  EvenLinesOnly: false
                              }

                              if (lotteryType == 7) {
                                  var productRules = lyAppProductsServices.getProductById(productType);
                                  rules.ProductsDrawOptions = [{
                                      "MultiDrawOptions": productRules.Draws.split(", ").map(function(currentDraw) {
                                          return {
                                              "NumberOfDraws": parseInt(currentDraw),
                                              "Discount": 0
                                          }
                                      }),
                                      "ProductId": productType,
                                      "IsSubscription": isSubscription
                                  }];
                                  rules.LotteryType = productRules.ProductName;

                                  lotteryname = productRules.ProductName;
                              }
                          }

                          if (typeof(ticketsNumbers) !== 'undefined' && ticketsNumbers.length > 0) {
                              rules.MinLines = 1;
                              rules.MaxLines = ticketsNumbers.length;
                              isRaffle = true;
                          } else {
                              isRaffle = false;
                          }

                          var productName = lyAppProductsServices.getProductNameById(productType);
                          var id;
                          var newItem = new lyCartItem(
                              id,
                              lotteryType,
                              draws,
                              linesOrShares,
                              numbersForPersonal,
                              price,
                              discount,
                              lotteryname,
                              isFastProcessing,
                              isSubscription,
                              isQuickPick,
                              numberOfTickets,
                              ticketsNumbers,
                              productType,
                              productExpire,
                              productIdSpecial,
                              guid,
                              isRaffle,
                              rules,
                              rules.EvenLinesOnly,
                              productName
                          );

                          cartObject.$cart.items.push(newItem);

                          $rootScope.$broadcast('lyCart:itemAdded', newItem);

                          $rootScope.$broadcast('lyCart:change', {});

                      }, function(error) {
                          console.warn('error in lyAppLotteriesService.getLotteries:', error);
                      })
              };

              /*
              //TODO remove

              this.addSpecialProduct = function(lotteryType, draws, qty, lotteryName) {
                  var productType = 14;
                  var count = 0;
                  var numbers = '';
                  var ticketsNumbers,
                      productExpire;

                  //TODO validate all input params
                  //TODO fastProcessing

                  var isSubscription = false;
                  var isQuickPick = false;

                  if (isSubscription) {
                      isSubscription = false;
                  }

                  try {

                      var product = lyAppProductsServices.getProductById(productType);
                      var rules = product.ValidLotteries.filter(function(obj) {
                          if ('LotteryTypeId' in obj && typeof(obj.LotteryTypeId) === 'number' && obj.LotteryTypeId === lotteryType) {
                              return true;
                          }
                          return false;
                      })[0];

                      var drawOption = product.Draws.map(function(option) {
                          return {
                              Discount: 0,
                              NumberOfDraws: option,
                              Weeks: 0
                          }
                      });

                      rules.ProductsDrawOptions = [];

                      rules.ProductsDrawOptions.push({
                          MultiDrawOptions: drawOption,
                          ProductId: product.ProductId,
                          IsSubscription: false
                      });

                      rules.ProductsDrawOptions.push({
                          MultiDrawOptions: drawOption,
                          ProductId: product.ProductId,
                          IsSubscription: true
                      });

                      lyAppProductsServices.getProductPriceByIds(productType, draws, lotteryType, count)
                          .then(function(priceObject) {
                              var price = priceObject.Price;
                              cartObject.addItem(
                                  lotteryType,
                                  draws,
                                  count,
                                  numbers,
                                  price,
                                  lotteryName,
                                  productType,
                                  rules,
                                  false,
                                  isSubscription,
                                  isQuickPick,
                                  ticketsNumbers,
                                  productExpire,
                                  true
                                  // qty
                              );
                          });
                  } catch (e) {
                      //TODO GO TO ERROR PAGE
                  }
              };

              this.addItemPredifined = function(productId, lotteryType, lines, draws, amount, guid, selectedNumbers, counterGuid) {
                  if (this.$cart.items.length === 10) {
                      this.$cart.items.shift();
                  }
                  if (!lyUtilities.isNumeric(productId)) {
                      productId = parseInt(productId);
                  }

                  if (!lyUtilities.isNumeric(lotteryType)) {
                      lotteryType = parseInt(lotteryType);
                  }

                  if (!lyUtilities.isNumeric(lines)) {
                      lines = parseInt(lines);
                  }

                  if (!lyUtilities.isNumeric(draws)) {
                      draws = parseInt(draws);
                  }

                  if (!lyUtilities.isNumeric(amount)) {
                      amount = parseInt(amount);
                  }

                  //generating id
                  var productIdSpecial = 999;
                  var product = lyAppProductsServices.getProductById(productId);
                  var productName,
                      selectedTab,
                      noofdraws,
                      nooflines,
                      rules,
                      personalComboBoxSelectionIndex,
                      personalSettingsIndex,
                      isSubscription,
                      isFastProcessing,
                      isQuickPick,
                      productExpire,
                      ticketsNumbers,
                      quanity;

                  var numbers = "";
                  var quantity = 1;
                  var isRaffle = false;
                  productIdSpecial = 999;
                  guid = guid;

                  if (typeof(product) === 'undefined') {
                      productName = lyAppLotteriesService.getLotteryById(lotteryType).LotteryType;
                  } else {
                      productName = product.ProductName;
                      selectedTab = 'product';
                  }

                  if (productId === 3) {
                      selectedTab = 'group';
                  } else if (productId === 1) {
                      selectedTab = 'personal';
                      nooflines = parseInt(lines);
                  } else if (draws === 0) {
                      selectedTab = 'raffle';
                  }

                  noofdraws = parseInt(draws);

                  var discount = 0,
                      groupComboBoxSelectionIndex = 0,
                      groupSettingsIndex = 0,
                      groupdiscount = 0,
                      groupnodraws = 0,
                      groupnoshares = 0,
                      grouporiginalprice = 0,
                      grouptotal = 0;

                  var productType = productId;
                  var originalprice = amount;
                  var totalCost = amount;

                  rules = {
                      SelectNumbers: 0,
                      MinSelectNumber: 0,
                      MaxSelectNumbers: 0,
                      ExtraNumbers: 0,
                      MaxExtraNumbers: 0,
                      MinExtraNumber: 0,
                      DrawsPerWeek: 0
                  };

                  switch (selectedTab) {
                      case 'personal':
                          if (typeof selectedNumbers !== 'undefined') {
                              numbers = lyUtilities.linesChecker(selectedNumbers);
                          } else {
                              //get lottery rules for genereting lines
                              rules = lyAppLotteriesService.getLotteryById(lotteryType);
                              var minLines = rules.MinLines;
                              var maxLines = rules.MaxLines;

                              if (nooflines > maxLines || minLines > nooflines) {
                                  throw "Lines can not be greater than max lines or less then defined in rules";
                              }
                              for (var i = 0; i < nooflines; i++) {
                                  if (i === nooflines - 1) {
                                      numbers += lyUtilities.quickpick(rules);
                                  } else {
                                      numbers += lyUtilities.quickpick(rules) + "|";
                                  }
                              }
                          }

                          break;
                      case 'group':
                          groupnodraws = draws;
                          groupnoshares = lines;
                          break;
                      case 'raffle':
                          isRaffle = true;
                          lyAppProductsServices.getRaffleNumbers(productId).then(
                              angular.bind(this, function(resp) {
                                  console.log(resp);

                                  //if response is array else throw error
                                  if (!Array.isArray(resp)) {
                                      throw ("OLA: raffle response is not array!: error:" + resp);
                                  }
                                  var ticket = resp[0];
                                  numbers = ticket.Number + "-" + ticket.Seat + "-" + ticket.Ticket;
                                  ticketsNumbers = [ticket.Id];

                                  var productExpire = [];
                                  var obj = {};
                                  var navidadExpiration = new Date();
                                  navidadExpiration.setMinutes(navidadExpiration.getMinutes() + RaffleExpiresInMin);
                                  obj.id = ticket.Id;
                                  obj.exp = navidadExpiration;
                                  productExpire.push(obj);

                                  nooflines = shares;

                                  var newItem = new lyCartItem(
                                      0,
                                      discount,
                                      groupComboBoxSelectionIndex,
                                      groupSettingsIndex,
                                      groupdiscount,
                                      groupnodraws,
                                      groupnoshares,
                                      grouporiginalprice,
                                      grouptotal,
                                      lotteryType,
                                      noofdraws,
                                      nooflines,
                                      numbers,
                                      originalprice,
                                      personalComboBoxSelectionIndex,
                                      personalSettingsIndex,
                                      selectedTab,
                                      totalCost,
                                      productName,
                                      rules.SelectNumbers,
                                      rules.MinSelectNumber,
                                      rules.MaxSelectNumbers,
                                      rules.ExtraNumbers,
                                      rules.MaxExtraNumbers,
                                      rules.MinExtraNumber,
                                      productRules.MinLines,
                                      productRules.MaxLines,
                                      rules.DrawsPerWeek,
                                      noofdraws,
                                      isFastProcessing,
                                      isSubscription,
                                      isQuickPick,
                                      ticketsNumbers,
                                      productType,
                                      productExpire,
                                      productIdSpecial,
                                      quantity,
                                      guid,
                                      isRaffle,
                                      counterGuid
                                  );


                                  this.$cart.items.push(newItem);

                                  $rootScope.$broadcast('lyCart:itemAdded', newItem);

                                  $rootScope.$broadcast('lyCart:change', {});

                              }));
                          return;
                      case "product":
                          switch (productType) {
                              case 4:
                                  quanity = 1;
                                  noofdraws = draws;
                                  nooflines = 1;
                                  numbers = lyUtilities.linesChecker(selectedNumbers);
                                  break;

                              case 14:
                                  quanity = 1;
                                  noofdraws = draws;

                                  break;

                              default:
                          }

                          break;
                      default:
                  }

                  var newItem = new lyCartItem(
                      0,
                      discount,
                      groupComboBoxSelectionIndex,
                      groupSettingsIndex,
                      groupdiscount,
                      groupnodraws,
                      groupnoshares,
                      grouporiginalprice,
                      grouptotal,
                      lotteryType,
                      noofdraws,
                      nooflines,
                      numbers,
                      originalprice,
                      personalComboBoxSelectionIndex,
                      personalSettingsIndex,
                      selectedTab,
                      totalCost,
                      productName,
                      rules.SelectNumbers,
                      rules.MinSelectNumber,
                      rules.MaxSelectNumbers,
                      rules.ExtraNumbers,
                      rules.MaxExtraNumbers,
                      rules.MinExtraNumber,
                      rules.MinLines,
                      rules.MaxLines,
                      rules.DrawsPerWeek,
                      noofdraws,
                      isFastProcessing,
                      isSubscription,
                      isQuickPick,
                      ticketsNumbers,
                      productType,
                      productExpire,
                      productIdSpecial,
                      quantity,
                      guid,
                      isRaffle,
                      counterGuid
                  );

                  this.$cart.items.push(newItem);

                  $rootScope.$broadcast('lyCart:itemAdded', newItem);

                  $rootScope.$broadcast('lyCart:change', {});
              }*/

              this.getItemById = function(itemId) {
                  var items = this.getCart().items;
                  var build = false;

                  angular.forEach(items, function(item) {
                      if (item.getId() === itemId) {
                          build = item;
                      }
                  });
                  return build;
              };

              this.setCart = function(cart) {
                  this.$cart = cart;
                  return this.getCart();
              };

              this.getCart = function() {
                  return this.$cart;
              };

              this.getItems = function() {
                  return this.getCart().items;
              };

              this.setItems = function(items) {
                  this.$cart.items = items;
              };

              this.getTopNItems = function(n) {
                  return this.getCart().items.slice(0, n);
              };

              this.getTotalItems = function() {
                  return this.getItems().length;
              };

              this.getShipping = function() {
                  if (this.getCart().items.length === 0) return 0;
                  return this.getCart().shipping;
              };

              this.getTax = function() {
                  return +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(2);
              };

              this.setAmountToPay = function(price) {
                  this.$cart.amountToPay = price;
              };

              // TODO DELETE THIS IF NOT USING
              this.getAmountToPay = function() {
                  if (this.$cart.amountToPay >= 0) {
                      return this.$cart.amountToPay;
                  }
                  return this.getTotal();
              };

              this.setTotalAfterDiscount = function(total) {
                  this.$cart.totalAfterDiscount = total;
              };

              this.getTotalAfterDiscount = function() {
                  return this.$cart.totalAfterDiscount;
              };

              this.removeItem = function(index) {
                  this.$cart.items.splice(index, 1);
                  $rootScope.$broadcast('lyCart:itemRemoved', {});
                  $rootScope.$broadcast('lyCart:change', {});

              };

              this.removeItemById = function(id) {
                  var cart = this.getCart();
                  angular.forEach(cart.items, function(item, index) {
                      if (item.getId() === id) {
                          cart.items.splice(index, 1);
                      }
                  });
                  this.setCart(cart);
                  $rootScope.$broadcast('lyCart:itemRemoved', {});
                  $rootScope.$broadcast('lyCart:change', {});
              };

              this.empty = function() {
                  $rootScope.$broadcast('lyCart:change', {});
                  this.$cart.items = [];
                  lyCartCacheFactory.emptyCart();
              };

              this.isEmpty = function() {
                  return !this.$cart.items.length;
              };

              this.setIframePaymentMethods = function(iframePaymentMethods) {
                  $rootScope.lyPayments = iframePaymentMethods;
                  this.$cart.iframePaymentMethods = iframePaymentMethods;
                  return this.getIframePaymentMethods();
              };

              this.getIframePaymentMethods = function() {
                  return this.$cart.iframePaymentMethods;
              };

              this.setPaymentMethodId = function(paymentMethodId) {
                  this.$cart.paymentMethodId = paymentMethodId;
                  return this.getPaymentMethodId();
              };

              this.getPhoneOrEmail = function() {
                  return this.$cart.phoneOrEmail;
              };

              this.setPhoneOrEmail = function(phoneOrEmail) {
                  this.$cart.phoneOrEmail = phoneOrEmail;
              };

              this.getPaymentMethodId = function() {
                  return this.$cart.paymentMethodId;
              };

              this.setProcessor = function(processor) {
                  this.$cart.processor = processor;
              };

              this.getProcessor = function() {
                  return this.$cart.processor;
              };

              this.setReedemCode = function(reedem) {
                  this.$cart.reedemCode = reedem;
              };

              this.getReedemCode = function() {
                  return this.$cart.reedemCode;
              };

              this.setReedemBonusAmount = function(reedemBonusAmount) {
                  this.$cart.reedemBonusAmount = reedemBonusAmount;
                  return this.getReedemBonusAmount();
              };

              this.getReedemBonusAmount = function() {
                  if (this.$cart.reedemBonusAmount < 0) {
                      return 0;
                  } else {
                      return this.$cart.reedemBonusAmount;
                  }
              };

              this.setAffiliateCode = function(aff) {
                  this.$cart.affiliateCode = aff;
                  return this.getAffiliateCode();
              };

              this.getAffiliateCode = function() {
                  return this.$cart.affiliateCode;
              };

              this.setOlapAffiliateCode = function(aff) {
                  this.$cart.olapAffiliateCode = aff;
                  return this.getOlapAffiliateCode();
              };

              this.getOlapAffiliateCode = function() {
                  return this.$cart.olapAffiliateCode;
              };

              this.setIsFastProcessing = function(isFastProcessing) {
                  this.$cart.isFastProcessing = isFastProcessing;
                  return this.getIsFastProcessing();
              };

              this.getIsFastProcessing = function() {
                  return this.$cart.isFastProcessing;
              };

              this.setFastProcessingTax = function(fastProcessingTax) {
                  this.$cart.fastProcessingTax = fastProcessingTax;
                  return this.getFastProcessingTax();
              };

              this.getFastProcessingTax = function() {
                  return this.$cart.fastProcessingTax;
              };

              this.setCurrency = function(currency) {
                  this.$cart.currency = currency;
                  return this.getCurrency();
              };

              this.getCurrency = function() {
                  return this.$cart.currency;
              };

              this.setRaffleExpiresInMin = function(raffleExpiresInMin) {
                  this.$cart.raffleExpiresInMin = raffleExpiresInMin;
                  return this.getRaffleExpiresInMin();
              };

              this.getRaffleExpiresInMin = function() {
                  return this.$cart.raffleExpiresInMin;
              };

              this.getBonusAmountToUse = function() {
                  return this.$cart.bonusAmountToUse;
              }

              this.setBonusAmountToUse = function(bonusAmountToUse) {
                  this.$cart.bonusAmountToUse = bonusAmountToUse;
              }

              this.toObject = function() {
                  if (this.getItems().length === 0) return false;
                  return items;
              };

              this.$restore = function(storedCart) {
                  var _self = this;
                  _self.init();
                  _self.$cart.iframePaymentMethods = storedCart.iframePaymentMethods;
                  _self.$cart.paymentMethodId = storedCart.paymentMethodId;
                  _self.$cart.processor = storedCart.processor;
                  _self.$cart.fastProcessingTax = storedCart.fastProcessingTax;
                  _self.$cart.amountToPay = storedCart.amountToPay;
                  _self.$cart.phoneOrEmail = storedCart.phoneOrEmail;
                  _self.$cart.reedemCode = storedCart.reedemCode;
                  _self.$cart.isFastProcessing = storedCart.isFastProcessing;
                  _self.$cart.affiliateCode = storedCart.affiliateCode;
                  _self.$cart.reedemBonusAmount = storedCart.reedemBonusAmount;
                  _self.$cart.olapAffiliateCode = storedCart.olapAffiliateCode;
                  _self.$cart.currency = storedCart.currency;
                  _self.$cart.bonusAmountToUse = storedCart.bonusAmountToUse;
                  _self.$cart.vipDiscount = storedCart.vipDiscount;
                  _self.$cart.totalAfterDiscount = storedCart.totalAfterDiscount;

                  angular.forEach(storedCart.items, function(item) {
                      _self.$cart.items.push(new lyCartItem(
                          item._id,
                          item._lotteryType,
                          item._draws,
                          item._linesOrShares,
                          item._numbersForPersonal,
                          item._totalCost,
                          item._discount,
                          item._lotteryName,
                          item._isFastProcessing,
                          item._isSubscription,
                          item._isQuickPick,
                          item._tickets,
                          item._ticketsNumbersId,
                          item._productType,
                          item._productExpire,
                          item._productIdSpecial,
                          // item._quantity,
                          item._guid,
                          item._isRaffle,
                          item._rules,
                          item._evenLinesOnly,
                          item._productName));
                  });
                  this.$save();
              };

              this.$save = function() {
                  return lyCartCacheFactory.set('cart', JSON.stringify(this.getCart()));
              }

              this.isContainOlapProduct = function() {
                  var cartLength = this.$cart.items.length;

                  for (var i = 0, len = cartLength; i < len; i++) {
                      if (this.$cart.items[i].getProductIdSpecial() === 999) {
                          return true;
                      }
                  }
                  return false;
              };

              this.getProductDiscount = function() {
                  var totalDiscount = 0;

                  this.getItems().forEach(function(item) {
                      totalDiscount += ((item.getTotal() / (1 - item.getDiscount()) - item.getTotal()));
                  });

                  return totalDiscount;
              }


              this.getVipDiscount = function() {
                  return this.$cart.vipDiscount;
              }

              this.setVipDiscount = function(vipDiscount) {
                  this.$cart.vipDiscount = vipDiscount;
              }

              this.getTotal = function() {
                  var total = 0;
                  this.getItems().forEach(function(item) {
                      total += item.getTotalCost();
                  });

                  return total;
              }

              this.getSubTotal = function() {
                  return this.getTotal() + this.getProductDiscount();
              };
          }
      ])
