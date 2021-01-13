(function () {
    'use strict';

    angular
        .module('app')
        .filter('objToString', objToString);
    
    function objToString() {
       return function (input) {
            var result = '';
            if (!angular.isObject) { result= 'duuupa'; }
            else {
                angular.forEach(input, function (data) {
                    result += data;
                });
            }

            return result;
        };
    }
})();