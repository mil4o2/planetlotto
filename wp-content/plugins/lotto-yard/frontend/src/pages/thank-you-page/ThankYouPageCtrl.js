'use strict';

angular.module('lyApp')
    .controller('ThankYouPageCtrl', [
        '$scope',
        '$state',
        '$log',
        'lyMyAccountUserService',
        'pageContent',
        'purchaseItems',
        '$rootScope',
        'lyCart',
        'lyUserCacheFactory',
        'lyApp.utility',
        '$location',
        function(
            $scope,
            $state,
            $log,
            lyMyAccountUserService,
            pageContent,
            purchaseItems,
            $rootScope,
            lyCart,
            lyUserCacheFactory,
            lyAppUtility,
            $location
        ) {
            $scope.$parent.breadcrumb = pageContent.data[0].content.yoast_breadcrumb;
            $scope.$parent.showBreadcrumb = pageContent.data[0].acf.show_bredcrumb;
            $scope.content = pageContent.data[0];
            $scope.contentFaq = pageContent.data[0].acf.faq;
            $scope.iFrame = '<iframe width="100%" height="355" src="' + pageContent.data[0].acf.video_link + '" frameborder="0" allowfullscreen></iframe>';
            $scope.purchaseItems = purchaseItems;

            $rootScope.$on('loggingOut', function(){
                $location.url('/');
            })

            lyUserCacheFactory.remove('MemberMoneyBalance');

            lyAppUtility.addingMetaOnScope(pageContent.data[0]);

            if (purchaseItems) {
                lyUserCacheFactory.remove('Products');
                lyCart.empty(); //clear cart
                $scope.purchaseItems = purchaseItems;
                $rootScope.$broadcast('loggingIn');

            }

            if ($state.params.deposit && pageContent.data[0].acf.deposit_content) {
                lyUserCacheFactory.remove('Transactions');
                $scope.pageContent = pageContent.data[0].acf.deposit_content;
            } else if ($state.params.contactUs && pageContent.data[0].acf.contact_us_content) {
                $scope.pageContent = pageContent.data[0].acf.contact_us_content;
            } else {
                $scope.pageContent = pageContent.data[0].content.rendered;
            }
        }
    ])
