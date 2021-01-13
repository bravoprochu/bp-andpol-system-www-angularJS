(function() {
    'use strict';

    angular
        .module('app')
        .directive('magPzCard', magPzCard);

    magPzCard.$inject = ['commonFunctions'];
    
    function magPzCard (cF) {
        // Usage:
        //     <magPzCard></magPzCard>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope:{
                objRef: '=',
                korektaUtworz: '&'
            },
            templateUrl:'app/content/magazyn/pz/magPzCard.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.screenSmall = cF.isScreenSmall();
        }
    }

})();