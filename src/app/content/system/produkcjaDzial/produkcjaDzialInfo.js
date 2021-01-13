(function() {
    'use strict';

    angular
        .module('app')
        .directive('produkcjaDzialInfo', produkcjaDzialInfo);

    produkcjaDzialInfo.$inject = ['$window'];
    
    function produkcjaDzialInfo ($window) {
        // Usage:
        //     <produkcjaDzialInfo></produkcjaDzialInfo>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope:{
                produkcjaDzial:'='
            },
            templateUrl:'app/content/system/produkcjaDzial/produkcjaDzialInfo.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();