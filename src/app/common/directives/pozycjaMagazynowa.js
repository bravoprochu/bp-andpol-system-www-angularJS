(function() {
    'use strict';

    angular
        .module('app')
        .directive('pozycjaMagazynowa', pozycjaMagazynowa);

    pozycjaMagazynowa.$inject = ['$mdMedia'];
    
    function pozycjaMagazynowa($mdMedia, magPozycjaMagazynowaDetailCtrl) {
        // Usage:
        //     <pozycjaMagazynowa></pozycjaMagazynowa>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/common/directives/pozycjaMagazynowa.html',
            controller: magPozycjaMagazynowaDetailCtrl,
            controllerAs:'vm'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.screenSmall = $mdMedia('gt-md');
        }
    }

})();