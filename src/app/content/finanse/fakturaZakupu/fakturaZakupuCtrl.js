(function () {
    'use strict';

    angular
        .module('app')
        .controller('fakturaZakupuCtrl', fakturaZakupuCtrl);

    fakturaZakupuCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory',];

    function fakturaZakupuCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Faktury zakupu';
        vm.subTitle = 'Tworzenie/edycja...';

        vm.dateRange = dateRange;
        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.startMode = false;
        vm.table = {
            searchText: '',
            order: '-fakturaZakupuId',
            limit: 10,
            page: 1,
            rowLimitOpt:[10,30,100],
            search: cF.tableSearch,
            edit:idzDo
        };


        activate();

        function activate() {
            getDataObj();
        }


        function dateRange() {
            cF.dateRange().then(function (res) {
                dF.postData('FinFakturaZakupu/DateRange', res).then(function (data) {
                    vm.info = data.info;
                    vm.pref = false;
                    vm.raport = data.raport;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                }, function (error) {

                })
            });
        }

        function idzDo(param) {
            $state.go('fakturaZakupuDetail', { id: param });
        }

        function getDataObj() {
            var drPref = cF.pref.getByKey($state.current.name);
            drPref = drPref != null ? drPref.dateRange : null
            if (drPref != null) {
                drPref.dateStart = new Date(drPref.dateStart);
                drPref.dateEnd = new Date(drPref.dateEnd);

            }

            if (drPref != null) {
                dF.postData('FinFakturaZakupu/DateRange', drPref).then(function (data) {
                    vm.info = data.info;
                    vm.pref = true;
                    console.log(vm.pref);
                    vm.raport = data.raport;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                    vm.startMode = true;
                }, function (error) {
                });
            } else {
                dF.getData("finFakturaZakupu").then(function (data) {
                    vm.info = data.info;
                    vm.pref = false;
                    vm.raport = data.raport;
                    data = data.result;
                    vm.dataObj = data;
                    vm.table.rowLimitOpt = data.length > 100 ? [10, 30, 100, data.length] : [10, 30, 100];
                    vm.startMode = true;
                },
                function (error) {
                    vm.dataError = true;
                });
            }
        }
    }
})();
