(function () {
    'use strict';

    angular
        .module('app')
        .controller('politykaCenowaCtrl', politykaCenowaCtrl);

    politykaCenowaCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory'];

    function politykaCenowaCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = "Polityka cenowa";
        vm.subTitle = 'Tworzenie/edycja...';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.startMode = false;
        vm.table = {
            searchText: '',
            order: '-politykaCenowaId',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: cF.tableSearch,
            edit: idzDo
        };



        activate();

        function activate() {
            getDataObj();
        };

        function idzDo(param) {
            $state.go('politykaCenowaDetail', { id: param });
        };

        function getDataObj() {
            dF.getData('finPolitykaCenowa').then(function (data) {
                vm.dataObj = data;
                vm.table.rowLimitOpt = data.length > 100 ? [10, 30, 100, data.length] : [10, 30, 100];
                vm.startMode = true;
            },
            function (error) {
                vm.dataError = true;
            });

        };
    };
})();
