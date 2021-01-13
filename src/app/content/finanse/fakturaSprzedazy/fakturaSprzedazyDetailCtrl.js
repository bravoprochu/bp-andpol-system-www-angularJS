(function () {
    'use strict';

    angular
        .module('app')
        .controller('fakturaSprzedazyDetailCtrl', fakturaSprzedazyDetailCtrl);

    fakturaSprzedazyDetailCtrl.$inject = ['$filter', '$q','$scope', '$state', '$stateParams', 'commonFunctions', 'dataFactory'];

    function fakturaSprzedazyDetailCtrl($filter, $q, $scope, $state, $stateParams, cF, dF) {
        var vm = this;
        vm.title = 'Faktura sprzedaży';
        vm.subTitle = "Tworzenie / edycja";

        vm.danePomocnicze = [];
        vm.fakturaPozycjePrzelicz = fakturaPozycjePrzelicz;
        vm.fakturaPozycjaAdd = fakturaPozycjaAdd;
        vm.fakturaPozycjaRemove = fakturaPozycjaRemove;
        vm.navCanDelete = $stateParams.id>0? true: false;
        vm.navDelete = navDelete;

        vm.formChanged = formChanged;

        var i = 0;

        vm.korektaUtworz = korektaUtworz;

        vm.magWzRemove = magWzRemove;

        vm.pdfGen = pdfGen;

        vm.navZapisz = navZapisz;

        vm.zamowieniaDostTable = {
            searchText: '',
            order: '-zamowienieId',
            limit: 10,
            page: 1,
            searchShow: false,
            onSelect: zamowieniaDostepneOnSelect,
            onDeselect: zamowieniaDostepneOnDeselect,
            rowSelect: true,
            title: 'Dostępne zamówienia'
        };

        vm.tableMagWzDost = {
            searchText: '',
            search: cF.tableSearch,
            order: '-magWzId',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            addSingle: tableMagWzDostAddSingle,
            addGroup: tableMagWzDostAddGroup
        }

        activate();

        function activate() {
            getById();
        }

        $scope.$watch('vm.dataObj.nabywca.kontrahentId', function (newVal, oldVal) {
            if ($stateParams.id == 0 && newVal!=null) {
                var idx = cF.findInArr(vm.danePomocnicze.kontrahentPlatnoscRodzaj, newVal, 'kontrahentRefId');
                if (idx > -1) {
                    var d = vm.danePomocnicze.kontrahentPlatnoscRodzaj[idx];
                    vm.dataObj.platnosc= {
                        ileDni: d.ileDni,
                        uwagi:d.uwagi,
                        platnoscRodzaj:angular.copy(d.platnoscRodzaj)
                    };
                }
            }
            
        });

        function fakturaPozycjaAdd()
        {
            var fakturaPozycja = {
                ilosc:1,
                nazwa: '',
                podatekStawka: vm.danePomocnicze.podatekStawka[5],
                uniqueKey: Math.random(),
                wartoscJedn: 1,
                wartosc: 1,
                wartoscPodatku: 0,
                status: "nowy"
            };
            vm.dataObj.fakturaPozycje = vm.dataObj.fakturaPozycje!=null ? vm.dataObj.fakturaPozycje : [];
            vm.dataObj.fakturaPozycje.push(fakturaPozycja);
            if (vm.dataObj.czyKorekta) {
                vm.dataObj.fakturaPozycjeZmiany.push(fakturaPozycja);
            }
        }

        function fakturaPozycjaRemove(poz) {
            vm.formMain.$setDirty();
            poz.status = cF.statusCheck('del', poz);
            if (vm.dataObj.czyKorekta) {
                var idxPozKor = cF.findInArr(vm.dataObj.fakturaPozycjeZmiany, poz.uniqueKey, 'uniqueKey')
                if (idxPozKor > -1) {
                    vm.dataObj.fakturaPozycjeZmiany.splice(idxPozKor, 1);
                }
                var idxPozPrzed = cF.findInArr(vm.dataObj.fakturaPozycjePrzed, poz.uniqueKey, "uniqueKey");
                if (idxPozPrzed > -1) {
                    var pozPrzed = vm.dataObj.fakturaPozycjePrzed[idxPozPrzed];
                    var p = angular.copy(pozPrzed);
                    p.ilosc = p.ilosc * (-1);
                    vm.dataObj.fakturaPozycjeZmiany.push(p);
                }
            }
            if (poz.status != 'usuniety') {
                vm.dataObj.fakturaPozycje.splice(vm.dataObj.fakturaPozycje.indexOf(poz), 1);
            }
            fakturaPozycjePrzelicz();
        }

        function fakturaPozycjePrzelicz(pozChanged) {
            var result = 0;
            var podsumWart = [];
            
            vm.dataObj.razemNetto = 0;
            vm.dataObj.razemPodatek = 0;
            vm.dataObj.razemBrutto = 0;

            if (vm.dataObj.stateId == 0) {
                vm.dataObj.dodatkoweInfo.wagaNetto = 0;
                vm.dataObj.dodatkoweInfo.wagaBrutto = 0;
                vm.dataObj.dodatkoweInfo.colli = 0;
            }

            for (var i = 0; i < vm.dataObj.fakturaPozycje.length; i++) {
                var poz = vm.dataObj.fakturaPozycje[i];
                if (poz.podatekStawka == null || poz.status=='usuniety') {continue; }

                var foundInPodsWart = fakturaPozycjeCzyPodatekStawka(podsumWart, poz.podatekStawka);
                if (foundInPodsWart >= 0) {
                    var pozycja = podsumWart[foundInPodsWart];
                    pozycja.ilosc += poz.ilosc;
                    pozycja.wartoscNetto += poz.wartosc;
                    pozycja.wartoscBrutto = (pozycja.wartoscNetto * poz.podatekStawka.wartosc) + pozycja.wartoscNetto;
                } else {
                    var podatekStawkaPozycja = {
                        podatekStawka: poz.podatekStawka,
                        wartoscNetto: poz.wartosc,
                        wartoscBrutto: (poz.wartosc * poz.podatekStawka.wartosc) + poz.wartosc
                    }
                    podsumWart.push(podatekStawkaPozycja);
                }

                poz.wartosc = poz.ilosc * poz.wartoscJedn;


                if (vm.dataObj.stateId == 0) {
                    if (angular.isNumber(poz.waga)) {
                        vm.dataObj.dodatkoweInfo.wagaNetto += (poz.waga * poz.ilosc);
                        vm.dataObj.dodatkoweInfo.wagaNetto.toFixed(2);
                    }
                    vm.dataObj.dodatkoweInfo.wagaBrutto = (vm.dataObj.dodatkoweInfo.wagaNetto * 1.03).toFixed(2);
                    poz.iloscKombinacji = poz.iloscKombinacji != null ? poz.iloscKombinacji : poz.ilosc;
                    vm.dataObj.dodatkoweInfo.colli += poz.iloscKombinacji * poz.ilosc;
                };
                poz.status = poz.status == null ? "nowy" : cF.statusCheck("mod", poz);
            }
            vm.dataObj.fakturaPodsumowanieWartosci = podsumWart;
            fakturaPodsumowanieWartosciRazem()
            

            if (pozChanged !== undefined) {
                if (pozChanged.czyKorekta) {
                    var idxPrzedKor = cF.findInArr(vm.dataObj.fakturaPozycjePrzed, pozChanged.uniqueKey, 'uniqueKey');
                    if (idxPrzedKor > -1) {
                        var idxZmiany = cF.findInArr(vm.dataObj.fakturaPozycjeZmiany, pozChanged.uniqueKey, 'uniqueKey');
                        if (idxZmiany > -1) {
                            vm.dataObj.fakturaPozycjeZmiany.splice(idxZmiany, 1);
                        }
                        var p = vm.dataObj.fakturaPozycjePrzed[idxPrzedKor];
                        var pZm = angular.copy(p);
                        pZm.czyKorekta = false;


                        var zmIlosc = pozChanged.ilosc - p.ilosc;
                        var zmWartoscJedn = pozChanged.wartoscJedn - p.wartoscJedn;
                        var zmPodatekChanged = pozChanged.podatekStawka.jednPodatekStawkaId != p.podatekStawka.jednPodatekStawkaId;

                        if (zmIlosc != 0 || zmWartoscJedn != 0 || zmPodatekChanged) {
                            pZm.podatekStawka = angular.copy(pozChanged.podatekStawka);
                            pZm.ilosc = pozChanged.ilosc - p.ilosc;
                            pZm.wartoscJedn = Math.round((pozChanged.wartoscJedn - p.wartoscJedn)*100)/100;
                            //pZm.wartosc = zmWartoscJedn != 0 ? Math.round((zmIlosc * (p.wartoscJedn + zmWartoscJedn) * 100)) / 100 : Math.round((zmIlosc * p.wartoscJedn) * 100) / 100;
                            pZm.wartosc = Math.round((zmIlosc * (p.wartoscJedn + zmWartoscJedn) * 100)) / 100;
                            vm.dataObj.fakturaPozycjeZmiany.push(pZm);
                        }
                        if (zmIlosc == 0) {
                            pZm.wartosc = pozChanged.ilosc * pozChanged.wartoscJedn;
                        }
                    }
                }
            }

        }

        function fakturaPodsumowanieWartosciRazem() {
            vm.dataObj.razemNetto = 0;
            vm.dataObj.razemBrutto = 0;
           
            angular.forEach(vm.dataObj.fakturaPodsumowanieWartosci, function (poz) {
                vm.dataObj.razemNetto += poz.wartoscNetto;
                vm.dataObj.razemBrutto += poz.wartoscBrutto;
            });
            vm.dataObj.razemPodatek = vm.dataObj.razemBrutto - vm.dataObj.razemNetto;
        }

        function fakturaPozycjeCzyPodatekStawka(arr, podatekStawka) {
            if (arr.length === 0 || podatekStawka==null) return -1;
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

        function formChanged() {
            if (!vm.dataObj.czyKorekta || vm.dataObj.stateId == 0) return;


            i++;
            console.log(i);

            korektaSprawdzZmiany();
        }

        function getById() {

            var _zamowienia = dF.getData('magWz/niezafakturowane');
            var _podatekStawka = dF.getData("bazaJednostek/podatekStawka");
            var _waluta = dF.getData('bazaJednostek/waluta');
            var _kontrahenci = dF.getData('kontrahent/smallList');
            var _fakturaById = $stateParams.id > 0 ? dF.getData('finFakturaSprzedazy/' + $stateParams.id) : null;
            var _dealerzy = dF.getData("kontrahent/kontrahentDealerDostawa");
            var _platnoscRodzaj = dF.getData('bazaJednostek/platnoscRodzaj');
            var _kontrahentPlatnoscRodzaj = dF.getData('kontrahent/platnoscRodzaj');


            $q.all([_zamowienia, _podatekStawka, _waluta, _kontrahenci, _fakturaById, _dealerzy, _platnoscRodzaj, _kontrahentPlatnoscRodzaj]).then(
                function (res) {
                    vm.danePomocnicze.magWzBaza = res[0];
                    vm.danePomocnicze.podatekStawka = res[1];
                    vm.danePomocnicze.waluta = res[2];
                    vm.danePomocnicze.kontrahenci = res[3];
                    vm.danePomocnicze.dealerzy = res[5];
                    vm.danePomocnicze.platnoscRodzaj = res[6];
                    vm.danePomocnicze.kontrahentPlatnoscRodzaj = res[7];

                    var sprzedawcaId = cF.findInArr(vm.danePomocnicze.kontrahenci, 1293, 'kontrahentId');

                    if ($stateParams.id > 0) {
                        vm.dataObj = res[4];
                        if (vm.dataObj.czyAktywna == false) {
                            cF.info("warning", "FakturaSprzedazy", "Pobrana faktura o Id: " + vm.dataObj.fakturaSprzedazyId + " jest nieaktywna, pobierz jej korektę");
                            cF.backTo('fakturaSprzedazy');
                        }
                        
                        vm.dataObj.stateId = $stateParams.id;
                        vm.dataObj.dodatkoweInfo.baza = {
                            wagaNetto: res[4].dodatkoweInfo.wagaNetto,
                            wagaBrutto: res[4].dodatkoweInfo.wagaBrutto,
                            colli: res[4].dodatkoweInfo.colli
                        };
                        if (vm.dataObj.fakturaPozycjeZmiany == undefined) {
                            vm.dataObj.fakturaPozycjeZmiany = [];
                        }
                        if (vm.dataObj.fakturaPozycjePrzed == undefined) {
                            vm.dataObj.fakturaPozycjePrzed = [];
                        }
                        if (vm.dataObj.baseFakturaId > 0) {
                            dF.getData('finFakturaSprzedazy/' + vm.dataObj.baseFakturaId).then(function (resKorekta) {
                                vm.dataObj.fakturaPozycjePrzed = resKorekta.fakturaPozycje;
                                vm.dataObj.baseFakturaNumerDokumentu = resKorekta.numerDokumentu;
                                vm.dataObj.baseFakturaDataWystawienia = resKorekta.dataWystawienia;
                                vm.dataObj.baseFakturaRazemNetto = resKorekta.razemNetto;
                                vm.dataObj.baseFakturaRazemBrutto = resKorekta.razemBrutto;
                                vm.startMode = true;
                                vm.dataObjCopy = resKorekta;
                            })
                        } else {
                            vm.dataObjCopy = angular.copy(vm.dataObj);
                        }
                    } else {
                        vm.dataObj = {
                            czyKorekta: false,
                            createdBy: cF.userName(),
                            dataWystawienia: new Date(),
                            dodatkoweInfo : {},
                            stateId: 0,
                            magWzWybrane: [],
                            sprzedawca: vm.danePomocnicze.kontrahenci[sprzedawcaId]
                        }
                    }
                    vm.startMode = true;

                }, cF.error);
        }

        function korektaSprawdzZmiany() {
            var changes = [];
            
        }

        function korektaUtworz() {
            vm.dataObj.korektaInProgress = true;
            vm.dataObj.czyKorekta = true;
            vm.dataObj.numerDokumentu += " (tworzenie korekty)";
            angular.forEach(vm.dataObj.fakturaPozycje, function (poz) {
                poz.uniqueKey = Math.random();
                poz.status = "nowy";
                poz.fakturaSprzedazyPozycjaOrygRef = poz.fakturaSprzedazyPozycjaId;
                var p = angular.copy(poz);
                vm.dataObj.fakturaPozycjePrzed.push(p);
                poz.czyKorekta = true;
            })

        }

        function magWzAdd(magWz) {
            vm.dataObj.magWzIdsUsuniete = vm.dataObj.magWzIdsUsuniete == null ? [] : vm.dataObj.magWzIdsUsuniete;
            vm.dataObj.magWzWybrane = vm.dataObj.magWzWybrane != null ? vm.dataObj.magWzWybrane : [];

            var foundInMagWzIdsUsuniete = vm.dataObj.magWzIdsUsuniete.indexOf(magWz.magWzId);
            if (foundInMagWzIdsUsuniete > -1) { vm.dataObj.magWzIdsUsuniete.splice(foundInMagWzIdsUsuniete, 1); }

            vm.dataObj.magWzIds = vm.dataObj.magWzIds != null ? vm.dataObj.magWzIds : [];
            vm.dataObj.magWzWybrane.push(magWz);
            vm.dataObj.magWzIds.push(magWz.magWzId);
            if (vm.dataObj.magWzWybrane.length == 1) {
                var idx = cF.findInArr(vm.danePomocnicze.kontrahenci, magWz.basicInfo.kontrahent.kontrahentId, 'kontrahentId');
                vm.dataObj.nabywca = vm.danePomocnicze.kontrahenci[idx];
            }
            vm.formMain.$setDirty();
        }

        function magWzRemove(magWz)
        {
            angular.forEach(magWz.pozycjaGroup, function (p) {
                if (p.pozMagId > 0) {
                    var idx = cF.findInArr(vm.dataObj.fakturaPozycje, p.pozMagId, 'pozMagId');
                    if (idx > -1) {
                        var fakPoz = vm.dataObj.fakturaPozycje[idx];
                        fakPoz.status = cF.statusCheck('del', fakPoz);
                        if (fakPoz.status != 'usuniety') {
                            console.log('to chyba nowa faktura, bo usunął pozycje' + p.nazwa);
                            vm.dataObj.fakturaPozycje.splice(idx, 1);
                        }
                    }
                }
            });
            vm.dataObj.magWzIds.splice(vm.dataObj.magWzIds.indexOf(magWz.magWzId), 1);
            vm.dataObj.magWzIdsUsuniete.push(magWz.magWzId);
            vm.danePomocnicze.magWzBaza.push(angular.copy(magWz));
            vm.formMain.$setDirty();
        }

        function magWzDostSplice(magWz) {
            var idx = vm.danePomocnicze.magWzBaza.indexOf(magWz);
            vm.danePomocnicze.magWzBaza.splice(idx, 1);
        }

        function navZapisz() {
            cF.dialogTakNie("Faktura sprzedaży", "Czy na pewno zapisać dane w bazie ?").then(function (tak) {
                dF.putData("finFakturaSprzedazy/" + vm.dataObj.stateId, vm.dataObj).then(function (res) {
                    $state.go('fakturaSprzedazy');
                }, cF.error())
            }, function (nie) {

            });
        }

        function navDelete() {
            var infoPrzyKorekcie = "Faktura bazowa zostanie 'przywrócona' jako aktywna, można utworzyć nową korektę; Aktualna Korekta nie zostanie usunięta z bazy.";
            var infoDlaFv = "Faktura zostanie usunięta z bazy. O ile nie jest ostatnią utworzoną, powstanie 'luka' w numeracji dokumentów.";
            var info = vm.dataObj.baseFakturaId > 0 ? infoPrzyKorekcie : infoDlaFv;
            cF.dialogTakNie("Usuń", "Czy na pewno chcesz usunąć dokument <strong>" + vm.dataObj.numerDokumentu + "</strong><br /> <small>" + info + "</small>").then(function (ok) {
                dF.deleteData('finFakturaSprzedazy/' + $stateParams.id).then(function (res) {
                    console.log(res);
                    if (res.baseFakturaId!=null) {
                        $state.go('fakturaSprzedazyDetail', { id: res.baseFakturaId });
                    } else {
                        $state.go("fakturaSprzedazy");
                    }
                }, cF.error);
            })
        }
 
        function pdfGen() {
            cF.dialogTakNie("FakturaSprzedaży", "Czy na pewno wygenerować PDF Faktura sprzedaży ?").then(function (ok) {
                dF.postData("finFakturaSprzedazy/pdfGenFv", vm.dataObj, true).then(function (res) {
                    cF.pdfGen(res, "FV_" + vm.dataObj.numerDokumentu + "_" + vm.dataObj.nabywca.skrot + ".pdf");
                }, cF.error);
            })

        }

        function saveAs(blob, fileName) {
            var url = window.URL.createObjectURL(blob);

            var doc = document.createElement("a");
            doc.href = url;
            doc.download = fileName;
            doc.click();
            window.URL.revokeObjectURL(url);
        }

        function tableMagWzDostAddSingle(magWz)
        {
            vm.dataObj.fakturaPozycje = vm.dataObj.fakturaPozycje != null ? vm.dataObj.fakturaPozycje : [];
            angular.forEach(magWz.pozycja, function (poz) {
                var p = angular.copy(poz);
                p.status = 'nowy';
                vm.dataObj.fakturaPozycje.push(p);
                if (vm.dataObj.czyKorekta) {
                    console.log('OK');
                    vm.dataObj.fakturaPozycjeZmiany.push(p);
                }
            });
            magWzAdd(angular.copy(magWz))
            magWzDostSplice(magWz);
        }

        function tableMagWzDostAddGroup(magWz) {
            var wtf = angular.copy(magWz);
            vm.dataObj.fakturaPozycje = vm.dataObj.fakturaPozycje != null ? vm.dataObj.fakturaPozycje : [];
            angular.forEach(wtf.pozycjaGroup, function (poz) {
                var found = cF.findInArr(vm.dataObj.fakturaPozycje, poz.uniqueKey, 'uniqueKey');
                if (found > -1) {
                    vm.dataObj.fakturaPozycje[found].ilosc += poz.ilosc;
                } else {
                    var p = angular.copy(poz);
                    p.status = "nowy";
                    vm.dataObj.fakturaPozycje.push(p);
                    if (vm.dataObj.czyKorekta) {
                        vm.dataObj.fakturaPozycjeZmiany.push(p)
                    }
                }
            });

            magWzAdd(angular.copy(magWz))
            magWzDostSplice(magWz);
        }

        function zamowieniaDostepneOnSelect(zam) {
            if (vm.dataObj.fakturaPozycje.length === 1) {
                vm.dataObj.zamowieniaBazaCopy = angular.copy(vm.dataObj.zamowieniaBaza);
                vm.dataObj.zamowieniaBaza = $filter('filter')(vm.dataObj.zamowieniaBaza, {
                    dealerInfo: {
                        kontrahentShort: zam.dealerInfo.kontrahentShort
                    }
                });
            }
        }

        function zamowieniaDostepneOnDeselect(zam) {
            if (vm.dataObj.fakturaPozycje.length === 0) {
                vm.dataObj.zamowieniaBaza = angular.copy(vm.dataObj.zamowieniaBazaCopy);
            }
        }

    }
})();
