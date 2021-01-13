(function () {
    'use strict';

    angular
        .module('app')
        .controller('wykonczenieDetailCtrl', wykonczenieDetailCtrl);

    wykonczenieDetailCtrl.$inject = ['$state', '$stateParams','$q', 'commonFunctions', 'dataFactory','statusCheck'];

    function wykonczenieDetailCtrl($state, $stateParams, $q, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Wykończenie - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.danePomocnicze = {};
        vm.dataObj = {};

        vm.navZapisz = navZapisz;

        vm.objId = parseInt($stateParams.id);
        vm.startMode = false;
        vm.usun = usun;


        activate();

        function activate() {
            getById();
        }

        function getById() {
           var pWykonczenieGrupa = dF.getData("wykonczenieGrupa");
            $q.all([pWykonczenieGrupa]).then(function (response) {
                vm.danePomocnicze.wykonczenieGrupa = response[0];
            }, function (error) {


            });


            if (vm.objId === 0) {
                vm.startMode = true;
                vm.dataObjCopy = angular.copy(vm.dataObj);
            } else {
                dF.getData("wykonczenie/"+vm.objId).then(function (data) {
                    vm.dataObj = data;
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                    vm.startMode = true;
                }, function (error) {
                });
            }


        }

        function navZapisz() {
            vm.navZapiszDisabled = true;
            dF.putData("wykonczenie/"+vm.objId, vm.dataObj).then(function (response) {
                vm.navIdzDo();
            }, function (error) {
            });
        }


        function usun() {
            cF.dialogTakNie("Wykończenie", "Czy na pewno usunąć wykończenie " + vm.dataObj.nazwa + " ?").then(function (ok) {
                dF.deleteData("wykonczenie/" + vm.objId).then(function (response) {
                    vm.navIdzDo();
                }, function (error) {

                });
            }, function (not) {

            })
            
        }

    }
})();
