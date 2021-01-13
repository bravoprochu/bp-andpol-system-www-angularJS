(function () {
    'use strict';

    angular
        .module('app')
        .controller('fakturaSprzedazyCtrl', fakturaSprzedazyCtrl);

    fakturaSprzedazyCtrl.$inject = ['$scope', '$state', 'commonFunctions', 'dataFactory'];

    function fakturaSprzedazyCtrl($scope, $state, cF, dF) {
        var vm = this;
        vm.title = 'Faktura sprzedaży';

        vm.dateRange = dateRange;
        vm.table = {
            searchText: '',
            order: '-fakturaSprzedazyId',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            search: cF.tableSearch,
            edit: function (param) {
                $state.go($state.current.name + "Detail", { id: param })
            }
        };

        activate();

        function activate() {
            getData();
        }


        function dateRange() {
            cF.dateRange().then(function (res) {
                dF.postData('finFakturaSprzedazy/DateRange', res).then(function (data) {
                    vm.info = data.info;
                    vm.pref = false;
                    vm.raport = data.raport;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                }, cF.error)
            });
        }

        function getData() {
            var drPref = cF.pref.getByKey($state.current.name);
            drPref = drPref != null ? drPref.dateRange : null
            if (drPref != null) {
                drPref.dateStart = new Date(drPref.dateStart);
                drPref.dateEnd = new Date(drPref.dateEnd);

            }

            if (drPref != null) {
                dF.postData('finFakturaSprzedazy/DateRange', drPref).then(function (data) {
                    vm.info = data.info;
                    vm.pref = true;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                    vm.startMode = true;
                }, cF.error);
            } else {
                dF.getData("finFakturaSprzedazy").then(function (data) {
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


        function goToDetail(param)
        {
            $state.go($state.current.name + "Detail", { id: param });
        }

    }


})();
