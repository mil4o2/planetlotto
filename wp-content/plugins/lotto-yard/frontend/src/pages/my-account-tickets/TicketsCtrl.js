 'use strict';

 angular.module('lyMyAccount')
     .controller('TicketsCtrl', [
         '$scope',
         'tickets',
         'lyMyAccountUserService',
         'lyApp.utility',
         'stateHelper',
         'lyMyAccoutContentACFData',
         'lyConstants',
         '$uibModal',
         'anchorSmoothScroll',
         function(
             $scope,
             tickets,
             lyMyAccountUserService,
             lyAppUtility,
             stateHelper,
             lyMyAccoutContentACFData,
             lyConstants,
             $uibModal,
             anchorSmoothScroll
         ) {
             lyAppUtility.addingMetaOnScope({
                 title: lyMyAccoutContentACFData.data.acf.my_tickets_title
             });

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd;
            }
            if(mm<10){
                mm='0'+mm;
            }
            var today = dd+'/'+mm+'/'+yyyy;

             $scope.todayDate = today;
            $scope.tickets = [];
             $scope.ticketsPageCount = tickets.length / 20;
             $scope.currentPage = 1;

             $scope.gotoElement = function (eID){
                anchorSmoothScroll.scrollTo(eID);
            };
             //
            //  $scope.changePage = function(change) {
            //
            //      var nextPage = $scope.currentPage + change;
            //      if (nextPage > 0) {
            //          lyMyAccountUserService.getTickets(nextPage)
            //              .then(function(resp) {
            //                  $scope.currentPage = nextPage;
            //                  $scope.tickets = resp;
            //                  $scope.gotoElement('my-account');
            //              }, function(error) {
            //                  stateHelper.goToHomePage();
            //              });
            //      }
            //  };
            $scope.changePage = function(page) {
                lyMyAccountUserService.getTickets(page)
                    .then(function(resp) {
                        debugger
                        if (resp.length > 0) {
                            $scope.tickets = resp;
                            $scope.gotoElement('my-account');
                        }
                    }, function(error) {
                        stateHelper.goToHomePage();
                    })
            }
            $scope.changePage($scope.currentPage);

            // lyMyAccountUserService.getFreeTicket().then(function(resp) {
            //
            //     if (resp.length > 0) {
            //         resp[0].IsFree = true;
            //         $scope.tickets.push(resp[0]);
            //     }
            // //    $scope.tickets = resp.length > 1 ? tickets : resp;
            // }, function(err) {
            //     $scope.tickets = [];
            // });

             $scope.openTickets = function(tickets) {
                 $scope.index = 0;
                 $scope.images = tickets;
                 $scope.modalInstance = $uibModal.open({
                     openedClass: 'scanned-ticket',
                     animation: true,
                     templateUrl: lyConstants.partialPath + 'my-account-tickets/templates/gallery.html',
                     scope: $scope
                 });
             };

             $scope.closeModal = function() {
                 $scope.modalInstance.close();
             };

             $scope.changeImage = function(index, change) {
                 var nextIndex = index + change;
                 if (nextIndex >= 0 && nextIndex < $scope.images.length) {
                     $scope.index = nextIndex;
                 }
             };

             $scope.getNumbers = function(ticket, index) {
                 if (ticket.hasOwnProperty('SingleLines')) {
                    if (ticket.SingleLines.hasOwnProperty('SelectedNumbers')) {
                       for (var prop in ticket.SingleLines.SelectedNumbers) {
                           return getWinningNumber(ticket.SingleLines.SelectedNumbers[prop], index);
                       }
                    }
                } else if (ticket.hasOwnProperty('WinningResult') && ticket.WinningResult) {
                    return getWinningNumber(ticket.WinningResult, index);
                }
                return [];
             };

             function getRaffleNumbers(numbersAsObject) {
                 var array = $.map(numbersAsObject, function(value) {
                     return [value];
                 });

                 return array;
             }

             function getWinningNumber(numbersAsString, index) {
                 if (numbersAsString.length) {
                     var separatedNumbers = numbersAsString.split('#');
                     if (separatedNumbers[index].length) {
                         return separatedNumbers[index].split(',');
                     }
                 }

                 return [];
             }
         }
     ]);
