(function () {
    'use strict';

    angular
        .module('app')
        .filter('sumOfValue', sumOfValue);
    
    function sumOfValue() {
        return function (data, key) {
            if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
                return 0;
            } 
            var sum = 0;
            for (var i = 0; i < data.length; i++) {
                //                sum = sum+ parseInt(data[i][key]);
                sum+=data[i][key];
            }
            return sum;
        };
    }
})();