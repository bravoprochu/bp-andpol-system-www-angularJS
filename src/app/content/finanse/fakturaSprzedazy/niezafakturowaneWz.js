(function () {
    'use strict';

    angular
        .module('app')
        .directive('niezafakturowaneWz', niezafakturowaneWz);

    niezafakturowaneWz.$inject = ['$window'];

    function niezafakturowaneWz($window) {
        // Usage:
        //     <niezafakturowaneWz></niezafakturowaneWz>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/finanse/fakturaSprzedazy/niezafakturowaneWz.html',
            scope: {
                dost: '=',
                tableObj:'='
            }
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();