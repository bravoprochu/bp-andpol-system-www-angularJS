(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningTkaninyBelka', planningTkaninyBelka);

    planningTkaninyBelka.$inject = ['$window'];
    
    function planningTkaninyBelka ($window) {
        // Usage:
        //     <planningTkaninyBelka></planningTkaninyBelka>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/planning/materialowka/tkaniny/planningTkaninyBelka.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();