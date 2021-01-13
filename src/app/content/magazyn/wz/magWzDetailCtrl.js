(function () {
    'use strict';

    angular
        .module('app')
        .controller('magWzDetailCtrl', magWzDetailCtrl);

    magWzDetailCtrl.$inject = ['$filter', '$q', '$stateParams', 'commonFunctions', 'dataFactory'];

    function magWzDetailCtrl($filter, $q, $stateParams, cF, dF) {
        var vm=this;
        vm.title = 'WZ - wydanie zewnętrzne';

        vm.danePomocnicze = [];
        vm.dataObj = {
            createdInfo: {
                createdBy: cF.userName(),
            },
            pozycjeMagazynowe: [],
        };
        vm.fakturaPozycjePrzelicz = fakturaPozycjePrzelicz;
        vm.dataObj.zamowieniaWybrane = [];
        vm.navZapisz = navZapisz;
        vm.pozMagDostepne = [];
        vm.pozMagSelectedItemChange = pozMagSelectedItemChange;
        vm.pozMagWybranaAdd = pozMagWybranaAdd;
        vm.pozMagWybraneRemove = pozMagWybraneRemove;
        


        vm.tabsIdx = 0;

        vm.pozMagDostTable = {
            searchText: '',
            order: '-zamowienieId',
            limit: 10,
            page: 1,
            searchShow: false,
            search: tableSearch,

            rowSelect: true,
            title: 'Dostępne zamówienia'
        };

        vm.pozMagWybrTable = {
            searchText: '',
            order: 'zamowienieId',
            limit: 10,
            page: 1,
            searchShow: false,
            search: tableSearch,
            rowSelect: false,
            title: 'Zamówienia wybrane '
        };
        vm.utworzKorekte = utworzKorekte;


        vm.tableZamowieniaWybrane = {
            searchText: '',
            order: '-zamowienieId',
            limit: 10,
            page: 1,
            searchShow: false,
            search: tableSearch,
            rowLimitOpt: vm.dataObj.zamowieniaWybrane.length > 100 ? [10, 30, 100, vm.dataObj.zamowieniaWybrane.length] : [10, 30, 100],

            onSelect: function (callback) {

            },
            onDeselect: function (callback) {

            },
            rowSelect: true,
            title: 'Dostępne zamówienia',
        }

        activate();

        function activate() {
            getById();
        }


        function fakturaPozycjePrzelicz() {
            console.log("fakturaPozycjePrzelicz");
            var result = 0
            var podsumWart = []
            angular.forEach(vm.dataObj.zamowieniaWybrane, function (zam) {
                zam.podatekStawka = angular.isDefined(zam.podatekStawka) ? zam.podatekStawka : vm.danePomocnicze.podatekStawka[5];
                if (angular.isDefined(zam.wartosc)) {
                    var foundInPodsWart = fakturaPozycjeCzyPodatekStawka(podsumWart, zam.podatekStawka);
                    if (foundInPodsWart >= 0) {
                        var poz = podsumWart[foundInPodsWart];
                        poz.wartoscNetto += zam.wartosc;
                        poz.wartoscBrutto = (poz.wartoscNetto * zam.podatekStawka.wartosc) + poz.wartoscNetto;
                    } else {
                        var podatekStawkaPozycja = {
                            podatekStawka: zam.podatekStawka,
                            wartoscNetto: zam.wartosc,
                            wartoscBrutto: (zam.wartosc * zam.podatekStawka.wartosc) + zam.wartosc
                        }
                        podsumWart.push(podatekStawkaPozycja);
                    }
                }
            })
            vm.dataObj.fakturaWartoscNetto = result;
            vm.dataObj.fakturaPodsumowanieWartosci = podsumWart;
        }

        function fakturaPozycjeCzyPodatekStawka(arr, podatekStawka) {
            if (arr.length === 0) return -1;
            var result = -1;
            for (var i = 0; i < arr.length; i++) {
                var podatek = arr[i];
                if (podatek.podatekStawka.jednPodatekStawkaId === podatekStawka.jednPodatekStawkaId) {
                    result = i
                    break
                };
            }
            return result;
        }

        function getById() {
            if ($stateParams.id== 0) {
                vm.dataObj.dataWystawienia = new Date();
                vm.dataObj.stateId = 0;
                getHelpfull();
            } else {
                dF.getData("magWz/" + $stateParams.id).then(function (res) {
                    vm.dataObj = res.result;
                    vm.dataObj.dokumentyBazowe = res.dokumentyBazowe;
                    vm.dataObj.stateId = $stateParams.id;
                    vm.dataObj.typDanychDokumentu = vm.dataObj.pozycjeMagazynowe.length > 0 ? 1 : 0;
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                    getHelpfull();
                }, function (err) {
                })
            }
        }

        function getHelpfull() {
            var _zamowienia = dF.getData('zamowienie/zamowienieFakturaSprzedazy');
            var _podatekStawka = dF.getData("bazaJednostek/podatekStawka");
            var _waluta = dF.getData('bazaJednostek/waluta');
            var _pozycjeMagazynowe = dF.getData('magPozycjaMagazynowa/dostepne');
            var _kontrahenci = dF.getData('kontrahent/smallList');

            $q.all([_zamowienia, _podatekStawka, _waluta, _pozycjeMagazynowe, _kontrahenci]).then(
                function (res) {
                    vm.danePomocnicze.zamowieniaBaza = res[0];
                    vm.danePomocnicze.podatekStawka = res[1];
                    vm.danePomocnicze.waluta = res[2];
                    vm.danePomocnicze.pozycjeMagazynowe = res[3];
                    vm.danePomocnicze.kontrahenci = res[4];
                    vm.pozMagDostTable.rowLimitOpt= vm.danePomocnicze.zamowieniaBaza.length > 100 ? [10, 30, 100, vm.danePomocnicze.zamowieniaBaza.length] : [10, 30, 100],
                    pozMagSetFilter();
                    vm.startMode = true;
                },
                function (err) {
                    console.log(err);
                });
        }

        function navZapisz() {

            cF.dialogTakNie('Czy na pewno zapisać dane ?').then(function (ok) {
                dF.putData('magWz/' + vm.dataObj.stateId, vm.dataObj).then(function (res) {
                    cF.backTo('magWz');
                }, cF.error)
            }, function (not) { });
            
        }


        function pozMagWybranaAdd() {
            var poz = vm.pozMagWybrana;
            if (vm.dataObj.czyKorekta) {
                var idx = cF.findInArr(vm.danePomocnicze.pozycjeMagazynowe, poz, "pozycjaMagazynowaId")
                if (idx < 0) {
                    poz.stanAktualny -= poz.ilosc;
                    vm.danePomocnicze.pozycjeMagazynowe.push(poz);
                } else {
                    console.log(idx);
                    vm.danePomocnicze.pozycjeMagazynowe[idx].stanAktualny -= poz.ilosc;
                }
            };

            vm.pozMagWybrana.stanAktualny -= vm.pozMagWybrana.ilosc;
            vm.dataObj.pozycjeMagazynowe.push(vm.pozMagWybrana);
            vm.pozMagWybrana = {};
            pozMagSetFilter()
        }

        function pozMagWybraneRemove(poz)
        {
            //jesli korekta - poprawia stan aktualny
            if (vm.dataObj.czyKorekta) {
                var idx = cF.findInArr(vm.danePomocnicze.pozycjeMagazynowe, poz, "pozycjaMagazynowaId")
                if (idx < 0) {
                    poz.stanAktualny += poz.ilosc;
                    vm.danePomocnicze.pozycjeMagazynowe.push(poz);
                } else {
                    console.log(idx);
                    vm.danePomocnicze.pozycjeMagazynowe[idx].stanAktualny += poz.ilosc;
                }
            };
            var idx = vm.dataObj.pozycjeMagazynowe.indexOf(poz);
            vm.dataObj.pozycjeMagazynowe.splice(idx, 1);
            pozMagSetFilter();
        }


        function pozMagSelectedItemChange()
        {

        }

        function pozMagSetFilter()
        {
            vm.pozMagDostepne = angular.copy(vm.danePomocnicze.pozycjeMagazynowe);
            angular.forEach(vm.dataObj.pozycjeMagazynowe, function (wybr) {
                var found = cF.findInArr(vm.pozMagDostepne, wybr, 'nazwa');
                if (found >= 0) {
                    vm.pozMagWybrana = vm.pozMagDostepne[1];
                    vm.pozMagSearchText = undefined;
                    vm.pozMagDostepne.splice(found, 1);
                }
            });
        };
        
        function tableSearch() {
            if (this.searchShow === true) {
                this.searchText = '';
            }
            this.searchShow = !this.searchShow;
        }

        function utworzKorekte()
        {
            vm.formMain.$setDirty();
            vm.dataObj.czyKorekta = true;
            vm.dataObj.magWzIdKorekta = vm.dataObj.magWzId;
            vm.dataObj.stateIdCopy = vm.dataObj.stateId;
            //zamowienia
            if (vm.dataObj.zamowieniaWybrane.length > 0) {
                vm.dataObj.typDanychDokumentu = 0;
                angular.forEach(vm.dataObj.zamowieniaWybrane, function (zam) {
                    vm.danePomocnicze.zamowieniaBaza.push(zam);
                })
            }
            //pozycjeMagazynowe
            if (vm.dataObj.pozycjeMagazynowe.length > 0) {
                vm.dataObj.typDanychDokumentu = 1;
            }


            vm.dataObj.stateId = 0;

            
        }

        function zamowieniaDostepneOnSelect(zam) {
            if (vm.dataObj.zamowieniaWybrane.length === 1) {
                vm.danePomocnicze.zamowieniaBazaCopy = angular.copy(vm.danePomocnicze.zamowieniaBaza);
                vm.danePomocnicze.zamowieniaBaza = $filter('filter')(vm.danePomocnicze.zamowieniaBaza, {
                    dealerInfo: {
                        kontrahentShort: zam.dealerInfo.kontrahentShort
                    }
                });
            }
            fakturaPozycjePrzelicz();
        }

        function zamowieniaDostepneOnDeselect(zam) {
            if (vm.dataObj.zamowieniaWybrane.length === 0) {
                vm.danePomocnicze.zamowieniaBaza = angular.copy(vm.danePomocnicze.zamowieniaBazaCopy);
            }
            fakturaPozycjePrzelicz();
        }
    }
})();
