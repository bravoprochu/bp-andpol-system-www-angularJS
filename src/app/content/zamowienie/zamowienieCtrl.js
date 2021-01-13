(function () {
    'use strict';

    angular
        .module('app')
        .controller('zamowienieCtrl', zamowienieCtrl);

    zamowienieCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory'];

    function zamowienieCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Zamówienie';
        vm.subTitle = 'Tworzenie zamówień...';

        vm.dateRange = dateRange;

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;

        vm.printPdf = printPdf;

        vm.rowSelected = [];

        vm.table = {
            order: '-zamowienieId',
            limit: 10,
            page: 1,
            searchShow: false,
            search: cF.tableSearch,
            edit: idzDo,
            
            rowSelect: vm.dataObj.isRowSelect
        };

        vm.startMode = false;

        activate();

        function activate() {
            getDataObj();
        }


        function dateRange() {
            cF.dateRange().then(function (res) {
                dF.postData('zamowienie/DateRange', res).then(function (data) {
                    console.log(data);
                    vm.info = data.info;
                    vm.pref = false;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                    
                }, cF.error)
            });
        }

        function idzDo(param) {
            $state.go('zamowienieDetail', { id: param });
        }

        function getDataObj() {
            var drPref = cF.pref.getByKey($state.current.name);
            drPref = drPref != null ? drPref.dateRange : null
            if (drPref != null) {
                drPref.dateStart = new Date(drPref.dateStart);
                drPref.dateEnd = new Date(drPref.dateEnd);

            }

            if (drPref != null) {
                dF.postData('zamowienie/DateRange', drPref).then(function (data) {
                    vm.info = data.info;
                    vm.pref = true;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                    vm.startMode = true;
                }, cF.error);
            } else {
                dF.getData("zamowienie").then(function (data) {
                    vm.info = data.info;
                    vm.pref = false;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.length > 100 ? [10, 30, 100, data.length] : [10, 30, 100];
                    vm.startMode = true;
                },
                    function (error) {
                        vm.dataError = true;
                    });
            }
        }


        function printPdf() {
            var dataToPost = {
                isGrouped: vm.isGrouped,
                listaZamowien: vm.rowSelected
            }

            dF.postData('zamowienie/listaProdukcyjna', dataToPost, true).then(function (res) {
                cF.pdfGen(res, "ListaProdukcyjna_"+cF.userName() +".xlsx");
            }, cF.error)

        }
    }
})();
