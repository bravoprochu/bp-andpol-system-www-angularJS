(function() {
    'use strict';

    angular
        .module('app')
        .directive('test', test);

    test.$inject = ['$window'];
    
    function test ($window) {
        // Usage:
        //     <test></test>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            template:'<md-button ng-click="test()" class="md-accent md-raised">TEST</md-button>'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.test = test;
            
            
            
           function test () {
                console.log("Test directive:");
                console.log("vm");
                console.log(scope.vm);
                console.log("FormMain");
                console.log(scope.vm.formMain);
            }
        }
    }

})();