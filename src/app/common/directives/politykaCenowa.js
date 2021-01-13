(function() {
    'use strict';

    angular
        .module('app')
        .directive('politykaCenowa', politykaCenowa);

    politykaCenowa.$inject = ['$filter', 'dataFactory', 'commonFunctions'];
    
    function politykaCenowa ($filter, dF, cF) {
        // Usage:
        //     <politykaCenowa></politykaCenowa>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: 'app/common/directives/politykaCenowa.html',
        };
        return directive;

        function link(scope, element, attrs) {
            var vm = scope.$parent.vm;

            vm.politykaCenowaSearch = politykaCenowaSearch;

            if (angular.isDefined(vm.danePomocnicze)) {
                vm.danePomocnicze.politykaCenowa = [];
            } else {
                vm.danePomocnicze = {
                    politykaCenowa: []
                };
            }
            dF.getData("finPolitykaCenowa").then(function (data) {
                vm.danePomocnicze.politykaCenowa = data;
            }, function (error) {

            });


            function politykaCenowaSearch() {
                if (vm.politykaCenowaSearchText === null) { return vm.danePomocnicze.politykaCenowa; } else {
                    return $filter('filter')(vm.danePomocnicze.politykaCenowa, vm.politykaCenowaSearchText);
                }
            }

        }
    }

})();