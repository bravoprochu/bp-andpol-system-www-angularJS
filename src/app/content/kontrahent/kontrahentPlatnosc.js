(function () {
    'use strict';

    angular
        .module('app')
        .directive('kontrahentPlatnosc', kontrahentPlatnosc);

    kontrahentPlatnosc.$inject = [];

    function kontrahentPlatnosc() {
        // Usage:
        //     <kontrahentPlatnosc></kontrahentPlatnosc>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                isDisabled:'=',
                ref:'=',
                danePomocnicze: '=',
                czyTransport: '=',
                viewForm:'='
            },
            templateUrl: 'app/content/kontrahent/kontrahentPlatnosc.html'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();