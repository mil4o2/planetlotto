'use strict';

angular.module('lyPlayPage.directives')
    .directive('lyScrollingMenus', [
        '$lyCart',
        function(
            $lyCart
        ) {
            return {
                restrict: 'A',
                templateUrl: $lyCart.partialPath + 'common/templates/scrolling-menu.html',
                controller: ['$scope', function($scope) {
                    $scope.acf.content.forEach(function(item) {
                        if (item.acf_fc_layout === "sidebar_menus") {
                            $scope.menuList = item.sidebar_menu;
                        }
                    })
                    $scope.scrollTo = function(eID) {

                        var headerHeight = document.getElementById('header').offsetHeight;
                        var menusHeight = document.getElementsByClassName('head-menu')[0].offsetHeight;
                        var i;
                        var startY = currentYPosition();
                        var stopY = elmYPosition(eID) - headerHeight - menusHeight;
                        var distance = stopY > startY ? stopY - startY : startY - stopY;

                        if (distance < 100) {
                            scrollTo(0, stopY);
                            return;
                        }

                        var speed = Math.round(distance / 100);
                        if (speed >= 20) speed = 20;
                        var step = Math.round(distance / 35);
                        var leapY = stopY > startY ? startY + step : startY - step;
                        var timer = 0;
                        if (stopY > startY) {
                            for (i = startY; i < stopY; i += step) {
                                setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
                                leapY += step;
                                if (leapY > stopY) leapY = stopY;
                                timer++;
                            }
                            return;
                        }
                        for (i = startY; i > stopY; i -= step) {
                            setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
                            leapY -= step;
                            if (leapY < stopY) leapY = stopY;
                            timer++;
                        }
                    }

                    function currentYPosition() {
                        // Firefox, Chrome, Opera, Safari
                        if (window.pageYOffset) {
                            return window.pageYOffset;
                        }
                        // Internet Explorer 6 - standards mode
                        if (document.documentElement && document.documentElement.scrollTop) {
                            return document.documentElement.scrollTop;
                        }
                        // Internet Explorer 6, 7 and 8
                        if (document.body.scrollTop) {
                            return document.body.scrollTop;
                        }
                        return 0;
                    }

                    function elmYPosition(eID) {
                        var elm = document.getElementById(eID);
                        var y = elm.offsetTop;
                        var node = elm;
                        while (node.offsetParent && node.offsetParent != document.body) {
                            node = node.offsetParent;
                            y += node.offsetTop;
                        }
                        return y;
                    }


                    var isSmallWindow = window.screen.availWidth <= 768;
                    if (isSmallWindow) {
                        jQuery('.menus').addClass('relative');
                        jQuery('.back-to-top').removeClass('hidden').removeClass('fixed').addClass('back-to-top-mobile');
                    }

                    jQuery(document).scroll(function() {
                        var menu = jQuery('#scrolling-menu');

                        if (menu.length && !isSmallWindow) {
                            jQuery('[data-toggle="back-to-top"]').tooltip();

                            var menusYpos = jQuery('.menus-location').offset().top + jQuery('.menus').height();
                            var footerYpos = jQuery('.footer').offset().top - (jQuery('.menus').height() / 2);
                            var windowYpos = jQuery('.menus-location').offset().top;
                            var windowHeight = jQuery(document).height()

                            if (menusYpos < footerYpos) {
                                jQuery('.menus').addClass('fixed');
                                jQuery('.menus').removeClass('absolute').removeClass('bottom');
                            } else {
                                jQuery('.menus').addClass('absolute').addClass('bottom');
                            }

                            if (windowHeight / 2 <= windowYpos) {
                                jQuery('.back-to-top').removeClass('hidden');
                            } else {
                                jQuery('.back-to-top').addClass('hidden');
                            }
                        }
                    });
                }]
            }
        }
    ]);