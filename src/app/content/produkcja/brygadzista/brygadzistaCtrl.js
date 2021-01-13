(function () {
    'use strict';

    angular
        .module('app')
        .controller('brygadzistaCtrl', brygadzistaCtrl);

    brygadzistaCtrl.$inject = ['commonFunctions', 'dataFactory']; 

    function brygadzistaCtrl(cF, dF) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Brygadzista';
        vm.subTitle = 'Raport wykonanych elementów';
        vm.isDetail = true;


        vm.dataObj = {};
        vm.getData = getData;
        
        vm.navZapisz = navZapisz;
        vm.navAnuluj = navAnuluj;

        activate();

        function activate() {
            getData();
        }


        function getData(date) {
            if (angular.isUndefined(date)) {
                date = new Date(moment().hour(0));
            }
            var dataToPost={
                dzienRoboczy:date,
                userName:cF.userName()
            }
            vm.inProgress = true;
            dF.postData("produkcjaBrygadzista/zaplanowane", dataToPost).then(function (res) {
                vm.dataObj.planningZamowienieKombi = res;
                vm.dataObjCopy = angular.copy(vm.dataObj);
                vm.startMode = true;
                vm.inProgress = false;
            }, function (error) {
                console.log(error);
                vm.inProgress = false;
            });
        }

        function navAnuluj() {
            cF.dialogTakNie('Czy anulować wprowadzone zmiany ?').then(function (ok) {
                vm.dataObj = angular.copy(vm.dataObjCopy);
            })
        }

        function navZapisz() {
            vm.inProgress = true;
            dF.postData('produkcjaBrygadzista/update', vm.dataObj.planningZamowienieKombi).then(function (res) {
                vm.inProgress = false;
            }, function (error) {
                console.log(error);
                vm.inProgress = false;
            })
        }
    }
})();
