(function () {
    'use strict';

    angular
        .module('app')
        .controller('normaCtrl', normaCtrl);

    normaCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory'];

    function normaCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Normy';
        vm.subTitle = 'Normy zakładowe';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.startMode = false;
        vm.table = {
            searchText: '',
            order: '-id',
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
            $state.go('normaDetail', { id: param });
        }

        function getDataObj() {
            dF.getData("norma").then(function (data) {
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
