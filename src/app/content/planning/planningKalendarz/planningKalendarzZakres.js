(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningKalendarzZakres', planningKalendarzZakres);

    planningKalendarzZakres.$inject = ['$window'];
    
    function planningKalendarzZakres ($window) {
        // Usage:
        //     <planningKalendarzZakres></planningKalendarzZakres>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            //scope: {
            //    dzial: '=',
            //    result:'='
            //},
            templateUrl: 'app/content/planning/planningKalendarz/planningKalendarzZakres.html'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();