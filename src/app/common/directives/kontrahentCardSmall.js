(function() {
    'use strict';

    angular
        .module('app')
        .directive('kontrahentCardSmall', kontrahentCardSmall);

    kontrahentCardSmall.$inject = [];
    
    function kontrahentCardSmall () {
        // Usage:
        //     <kontrahentCardSmall></kontrahentCardSmall>
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            scope:{
                ref:'='
            },
            templateUrl:'app/common/directives/kontrahentCardSmall.html'
        };
        return directive;
    }

})();