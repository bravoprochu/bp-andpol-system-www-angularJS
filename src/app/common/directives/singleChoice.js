(function() {
    'use strict';

    angular
        .module('app')
        .directive('singleChoice', singleChoice);

    singleChoice.$inject = ['commonFunctions'];
    
    function singleChoice (cF) {
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/common/directives/singleChoice.html',
            controller: singleChoiceCtrl,
            controllerAs:'vm',
            scope: {
                daneId:'@',
                danePomocnicze: '=',
                isDisabled:'=',
                isVertical: '=?',
                opis: '@',
                pole: '@',
                selectedItem: '=',
                title: '@',

            }
        };
        return directive;

        function link(scope, element, attrs) {
            if (scope.isVertical === undefined) { scope.isVertical = true; }
            scope.$watch("selectedItem", function (newVal) {
                //scope.selected = angular.isDefined(newVal) ? newVal : scope.danePomocnicze[0];
                scope.selected = newVal;
            });
            scope.isScreenSmall = cF.isScreenSmall();
            scope.pole = scope.pole ? scope.pole : 'nazwa';
        }
    };




    /* @ngInject */
    singleChoiceCtrl.$inject=['$scope'];
    function singleChoiceCtrl($scope) {
        /*jshint validthis: true */
        var vm = this;

        vm.selectedChanged = selectedChanged;
        vm.dane = $scope.danePomocnicze;
        vm.init = init;
        vm.pole = $scope.pole ? $scope.pole : 'nazwa';

        init();


        function init() {
            if (angular.isUndefined($scope.selectedItem) || angular.isUndefined($scope.daneId)) {
                vm.selected = $scope.danePomocnicze[0];
                selectedChanged();
                return;
            } else {
                angular.forEach($scope.danePomocnicze, function (dp) {
                    if (dp[$scope.daneId] == $scope.selectedItem[$scope.daneId]) {
                        vm.selected = dp;
                        selectedChanged();
                    }
                });
            }
        }

        function selectedChanged() {
            $scope.selectedItem = vm.selected;
        }

        $scope.$watch("selected", function (newVal) {
            init();
        });

        
    }

})();