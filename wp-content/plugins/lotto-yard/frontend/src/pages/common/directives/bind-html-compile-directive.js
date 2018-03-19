'use strict'

angular.module('lyApp.directives')
    /**
     * @ngdoc directive
     * @name lyApp.directive:bindHtmlCompile
     * @restrict A
     * @element ANY
     * 
     * @description
     * The bind-html-compile directive allows for HTML containing directives to be compiled.
     * You should only use this directive where the content is coming from a trusted source.
     * 
     * @param {data.content}  bindHtmlCompile   If the data.content contained a directive, it would not be compiled.
     */
    .directive('bindHtmlCompile', [
        '$compile',
        function(
            $compile
        ) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    scope.$watch(function() {
                        return scope.$eval(attrs.bindHtmlCompile);
                    }, function(value) {
                        // In case value is a TrustedValueHolderType, sometimes it
                        // needs to be explicitly called into a string in order to
                        // get the HTML string.
                        element.html(value && value.toString());
                        // If scope is provided useS it, otherwise use parent scope
                        var compileScope = scope;
                        if (attrs.bindHtmlScope) {
                            compileScope = scope.$eval(attrs.bindHtmlScope);
                        }
                        $compile(element.contents())(compileScope);
                    });
                }
            };
        }
    ])