(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningZamowieniaBaza', planningZamowieniaBaza);

    planningZamowieniaBaza.$inject = [];
    
    function planningZamowieniaBaza () {
        // Usage:
        //     <planningZamowieniaBaza></planningZamowieniaBaza>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/planning/planningZamowieniaBaza.html',
            scope: {
                tableObj: '=',
                zamowieniaDost: '=',
                destDataObj:'='
            }
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();