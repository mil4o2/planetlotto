'use strict';

angular.module('lyApp')
    .controller('HomePageCtrl', [
        '$scope',
        '$state',
        'pageContent',
        'lyApp.utility',
        'lyApiData',
        'lyConstants',
        'testimonials',
        'lotteriesResults',
        '$timeout',
        'stateHelper',
        function(
            $scope,
            $state,
            pageContent,
            lyAppUtility,
            lyApiData,
            lyConstants,
            testimonials,
            lotteriesResults,
            $timeout,
            stateHelper
        ) {
            if ($state.params.s && $state.params.m) {
                $state.go('quickpick.olap', {
                    hash: $state.params.m,
                    affiliate: $state.params.s
                });
            }

            lyAppUtility.addingMetaOnScope(pageContent.data[0]);
            $scope.allRules = lyApiData.LotteryRules;
            $scope.allDraws = lyApiData.AllDraws;
            $scope.homeSliderData = pageContent.data[0].acf.home_slider;
            $scope.enableHomePageSlider = pageContent.data[0].acf.enable_disable;
            $scope.embededIframe = pageContent.data[0].acf.embed_html_iframe;
            $scope.pageContent = pageContent.data[0].content.rendered;
            $scope.backgroundImageLink = pageContent.data[0].acf.page_background.url;
            $scope.testimonials = testimonials;
            $scope.lotteriesResults = lotteriesResults;
            $scope.playWidget = pageContent.data[0].acf.play_widget;
            $scope.playWidgetLink = pageContent.data[0].acf.play_widget_link;

            $scope.showFixedCart = function() {
                angular.element('#fixed-cart-popup')[0].style.display = "block";
                $timeout(function() {
                    angular.element('#fixed-cart-popup')[0].style.opacity = 1;
                }, 100);
            }
            $scope.$parent.breadcrumb = pageContent.data[0].content.yoast_breadcrumb;
            $scope.$parent.showBreadcrumb = pageContent.data[0].acf.show_bredcrumb;

            //$scope.goToPlayPageFromHome = function() {
            //    var lotteryName = $scope.allDraws[0].LotteryName.toLowerCase();
            //    stateHelper.goToPlayPage(lotteryName, true);
            //}

            $scope.drawsGroup = [];

            var classicLotteryInitialDraws = 4,
                specialLotteryInitialDraws = 2;

            $scope.drawsGroup.push(getSpecialProduct("Euro Group", 'eu'));
            $scope.drawsGroup.push(getSpecialProduct("American Group", 'us'));
            $scope.drawsGroup.push(getTopJackpot());

            function getSpecialProduct(productName, countryCode) {
                var product = {
                    "LotteryName": productName,
                    "Jackpot": 0,
                    "LotteryCurrency2": "",
                    "ProductId": 3,
                    "AllLotteries": [],
                    "isClassicLottery": false,
                    "initialDraws": specialLotteryInitialDraws
                };

                $scope.allDraws.filter(function(lottery) {
                    if (lottery.CountryCode == countryCode) {
                        product.Jackpot += lottery.Jackpot;
                        product.LotteryCurrency2 = lottery.LotteryCurrency2;
                        product.AllLotteries.push({
                            "LotteryTypeId": lottery.LotteryTypeId,
                            "Price": 0
                        });
                    }
                });

                return product;
            }

            function getTopJackpot() {
                var product = {
                    "LotteryName": "Jackpot Hunter",
                    "Jackpot": $scope.allDraws[0].Jackpot,
                    "LotteryCurrency2": "$",
                    "ProductId": 14,
                    "AllLotteries": [{
                        "LotteryTypeId": 7,
                        "Price": 0
                    }],
                    "isClassicLottery": false,
                    "initialDraws": specialLotteryInitialDraws
                };

                return product;
            }
        }
    ])
