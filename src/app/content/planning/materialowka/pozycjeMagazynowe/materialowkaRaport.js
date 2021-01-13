(function() {
    'use strict';

    angular
        .module('app')
        .directive('materialowkaRaport', materialowkaRaport);

    materialowkaRaport.$inject = [];
    
    function materialowkaRaport () {
        // Usage:
        //     <materialowkaRaport></materialowkaRaport>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/planning/materialowka/pozycjeMagazynowe/materialowkaRaport.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();