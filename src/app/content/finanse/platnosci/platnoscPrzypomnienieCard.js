(function() {
    'use strict';

    angular
        .module('app')
        .directive('platnoscPrzypomnienieCard', platnoscPrzypomnienieCard);

    platnoscPrzypomnienieCard.$inject = [];
    
    function platnoscPrzypomnienieCard () {
        // Usage:
        //     <platnoscPrzypomnienieCard></platnoscPrzypomnienieCard>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/finanse/platnosci/platnoscPrzypomnienieCard.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();