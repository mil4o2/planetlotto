  'use strict';

  angular.module('lyApp')
      .controller('SingleBlogCtrl', [
          '$scope',
          'lyApp.utility',
          'pageContent',
          'blogPage',
          'testimonials',
          'draws',
          'allCategories',
          'lyApiData',
          'allBlogs',
          'stateHelper',
          function(
              $scope,
              lyAppUtility,
              pageContent,
              blogPage,
              testimonials,
              draws,
              allCategories,
              lyApiData,
              allBlogs,
              stateHelper
          ) {
              lyAppUtility.addingMetaOnScope(pageContent.data[0]);

              $scope.allRules = lyApiData.LotteryRules;
              $scope.allDraws = lyApiData.AllDraws;
              $scope.allBlogs = allBlogs.data;

              $scope.$parent.showBreadcrumb = blogPage.data[0].acf.show_bredcrumb;
              $scope.$parent.breadcrumb = pageContent.data[0].content.yoast_breadcrumb;

              $scope.pageContent = pageContent.data[0];

              $scope.categories = allCategories.data.filter(function( obj ) {
                    return obj.id == $scope.pageContent.categories[0];
              });

              $scope.pageWidget = blogPage.data[0].acf;
              $scope.widgetList = $scope.pageWidget.add_widget;

              $scope.draws = draws;
              $scope.testimonials = testimonials;

          }
      ])
