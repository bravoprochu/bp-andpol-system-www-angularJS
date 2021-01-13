(function () {
    'use strict';

    angular
        .module('app')
        .filter('dateGroupBy', dateGroupBy);
    
    function dateGroupBy() {
        return function (inData, key) {
            if (typeof (inData) === 'undefined' && typeof (key) === 'undefined') {
                return 0;
            }
            var result = [];
            var dzien = {
                data: null,
                platnosci:[]
            };
            var dniPlatnosci = [];

            angular.forEach(inData, function (platnosc) {
                var data = moment(platnosc.terminPlatnosci).format('YYYY-MM-DD');
                if (czyJestJuzDzienPlatnosci(data)) {
                    dniPlatnosci.push(data);
                }
            });

            angular.forEach(dniPlatnosci, function (dzienPlatnosci) {
                var tmp = {
                    data: dzienPlatnosci,
                    platnosci:[]
                };
                result.push(tmp);
            });

            angular.forEach(inData, function (platnosc) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].data == platnosc.data) {
                        result[i].platnosci.push(platnosc);
                    }
                }
            });


            function czyJestJuzDzienPlatnosci(data) {
                return dniPlatnosci.indexOf(data)<0;
            }



            return result;
        };
    }
})();