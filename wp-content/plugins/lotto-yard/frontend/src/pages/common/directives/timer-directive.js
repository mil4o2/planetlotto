'use strict';

angular.module('lyApp.directives')
    .directive('lyTimer', [
        '$interval',
        'lyConstants',
        function(
            $interval,
            lyConstants
        ) {
            return {
                restrict: 'A',
                scope: {
                    time: '='
                },
                date: '@',
                templateUrl: lyConstants.partialPath + 'common/templates/timer.html',
                link: function(scope) {
                    scope.translation = lyConstants.translationObject;

                    scope.days1 = 0;
                    scope.days2 = 0;

                    scope.hours1 = 0;
                    scope.hours2 = 0;

                    scope.minutes1 = 0;
                    scope.minutes2 = 0;

                    scope.seconds1 = 0;
                    scope.seconds2 = 0;

                    var future = new Date(scope.time || new Date().toLocaleString());
                    var timer = null;

                    var stopTimer = function() {
                        if (angular.isDefined(startTimer)) {
                            var res = $interval.cancel(startTimer);
                        }
                    };

                    var timer = function() {
                        var time = Math.floor((future.getTime() - (3 * 60 * 60 * 1000)) - new Date().getTime()) / 1000;
                        var dateAndTime = GetDateAndTime(time);

                        setTimerValues(dateAndTime);

                        if (time < 0) {
                            stopTimer();
                            setTimerValues(['00', '00', '00', '00']);
                        }
                    };

                    var startTimer = $interval(timer, 1000);

                    function GetDateAndTime(time) {
                        var days = Math.floor(time / 86400);
                        time -= days * 86400;
                        days = days.toString().length == 2 ? days.toString() : '0' + days;

                        var hours = Math.floor(time / 3600) % 24;
                        time -= hours * 3600;
                        hours = hours.toString().length == 2 ? hours.toString() : '0' + hours;

                        var minutes = Math.floor(time / 60) % 60;
                        time -= minutes * 60;
                        minutes = minutes.toString().length == 2 ? minutes.toString() : '0' + minutes;

                        var seconds = Math.floor(time % 60);
                        seconds = seconds.toString().length == 2 ? seconds.toString() : '0' + seconds;

                        return [days, hours, minutes, seconds]
                    }

                    function setTimerValues(dateAndTime) {
                        scope.days1 = dateAndTime[0][0];
                        scope.days2 = dateAndTime[0][1];

                        scope.hours1 = dateAndTime[1][0];
                        scope.hours2 = dateAndTime[1][1];

                        scope.minutes1 = dateAndTime[2][0];
                        scope.minutes2 = dateAndTime[2][1];

                        scope.seconds1 = dateAndTime[3][0];
                        scope.seconds2 = dateAndTime[3][1];
                    }
                }
            }
        }
    ])