'use strict'

angular.module('lyApp.directives')
    .directive('lyLotteryInfo', [
        '$location',
        'lyConstants',
        'lyAppLotteriesService',
        '$sce',
        function(
            $location,
            lyConstants,
            lyAppLotteriesService,
            $sce
        ) {
            return {
                restrict: 'A',
                templateUrl: lyConstants.partialPath + 'lottery-info/templates/single-info-directive.html',
                link: function(scope) {
                    var separatedUrl = $location.url().split('-')[0];
                    scope.lotteryName = separatedUrl.substring(1);
                    scope.moreInfo = scope.acf.more_info;

                    lyAppLotteriesService.getAllLotteriesRules()
                        .then(function(resp) {
                            if (!Array.isArray(resp)) {
                                return;
                            }

                            scope.lotteryRules = resp.filter(function(current) {
                                return current.LotteryType.toLowerCase() == scope.lotteryName.toLowerCase();
                            })[0];
                        }, function(error) {
                            console.warn('error in lyAppLotteriesService.getAllLotteriesRules', error);
                        })

                    lyAppLotteriesService.getAllBrandDraws()
                        .then(function(resp) {
                            if (!Array.isArray(resp)) {
                                return;
                            }

                            resp.forEach(function(current) {
                                if (current.LotteryName.toLowerCase() == scope.lotteryName.toLowerCase()) {
                                    scope.currentJackpot = current.Jackpot;
                                    scope.lotteryDrawDate = current.DrawDate;
                                    scope.currency = current.LotteryCurrency2;
                                }
                            })
                        }, function(error) {
                            console.warn('error in lyAppLotteriesService.getAllBrandDraws:', error);
                        })

                    lyAppLotteriesService.getLotteryResultsNoRaffles()
                        .then(function(resp) {
                            scope.allLotteries = resp.map(function(current) {
                                if (current.LotteryName.toLowerCase() == scope.lotteryName) {
                                    scope.lotteryInfo = current;
                                    scope.lotteryName = current.LotteryName;
                                }

                                return current.LotteryName;
                            });
                        }, function(error) {
                            console.warn('error in lyAppLotteriesService.getLotteryResultsNoRaffles', error);
                        });

                    scope.goToPlayPage = function(lotteryName) {
                        $location.path('/' + lyConstants.selectPageSlug + '/' + lotteryName.toLowerCase() + '/');
                    }

                    scope.changeInfo = function(lotteryName) {
                        $location.path('/' + lotteryName.toLowerCase() + '-info/');
                    }

                    if (scope.acf.graph) {
                        scope.config = {
                                title: '', // chart title. If this is false, no title element will be created.
                                tooltips: true,
                                labels: false, // labels on data points
                                mouseover: function() {}, // exposed events
                                mouseout: function() {},
                                click: function() {},
                                legend: { // legend config
                                    display: false, // can be either 'left' or 'right'.
                                    position: 'left',
                                    htmlEnabled: true // you can have html in series name
                                },
                                colors: ['#fff', "#666"], // override this array if you're not happy with default colors
                                innerRadius: 0, // Only on pie Charts
                                lineLegend: 'lineEnd', // Only on line Charts
                                lineCurveType: 'dashedline', // change this as per d3 guidelines to avoid smoothline
                                isAnimate: true, // run animations while rendering chart
                                yAxisTickFormat: 's', //refer tickFormats in d3 to edit this value
                                xAxisMaxTicks: 15, // Optional: maximum number of X axis ticks to show if data points exceed this number
                                yAxisTickFormat: 's',
                                xAxisMaxTicks: 15, // refer tickFormats in d3 to edit this value
                                waitForHeightAndWidth: true // if true, it will not throw an error when the height or width are not defined (e.g. while creating a modal form), and it will be keep watching for valid height and width values
                            }
                            //SAMPLE
                            // scope.data = {
                            //     series: [' '],
                            //     data: [{
                            //         x: "",
                            //         y: [],
                            //         tooltip: ""
                            //     }]
                            // }
                        scope.data = {
                            series: [' '],
                            data: []
                        }
                        scope.graphData = scope.acf.graph;
                        scope.yDataHeight = (13 / scope.graphData.length) * 25;

                        for (var i = 0; i < scope.graphData.length; i++) {
                            var temp = {
                                x: "",
                                y: [],
                                tooltip: ""
                            }

                            temp.x = scope.graphData[i].x_data;
                            temp.y[0] = i;
                            temp.tooltip = scope.graphData[i].point_data;

                            scope.data.data.push(temp);
                        }
                    }
                }
            }
        }
    ]);