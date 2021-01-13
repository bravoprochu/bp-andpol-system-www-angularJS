(function () {
    'use strict';

    angular
        .module('app')
        .controller('qrCodeWydrukCtrl', qrCodeWydrukCtrl);

    qrCodeWydrukCtrl.$inject = ['$document','$state', '$window','commonFunctions', 'dataFactory']; 

    function qrCodeWydrukCtrl($document, $state, $window, cF, dF) {
        /*jshint validthis: true */
        var vm = this;
        vm.title = 'qrCodeBasket';
        vm.subTitle = 'Drukowanie etykiet qrCode';

        vm.navIdzDo = navIdzDo;

        vm.qrSize = 150;
        vm.qrBoxHeight = 230;
        vm.qrBoxTextWidth = 100;

        vm.title = 'qrCodeWydrukCtrl';
        vm.qrList = [];
        vm.qrListSelected = [];
        vm.qrExists=qrExists;
        vm.qrToggle = qrToggle;
        vm.qrUsunWszystkie = qrUsunWszystkie;
        vm.qrUsun = qrUsun;
           
        activate();

        function activate() {
            getData();
        }

        function getData() {
            dF.getData("QrCodeBasket").then(function (data) {
                vm.qrList = data;
                vm.startMode = true;
            }, function (error) {
            });
        }


        function navIdzDo() {
            $state.go(vm.parentState);
        }

        function qrToggle(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1); else
            if (vm.qrListSelected.length >= 6) return; else list.push(item);

        }

        function qrExists(item, list) {
            return list.indexOf(item) > -1;
        }

        function qrUsun(data) {
            cF.dialogTakNie('QrCodeBasket', 'Czy na pewno usunąć ' + data.nazwa + ' ?').then(function () {
                usun(data);
            }, function () {
                cF.info('warning', 'qrCodeBasket', 'To po co trujesz ?');
            });
        }

        function qrUsunWszystkie() {
            vm.inProgress = true;
            cF.dialogTakNie('QrCodeBasket', 'Czy na pewno usunąć WSZYSTKIE zaznaczone pozycje ??').then(function () {
                angular.forEach(vm.qrListSelected, function (wybr) {
                    usun(wybr);
                });
                vm.inProgress = false;
            }, function (error) {
                cF.info('warning', 'qrCodeBasket', 'To po co trujesz ?');
                vm.inProgress = false;
            });

        }

        function usun(data) {
            dF.deleteData("qrCodeBasket/"+ data.qrCodeBasketId).then(function (response) {

                if (qrExists(data, vm.qrListSelected)) {
                    var idx = vm.qrListSelected.indexOf(data);
                    vm.qrListSelected.splice(idx, 1);
                }
                var idx2 = vm.qrList.indexOf(data);
                if (idx2 > -1) vm.qrList.splice(idx2, 1);
            });
        }

    }
})();
