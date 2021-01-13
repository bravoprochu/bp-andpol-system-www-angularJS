(function () {
    'use strict';

    angular
        .module('app')
        .controller('magPozycjaMagazynowaCtrl', magPozycjaMagazynowaCtrl);

    magPozycjaMagazynowaCtrl.$inject = ['$q','$state', 'commonFunctions', 'dataFactory'];

    function magPozycjaMagazynowaCtrl($q, $state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Pozycje magazynowe';
        vm.subTitle = 'Magazyn - lista składników, stany aktualne';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
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
            $state.go($state.current.name+'Detail', { id: param });
        }

        function getDataObj() {
            dF.getData('magPozycjaMagazynowa').then(function (data) {
                vm.dataObj = data;
                vm.table.rowLimitOpt = data.length > 100 ?  [10, 30, 100, data.length] : [10, 30, 100];
                vm.startMode = true;
            }, function (error) {
                console.log(error);
            });
        }

        function navIdzDo() {
            $state.go(vm.parentState);
        }

        function tableSearch() {
            if (vm.table.searchShow === true) {
                vm.table.searchText = '';
            }
            vm.table.searchShow = !vm.table.searchShow;
        }

    }
})();
