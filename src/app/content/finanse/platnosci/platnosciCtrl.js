(function () {
    'use strict';

    angular
        .module('app')
        .controller('platnosciCtrl', platnosciCtrl);

    platnosciCtrl.$inject = ['$filter', '$mdPanel', '$state', 'commonFunctions', 'dataFactory'];

    function platnosciCtrl($filter, $mdPanel, $state, cF, dF) {
        /* jshint validthis:true */
        var vm = this;

        vm.title = 'Finanse - płatności';
        vm.subTitle = 'Płatności przypomnienia; faktury i inne...';

        vm.dataObj = [];
        vm.dataObjFiltered = dataObjFiltered;
        vm.danePomocnicze = {
            kontrahenci: []
        };
        vm.durationDni = durationDni;
        vm.idzDo = function (state) { $state.go(state);};

        vm.platnosc = {
            dane: [],
            filtruj:platnoscFiltruj,
            searchText: '',
            searchShow: platnoscSearchShow,
            searchShown:false,
        };
        vm.platnoscDodaj = platnoscDodaj;
        vm.platnoscIdzDoFaktury = platnoscIdzDoFaktury;

        activate();

        function activate() {
            getData();
        }

        function dataObjFiltered() {
            if (vm.platnoscSearchText === undefined || vm.platnoscSeachText === '') { return vm.dataObj; } else {
                return $filter('filter')(vm.dataObj, vm.platnoscSearchText);
            }
        }

        function durationDni(data) {
            data.spozniony = moment(data.data).isBefore(moment()) === true ? true: false;
            return moment(data.data).fromNow();
        }

        function durationDniPrzelicz() {
                angular.forEach(vm.dataObj, function (platnosc) {
                    platnosc.deadline = durationDni(platnosc);
                });
            }

        function getData() {
            dF.getData("finPlatnoscPrzypomnienie").then(function (data) {
                vm.danePomocnicze.kontrahenci = data.kontrahenci;
                vm.danePomocnicze.waluta = data.waluta;

                vm.dataObj = data.result;
                platnoscPrzygotujDaty()                

                vm.startMode = true;
            }, function (error) {
                console.log(error);
            });



        }

        function updateData(data) {
            if (angular.isDefined(data.result)) {
                vm.dataObj = data.result;
                platnoscPrzygotujDaty();
            }
        }


        
        function platnoscDodaj(platnosc) {
            
            var panelConfig = angular.extend({}, cF.panelDefault(), 
                {
                    controller: 'platnoscPrzypomnienieCardUpdateCtrl',
                    templateUrl: 'app/content/finanse/platnosci/platnosciTmpl.html',
                    locals: {
                        platnosc: platnosc,
                        onUpdate: updateData,
                        danePomocnicze: vm.danePomocnicze,
                    },
                }
                );

            
            

            var panelRef = $mdPanel.create(panelConfig);
            panelRef.open(panelConfig);
        }


        function platnoscPrzygotujDaty(){
            vm.platnosc.filtruj();
            durationDniPrzelicz();
        }

        function platnoscFiltruj() {
            var p = vm.platnosc;
            if (p.searchText === undefined || p.searchText === '') { p.dane = vm.dataObj; } else {
                p.dane = $filter('filter')(vm.dataObj, p.searchText);
            }
        }

        function platnoscIdzDoFaktury(id) {
            $state.go("fakturaZakupuDetail", { id: id });
        }

        function platnoscSearchShow() {
            var p = vm.platnosc;
            p.searchShown=!p.searchShown;

            if (!p.searchShown) {
                p.searchText='';
                p.filtruj();
            }
        }

       
        function idzDo(param) {
        }



    }
})();
