 'use strict';

 angular.module('lyMyAccount')
     .controller('TransactionsCtrl', [
         '$scope',
         'transactions',
         'lyMyAccountUserService',
         'lyApp.utility',
         'lyConstants',
         'stateHelper',
         'lyMyAccoutContentACFData',
         '$stateParams',
         function(
             $scope,
             transactions,
             lyMyAccountUserService,
             lyAppUtility,
             lyConstants,
             stateHelper,
             lyMyAccoutContentACFData,
             $stateParams
         ) {
            $scope.transactions = transactions;
            lyAppUtility.addingMetaOnScope({
                title: lyMyAccoutContentACFData.data.acf.my_transactions_title
            });

            $scope.activeTab = 0;
            if ($stateParams.withdraw !== null) {
                $scope.activeTab = 1;
            } else {
                $scope.activeTab = 0;
            }
         }
     ])
