(function () {
    'use strict';

    angular
        .module('app')
        .controller('materialDetailCtrl', materialDetailCtrl);

    materialDetailCtrl.$inject = ['$q','$state', '$stateParams', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function materialDetailCtrl($q, $state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Nazwy grup tkanin - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.danePomocnicze = {};


        vm.navZapisz = navZapisz;

        vm.dataObj = {};
        vm.objId = parseInt($stateParams.id);
        vm.startMode = false;
        vm.usun = usun;




        activate();

        function activate() {
            getById();
        }



        function getById() {
            var pmaterialGrupaKontrahent = dF.getData("bazaJednostek/materialGrupaKontrahent");
            $q.all([pmaterialGrupaKontrahent])
                .then(function (data) {
                    vm.danePomocnicze.materialGrupaKontrahent = data[0];
                    if (vm.objId === 0) {
                        vm.startMode = true;
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                    } else {
                        dF.getData("material/"+vm.objId).then(function (data) {
                            vm.dataObj = data;
                            vm.dataObjCopy = angular.copy(vm.dataObj);
                            vm.startMode = true;
                        }, function (error) {
                        });
                    }
                });
        }

        function navZapisz() {
            vm.navZapiszDisabled = true;
            dF.putData("material/"+vm.objId, vm.dataObj).then(function (response) {
                vm.navIdzDo();

            }, function (error) {
            });
        }


        function usun() {
            cF.dialogTakNie("Usuń", 'Czy na pewno chcesz usunąć ' + vm.dataObj.nazwa + ' ?')
                    .then(function () {
                        dF.deleteData("material/" +vm.objId ).then(function (response) {
                            vm.navIdzDo();
                        }, function (error) {
                        });
                    }, function () {
                    });
        }

    }
})();
