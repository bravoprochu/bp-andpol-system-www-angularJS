(function () {
    'use strict';

    angular
        .module('app')
        .controller('platnosciZaplaconeCtrl', platnosciZaplaconeCtrl);

    platnosciZaplaconeCtrl.$inject = ['$filter','$q', '$state', 'commonFunctions', 'dataFactory'];

    function platnosciZaplaconeCtrl($filter,$q, $state, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Płatności';
        vm.subTitle = 'Płatności - zapłacone';

        vm.chart = {
            data: [],
            labels: [],
            series: []
        };

        vm.chartKontrahent = {
            data: [],
            labels: [],
            series: []
        };

        vm.getDataObj = getDataObj;
        vm.dataObj = [];
        vm.dateRange = dateRange;
        vm.idzDo = function (state) { $state.go(state); };
        vm.startMode = false;
        vm.table = {
            dane: function () { return $filter('filter')(vm.dataObj, vm.table.searchText); },
            order: '-platnoscPrzypomnienieId',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            search: tableSearch,
            searchShow: false,
            searchText: '',
        };


        activate();

        function activate() {
            getDataObj();
        }

        function dateRange(dateStart) {
            cF.dateRange(null, 'terminPlatnosci').then(function (res) {
                vm.info = '';
                dF.postData('FinPlatnoscPrzypomnienie/DateRange', res).then(function (data) {
                    vm.info = data.info;
                    vm.pref = false;
                    vm.raportInProgress = true;
                    cF.chartData(data.raport, ['wartosc'], 'label', ["Wartość"]).then(function (rap) {
                        vm.chart.data = rap.data
                        vm.chart.labels = rap.labels
                        vm.chart.series = rap.series
                    });
                    vm.chartKontrahentData = data.raportKontrahent;
                    cF.chartData(data.raportKontrahent, ['wartosc'], 'label', ["Wartość"]).then(function (rap) {
                        vm.chartKontrahent.data = rap.data
                        vm.chartKontrahent.labels = rap.labels
                        vm.chartKontrahent.series = rap.series
                    });
                    vm.raportInProgress = false;
                    vm.raport = data.raport;
                    vm.dataObj = data.result;
                    vm.table.rowLimitOpt = data.result.length > 100 ? [10, 30, 100, data.result.length] : [10, 30, 100];
                }, function (error) {

                })
            });
        }

        function getDataObj() {

            var dateRangePref = cF.pref.getByKey($state.current.name);
            dateRangePref=dateRangePref!=null ? dateRangePref.dateRange:null
            if (dateRangePref != null) {

                dF.postData('FinPlatnoscPrzypomnienie/DateRange', dateRangePref).then(function (data) {
                    vm.info = data.info;
                    vm.pref = true;
                    vm.raportInProgress = true;
                    cF.chartData(data.raport, ['wartosc'], 'label', ["Wartość"]).then(function (rap) {
                        vm.chart.data = rap.data
                        vm.chart.labels = rap.labels
                        vm.chart.series = rap.series
                    });
                    vm.chartKontrahentData = data.raportKontrahent;
                    cF.chartData(data.raportKontrahent, ['wartosc'], 'label', ["Wartość"]).then(function (rap) {
                        vm.chartKontrahent.data = rap.data
                        vm.chartKontrahent.labels = rap.labels
                        vm.chartKontrahent.series = rap.series
                    });
                    vm.raportInProgress = false;
                    vm.raport = data.raport;
                    data = data.result;
                    vm.dataObj = data;
                    vm.table.rowLimitOpt = data.length > 100 ? [10, 30, 100, data.length] : [10, 30, 100];
                    vm.startMode = true;
                }, function (error) {

                })


            } else {


            dF.getData('FinPlatnoscPrzypomnienie/Zaplacone').then(function (data) {
                vm.info = data.info;
                vm.pref = false;
                vm.raportInProgress = true;
                cF.chartData(data.raport, ['wartosc'], 'label', ["Wartość"]).then(function (rap) {
                    vm.chart.data=rap.data
                    vm.chart.labels=rap.labels
                    vm.chart.series=rap.series
                });
                vm.chartKontrahentData = data.raportKontrahent;
                cF.chartData(data.raportKontrahent, ['wartosc'], 'label', ["Wartość"]).then(function(rap){
                    vm.chartKontrahent.data = rap.data
                    vm.chartKontrahent.labels = rap.labels
                    vm.chartKontrahent.series = rap.series
                });
                vm.raport = data.raport;
                vm.raportInProgress = false;
                data = data.result;
                vm.dataObj = data;
                vm.table.rowLimitOpt = data.length > 100 ? [10, 30, 100, data.length] : [10, 30, 100];
                vm.startMode = true;
                },
                function (error) {
                    console.log(error);
                });
            }

        }

        function tableSearch() {
            if (vm.table.searchShow === true) {
                vm.table.searchText = '';
            }
            vm.table.searchShow = !vm.table.searchShow;
        }


    }
})();
