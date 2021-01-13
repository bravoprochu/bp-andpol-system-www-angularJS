(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningTkaninyBelkaRaport', planningTkaninyBelkaRaport);

    planningTkaninyBelkaRaport.$inject = ['$window'];
    
    function planningTkaninyBelkaRaport ($window) {
        // Usage:
        //     <planningTkaninyBelkaRaport></planningTkaninyBelkaRaport>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/planning/materialowka/tkaniny/raport/planningTkaninyBelkaRaport.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();