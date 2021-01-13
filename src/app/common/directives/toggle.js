(function() {
    'use strict';

    angular
        .module('app')
        .directive('toggle', toggle);

    toggle.$inject = [];
    
    function toggle () {
        // Usage:
        //     <toggle></toggle>
        // Creates:
        // 
        var directive = {
            link: link,
            templateUrl: 'app/common/directives/toggle.html',
            scope: {
                source: '=',
                title: '@',
                subTitle:'@',
                isOpen:'@'
            },
            restrict: 'E'

        };
        return directive;

        function link(scope, element, attrs) {
            scope.$watch('pos', function (newVal) {
                scope.source = newVal;

                if (scope.isOpen === "true") {
                    scope.pos = true;
                }
            });
        }
    }

})();