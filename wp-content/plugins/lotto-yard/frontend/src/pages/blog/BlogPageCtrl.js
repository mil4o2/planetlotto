  'use strict';

  angular.module('lyApp')
      .controller('BlogPageCtrl', [
          '$scope',
          'lyApp.utility',
          'pageContent',
          'allBlogs',
          'testimonials',
          'draws',
          'allCategories',
          'allTags',
          'stateHelper',
          'lyApiData',
          function(
              $scope,
              lyAppUtility,
              pageContent,
              allBlogs,
              testimonials,
              draws,
              allCategories,
              allTags,
              stateHelper,
              lyApiData
          ) {
              lyAppUtility.addingMetaOnScope(pageContent.data[0]);

              $scope.allRules = lyApiData.LotteryRules;
              $scope.allDraws = lyApiData.AllDraws;

              $scope.$parent.breadcrumb = pageContent.data[0].content.yoast_breadcrumb;
              $scope.$parent.showBreadcrumb = pageContent.data[0].acf.show_bredcrumb;

              $scope.pageContent = pageContent.data[0];
              $scope.allBlogs = allBlogs.data;
              $scope.categories = allCategories.data;
              $scope.tags = allTags.data;

              $scope.getName = function(id, isTag) {
                  var temp;
                  if (isTag) {
                      var temp = allTags.data.filter(function(obj) {
                          return obj.id == id;
                      });
                  } else {
                      var temp = allCategories.data.filter(function(obj) {
                          return obj.id == id;
                      });
                  }
                  return temp[0].name;
              }

              $scope.goToBlogByTaxonomyFilter = function(id, isTag){
                  var name = $scope.getName(id, isTag);
                  stateHelper.goToBlogByTaxonomyFilter(id, name, isTag);
              }

              $scope.pageWidget = pageContent.data[0].acf;
              $scope.widgetList = $scope.pageWidget.add_widget;

              $scope.testimonials = testimonials;
              $scope.draws = draws;

          }
      ])
