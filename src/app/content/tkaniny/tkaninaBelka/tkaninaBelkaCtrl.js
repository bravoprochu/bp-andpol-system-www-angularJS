(function () {
    'use strict';

    angular
        .module('app')
        .controller('tkaninaBelkaCtrl', tkaninaBelkaCtrl);

    tkaninaBelkaCtrl.$inject = ['$state', 'commonFunctions', 'dataFactory'];

    function tkaninaBelkaCtrl($state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Tkaniny - Belki ';
        vm.subTitle = 'Ewidencja belek z tkaninami';

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.idzDo = idzDo;
        vm.sortOrder = false;
        vm.sortOrderBy = 'nazwa';
        vm.startMode = false;
        vm.table = {
            limit: 10,
            order: '-id',
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchText: '',
            searchShow: false,
            search: function () {
                if (vm.table.searchShow === true) {
                    vm.table.searchText = '';
                }
                vm.table.searchShow = !vm.table.searchShow;
            },
            edit: idzDo
        };

        activate();

        function activate() {
            getDataObj();
        }

        function idzDo(param) {
            $state.go('tkaninaBelkaDetail', { id: param });
        }

        function getDataObj() {
            dF.getData('materialBelka').then(function (data) {
//                policzStanAktualny(data);
                vm.dataObj = data;
                vm.table.rowLimitOpt = data.length > 100 ?  [10, 30, 100, data.length] : [10, 30, 100];
                vm.startMode = true;
            },
            function (error) {
                vm.info = "Błąd podczas pobierania danych, status: " + error.status;
            });

        }

        function policzStanAktualny(data) {
            angular.forEach(data, function (belka) {
                belka.rozchodInneWartosc = belka.rozchodInne.length === 0 ?  0 : belka.rozchodInne[0].wartosc;
                belka.rozchodObszycieWartosc = belka.rozchodObszycie.length === 0 ? 0 : belka.rozchodObszycie[0].wartosc;
                belka.stanAktualny = belka.stanPoczatkowy - (belka.rozchodInneWartosc + belka.rozchodObszycieWartosc);
            });

        }
  

    }
})();
