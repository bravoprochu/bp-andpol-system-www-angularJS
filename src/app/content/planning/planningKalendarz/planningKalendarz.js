(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningKalendarz', planningKalendarz);

    planningKalendarz.$inject = [];
    
    function planningKalendarz () {
        // Usage:
        //     <planningKalendarz></planningKalendarz>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/planning/planningKalendarz/planningKalendarz.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();