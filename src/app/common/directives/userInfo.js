(function () {
    'use strict';

    angular
        .module('app')
        .directive('userInfo', userInfo);

    userInfo.$inject = ['$window'];

    function userInfo($window) {
        // Usage:
        //     <userInfo></userInfo>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                obj: '='
            },
            templateUrl: 'app/common/directives/userInfo.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();