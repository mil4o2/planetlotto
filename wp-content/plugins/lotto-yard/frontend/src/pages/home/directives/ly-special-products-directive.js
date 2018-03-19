    "use strict";

    angular.module('lyApp.directives')
        .directive('lySpecialProducts', [
            '$lyCart',
            // 'showCharityLotteryOnlyFilter',
            function(
                $lyCart
                // showCharityLotteryOnlyFilter
            ) {
                return {
                    restrict: 'C',
                    templateUrl: $lyCart.partialPath + 'home/templates/ly-special-products.html',
                    controller: ['$scope', '$timeout', function($scope, $timeout) {
                        $scope.isClassicTab = true;
                        $scope.showCharityLotteriesOnly = false;
                        $scope.charityLotteryFilter = {};

                        $scope.showCharityLotteries = function(){
                            $scope.showCharityLotteriesOnly = !$scope.showCharityLotteriesOnly;

                            //$scope.viewLoaded = false;
                            //
                            //var slider = jQuery('#special-products-slider');
                            //slider.slick('unslick');

                            $scope.charityLotteryFilter = $scope.showCharityLotteriesOnly ? {LotteryName:'MegaMillions'} : {};
                            //slider.slick($scope.slickConfigSpecialProducts);
                            //
                            //$scope.viewLoaded = true;
                        };

                        $scope.classicProducts = $scope.allDraws;

                        $scope.classicProducts.forEach(function(item) {
                            var options = getLottteryDrawsOptions($scope.allRules, item.LotteryTypeId, 3, false);
                            item.drawOptions = options;
                        });

                        $scope.changeCarousel = function(isClassic) {
                            $scope.isClassicTab = isClassic;
                        };

                        $scope.viewLoaded = true;
                        var slickFirstLoad = false;
                        $scope.slickConfigSpecialProducts = {
                            lazyLoad: 'ondemand',
                            enabled: true,
                            fade: false,
                            draggable: true,
                            slidesToShow: 4,
                            slidesToScroll: 4,
                            autoplay: true,
                            autoplaySpeed: 3000,
                            arrows: true,
                            nextArrow: '<span class="arrow-next glyphicon glyphicon-menu-right" aria-hidden="true"></span>',
                            prevArrow: '<span class="arrow-prev glyphicon glyphicon-menu-left" aria-hidden="true"></span>',
                            responsive: [{
                                breakpoint: 750,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                    arrows: false
                                }
                            },
                                {
                                    breakpoint: 992,
                                    settings: {
                                        slidesToShow: 2,
                                        slidesToScroll: 1,
                                        arrows: true
                                    }
                                },
                                {
                                    breakpoint: 1200,
                                    settings: {
                                        slidesToShow: 3,
                                        slidesToScroll: 1,
                                        arrows: true
                                    }
                                }
                            ],
                            event: {
                                init: function(event, slick) {console.log(arguments);

                                    $timeout(function() {
                                        if(!slickFirstLoad){
                                            slickFirstLoad = !slickFirstLoad;
                                            $scope.viewLoaded = false;
                                            jQuery(event.currentTarget).slick('unslick');
                                            jQuery(event.currentTarget).slick($scope.slickConfigSpecialProducts);
                                        $scope.viewLoaded = true;
                                        }

                                    },500);
                                }
                            }
                        };

                        function getLottteryDrawsOptions(all, lotteryId, productId, isSubscription) {
                            var result = all.filter(function(item) {
                                return item.LotteryTypeId === lotteryId;
                            });

                            return result[0].ProductsDrawOptions.filter(function(item) {
                                return item.IsSubscription == isSubscription && item.ProductId == productId;
                            })[0].MultiDrawOptions;
                        }

                    }]
                }
            }
        ])
