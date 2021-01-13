(function () {
    'use strict';

    angular
        .module('app')
        .controller('materialCtrl', materialCtrl);

    materialCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory'];

    function materialCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Materiały';
        vm.subTitle = 'Lista produktów...';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.sortOrder = false;
        vm.sortOrderBy = 'nazwa';
        vm.startMode = false;
        vm.table = {
            searchText: '',
            order: 'nazwa',
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
            $state.go('materialDetail', {id:param});
        }

        function getDataObj() {
            vm.n = vm.n + 1;
            dF.getData("material").then(function (data) {
                vm.dataObj = data;
                vm.table.rowLimitOpt = data.length > 100 ?  [10, 30, 100, data.length] : [10, 30, 100];
                vm.startMode = true;
            },
            function (error) {
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
