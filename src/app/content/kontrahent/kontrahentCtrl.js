(function () {
    'use strict';

    angular
        .module('app')
        .controller('kontrahentCtrl', kontrahentCtrl);

    kontrahentCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory'];

    function kontrahentCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Lista Kontrahentów';
        vm.subTitle = 'dodanie nowego/edycja...';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.startMode = false;
        vm.table = {
            searchText: '',
            order: 'nazwa',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: tableSearch,
            edit: idzDo
        };



        activate();

        function activate() {
            getDataObj();
        }

        function idzDo(param) {
            $state.go('kontrahentDetail', {
                id: param
            });
        }

        function getDataObj() {
            return dF.getData('kontrahent').then(function (data) {
                vm.dataObj = data;
                vm.table.rowLimitOpt = data.length > 100 ? [10, 30, 100, data.length] : [10, 30, 100];
                vm.startMode = true;
            }, function (error) {
                console.log(error);
            });

        };

        function tableSearch() {
            if (vm.table.searchShow === true) {
                vm.table.searchText = '';
            }
            vm.table.searchShow = !vm.table.searchShow;
        }
    }
})();
