(function() {
    'use strict';

    angular
        .module('app')
        .directive('naglowek', naglowek);

    naglowek.$inject = ['$state','commonFunctions'];
    
    function naglowek ($state, cF) {
        // Usage:
        //     <naglowek></naglowek>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/common/naglowek.html',
            
        };
        return directive;

        function link(scope, element, attrs) {
            scope.screenSmall = cF.isScreenSmall();
            scope.navToggle = function () {
                var vm;
                vm= angular.isDefined(scope.vm) ? scope.vm : scope.$parent.vm;
                vm.navIsOpen = !vm.navIsOpen;
            };
            czyDetail();

            function czyDetail() {
                if (angular.isDefined(scope.vm.isDetail)) {
                    scope.isDetail = scope.vm.isDetail;
                } else {
                    scope.isDetail = angular.isDefined($state.$current.params.id) ? true : false;
                }
            }


        }
    }

})();