(function () {
    'use strict';

    angular
        .module('app')
        .controller('wykonczenieGrupaDetailCtrl', wykonczenieGrupaDetailCtrl);

    wykonczenieGrupaDetailCtrl.$inject = ['$state', '$stateParams', 'commonFunctions', 'dataFactory','statusCheck'];

    function wykonczenieGrupaDetailCtrl($state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Wykończenie - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.dataObj = {};

        vm.navZapisz = navZapisz;

        vm.objId = parseInt($stateParams.id);
        vm.startMode = false;
        vm.usun = usun;
        vm.navCanDelete = true;
        vm.navDelete = usun;


        activate();

        function activate() {
            getById();
        }

        function getById() {
            if (vm.objId === 0) {
                vm.startMode = true;
                vm.dataObjCopy = angular.copy(vm.dataObj);
            } else {
                dF.getData("wykonczenieGrupa/"+vm.objId).then(function (data) {
                    vm.dataObj = data;
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                    vm.startMode = true;
                }, function (error) {
                });
            }


        }

        function navZapisz() {
            vm.navZapiszDisabled = true;
            if (vm.objId === 0) {
                dF.postData("wykonczenieGrupa", vm.dataObj).then(function (response) {
                    vm.navIdzDo();
                }, function (error) {
                    cF.info("error", vm.title, "Błąd danych", error);

                });
            } else {
                dF.putData("wykonczenieGrupa/"+ vm.objId, vm.dataObj).then(function (response) {
                    vm.navIdzDo();
                }, function (error) {
                });

            }
        }


        function usun() {
            cF.dialogTakNie('WykończenieGrupa', 'Czy na pewno usunąć wykończnie ' + vm.dataObj.nazwa).then(function (ok) {
                dF.deleteData("wykonczenieGrupa/" + vm.objId).then(function (response) {
                    vm.navIdzDo();
                }, function (error) { });
            })
        }

    }
})();
