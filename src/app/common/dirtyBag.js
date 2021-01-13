(function () {
    'use strict';

    angular
        .module('app')
        .directive('dirtyBag', dirtyBag);

    dirtyBag.$inject = ['dirtyBagContainer'];

    function dirtyBag(dbContainer) {
        // Usage:
        //     <dirtyBag></dirtyBag>
        // Creates:
        var directive = {
            restrict: 'AE',
            require: '^form',
            link: link,
            scope: {
                status: '=',
            },
            controller: ['$scope', function ($scope) {

                var vm = this;

                
                $scope.$watch('status', function (newVal) {

                    if (newVal !== undefined) {
                        vm.dirtyBagStatus = newVal;
                    }

                });

                vm.dirtyBag = {};
                vm.dirtyBagStatus = $scope.status;
                vm.updateStatus = function (dane) {
                    $scope.status = dane;
                };

              
            }],
        };

        return directive;

        function link(scope, el, attrs, formCtrl) {
            
        }
    }
}());
