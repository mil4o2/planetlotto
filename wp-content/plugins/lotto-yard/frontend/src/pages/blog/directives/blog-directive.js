 'use strict';

 angular.module('lyApp.directives')
     .directive('lyBlog', [
         '$lyCart',
         function(
             $lyCart
         ) {
             return {
                 restrict: 'C',
                 templateUrl: $lyCart.partialPath + 'blog/templates/ly-blog.html',
                 link: function(scope) {
                     scope.currentPage = 0;
                     scope.pageSize = 4;
                     scope.numberOfPages = Math.ceil(scope.allBlogs.length / scope.pageSize);
                     scope.scrollToTop = function(){
                        $(document.body).animate({
                            'scrollTop':   $('#news-scroll-top').offset().top
                        }, 100);
                     }
                 }
             }
         }
     ])
