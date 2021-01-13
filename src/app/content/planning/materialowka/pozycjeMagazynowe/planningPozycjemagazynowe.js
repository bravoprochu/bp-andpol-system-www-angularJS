(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningPozycjemagazynowe', planningPozycjemagazynowe);

    planningPozycjemagazynowe.$inject = [];
    
    function planningPozycjemagazynowe () {
        // Usage:
        //     <planningPozycjemagazynowe></planningPozycjemagazynowe>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/planning/materialowka/pozycjeMagazynowe/planningPozycjemagazynowe.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();