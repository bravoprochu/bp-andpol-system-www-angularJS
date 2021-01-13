(function() {
    'use strict';

    angular
        .module('app')
        .directive('kalendarz', kalendarz);

    kalendarz.$inject = ['$mdMedia'];
    
    function kalendarz ($mdMedia) {
        // Usage:
        //     <kalendarz></kalendarz>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                data: '=',

                przejdzDo: '&'
            },
            templateUrl:'app/common/directives/kalendarz.html'

        };
        return directive;

        function link(scope, element, attrs) {
            scope.daysOfWeek = ["pon", "wt", "śr", "czw", "pt", "sb", "ndz"];
            scope.today = moment().format('YYYY-MM-DD');
            scope.kalendarz = [];
            scope.doMonthView = doMonthView;
            scope.idzDo = idzDo;
            scope.isSmall = $mdMedia('gt-md');


            function doMonthView(startDate) {
                var start = angular.isDate(startDate) ? moment(startDate): moment();
                var miech={
                    razemDni: start.endOf('month').date(),
                    dzienTyg: start.startOf('month').format('dddd'),
                    dzienTygNumer:start.startOf('month').day(),
                    weekNumberStart: start.startOf('month').week(),
                    weekNumberEnd:start.endOf('month').week()
                }

                //mv = monthView..
                var mvStartDate = moment().week(miech.weekNumberStart).startOf('week');
                var mvEndDate = moment().week(miech.weekNumberEnd).endOf('week');
                var mvIloscDni = mvEndDate.diff(mvStartDate, 'days')+1;

                var kalendarz = {
                    razemDni:mvIloscDni,
                    weeks: [],
                }

                var week = {
                    days: []
                }

                var currWeekNr = miech.weekNumberStart;
                for (var mv = 0; mv < mvIloscDni; mv++) {
                    
                    var currDay = moment(mvStartDate).add(mv, 'days');
                    var day = {
                        dzien: new Date(currDay.format("YYYY-MM-DD")),
                        dzienTygNr: currDay.day(),
                        dzienTyg: currDay.format('dddd'),
                        weekNumber: currDay.week(),
                        dataObj:[]
                    };

                    if (currDay.month() == start.month()) {
                        day.background = 400;
                        day.oppacity = 1;
                    } else {
                        day.background = 400;
                        day.oppacity = 0.6;
                    }

                    

                    if (day.weekNumber == currWeekNr) {
                        week.days.push(day);
                    } else {
                        week.weekNumber = currWeekNr;
                        kalendarz.weeks.push(angular.copy(week));

                        week.days = [];
                        currWeekNr++;
                        week.days.push(day);
                    }
                    if (mv == mvIloscDni-1 && week.days.length < 8) {
                        kalendarz.weeks.push(angular.copy(week));
                    }

                }
                console.log(kalendarz);
                scope.kalendarz=kalendarz;
            }

            function idzDo(param, dzienRoboczy) {
                param = param === undefined ? 0 : param;
                scope.przejdzDo({ id: param, day: dzienRoboczy });
            }

        }
    }

})();