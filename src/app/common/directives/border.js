(function() {
    'use strict';

    angular
        .module('app')
        .directive('border', border);

    border.$inject = [];
    
    function border () {
        // Usage:
        //     <border></border>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {

            var borderRadius='1em';

            element[0].style['border-style'] = 'solid';
            element[0].style['border-color'] = 'beige';
            element[0].style['-moz-border-radius'] = borderRadius;
            element[0].style['-webkit-border-radius'] = borderRadius;
            element[0].style['border-radius'] = borderRadius;
        }
    }

})();