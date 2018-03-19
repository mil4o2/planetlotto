'use strict';

angular.module('lyCart.directives')
    /**
     * @ngdoc directive
     * @name lyCart.directive:lyCartSummary
     * @restrict A
     * @element ANY
     *
     * @description
     */
    .directive('lyCartSummary', [
        'lyConstants',
        '$timeout',
        function(
            lyConstants,
            $timeout
        ) {
            return {
                restrict: 'A',
                controller: 'CartCtrl',
                scope: {},

                transclude: true,
                templateUrl: lyConstants.partialPath + 'cart/templates/summary.html',
                link: function(scope, $rootScope) {
                    scope.showFreeTicket = true;

                    function checkIfFreeTicket(){
                        if(scope.userService.isLogin){
                            scope.userService.getMemberMoneyBalanceByMemberId().then(function(resp){
                                if (!resp.FirstPurchase) {
                                    scope.showFreeTicket = false;
                                }
                            })
                        }
                    }
                    checkIfFreeTicket();

                    scope.$on('loggingOut', function(){
                        scope.showFreeTicket = true;
                    });

                    scope.$on('loggingIn', function(){
                        checkIfFreeTicket();
                    });

                    scope.closePopup = function() {
                        angular.element('#toggle-cart-popup').removeClass('open');
                        angular.element('#toggle-cart-popup-mobile').removeClass('open');
                    }

                    scope.hideFixedCartPopup = function() {

                        angular.element('#fixed-cart-popup')[0].style.opacity = 0;
                        $timeout(function() {
                            angular.element('#fixed-cart-popup')[0].style.display = "none";
                        }, 100);
                    }
                }
            };
        }
    ])
