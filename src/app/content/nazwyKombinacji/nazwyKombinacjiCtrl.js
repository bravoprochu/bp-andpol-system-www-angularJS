(function () {
    'use strict';

    angular
        .module('app')
        .controller('nazwyKombinacjiCtrl', nazwyKombinacjiCtrl);

    nazwyKombinacjiCtrl.$inject = ['$filter', '$state', 'commonFunctions', 'dataFactory'];

    function nazwyKombinacjiCtrl($filter, $state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Nazwy kombinacji';
        vm.subTitle = 'Lista i pierdoły..';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.startMode = false;
        vm.tableLength = 15;
        vm.table = {
            dane:tableDane,
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
            $state.go('nazwyKombinacjiDetail', {id:param});
        }

        function getDataObj() {
            dF.getData("nazwaKombinacji").then(function (data) {
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

        function tableDane() {
            if (angular.isDefined(vm.table.searchText)) {
                return $filter('filter')(vm.dataObj, vm.table.searchText);
            } else {

                return vm.dataObj;
            }
        }
    }
})();
