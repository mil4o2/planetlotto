'use strict';

angular.module('lyPlayPage.directives')
    .directive('lyForPlayers', [
        '$lyCart',
        function(
            $lyCart
        ) {
            return {
                restrict: 'A',
                templateUrl: $lyCart.partialPath + 'common/templates/forplayers.html',
                controller: ['$scope', '$location', function($scope, $location) {
                    $scope.acf.content.forEach(function(entry) {
                        if (entry.acf_fc_layout === "sidebar_links") {
                            $scope.forPlayersLinks = entry.sidebar_links;
                        }
                    })
                    $scope.currentUrl = $location.absUrl();
                }],
                link: function(scope, element, attr){
                    scope.titleMenu = attr.titlemenu;
                }
            }
        }
    ]);