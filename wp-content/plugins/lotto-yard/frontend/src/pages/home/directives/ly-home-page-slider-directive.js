'use strict';

angular.module('lyApp.directives')
    .directive('lyHomePageSlider', [
        '$lyCart',
        '$document',
        '$timeout',
        'quickPickService',
        'stateHelper',
        function(
            $lyCart,
            $document,
            $timeout,
            quickPickService,
            stateHelper
        ) {
            return {
                restrict: 'C',
                templateUrl: $lyCart.partialPath + 'home/templates/ly-home-page-slider.html',
                link: function(scope, element) {
                    var bodyBgrImage = angular.element('#home-bgr-image-slider')[0];
                    scope.isGoingToPersonalSelectPage = scope.homeSliderData[0].go_to_classic_page;
                    showBackground(0);

                    scope.slickConfig = {
                        //infinite: false,
                        infinite: true,
                        dots: true,
                        enabled: true,
                        fade: true,
                        draggable: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                        autoplay: true,
                        autoplaySpeed: 5000,
                        responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: true,
                                    dots: false
                                }
                            }
                        ],
                        method: {},
                        event: {
                            afterChange: function(event, slick, currentSlide, nextSlide) {
                                scope.isGoingToPersonalSelectPage = scope.homeSliderData[currentSlide].go_to_classic_page;
                                bodyBgrImage.style.opacity = 0.7;
                                $timeout(function() {
                                    showBackground(currentSlide)
                                }, 500);
                            }
                        }
                    };

                    scope.goToPlayPage = function() {
                        if (scope.isGoingToPersonalSelectPage) {
                            var lotteryId = scope.allDraws[0].LotteryTypeId;
                            quickPickService.addPersonalQuickPickToCart(1, 10, lotteryId, false)
                                .then(function() {
                                    stateHelper.goToCartPage();
                                });
                        } else {
                            var lotteryName = scope.allDraws[0].LotteryName.toLowerCase();
                            stateHelper.goToPlayPage(lotteryName, scope.isGoingToPersonalSelectPage);
                        }
                    };

                    function showBackground(index) {
                        bodyBgrImage.src = scope.homeSliderData[index].slide_image.url;
                        bodyBgrImage.style.opacity = 1;
                    }

                    //var mainData = scope.$parent.homeSliderData,
                    //    mobileData = [
                    //        //mainData[0],
                    //        {
                    //            heading_color: '#fff',
                    //            slide_image:false,
                    //            slider_heading: '',
                    //            slider_second_text: '',
                    //            current_biggest_jackpot: false,
                    //            embed_html_iframe: false,
                    //            background_images : {
                    //                url : "http://cardinalhouse.godev.eu/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-1.jpg"
                    //            },
                    //            mobile_slider_image : {
                    //                url : "http://cardinalhouse.godev.eu/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-1.jpg"
                    //            }
                    //        },
                    //        {
                    //            heading_color: '#fff',
                    //            slide_image:false,
                    //            slider_heading: '',
                    //            slider_second_text: '',
                    //            current_biggest_jackpot: false,
                    //            embed_html_iframe: false,
                    //            background_images : {
                    //                url : "http://cardinalhouse.godev.eu/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-2.jpg"
                    //            },
                    //            mobile_slider_image : {
                    //                url : "http://cardinalhouse.godev.eu/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-2.jpg"
                    //            }
                    //        },
                    //        {
                    //            heading_color: '#fff',
                    //            slide_image:false,
                    //            slider_heading: '',
                    //            slider_second_text: '',
                    //            current_biggest_jackpot: false,
                    //            embed_html_iframe: false,
                    //            background_images : {
                    //                url : "http://cardinalhouse.godev.eu/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-3.jpg"
                    //            },
                    //            mobile_slider_image : {
                    //                url : "http://cardinalhouse.godev.eu/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-3.jpg"
                    //            }
                    //        },
                    //        {
                    //            heading_color: '#fff',
                    //            slide_image:false,
                    //            slider_heading: '',
                    //            slider_second_text: '',
                    //            current_biggest_jackpot: false,
                    //            embed_html_iframe: false,
                    //            background_images : {
                    //                url : "http://cardinalhouse.godev.eu/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-4.jpg"
                    //            },
                    //            mobile_slider_image : {
                    //                url : "http://planetlotto.com.au/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-4.jpg"
                    //            }
                    //        },
                    //        {
                    //            heading_color: '#fff',
                    //            slide_image:false,
                    //            slider_heading: '',
                    //            slider_second_text: '',
                    //            current_biggest_jackpot: false,
                    //            embed_html_iframe: false,
                    //            background_images : {
                    //                url : "http://planetlotto.com.au/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-5.jpg"
                    //            },
                    //            mobile_slider_image : {
                    //                url : "http://planetlotto.com.au/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-5.jpg"
                    //            }
                    //        },
                    //        {
                    //            heading_color: '#fff',
                    //            slide_image:false,
                    //            slider_heading: '',
                    //            slider_second_text: '',
                    //            current_biggest_jackpot: false,
                    //            embed_html_iframe: false,
                    //            background_images : {
                    //                url : "http://planetlotto.com.au/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-6.jpg"
                    //            },
                    //            mobile_slider_image : {
                    //                url : "http://planetlotto.com.au/wp-content/plugins/lotto-yard/frontend/images/mobile-slide-6.jpg"
                    //            }
                    //        }
                    //    ];
                    //scope.isMobileWidth = $window.innerWidth < 768;
                    //scope.dataLoaded = false;
                    //
                    //angular.element($window).bind('resize', function(){
                    //
                    //    checkWindowWidth();
                    //
                    //});
                    //$timeout(function(){
                    //
                    //    checkWindowWidth();
                    //
                    //});
                    //
                    //function checkWindowWidth(){
                    //    if($window.innerWidth > 767 && !scope.isMobileWidth){
                    //        scope.isMobileWidth = !scope.isMobileWidth;
                    //        reInit(mainData);
                    //
                    //    }
                    //    else if($window.innerWidth < 768 && scope.isMobileWidth){
                    //        scope.isMobileWidth = !scope.isMobileWidth;
                    //        reInit(mobileData);
                    //    }
                    //
                    //    $timeout(function(){
                    //        setBackgroundHeight();
                    //    },1000);
                    //}
                    //
                    //function setBackgroundHeight(){
                    //
                    //    if($window.innerWidth >= 768){
                    //        var videoSlide = jQuery(element).find('.video-holder').first().parent();
                    //    }
                    //    else{
                    //        var videoSlide = jQuery(element).find('.image').last();
                    //    }
                    //    var textSlideImage = jQuery(element).find('.image-bg'),
                    //        videoSlideHeight = videoSlide.height();
                    //
                    //    textSlideImage.height(videoSlideHeight + 'px');
                    //}
                    //
                    //function reInit(data){
                    //
                    //    var slider = jQuery('#main-slider');
                    //    scope.dataLoaded = false;
                    //
                    //    scope.$apply(function(){
                    //        scope.$parent.homeSliderData = data;
                    //    });
                    //
                    //    scope.dataLoaded = true;
                    //}
                }
            };
        }
    ])