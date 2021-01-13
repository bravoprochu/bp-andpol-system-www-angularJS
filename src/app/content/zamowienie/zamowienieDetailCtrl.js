(function () {
    'use strict';

    angular
        .module('app')
        .controller('zamowienieDetailCtrl', zamowienieDetailCtrl);

    zamowienieDetailCtrl.$inject = ['$filter', '$state', '$stateParams', '$q', 'commonFunctions', 'dataFactory', 'qrCodeGen', 'statusCheck'];

    function zamowienieDetailCtrl($filter, $state, $stateParams, $q, cF, dF, qrCodeGen, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Zamówienie - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.danePomocnicze = {};

        vm.dealerSearchFilter = [];
        vm.dealerSearchTextChange = dealerSearchTextChange;


        vm.dealerDostawaChange = dealerDostawaChange;
        vm.dealerDostawaSearchTextChange = dealerDostawaSearchTextChange;
        vm.dealerDostawaSearchFilter = [];


        vm.dealerUtworzNowego = dealerUtworzNowego;
        vm.dealerChange = dealerChange;


        vm.navZapisz = navZapisz;
        vm.navDelete = navDelete;

        vm.normaKombiMaterialChange = normaKombiMaterialChange;
        vm.normaKombiMaterialDomyslnyChange = normaKombiMaterialDomyslnyChange;
        vm.normaKombiMaterialList = normaKombiMaterialList;
        vm.normaKombiObszycieChange = normaKombiObszycieChange;
        vm.normaKombiWykonczenieChange = normaKombiWykonczenieChange

        vm.normaKombiDodaj = normaKombiDodaj;
        vm.normaKombiUsun = normaKombiUsun;
        vm.normaKombiElementy = {
            obszycie: [],
        };
        vm.normaSearch = normaSearch;
        vm.normaWybierz = normaWybierz;

        vm.dataObj = {
            dataZamowienia: new Date(),
            kontrahent: {
                dealer: {}
            },
            nazwa: '',
            uwagi: '',
            requireDeliver: false,
            Ilosc: 1,
            kombinacje: [],
            status: "nowy"
        };
        vm.objId = parseInt($stateParams.id);
        vm.qrCodeGen = vm.objId > 0 ? true : false;
        vm.qrCodeGenFn = qrCodeGenFn;
        vm.requireDeliverChange = requireDeliverChange;
        vm.szablonPrzygotuj = szablonPrzygotuj;
        vm.szablon = {
            materialDomyslnyChange: szablonMaterialDomyslnyChange,
            obszycie: [],
            wykonczenie: [],
            zastosuj: szablonZastosuj
        };

        vm.startMode = false;
        vm.usun = usun;

        //        =========================================-------------------------------------=============================================

        activate();

        function activate() {
            getById();
        }


        function dealerSearchTextChange() {

            vm.dealerSearchFilter = [];
            vm.dealerSearchFilter = $filter('filter')(vm.danePomocnicze.dealer, { czyAdresDostawy: false, $: vm.dealerSearchText });
        }

        function dealerDostawaSearchTextChange() {
            if (!vm.dataObj.dealer) return;
            vm.dealerDostawaSearchFilter = $filter('filter')(vm.danePomocnicze.dealer, { czyAdresDostawy: true, nazwa: vm.dataObj.dealer.nazwa, kontrahentRefId: vm.dataObj.dealer.kontrahentRefId });
            vm.dealerDostawaSearchFilter = $filter('filter')(vm.dealerDostawaSearchFilter, { $: vm.dealerDostawaSearchText});
        }



        function dealerUtworzNowego() {
            $state.go('kontrahent');
        }

        function dealerChange() {
            vm.dataObj.dealerDostawa = null;
            if (vm.dataObj.dealer == null) return;
            vm.dealerDostawaSearchFilter = $filter('filter')(vm.danePomocnicze.dealer, { czyAdresDostawy: true, nazwa: vm.dataObj.dealer.nazwa, kontrahentRefId: vm.dataObj.dealer.kontrahentRefId });
            var dealer = vm.dataObj.dealer;
            vm.dataObj.kontrahent.dealer = dealer;
            
            dF.getData("zamowieniePomoc/GetKontrahentDetail/"+ dealer.kontrahentRefId ).then(function (dane) {
                vm.dataObj.kontrahent = dane.kontrahent;
                vm.danePomocnicze.material = dane.material;
                vm.dataObj.kombinacje = [];
            });
        }

        function dealerDostawaChange()
        {
            

        }

        function getById() {
            var pNormy = dF.getData("zamowieniePomoc/GetNormy");
            var pDealers = dF.getData("zamowieniePomoc/GetDealers");
            var pWykonczenieGrupa = dF.getData("wykonczenieGrupa");

            $q.all([pNormy, pDealers, pWykonczenieGrupa])
                .then(function (data) {
                    vm.danePomocnicze.normy = data[0];
                    vm.danePomocnicze.dealer = data[1];
                    vm.danePomocnicze.wykonczenieGrupa = data[2];
                    vm.normaKombiElementy.wypychDost = angular.copy(vm.danePomocnicze.wypych);

                    vm.dataObj.createdBy = cF.userName();

                    if (vm.objId === 0) {

                        vm.dataObj.dataZamowienia = new Date();
                        vm.dataObj.dataRealizacji = new Date(moment().add(4, 'w'));
                        vm.dataObj.ilosc = 1;
                        vm.startMode = true;
                        vm.dataObjCopy = angular.copy(vm.dataObj);

                    } else {
                        dF.getData("zamowienie/" + vm.objId).then(function (data) {
                            var result = data.result;
                            var material = data.material;
                            vm.dataObj = result;
                            vm.danePomocnicze.material = material;
                            vm.dataObj.dataZamowienia = new Date(vm.dataObj.dataZamowienia);
                            vm.dataObj.dataRealizacji = new Date(vm.dataObj.dataRealizacji);

                            vm.danePomocnicze.norma = angular.copy(result.norma);
                            vm.normaSelected = angular.copy(result.norma);
                            vm.navCanDelete = true;
                            kombinacjaPrepLp()
                            vm.startMode = true;
                            vm.dataObjCopy = angular.copy(vm.dataObj);
                            normaKombiNazwyKombinacjiIsDisabled()
                        }, function (error) {
                        });
                    }


                }, function (error) {
                    console.log("$q.All error: ");
                    console.log(error);
                });

            function kombinacjaPrepLp() {
                var idx = 1;
                angular.forEach($filter('orderBy')(vm.dataObj.kombinacje, 'zamowienieKombiId'), function (k) {
                    k.lp = idx;
                    idx++
                })
            }
        }

        function navZapisz() {
            vm.inProgress = true;
            vm.navZapiszDisabled = true;
            dF.putData("zamowienie/"+ vm.objId, vm.dataObj).then(function (response) {
                vm.navZapiszDisabled = false;
                vm.navIdzDo();

            }, function (error) {
            });
        }

        function navDelete() {
            cF.dialogTakNie('Czy na pewno usunąć całe zamówienie ? ').then(function (ok) {
                dF.deleteData('zamowienie/' + vm.objId).then(function (res) {
                    vm.navIdzDo();
                }, cF.error);

            }, function (cancel) { });
        }

        function normaKombiMaterialChange(mat, parent, kombi) {
            console.log('change...');

            if (angular.isDefined(mat) && angular.isDefined(mat)) {
                parent.materialRefId = mat.id;
            } else {
                parent.materialRefId = null;
            }
        }

        function normaKombiMaterialDomyslnyChange(mat, kombi) {
            if (angular.isDefined(mat) && angular.isDefined(kombi)) {
                angular.forEach(kombi.kombinacjaObszycie, function (obsz) {
                    console.log(obsz);
                    obsz.status = statusCheck.check('mod', obsz);
                    obsz.material = mat;
                });
            }
        }

        function normaKombiMaterialList(searchText) {
            if (searchText === null) { return vm.danePomocnicze.material; }
            return $filter('filter')(vm.danePomocnicze.material, searchText);
        }

        function normaKombiDodaj(wybranaKombi) {
            var kombi = angular.copy(wybranaKombi);
            kombi.status = statusCheck.check('add', kombi);
            kombi.lp = vm.dataObj.kombinacje.length + 1;
            vm.dataObj.kombinacje.push(kombi);
            normaKombiNazwyKombinacjiIsDisabled()
            vm.szablon.szablonPokaz = false;
            normaKombiWartosciDomyslne(kombi);
        }

        function normaKombiNazwyKombinacjiIsDisabled()
        {
            var lastKombi = vm.dataObj.kombinacje;
            var lastChar="A"
            if (lastKombi.length > 0) {
                lastKombi = lastKombi[lastKombi.length - 1];
                lastChar = lastKombi.nazwaKombinacji.nazwa.charAt(lastKombi.nazwaKombinacji.nazwa.length - 1);
            }
            var dostKombi = vm.danePomocnicze.norma.kombinacje;


            angular.forEach(dostKombi, function (k) {
                    var firstChar = k.nazwaKombinacji.nazwa.charAt(0);
                    if (lastChar == "-") {
                        k.isDisabled = firstChar == "-" ? false : true;
                    } else {
                        k.isDisabled = firstChar == "-" ? true: false;
                    }
            });
        }

        function normaKombiObszycie(dane) {
            angular.forEach(vm.normaDetail.kombinacje, function (kombiOrg) {
                if (kombiOrg.kombinacjaId == dane.kombinacjaId) {
                    var obsz = kombiOrg.kombinacjaObszycie;
                    for (var i = 0; i < obsz.length; i++) {
                        var tmp = {};
                        tmp.materialRefId = null;
                        tmp.nazwaMaterialu = null;
                        tmp.nazwaWykonczenia = obsz[i].nazwaWykonczenia;
                        tmp.status = "nowy";
                        tmp.uwagi = null;
                        tmp.wykonczenieRefId = obsz[i].wykonczenieRefId;
                        tmp.zamowienieKombiRefId = obsz[i].kombinacjaId;
                        dane.kombinacjaObszycie.push(tmp);
                    }

                }
            });
        }

        function normaKombiObszycieChange(obsz, kombi) {
            obsz.status = statusCheck.check('mod', obsz);
            kombi.status = statusCheck.check('mod', kombi);
            vm.formMain.$setDirty();
        }

        function normaKombiUsun(kombinacja) {

            cF.dialogTakNie('Kombinacja zamówienia', 'Czy na pewno chcesz usunąć ?').then(function () {
                angular.forEach(vm.normaKombiElementy, function (value, key) {
                    if (angular.isDefined(kombinacja[key])) {
                        angular.forEach(kombinacja[key], function (elem) {
                            elem.status = statusCheck.check('del', elem);
                        });
                    }
                });

                angular.forEach(kombinacja.kombinacjaObszycie, function (ko) {
                    ko.status = statusCheck.check('del', ko);
                });

                angular.forEach(kombinacja.kombinacjaWykonczenie, function (wyk) {
                    wyk.status = statusCheck.check('del', wyk);
                })

                kombinacja.status = statusCheck.check("del", kombinacja);

                if (kombinacja.status != "usuniety") {
                    var idx = vm.dataObj.kombinacje.indexOf(kombinacja);
                    vm.dataObj.kombinacje.splice(idx, 1);
                }
                vm.formMain.$setDirty();
                if (vm.szablon.szablonPokaz) { vm.szablonPrzygotuj(); }
                vm.szablon.szablonPokaz = false;
            });
        }

        function normaKombiWykonczenieChange(opcja) {
            opcja.status = statusCheck.check('mod', opcja);
        }

        function normaKombiWartosciDomyslne(kombi) {
            angular.forEach(kombi.kombinacjaWykonczenie, function (wyk) {
                wyk.wykonczenieRefId = wyk.wykonczenieOpcje[0].wykonczenieId;
            });
        }

        function normaSearch() {
            if (vm.normaSearchText === null) return;
            var result = $filter('filter')(vm.danePomocnicze.normy, vm.normaSearchText);
            return $filter('orderBy')(result, 'nazwa');

        }

        function normaWybierz(norma) {
            if (angular.isDefined(vm.normaSearchText) && angular.isDefined(norma)) {
                dF.getData("zamowieniePomoc/getNormaDetail/"+norma.id).then(function (data) {
                    vm.dataObj.kombinacje = [];
                    vm.danePomocnicze.norma = data;
                    vm.dataObj.norma = data;
                    normaKombiNazwyKombinacjiIsDisabled();
                });
            }
        }

        function qrCodeGenFn() {
            var kombiRaport = listaKombinacji();
            var terminRealizacji = vm.dataObj.terminRealizacji !== null ? ']\n DueDate: [' + vm.dataObj.dataRealizacji.toLocaleDateString() : ']';

            var qrCode = {
                nazwa: 'Zam: ' + vm.dataObj.zamowienieNr + ', - ref: ' + vm.dataObj.reference,
                grupa: $state.current.name,
                uwagi: '\n Comm: [' + vm.dataObj.commission + ']\n Order: [' + vm.dataObj.dataZamowienia.toLocaleDateString() + terminRealizacji + ']\n kombi: [' + kombiRaport + ']'
            };

                return qrCodeGen.qrCodeBasketAdd(qrCode).then(function (ok) {
                    vm.navIsOpen = false;
                }, cF.error);

     

            function listaKombinacji() {
                var baza = $filter('orderBy')(vm.dataObj.kombinacje, 'zamowienieKombiId');
                var result = [];
                console.log(result);
                for (var i = 0; i < baza.length; i++) {
                    var kombi = baza[i];
                    result.push(kombi.nazwaKombinacji.nazwa);
                }
                return result;
            }
        }

        function przygotujKombinacje(dane) {
            angular.forEach(dane.kombinacje, function (d) {
                statusCheck.przygotujDostepneWykonczenie(d.wykonczenieBoczka, d.wykonczenieBoczkaDost);
                statusCheck.przygotujDostepneWykonczenie(d.wykonczenieDeski, d.wykonczenieDeskiDost);
                statusCheck.przygotujDostepneWykonczenie(d.wykonczenieNozki, d.wykonczenieNozkiDost);
                d.wypychDost = angular.copy(vm.danePomocnicze.wypych);
            });

        }

        function przygotujNormy(id) {
            normaWybierz(id);
            for (var i = 0; i < vm.danePomocnicze.normy.length; i++) {
                if (vm.danePomocnicze.normy[i].id == id) {
                    return vm.danePomocnicze.normy[i];
                }
            }

            return;
        }

        function requireDeliverChange() {
            if (vm.dataObj.requireDeliver) {
                if (vm.dataObj.dataRealizacji !== null) {
                    vm.dataObj.dataRealizacji = new Date(vm.dataObj.dataRealizacji);
                    return;
                } else {
                    var d = new Date();
                    vm.dataObj.dataRealizacji = new Date();
                    return;
                }
            }
            vm.dataObj.dataRealizacji = null;
        }

        function szablonMaterialDomyslnyChange() {
            if (angular.isUndefined(vm.szablon.materialSelected)) { return; }
            angular.forEach(vm.szablon.obszycie, function (obszycie) {
                obszycie.material = vm.szablon.materialSelected;
                obszycie.status = statusCheck.check('mod', obszycie);
            });
        }

        function szablonPrzygotuj() {
            if (!vm.szablon.szablonPokaz) { return; }

                vm.szablon.szablonPokaz=true,
                vm.szablon.obszycie=[],
                vm.szablon.obszycieIds=[],
                vm.szablon.wykonczenie= [],
                vm.szablon.wykonczenieIds= [],

            
            angular.forEach(vm.dataObj.kombinacje, function (kombi) {
                var obszycie = kombi.kombinacjaObszycie;
                //obszycia
                angular.forEach(kombi.kombinacjaObszycie, function (obsz) {
                    var czyJestObsz = vm.szablon.obszycieIds.indexOf(obsz.obszycieRefId);
                    if (czyJestObsz < 0) {
                        var obszToPush = {
                            material: null,
                            obszycieNazwa: obsz.obszycieNazwa,
                            obszycieRefId: obsz.obszycieRefId,
                        }
                        vm.szablon.obszycie.push(angular.copy(obszToPush));
                        vm.szablon.obszycieIds.push(obsz.obszycieRefId);
                    }
                });

                //wykonczenia
                angular.forEach(kombi.kombinacjaWykonczenie, function (wyk) {
                    var czyJestGrupa = vm.szablon.wykonczenieIds.indexOf(wyk.wykonczenieGrupa.wykonczenieGrupaId);
                    if (czyJestGrupa < 0) {
                        var wykToPush = {
                            wykonczenieGrupa: angular.copy(wyk.wykonczenieGrupa),
                            wykonczenieOpcje: angular.copy(wyk.wykonczenieOpcje)
                        }
                        vm.szablon.wykonczenie.push(angular.copy(wykToPush));
                        vm.szablon.wykonczenieIds.push(wyk.wykonczenieGrupa.wykonczenieGrupaId);
                    }
                });


            });
        }

        function szablonZastosuj() {
            if (vm.dataObj.kombinacje.length == 0 || vm.szablon == undefined) { return; }

            angular.forEach(vm.dataObj.kombinacje, function (kombi) {

                //obszycie
                angular.forEach(kombi.kombinacjaObszycie, function (obsz) {
                    var foundInSzablon = vm.szablon.obszycieIds.indexOf(obsz.obszycieRefId);
                    if (foundInSzablon > -1) {
                        obsz.material = vm.szablon.obszycie[foundInSzablon].material;
                        obsz.uwagi = vm.szablon.obszycie[foundInSzablon].uwagi;
                        obsz.status = cF.statusCheck('mod', obsz);
                    };
                });

                //wykonczenia
                angular.forEach(kombi.kombinacjaWykonczenie, function (wyk) {
                    var foundInSzablonGrupa = vm.szablon.wykonczenieIds.indexOf(wyk.wykonczenieGrupa.wykonczenieGrupaId);
                    if (foundInSzablonGrupa > -1) {
                        //grupaFound
                        var wykSzablon = vm.szablon.wykonczenie[foundInSzablonGrupa];
                        var wykOpcjaIdx = cF.findInArr(wyk.wykonczenieOpcje, wykSzablon.wykonczenieRefId, "wykonczenieId");
                        if (wykOpcjaIdx > -1) {
                            wyk.kombinacjaWykonczenieRefId = wyk.wykonczenieOpcje[wykOpcjaIdx].kombinacjaWykonczenieRefId;
                            wyk.status = cF.statusCheck('mod', wyk);
                        }
                    }
                });
            });
        }

        function usun() {

            dF.deleteData("zamowienie/" + vm.objId).then(function (response) {
                console.log(vm.objId);
                //vm.navIdzDo();
            }, function (error) {
            });
        }

    }
})();

