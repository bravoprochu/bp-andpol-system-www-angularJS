(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningWykonany', planningWykonany);

    planningWykonany.$inject = [];
    
    function planningWykonany () {
        // Usage:
        //     <planningWykonany></planningWykonany>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/planning/planningWykonany.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();