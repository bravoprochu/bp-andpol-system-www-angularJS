(function() {
    'use strict';

    angular
        .module('app')
        .directive('liniaPozioma', liniaPozioma);

    liniaPozioma.$inject = [];
    
    function liniaPozioma () {
        // Usage:
        //     <liniaPozioma></liniaPozioma>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            template: '<md-divider class="lineHeightByk"></md-divider>'+
                       '<md-divider class="lineHeightByk"></md-divider>'

        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();