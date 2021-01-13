(function() {
    'use strict';

    angular
        .module('app')
        .directive('wyborKombinacji', wyborKombinacji);

    wyborKombinacji.$inject = ['$window'];
    
    function wyborKombinacji ($window) {
        // Usage:
        //     <wyborKombinacji></wyborKombinacji>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: 'app/common/wyborKombinacjiD.html'

        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();