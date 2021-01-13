(function () {
    'use strict';

    angular
        .module('app')
        .controller('magPzCtrl', magPzCtrl);

    magPzCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory'];

    function magPzCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'PZ';
        vm.subTitle = 'Przyjęcie zewnętrzne';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.dateRange = dateRange;
        vm.idzDo = idzDo;
        vm.startMode = false;
        vm.table = {
            searchText: '',
            order: '-pzId',
            limit: 10,
            page: 1,
            rowLimitOpt:[10,30,100],
            searchShow: false,
            search: tableSearch,
            edit: idzDo
        };



        activate();

        function activate() {
            getDataObj();

        }

        function dateRange(dateStart) {
            cF.dateRange().then(function (res) {
                dF.postData('MagPz/DateRange', res).then(function (data) {
                    vm.info = data.info;
                    vm.pref = false;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                    vm.inProgress = false;
                }, function (error) {

                })
            });
        }

        function idzDo(param) {
            $state.go('magPZDetail', { id: param });
        }

        function getDataObj() {
            var dateRangePref = cF.pref.getByKey($state.current.name);
            dateRangePref=dateRangePref!=null ? dateRangePref.dateRange:null
            if (dateRangePref != null) {
                dF.postData('MagPz/DateRange', dateRangePref).then(function (data) {
                    vm.info = data.info;
                    vm.pref = true;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                    vm.startMode = true;
                }, function (error) {

                })

            } else {
                dF.getData("magPz").then(function (data) {
                    vm.info = data.info;
                    vm.pref = false;
                    data = data.result;
                    vm.data = data;
                    vm.dataObj = data;
                    vm.table.rowLimitOpt = data.length > 100 ? [10, 30, 100, data.length] : [10, 30, 100];
                    vm.startMode = true;
                },
                function (error) {
                    console.log(error);
                });
            }
        }

        function tableSearch() {
            if (vm.table.searchShow === true) {
                vm.table.searchText = '';
            }
            vm.table.searchShow = !vm.table.searchShow;
        }


    }
})();
