(function() {
    'use strict';

    angular
        .module('app')
        .directive('statusWatch', statusWatch);

    statusWatch.$inject = ['statusCheck'];
    
    function statusWatch (statusCheck) {
        // Usage:
        //     <statusWatch></statusWatch>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            require:'^form',
            scope: {
                status: '=',
            },
        };
        return directive;

        function link(scope, element, attrs, formCtrl) {
            scope.directiveForm = formCtrl
            scope.$watch('directiveForm.$dirty', function (newVal) {
                if (newVal) {
                    scope.status.status = statusCheck.check('mod', scope.status);
                }
            });
        }


    }

})();