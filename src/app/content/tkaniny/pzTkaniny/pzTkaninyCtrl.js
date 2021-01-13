(function () {
    'use strict';

    angular
        .module('app')
        .controller('pzTkaninyCtrl', pzTkaninyCtrl);

    pzTkaninyCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory'];

    function pzTkaninyCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'PZ Tkaniny';
        vm.subTitle = 'Potwierdzone belki...';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.sortOrder = false;
        vm.sortOrderBy = 'nazwa';
        vm.startMode = false;
        vm.table = {
            searchText: '',
            order: '-pzTkaninyId',
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

        function idzDo(param) {
            $state.go('pzTkaninyDetail', {id:param});
        }

        function getDataObj() {
            vm.n = vm.n + 1;
            dF.getData("materialBelka/pzTkaniny").then(function (data) {
                vm.dataObj = data;
                vm.table.rowLimitOpt = data.length > 100 ?  [10, 30, 100, data.length] : [10, 30, 100];
                vm.startMode = true;
            },
            function (error) {
                console.log(error);
            });

        }

        function tableSearch() {
            if (vm.table.searchShow === true) {
                vm.table.searchText = '';
            }
            vm.table.searchShow = !vm.table.searchShow;
        }

    }
})();
