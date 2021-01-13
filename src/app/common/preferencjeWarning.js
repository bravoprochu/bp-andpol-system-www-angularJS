(function() {
    'use strict';

    angular
        .module('app')
        .directive('preferencjeWarning', preferencjeWarning);

    preferencjeWarning.$inject = ['commonFunctions'];
    
    function preferencjeWarning (cF) {
        // Usage:
        //     <preferencjeWarning></preferencjeWarning>
        // Creates:
        // 
        var directive = {
            link: link,
            template: '<md-button class="md-icon-button" aria-label="preferencje" disabled ng-if="vm.pref" ng-click="info()">'
                    + '<md-tooltip md-direction="top">Pobrano dane na bazie preferowanych dateRange (ustawienia domyślne)</md-tooltip>'
                    + '<md-icon md-svg-icon="warning"></md-icon>'
                    +' </md-button>',
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.info = function () {
                cF.info("warning", "DateRange", "Ikona oznacza, że pobrano dane na bazie preferowanych dateRange (ustawienia domyślne)");
            }
        }
    }

})();