(function() {
    'use strict';

    angular
        .module('app')
        .directive('dzienRoboczyDatePicker', dzienRoboczyDatePicker);

    dzienRoboczyDatePicker.$inject = ['commonFunctions'];
    
    function dzienRoboczyDatePicker (cF) {
        // Usage:
        //     <dzienRoboczyDatePicker></dzienRoboczyDatePicker>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/system/produkcjaDzial/dzienRoboczyDatePicker.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.isSmall = cF.isScreenSmall();
        }
    }

})();