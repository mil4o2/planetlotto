   'use strict';

   angular.module('lyApp.directives')
       .directive('lyTestimonials', [
           '$lyCart',
           function(
               $lyCart
           ) {
               return {
                   restrict: 'EC',
                   templateUrl: $lyCart.partialPath + 'home/templates/ly-testimonials.html',
                   link: function(scope, element) {
                       scope.slickConfigTestimonials = {
                           // infinite: false,
                           slidesToShow: 1,
                           slidesToScroll: 1,
                           autoplay: true,
                           autoplaySpeed: 2000,
                           arrows: true,
                           nextArrow: '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>',
                           prevArrow: '<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>'
                       };

                   }
               }
           }
       ])