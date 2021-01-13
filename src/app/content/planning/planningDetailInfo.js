(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningDetailInfo', planningDetailInfo);

    planningDetailInfo.$inject = ['$window'];
    
    function planningDetailInfo ($window) {
        // Usage:
        //     <planningDetailInfo></planningDetailInfo>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/planning/planningDetailInfo.html',
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();