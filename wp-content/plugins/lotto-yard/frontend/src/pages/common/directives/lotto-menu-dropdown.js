'use strict';

angular.module('lyApp.directives')
    .directive('lottoMenuDropdown', [
        'lyCartService',
        '$lyCart',
        '$timeout',
        function(
            lyCartService,
            $lyCart,
            $timeout
        ) {
            return {
                restrict: 'C',
                templateUrl: $lyCart.partialPath + 'common/templates/lotto-menu-dropdown.html',
                link: function(scope, element) {

                    scope.lottos = [];

                    lyCartService.getLotteryAndProductDataCart().then(function(response){
                        scope.lottos = response.AllDraws;
                    }, function(){});

                    var dropdownToggle = jQuery(element).parent();

                    dropdownToggle.on('mouseenter', function(event){

                        jQuery(element).removeClass('hide');

                    });

                    dropdownToggle.on('mouseleave', function(event){

                        jQuery(element).addClass('hide');

                    });

                }
            }
        }
    ])