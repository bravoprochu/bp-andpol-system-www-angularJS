(function () {
    'use strict';

    angular
        .module('app')
        .controller('stanowiskaCtrl', stanowiskaCtrl);

    stanowiskaCtrl.$inject = ['$filter', '$state', 'commonFunctions', 'dataFactory'];

    function stanowiskaCtrl($filter, $state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'stanowiska';
        vm.subTitle = 'Stanowiska, grupy pracownicze..';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.startMode = false;

        vm.table = {
            dane: tableDane,
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
            $state.go('stanowiskaDetail', { id: param });
        }

        function getDataObj() {
            dF.getData('robocizna').then(function(data) {
                var data = data;
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
