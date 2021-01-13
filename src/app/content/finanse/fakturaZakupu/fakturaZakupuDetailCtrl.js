(function () {
    'use strict';

    angular
        .module('app')
        .controller('fakturaZakupuDetailCtrl', fakturaZakupuDetailCtrl);

    fakturaZakupuDetailCtrl.$inject = ['$filter', '$mdMedia', '$mdPanel', '$state', '$stateParams', '$q', 'commonFunctions', 'currentUser', 'dataFactory', 'statusCheck'];

    function fakturaZakupuDetailCtrl($filter, $mdMedia, $mdPanel, $state, $stateParams, $q, cF, currentUser, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.objId = parseInt($stateParams.id);
        vm.title = 'Faktura zakupu';
        vm.subTitle = 'Edycja/tworzenie nowego dokumentu..';


        vm.danePomocnicze = {
            kontrahenci: [],
        };


        
        vm.isSmall = cF.isScreenSmall();
        vm.dataObj = {};

        vm.navCanDelete = vm.objId > 0 ? true : false;
        vm.navZapisz = navZapisz;
        vm.navDelete = navDelete;

        //vm.platnoscCardUpdate = platnoscCardUpdate;

        vm.platnoscTerminUstawIleDni = platnoscTerminUstawIleDni;
        vm.platnoscTerminUstawDpicker = platnoscTerminUstawDpicker;

        vm.pzMagDodaj = pzMagDodaj;
        vm.pzMagUsun = pzMagUsun;
        vm.pzPrzeliczIloscMag = pzPrzeliczIloscMag;
        vm.pzPrzeliczWartoscRazem = pzPrzeliczWartoscRazem;
        vm.pzPrzeliczWartosc = pzPrzeliczWartosc;
        vm.pzTkaninyDodaj = pzTkaninyDodaj;
        vm.pzTkaninyUsun = pzTkaninyUsun;

        vm.startMode = false;


        //        =========================================-------------------------------------=============================================

        activate();

        function activate() {
            getById();
        }

       


        function getById() {
            var pKontrahenci = dF.getData("kontrahent/smallList");
            var pNierozliczonePz = dF.getData("magPz/nierozliczonePz");
            var pNierozliczonePzTkaniny = dF.getData("materialBelka/nierozliczonePzTkaniny");
            var pPodatekStawka = dF.getData("bazaJednostek/podatekStawka");
            var pPlatnoscRodzaj = dF.getData("bazaJednostek/platnoscRodzaj");
            var pWaluta = dF.getData("bazaJednostek/waluta");

            $q.all([pKontrahenci, pNierozliczonePz, pPodatekStawka, pPlatnoscRodzaj, pNierozliczonePzTkaniny, pWaluta])
                .then(function (dane) {
                    vm.danePomocnicze.kontrahenci = dane[0];
                    vm.danePomocnicze.pzMag = dane[1];
                    vm.danePomocnicze.pzTkaniny = dane[4];
                    vm.danePomocnicze.podatekStawka = dane[2];
                    vm.danePomocnicze.platnoscRodzaj = dane[3];
                    vm.danePomocnicze.waluta = dane[5];


                    if (vm.objId === 0) {

                        vm.dataObj = {
                            status: "nowy",
                            createdBy: currentUser.getProfile().userEmail,
                            czyPrzypomnieniePlatnosc: true,
                            datyRazem: true,
                            dataSprzedazy: new Date(),
                            dataWystawienia: new Date(),
                            dataWplywu: new Date(),
                            fakturaPodsumowanieWartosciShow : true,
                            fakturaPozycjeMag: [],
                            fakturaPozycjeMagShow:true,
                            fakturaPozycjeTkaniny: [],
                            fakturaPozycjeTkaninyShow: true,

                            platnoscRodzaj: {
                                czyDni:true,
                                czyUwagi: false,
                                jednPlatnoscRodzajId: 3,
                                nazwa:"Przelew"
                            },

                            pz:{
                                pzMagDost:[],
                                pzTkaninyDost:[]
                            },
                            pzRozliczoneMag: [],
                            pzRozliczoneTkaniny:[],
                            waluta:vm.danePomocnicze.waluta[0],
                        };
                        vm.dataObj.dataSprzedazy.setHours(0, 0, 0, 0);
                        vm.dataObj.dataWystawienia.setHours(0, 0, 0, 0);
                        vm.dataObj.dataWplywu.setHours(0, 0, 0, 0);
                        vm.platnoscTerminDpicker = new Date(vm.dataObj.dataWystawienia);
                        
                        podsumowanieWartosciPrzygutuj();
                        pzDostPrzygotuj();


                        vm.dataObjCopy = angular.copy(vm.dataObj);
                        vm.startMode = true;
                    } else {
                        dF.getData('finFakturaZakupu/'+ vm.objId).then(function (dane) {
                            vm.dataObj = dane;
                            vm.dataObj.lastModifiedBy = dane.modifiedBy ? dane.modifiedBy : null
                            vm.dataObj.lastModifiedDateTime = dane.modifiedBy ? new Date(dane.modifiedDateTime) : null
                            vm.dataObj.modifiedBy = currentUser.getProfile().userEmail;
                            vm.dataObj.dataSprzedazy = new Date(dane.dataSprzedazy);
                            vm.dataObj.dataWystawienia = new Date(dane.dataWystawienia);
                            vm.dataObj.dataWplywu = new Date(dane.dataWplywu);
                            vm.dataObj.fakturaPodsumowanieWartosciShow = true;
                            vm.dataObj.fakturaPozycjeTkaninyShow = dane.pzRozliczoneTkaniny.length > 0 ? true : false
                            vm.dataObj.fakturaPozycjeMagShow = dane.pzRozliczoneMag.length > 0 ? true : false
                            platnoscTerminUstawDpicker();
                            pzPrzeliczWartoscRazemAlert();
                            vm.dataObjCopy = angular.copy(vm.dataObj);
                            vm.startMode = true;
                        }, function (error) {
                            vm.navIdzDo();
                        });
                    }

                }, function (error) {
                    console.log(error);
                });


        }

        function navDelete() {
            vm.inProgress = true;
            cF.dialogTakNie('Czy na pewno usunąć fakturę ?', 'Jeżeli zostało utworzone przypomnienie o płatności, również zostanie usunięte. <BR />PZkom wykorzystanym w fakturze zostaną usunięte statusy FV (muszą być usunięte osobno)').then(function (ok) {
                dF.deleteData('finFakturaZakupu/' + vm.objId).then(function (success) {
                    vm.navIdzDo();
                }, function (error) {
                    console.log(error);
                    vm.inProgress = false;
                })
            }, function (cancel) {
                vm.inProgress = false;
            });
        }


        function navZapisz() {
            vm.inProgress = true;
            cF.dialogTakNie(vm.title, "Czy na pewno zapisać dane w bazie ?").then(function (ok) {
                dF.putData("finFakturaZakupu/"+vm.objId, vm.dataObj).then(function (response) {
                    vm.navIdzDo();
                }, function (error) {
                    vm.inProgress = false;

                });

            }, function (cancel) {
                cF.info('warning', vm.title, "Dane nie zostały zapisane...");
                vm.inProgress = false;
            });

        }


        function platnoscTerminUstawIleDni() {
            var termin = vm.dataObj.platnoscRodzajIleDni;
            var picker = vm.platnoscTerminDpicker;

            var result = moment(picker).diff(moment(vm.dataObj.dataWystawienia), 'days');

            vm.dataObj.platnoscRodzajIleDni = result;
        }

        function platnoscTerminUstawDpicker() {
            if (!vm.dataObj.platnoscRodzajIleDni) { return; }

            var result=moment(moment(vm.dataObj.dataWystawienia).add(vm.dataObj.platnoscRodzajIleDni, 'days'));

            vm.platnoscTerminDpicker = new Date(result.format());
        }

        function podsumowanieWartosciPrzygutuj() {
            vm.dataObj.fakturaPodsumowanieWartosci = [];
            var result = vm.dataObj.fakturaPodsumowanieWartosci;

            angular.forEach(vm.danePomocnicze.podatekStawka, function (stawka) {
                var temp = {
                    podatekStawka: angular.copy(stawka),
                    wartoscBrutto: null,
                    wartoscNetto: null,
                    wartoscVat: null
                }
                result.push(temp);
            });


        }

        function pzDostPrzygotuj() {
            vm.dataObj.pz.pzMagDost = $filter('roznica')(vm.danePomocnicze.pzMag, vm.dataObj.pzRozliczoneMag, 'pzId', 'pzId');
            vm.dataObj.pz.pzTkaninyDost = $filter('roznica')(vm.danePomocnicze.pzTkaniny, vm.dataObj.pzRozliczoneTkaniny, 'pzTkaninyId', 'pzTkaninyId');
        }

        function pzMagDodaj(pzMag) {
            vm.dataObj.pzRozliczoneMag.push(pzMag);
            pzDostPrzygotuj();
            pzPrzeliczIloscMag();
        }

        function pzMagUsun() {
            pzDostPrzygotuj();
            pzPrzeliczIloscMag();
            pzPrzeliczWartosc();
        }

        function pzPrzeliczIloscMag() {
            vm.dataObj.fakturaPozycjeMag = [];
            var result = vm.dataObj.fakturaPozycjeMag;

            //pz'tki:
            angular.forEach(vm.dataObj.pzRozliczoneMag, function (pzMag) {
                //pozycje pztki:
                angular.forEach(pzMag.pzPozycja, function (pozMag) {
                    var uniqueKey = pozMag.pozycjaMagazynowa.pozycjaMagazynowaId;
                    var pozInPozMag = cF.checkByUniqueKey(result, uniqueKey)
                    var temp = {
                        uniqueKey: uniqueKey,
                        pozycjaMagazynowaRefId: uniqueKey,
                        ilosc: pozMag.ilosc,
                        jednostka: pozMag.pozycjaMagazynowa.jednostka,
                        nazwa:pozMag.pozycjaMagazynowa.nazwa,
                        podatekStawka: pozMag.pozycjaMagazynowa.vatZakupu,
                        magPzPozycjaId: pozMag.magPzPozycjaId,
                        statystyki:pozMag.pozycjaMagazynowa.statystyki
                    }

                    if (pozInPozMag === undefined) {
                        result.push(temp);
                    } else {
                        pozInPozMag.ilosc += pozMag.ilosc;
                    }
                })
            });
        }

        function pzPrzeliczIloscTkaniny() {
            vm.dataObj.fakturaPozycjeTkaniny = [];
            var result = vm.dataObj.fakturaPozycjeTkaniny;

            //pztki tkanin:
            angular.forEach(vm.dataObj.pzRozliczoneTkaniny, function (pzTkaniny) {
                //material belka:
                angular.forEach(pzTkaniny.materialBelka, function (matBelka) {

                    var uniqueKey = matBelka.materialId;
                    var pozInPozTkaniny = cF.checkByUniqueKey(result, uniqueKey);
                    var temp = {
                        uniqueKey: uniqueKey,
                        materialId: uniqueKey,
                        nazwa:matBelka.material.nazwa,
                        ilosc: matBelka.ilosc,
                        jednostka: 'mb',
                        podatekStawka: angular.copy(vm.danePomocnicze.podatekStawka[5]),
                        statystyki:matBelka.material.statystyki
                    };

                    if (pozInPozTkaniny === undefined) {
                        result.push(temp);
                    } else {
                        pozInPozTkaniny.ilosc += matBelka.ilosc;
                    }
                })

            });
        }

        function pzPrzeliczWartosc(pozMag) {
            if (angular.isDefined(pozMag)) {
                pozMag.wartosc = Math.round(pozMag.ilosc * pozMag.cena * 100) / 100;
            }

            var pods = vm.dataObj.fakturaPodsumowanieWartosci;
            var pozycjeMag = vm.dataObj.fakturaPozycjeMag;
            var pozycjeTkaniny = vm.dataObj.fakturaPozycjeTkaniny;

            //ustalenie uniqueKey dla podsumowaniaWartosci
            angular.forEach(pods, function (p) {
                p.uniqueKey = p.podatekStawka.jednPodatekStawkaId;
                p.wartoscBrutto = null;
                p.wartoscNetto = null;
                p.wartoscVat = null;
            })


            angular.forEach(pozycjeMag, function (poz) {
                if (poz.cena && poz.podatekStawka) {
                    var podsPoz = cF.checkByUniqueKey(pods, poz.podatekStawka.jednPodatekStawkaId);
                    podsPoz.wartoscNetto += poz.ilosc * poz.cena;
                    podsPoz.wartoscNetto = Math.round(podsPoz.wartoscNetto * 100) / 100;
                    podsPoz.wartoscBrutto = Math.round(podsPoz.wartoscNetto * (1 + poz.podatekStawka.wartosc) * 100) / 100;
                    var vatValue = podsPoz.wartoscBrutto - podsPoz.wartoscNetto;
                    podsPoz.wartoscVat = vatValue == 0 ? null : Math.round(vatValue * 100) / 100;
                    poz.status = statusCheck.check('mod', poz);
                }
            });

            angular.forEach(pozycjeTkaniny, function (poz) {
                if (poz.cena && poz.podatekStawka) {
                    var podsPoz = cF.checkByUniqueKey(pods, poz.podatekStawka.jednPodatekStawkaId);
                    podsPoz.wartoscNetto += poz.ilosc * poz.cena;
                    podsPoz.wartoscNetto = Math.round(podsPoz.wartoscNetto * 100) / 100;
                    podsPoz.wartoscBrutto = Math.round(podsPoz.wartoscNetto * (1 + poz.podatekStawka.wartosc) * 100) / 100;
                    var vatValue = podsPoz.wartoscBrutto - podsPoz.wartoscNetto;
                    podsPoz.wartoscVat = vatValue == 0 ? null : Math.round(vatValue * 100) / 100;
                    poz.status = statusCheck.check('mod', poz);
                }
            });


            pzPrzeliczWartoscRazem();
        }

        function pzPrzeliczWartoscRazem() {
            vm.dataObj.razemBrutto = null;
            vm.dataObj.razemNetto = null;
            vm.dataObj.razemVat = null;

            angular.forEach(vm.dataObj.fakturaPodsumowanieWartosci, function (stawka) {

                vm.dataObj.razemBrutto += stawka.wartoscBrutto;
                vm.dataObj.razemNetto += stawka.wartoscNetto;
                vm.dataObj.razemVat += stawka.wartoscVat;
            });
            pzPrzeliczWartoscRazemAlert();
        }

        function pzPrzeliczWartoscRazemAlert() {
            angular.forEach(vm.dataObj.fakturaPodsumowanieWartosci, function (stawka) {
                if (stawka.wartoscBrutto && stawka.podatekStawka.wartosc>0 && stawka.wartoscNetto) {
                    stawka.realBrutto = Math.round(stawka.wartoscNetto * (1 + stawka.podatekStawka.wartosc) * 100) / 100;
                    stawka.realVat = stawka.realBrutto - stawka.wartoscNetto;
                    stawka.realVat=Math.round(stawka.realVat*100)/100
                    var redAlert = { 'color': 'red' };



                    if (stawka.wartoscBrutto!=stawka.realBrutto) {
                        stawka.bruttoAlertError = true
                        stawka.bruttoAlert = redAlert;
                    } else {
                        stawka.bruttoAlertError = false
                        stawka.bruttoAlert = {};
                    }

                    if (stawka.wartoscVat != stawka.realVat) {
                        stawka.vatAlert = redAlert;
                        stawka.vatAlertError=true
                    } else {
                        stawka.vatAlert = {};
                        stawka.vatAlertError = false
                    }

                }
            });
        }

        function pzTkaninyDodaj(pz) {
            vm.dataObj.pzRozliczoneTkaniny.push(pz);
            pzDostPrzygotuj();
            pzPrzeliczIloscTkaniny();
        }

        function pzTkaninyUsun() {
            pzDostPrzygotuj();
            pzPrzeliczIloscTkaniny();
            pzPrzeliczWartosc();
        }

        function tableSearch() {
            if (vm.table.searchShow === true) {
                vm.table.searchText = '';
            }
            vm.table.searchShow = !vm.table.searchShow;
        }

    }
})();

