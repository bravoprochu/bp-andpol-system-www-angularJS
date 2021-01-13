(function () {
    'use strict';

    angular
        .module('app')
        .controller('platnoscPrzypomnienieCardUpdateCtrl', platnoscPrzypomnienieCardUpdateCtrl);

    platnoscPrzypomnienieCardUpdateCtrl.$inject = ['$scope', 'commonFunctions', 'dataFactory'];

    function platnoscPrzypomnienieCardUpdateCtrl($scope, cF, dF) {
        /* jshint validthis:true */
        var vm = this;
        var platnosc = vm.platnosc;

        vm.navZapisz = navZapisz;
        vm.navAnuluj = navAnuluj;
        vm.navUsun = navUsun;
        vm.kontrahenci = vm.danePomocnicze.kontrahenci;
        vm.waluta = vm.danePomocnicze.waluta;
        vm.kontrahentSearch = kontrahentSearch;
        vm.kontrahentWybierz = kontrahentWybierz;
        vm.kontrahentPoprawDane = kontrahentPoprawDane;
        vm.kontrahentUtworzNowego = kontrahentUtworzNowego;
        vm.kontrEditSave = kontrEditSave;
        if (angular.isUndefined(platnosc)) {
            vm.data = {
                nazwaKontrahenta: null,
                terminPlatnosci: new Date(),
                dataZaplaty:new Date(),
                fakturaNr: null,
                kwota: null,
                uwagi: '',
                isDone: false,
            };
            vm.editMode = false;

        } else {
            vm.editMode = true;
            platnosc.dataZaplaty = new Date();
            platnosc.terminPlatnosci = new Date(platnosc.terminPlatnosci);
            vm.dataCopy = angular.copy(platnosc);
            vm.data = angular.copy(platnosc);
        }


        function kontrahentSearch() {
            if (vm.kontrahentSearchText === null) return kontrahenci;
            return $filter('filter')(kontrahenci, vm.kontrahentSearchText);
        }

        function kontrahentWybierz(kontrahent) {
            if (angular.isUndefined(kontrahent)) {
                vm.data.kontrahent = null;
                vm.data.kontrahentRefId = null;
            } else {
                vm.data.kontrahent = kontrahent;
                vm.data.kontrahentRefId = kontrahent.kontrahentId;
            }
        }

        function kontrahentPoprawDane(kontr) {
            vm.kontrahentPoprawDaneEditMode = true;
            dF.getData("kontrahent/" + kontr.kontrahentId).then(function (dane) {
                vm.kontr = dane;
            }, function (error) {
            });
        }

        function kontrahentUtworzNowego() {
            console.log("Utórz nowego()");
        }

        function kontrEditSave() {
            vm.kontr.status = "zmieniony";
            dF.putData("kontrahent/" + vm.kontr.kontrahentId, vm.kontr).then(function (response) {
                zaktualizujLokalneDane(vm.kontr);
                vm.kontrahentPoprawDaneEditMode = false;
            }, function (error) {
                onUpdate(err);
            });
        }

        function navAnuluj() {
//            vm.formMain.$rollbackViewValue();
            vm.onUpdate("Anulowano");
            vm.mdPanelRef.destroy();
            vm.mdPanelRef.hide();
            platnosc = angular.copy(vm.dataCopy);
        }
        function navZapisz() {
            if (angular.isDefined(platnosc)) {
                var d = vm.data;

                vm.data.doneBy = cF.userName();
                dF.putData("finPlatnoscPrzypomnienie/" + vm.data.platnoscPrzypomnienieId, vm.data).then(function (data) {
                    vm.onUpdate(data);
                    vm.mdPanelRef.destroy();
                    vm.mdPanelRef.hide();
                }, function (error) {

                });
            } else {
                dF.postData('finPlatnoscPrzypomnienie', vm.data).then(function (data) {
                    vm.onUpdate(data);
                    vm.mdPanelRef.destroy();
                    vm.mdPanelRef.hide();
                }, function (error) {

                });
            }
        }
        function navUsun() {
            vm.mdPanelRef.hide();
            cF.dialogTakNie('PłatnośćPrzypomnienie', 'Czy na pewno usunąć przypomnienie ' + vm.data.kontrahent.nazwa + ', kwota: ' + vm.data.kwota + ' ' + vm.data.waluta.skrot + ' ?').then(function (ok) {

                dF.deleteData('finPlatnoscPrzypomnienie/' + vm.data.platnoscPrzypomnienieId).then(function (data) {
                    vm.onUpdate(data)
                    vm.mdPanelRef.destroy();
                    vm.mdPanelRef.hide();
                }, function (error) {
                    vm.mdPanelRef.show();
                });

            }, function (anuluj) {
                vm.mdPanelRef.show();
            })
        }
    }
})();
