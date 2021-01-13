(function () {
    'use strict';

    angular
        .module('app')
        .controller('planningCtrl', planningCtrl);

    planningCtrl.$inject = ['$filter', '$mdDialog', '$q', '$state', 'commonFunctions', 'dataFactory'];

    function planningCtrl( $filter, $mdDialog, $q, $state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Planning - lista';
        vm.subTitle = 'Planowanie produkcji, rezerwacja tkanin/pozycji magazynowych...';


        vm.getDataObj = getDataObj;
        vm.dataObj = {};

        vm.chartData=cF.chartData

        vm.danePomocnicze = {};
        vm.idzDo = idzDo;

        vm.tablePlanning = {
            searchText: '',
            order: '-planningId',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: function () {
                    if (this.searchShow === true) {this.searchText = '';}
                    this.searchShow = !this.searchShow;
            },
            edit: idzDo
        }

        activate();

        function activate() {
            getDataObj();
        }


        function getDataObj() {
            var pPlanning = dF.getData('planning');
            $q.all([pPlanning]).then(function (data) {
                vm.dataObj.planning= data[0];
                vm.startMode = true;
            }, function (error) { console.log(error); })
        }

        function idzDo(param) {
            $state.go('planningDetail', { id: param });
        }






    }
})();
