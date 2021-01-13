(function () {
    'use strict';

    angular
        .module('app')
        .controller('obszycieDetailCtrl', obszycieDetailCtrl);

    obszycieDetailCtrl.$inject = ['$state', '$stateParams', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function obszycieDetailCtrl($state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Obszycie - elementy; - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

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
            if (vm.objId === 0) {
                vm.startMode = true;
                vm.dataObjCopy = angular.copy(vm.dataObj);
            } else {
                dF.getData("obszycie/"+vm.objId).then(function (data) {
                    vm.dataObj = data;
                    vm.startMode = true;
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                }, function (error) {
                });
            }


        }

        function navZapisz() {
            vm.navZapiszDisabled = true;
            dF.putData("obszycie/"+vm.objId, vm.dataObj).then(function (response) {
                vm.navIdzDo();
            }, function (error) {

            });
        }


        function usun() {
            dF.deleteData("obszycie/"+ vm.objId).then(function (response) {
                vm.navIdzDo();
            }, function (error) {

            });
        }
    }
})();
