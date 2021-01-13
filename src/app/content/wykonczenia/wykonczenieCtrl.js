(function () {
    'use strict';

    angular
        .module('app')
        .controller('wykonczenieCtrl', wykonczenieCtrl);

    wykonczenieCtrl.$inject = ['$filter', '$state', 'commonFunctions', 'dataFactory'];

    function wykonczenieCtrl($filter, $state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Wykończenia';
        vm.subTitle = 'rodzaje wykończeń...';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.startMode = false;

        vm.table = {
            dane: function(){return $filter('filter')(vm.dataObj, vm.table.searchText);},
            order: 'nazwa',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            search: tableSearch,
            searchShow: false,
            searchText: '',
            edit: idzDo
        };



        activate();

        function activate() {
            getDataObj();
        }

        function idzDo(param) {
            $state.go('wykonczenieDetail', { id: param });
        }

        function getDataObj() {
            dF.getData("wykonczenie").then(function (data) {
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
