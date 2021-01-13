(function () {
    'use strict';

    angular
        .module('app')
        .filter('bezUsunietych', bezUsunietych);
    
    function bezUsunietych() {
        return function bezUsunietychFilter(input) {
            var result=[];
            angular.forEach(input, function (data) {
                if (data.status == 'nowy' || data.status == 'baza' || data.status=='zmieniony') {
                    result.push(data);
                }
            });
            return result;

        };
    }
})();