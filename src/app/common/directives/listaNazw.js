(function() {
    'use strict';

    angular
        .module('app')
        .directive('listaNazw', listaNazw);

    listaNazw.$inject = ['$window'];
    
    function listaNazw ($window) {
        // Usage:
        //     <listaNazw></listaNazw>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                color:'@',
                title: '@',
                lista: '='
            },
            templateUrl:'app/common/directives/listaNazw.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();