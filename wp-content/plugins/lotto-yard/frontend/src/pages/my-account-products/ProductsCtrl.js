 'use strict';

 angular.module('lyMyAccount')
     .controller('ProductsCtrl', [
         '$scope',
         'products',
         'lyMyAccountUserService',
         'lyApp.utility',
         'stateHelper',
         'lyMyAccoutContentACFData',
         'anchorSmoothScroll',
         function(
             $scope,
             products,
             lyMyAccountUserService,
             lyAppUtility,
             stateHelper,
             lyMyAccoutContentACFData,
             anchorSmoothScroll
         ) {
             lyAppUtility.addingMetaOnScope({
                 title: lyMyAccoutContentACFData.data.acf.my_products_title
             });

             $scope.currentPage = 1;

             function mapProducts(products){
                 for (var i = 0; i < products.length; i++) {
                     if (products[i].ProductId != 1 && products[i].ProductId != 3 && products[i].ProductId != 15 && products[i].ProductId != 16 && products[i].ProductId != 20 && products[i].ProductId != 21 && products[i].ProductId != 24
                          && products[i].ProductId != 25 && products[i].ProductId != 26 && products[i].ProductId != 27 && products[i].ProductId != 31 && products[i].ProductId != 32  && products[i].ProductId != 33
                          && products[i].ProductId != 34 && products[i].ProductId != 36 && products[i].ProductId != 37) {

                              products[i].MainLottery = products[i].Product;
                              //for free ticket
                              //ID is 17 for PLanet lotto
                              if (products[i].ProductId = 17) {
                                  if (products[i].MainLottery == "freeSingle") {
                                      //change the MainLottery because of split/join after this for cicle
                                      products[i].Product = products[i].Lotteries[0].LotteryName;
                                 } else if(products[i].MainLottery == "24/7 VIP"){
                                     products[i].MainLottery = "24-7 VIP"
                                     products[i].Product = 'Bundle';
                                 } else if(products[i].MainLottery == "Premium 24/7 VIP"){
                                     products[i].MainLottery = "Premium 24-7 VIP";
                                     products[i].Product = 'Bundle';
                                 } else {
                                      products[i].Product = 'Bundle';
                                  }
                              }


                     } else {
                         if (products[i].ProductId != 1 && products[i].ProductId != 3) {
                             if (products[i].ProductId == 15 || products[i].ProductId == 20 || products[i].ProductId == 24 || products[i].ProductId == 26 || products[i].ProductId == 31 || products[i].ProductId == 33|| products[i].ProductId == 36) {
                                 products[i].Product = 'Classic';
                             } else {
                                 products[i].Product = 'Group';
                             }
                         }
                     }
                     if (products[i].MainLottery != 'All') {
                         products[i].NameToShow = products[i].MainLottery.split(/(?=[A-Z])/).join(" ");
                     }
                     if (products[i].Product == 'Personal') {
                         products[i].Product = 'Classic';
                     }
                     if (products[i].NameToShow == 'Against Cancer') {
                         products[i].NameToShow = 'Against Cancer 2017';
                     }
                 }

                 $scope.productsMaped = products;
                 $scope.productsPageCount = $scope.productsMaped.length;
             }
             mapProducts(products)

             $scope.gotoElement = function (eID){
                anchorSmoothScroll.scrollTo(eID);
             };

            //  $scope.changePage = function(change) {
            //      var nextPage = $scope.currentPage + change;
            //      if (nextPage > 0) {
            //          lyMyAccountUserService.getProducts(nextPage)
            //              .then(function(resp) {
            //                  $scope.currentPage = nextPage;
            //                  $scope.products = resp;
            //                  $scope.gotoElement('my-account');
            //              }, function(error) {
            //                  stateHelper.goToHomePage();
            //              });
            //      }
            //  };
             $scope.changePage = function(page) {
                 lyMyAccountUserService.getProducts(page)
                     .then(function(resp) {
                         debugger
                        //  $scope.products = resp;
                        mapProducts(resp)
                         $scope.gotoElement('my-account');
                     }, function(error) {
                         stateHelper.goToHomePage();
                     })
             }
             $scope.changePage($scope.currentPage);

             $scope.getProductType = function(product, id){
                 if (product == 'Personal' || product == 'Group') {
                     return product;
                 } else {
                     return 'Bundle';
                 }
             }
         }
     ]);
