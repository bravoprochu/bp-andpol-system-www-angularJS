(function () {
    'use strict';

    angular
        .module('app')
        .filter('noBrackets', noBrackets);
    
    function noBrackets() {
        return function (value) {

            if (angular.isArray(value)) {
                return value[0];
            }
            return;
        };
    }
})();