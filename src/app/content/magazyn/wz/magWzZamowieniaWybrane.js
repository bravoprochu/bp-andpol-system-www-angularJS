(function () {
    'use strict';

    angular
        .module('app')
        .directive('magWzZamowieniaWybrane', magWzZamowieniaWybrane);

    magWzZamowieniaWybrane.$inject = ['$mdDialog'];

    function magWzZamowieniaWybrane($mdDialog) {
        // Usage:
        //     <magWzZamowieniaWybrane></magWzZamowieniaWybrane>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                dane: '=',
                tableObj: '=',

            },
            templateUrl: 'app/content/magazyn/wz/magWzZamowieniaWybrane.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.editWartoscWz = function (ev, zam) {
                ev.stopPropagation();

                var dlgOptions = {
                    targetEvent: ev,
                    locals: {
                        maxValue:zam.ilosc
                    },
                    bindToController:true,
                    controller: function () {
                        var vm = this;
                        vm.save = function () {
                            $mdDialog.hide(vm.wartoscWz);
                        }
                        vm.cancel = function () {
                            return $mdDialog.cancel();
                        }
                    },
                    controllerAs:'vm',
                    templateUrl: 'app/content/magazyn/wz/magWzZamowieniaWybraneWartoscWzDialog.html',
                };


                $mdDialog.show(dlgOptions).then(function (res) {
                    zam.wartoscWz = res;
                }, function (cancel) {

                });
            }
        }
    }

})();