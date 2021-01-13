(function () {
    'use strict';

    angular
        .module('app')
        .controller('magWzCtrl', magWzCtrl);

    magWzCtrl.$inject = ["$state", "commonFunctions", "dataFactory"];

    function magWzCtrl($state, cF, dF) {
        var vm = this;
        vm.title = 'WZ Wydanie Zewnętrzne';

        vm.dateRange = dateRange;



        activate();

        function activate() {
            getData()
        }


        vm.table = {
            searchText: '',
            order: '-magWzId',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            edit: function (param) {
                $state.go($state.current.name + "Detail", { id: param })
            }
        };

        function dateRange() {
            cF.dateRange().then(function (res) {
                dF.postData('MagWz/DateRange', res).then(function (data) {
                    vm.info = data.info;
                    vm.pref = false;
                    vm.raport = data.raport;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                }, cF.error)
            });
        }

        function getData()
        {
            var drPref = cF.pref.getByKey($state.current.name);
            drPref = drPref != null ? drPref.dateRange : null
            if (drPref != null) {
                drPref.dateStart = new Date(drPref.dateStart);
                drPref.dateEnd = new Date(drPref.dateEnd);

            }

            if (drPref != null) {
                dF.postData('MagWz/DateRange', drPref).then(function (data) {
                    vm.info = data.info;
                    vm.pref = true;
                    console.log(vm.pref);
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                    vm.startMode = true;
                }, cF.error);
            } else {
                dF.getData("MagWz").then(function (data) {
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
    }
})();
