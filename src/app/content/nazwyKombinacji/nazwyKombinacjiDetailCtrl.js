(function () {
    'use strict';

    angular
        .module('app')
        .controller('nazwyKombinacjiDetailCtrl', nazwyKombinacjiDetailCtrl);

    nazwyKombinacjiDetailCtrl.$inject = ['$state', '$stateParams', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function nazwyKombinacjiDetailCtrl($state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Nazwa kombinacji - szczegóły';
        vm.subTitle = 'Lista i pierdoły..' + $stateParams.id;

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
                dF.getData("nazwaKombinacji/"+vm.objId).then(function (data) {
                    vm.dataObj = data;
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                    vm.startMode = true;

                }, function (error) {
                });
            }


        }

        function navCzyZapisz() {
            if (angular.isUndefined(vm.formMain)) { return; }
            var result = false;

            var mainDirty = false;

            var areValid = false;
            var areDirty = false;


            if (vm.formMain.$dirty) {
                mainDirty = true;
                vm.dataObj.status = statusCheck.check("mod", vm.dataObj);
            }


            if (mainDirty) { areDirty = true; }
            if (vm.formMain.$valid) { areValid = true; }


            if (areDirty && areValid) return true;

            return result;
        }


        function navZapisz() {
            vm.navZapiszDisabled = true;
            dF.putData("nazwaKombinacji/"+vm.objId, vm.dataObj).then(function (response) {
                vm.navIdzDo();
            }, function (error) {
            });
        }

        function usun() {
            dF.deleteData("nazwaKombinacji/"+vm.objId ).then(function (response) {
                vm.navIdzDo();
            }, function (error) {
            });
        }


    }
})();
