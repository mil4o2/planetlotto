 'use strict';

 angular.module('lyCart')
     .controller('RaffleCtrl', [
         '$scope',
         'lyCart',
         '$timeout',
         function(
             $scope,
             lyCart,
             $timeout
         ) {

             function Countdown(scope, item) {
                 var timer,
                     itemId = item.getId(),
                     instance = this,

                     counterEnd = function() {
                         $timeout(function() {
                             lyCart.removeItemById(itemId);
                             $scope.initCart();
                             //angular.element('#navidad' + itemId).click();
                         }, 100);
                     };

                 function decrementCounter() {
                     if (scope.seconds <= 0) {
                         counterEnd();
                         instance.stop();
                         return;
                     }
                     scope.seconds--;
                     if (scope.seconds === 0) {
                         scope.isRefreshing = true;
                     }

                     angular.element('#timer' + itemId).text(convertDate(scope.seconds));
                     scope.$apply(); //update the view bindings
                 }

                 this.start = function() {
                     clearInterval(timer);
                     if (item.getProductExpire() === 0) {
                         return;
                     }
                     scope.seconds = item.getProductExpire();

                     angular.element('#timer' + itemId).text(convertDate(scope.seconds));

                     timer = setInterval(decrementCounter.bind(this.timer), 1000);
                 };

                 this.stop = function() {
                     clearInterval(timer);
                 }
             }

             var ct;
             $scope.init = function(id) {
                 console.log("raffle counter init id:", id);
                 var itemCart = lyCart.getItemById(id);
                 //create a new event timer and start counting down
                 ct = new Countdown($scope, itemCart);
                 ct.start();
             };

             function convertDate(t) {
                 var days, hours, minutes, seconds;
                 //days = Math.floor(t / 86400);
                 //t -= days * 86400;
                 //hours = Math.floor(t / 3600) % 24;
                 //t -= hours * 3600;
                 minutes = Math.floor(t / 60) % 60;
                 t -= minutes * 60;
                 seconds = t % 60;
                 return [
                     //days + 'd',
                     //hours + 'h',
                     minutes + 'm',
                     seconds + 's'
                 ].join(' ');
             };
         }
     ])