(function () {
    'use strict';

    angular
        .module('app')
        .controller('planningDetailCtrl', planningDetailCtrl);

    planningDetailCtrl.$inject = ['$filter', '$mdDialog', '$q', '$state', '$stateParams', 'commonFunctions', 'dataFactory'];

    function planningDetailCtrl( $filter, $mdDialog, $q, $state, $stateParams, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Planning';
        vm.subTitle = 'Planowanie produkcji, rezerwacja tkanin/pozycji magazynowych...';
        vm.objId = parseInt($stateParams.id);
        vm.isDetail = false;

        vm.getDataObj = getDataObj;
        vm.dataObj = {
            zamowieniaWybrane: [],
        };
        vm.chartPozMag = {
            options: {
                title: {
                    text: "Wielki tytuł",
                    display: true,
                    position:'top',
                    fontSize:16
                },
            }
        }


        vm.chartData=cF.chartData

        vm.danePomocnicze = {};
        vm.idzDo = idzDo;

        vm.materialBelkaChange = materialBelkaChange;
        vm.materialBelkaSprawdzWybrane = materialBelkaSprawdzWybrane;
        vm.materialBelkaCzyMaterialyPrzypisaneWszystkie = materialBelkaCzyMaterialyPrzypisaneWszystkie;
        vm.materialBelkaTextChanged = materialBelkaTextChanged;
        vm.materialZuzycieGrupaBelkaOk = materialZuzycieGrupaBelkaOk;
        vm.materialZuzycieGrupaDodaj = materialZuzycieGrupaDodaj;
        vm.materialZuzycieGrupaUsun = materialZuzycieGrupaUsun;
        vm.planning = {
            etapy: [],
            isLoading: false
        };

 //       vm.planningCanBeSave = true;
        

        vm.planningKalendarz = planningKalendarz;
        vm.planningKalendarzCP = planningKalendarzCP;
        vm.planningKalendarzDzienWybrany = planningKalendarzDzienWybrany;
        vm.planningKalendarzDzienListUpdate = planningKalendarzDzienListUpdate;
        vm.planningZapisz = planningZapisz;
        vm.planningCanBeSave = planningCanBeSave;

        vm.resetAll = resetAll;

        vm.tempOutputShow = false;


        vm.raport = {
            planningMaterial:[],
            dataRealizacji: new Date(),
            loading:false,
            minDate: new Date()
        };
        vm.zuzyciePrzelicz = zuzyciePrzelicz;

        vm.tablePlanning = {
            searchText: '',
            order: '-id',
            limit: 10,
            page: 1,
            searchShow: false,
            search: tableSearch,
            edit: idzDo
        };
        vm.tablePozycjaMagazynowa = {
            searchText: '',
            order: '-id',
            limit: 10,
            page: 1,
            searchShow: false,
            search: tableSearch,
            edit: idzDo
        };
        vm.tableZamowienie = {
            searchText: '',
            order: '-zamowienieId',
            limit: 10,
            page: 1,
            searchShow: false,
            search: tableSearch,
            edit: idzDo,
            onSelect: function (callback) {
                resetPlanning();
                resetZamowieniaWybrane();;
            },
            onDeselect: function (callback) {
                resetPlanning();
                resetZamowieniaWybrane();;
            },
            rowSelect: true,
            title: 'Dostępne zamówienia',
            
        };
        vm.zamowieniaBaza = zamowieniaBaza;
        vm.navDelete = navDelete;


        activate();


        vm.dataLoad = function () {
            console.log('load');
            if (vm.data===undefined) { return; }
            vm.dataObj = angular.fromJson(vm.data);
        }
        vm.dataSave = function () {
            console.log('save');
            var dane = angular.toJson(vm.dataObj);
            vm.data = dane;
        }


        function activate() {
            getDataObj();
            dataInit();
        }


        function dataInit() {
            vm.dataObj.planningStart = new Date(moment().add(1, 'week').day(1).hour(0));
        }

        function idzDo(param) {
            $state.go('planningDetail', { id: param });
        }

        function getDataObj() {
            if (vm.objId > 0) {
                dF.getData('planning/' + vm.objId).then(function (res) {
                    vm.title += " - szczegóły";
                    vm.dataObj = res;
                    vm.startMode = true;
                }, function (error) {
                    vm.startMode = false;
                    vm.isDetail = true;
                    cF.backTo('planning');
                })
            } else {
                vm.title+=" - tworzenie nowego"
                var pProdukcjaDzial = dF.getData('bazaJednostek/produkcjaDzial');
                var pProdukcjaDzialByPoziom = dF.getData('planning/produkcjaDzialByPoziom');
                $q.all([pProdukcjaDzial, pProdukcjaDzialByPoziom]).then(function (data) {
                    vm.danePomocnicze.produkcjaDzial = data[0];
                    vm.danePomocnicze.produkcjaDzialByPoziom = data[1];
                    vm.planning.planningStart = new Date(moment().startOf('week'));
                    vm.startMode = true;
                }, function (error) { console.log(error); })
            }
        }



        function materialBelkaChange(matGrupa, grupa, belka) {
            grupa.materialBelkaDost = materialBelkaSprawdzWybrane(matGrupa);
            grupa.zuzycieWartosc = parseFloat((grupa.zuzycie).replace(',','.'));

            grupa.belkaPrzypisanaPrawidlowo = materialBelkaPrzypisana(grupa);
            matGrupa.materialWszystkiePrzypisanePrawidlowo = materialBelkaCzyMaterialyPrzypisane(matGrupa);
            vm.dataObj.validTkaninyBelka = materialBelkaCzyMaterialyPrzypisaneWszystkie();
        }

        function materialBelkaDost(matGrupa, grupa) {
            var wybrane = materialBelkaSprawdzWybrane(matGrupa);
            var result = [];
            if (angular.isDefined(matGrupa.materialBelkaWybr)) {
                result = $filter('roznica')(matGrupa.materialBelkaDost, matGrupa.materialBelkaWybr, 'id', 'id');
            } else {
                result = matGrupa.materialBelkaDost;
            }
            if (angular.isDefined(grupa.belkaSearchText) && grupa.belkaSearchText !== "") {
                result = $filter('filter')(result, grupa.belkaSearchText);
            }
            return result;
        }

        function materialBelkaPrzypisana(grupa) {
            if (grupa.materialBelka !== null) {
                return grupa.materialBelka.stanAktualny >= grupa.zuzycieWartosc ? true : false;
            }
        }

        function materialBelkaSprawdzWybrane(matGrupa) {
            var wybrane = [];
            angular.forEach(matGrupa.planningMaterialBelka, function (matBelka) {
                if (matBelka.materialBelka !== null) {
                    wybrane.push(matBelka.materialBelka);
                }
            });
            return $filter('roznica')(matGrupa.materialBelkaDost, wybrane, 'id', 'id');
        }

        function materialBelkaTextChanged(matGrupa, grupa) {
            if (grupa.belkaSearchText == '') {
                grupa.materialBelka = null;
            }
            grupa.materialBelkaDost = materialBelkaSprawdzWybrane(matGrupa);
            grupa.belkaPrzypisanaPrawidlowo = materialBelkaPrzypisana(grupa);
            matGrupa.materialWszystkiePrzypisanePrawidlowo = materialBelkaCzyMaterialyPrzypisane(matGrupa);
            vm.dataObj.validTkaninyBelka = materialBelkaCzyMaterialyPrzypisaneWszystkie();
        }

        function materialZuzycieGrupaBelkaOk(matGrupa, grupa) {
            console.log(matGrupa);
        }

        function materialZuzycieGrupaDodaj(matGrupa, grupaEdit) {
            var dlgOpt = {
                templateUrl: 'app/common/dialogs/materialZuzycieGrupa.html',
                bindToController:true,
                locals: {
                    bazowy:angular.copy(matGrupa),
                    zuzyciePrzelicz: vm.zuzyciePrzelicz,
                    grupaEdit:angular.copy(grupaEdit)
                },
                controller: materialZuzycieGrupaCtrl,
                controllerAs:'vm',
            };

            $mdDialog.show(dlgOpt).then(function (response) {
                if (grupaEdit === undefined) {
                    matGrupa.planningMaterialBelka.push(response.grupaNowa);
                } else {
                    matGrupa.planningMaterialBelka[matGrupa.planningMaterialBelka.indexOf(grupaEdit)] = response.grupaNowa;
                }
                matGrupa.planningMaterialBelka[0] = response.grupaBaza;
            }, function (cancel) {

            });

            materialZuzycieGrupaCtrl.$inject=['$scope', '$filter', 'dataFactory'];
            function materialZuzycieGrupaCtrl($scope, $filter, dF){
                var vm = this;
                vm.contentHeight = 200;
                vm.grupaBaza = vm.bazowy.planningMaterialBelka[0];

                vm.filtruj = filtruj;
                vm.navSave = save;
                vm.navCancel = cancel;
                vm.obszycieAdd = obszycieAdd;
                vm.obszycieAddAll = obszycieAddAll;
                vm.obszycieDel = obszycieDel;
                vm.obszycieRemoveAll = obszycieRemoveAll;
                vm.zuzyciePrzeliczZuzycie = zuzyciePrzeliczZuzycie;


                if (vm.grupaEdit === undefined) {
                    vm.grupaNowa = {
                        baza: {
                            dlugosc: vm.grupaBaza.baza.dlugosc,
                            szerokosc: vm.grupaBaza.baza.szerokosc
                        },
                        listaObszyc: [],
                        zuzycie: 0
                    };
                } else {
                    vm.grupaNowa = vm.grupaEdit;
                }

                function filtruj(target) {
                    if (target.searchText === "") {return; } else {
                        target.listaObszyc = $filter('filter')(vm.bazowy.listaObszyc, target.searchText);
                    }
                }

                function obszycieAdd(obsz) {
                    vm.grupaNowa.listaObszyc.push(obsz);
                    vm.grupaNowa.status = cF.statusCheck('add', vm.grupaNowa);
                    vm.grupaBaza.listaObszyc.splice(vm.grupaBaza.listaObszyc.indexOf(obsz), 1);
                }

                function obszycieAddAll(grupa) {
                    angular.forEach(grupa, function (obszBaza) {
                        vm.grupaNowa.listaObszyc.push(obszBaza);
                    });
                    vm.grupaNowa.status = cF.statusCheck('add', vm.grupaNowa);
                    angular.forEach(angular.copy(grupa), function (obsz) {
                        for (var i = 0; i < vm.grupaBaza.listaObszyc.length; i++) {
                            var item = vm.grupaBaza.listaObszyc[i];
                            if (item.id === obsz.id) {
                                vm.grupaBaza.listaObszyc.splice(i, 1);
                                break;
                            }
                        }
                    });
                }


                function obszycieRemoveAll(grupa) {
                    angular.forEach(grupa, function (obszNowa) {
                        vm.grupaBaza.listaObszyc.push(obszNowa);
                    });
                    angular.forEach(angular.copy(grupa), function (obsz) {
                        for (var i = 0; i < vm.grupaNowa.listaObszyc.length; i++) {
                            var item = vm.grupaNowa.listaObszyc[i];
                            if (item.id === obsz.id) {
                                vm.grupaNowa.listaObszyc.splice(i, 1);
                                break;
                            }
                        }
                    });
                }

                function obszycieDel(obsz) {
                    vm.grupaBaza.listaObszyc.push(obsz);
                    vm.grupaNowa.listaObszyc.splice(vm.grupaNowa.listaObszyc.indexOf(obsz), 1);
                }

                function zuzyciePrzeliczZuzycie(grupa, listaObszyc) {
                    vm.inProgress = true;
                    var grupaToPost = {
                        baza: grupa.baza,
                        listaObszyc: listaObszyc,
                    };
                    dF.postData('zamowieniePomoc/zuzycieMaterialGrupa', grupaToPost).then(function (res) {
                        grupa.zuzycie = res.zuzycie;
                        vm.inProgress = false;
                    }, function (error) {
                        vm.inProgress = false;
                    });
                }

                function save() {
                    vm.zuzyciePrzelicz(vm.grupaNowa, vm.grupaNowa.listaObszyc);
                    vm.zuzyciePrzelicz(vm.grupaBaza, vm.grupaBaza.listaObszyc);
                    $mdDialog.hide({ grupaNowa: vm.grupaNowa, grupaBaza: vm.grupaBaza });
                }
                function cancel() {
                    $mdDialog.hide();
                }


            }

        }

        function materialZuzycieGrupaUsun(matGrupa, grupa) {
            cF.dialogTakNie(vm.title, "Czy na pewno usunąć grupę ?").then(function (ok) {
                angular.forEach(grupa.listaObszyc, function (obsz) {
                    matGrupa.planningMaterialBelka[0].listaObszyc.push(angular.copy(obsz));
                });
                vm.zuzyciePrzelicz(matGrupa.planningMaterialBelka[0]);
                matGrupa.planningMaterialBelka.splice(matGrupa.planningMaterialBelka.indexOf(grupa), 1);
            }, function (cancel) {

            });
        }

        function materialBelkaCzyMaterialyPrzypisane(matBelka) {
            var result = true;
            angular.forEach(matBelka.planningMaterialBelka, function (grupa) {
                if (grupa.belkaPrzypisanaPrawidlowo === false || grupa.belkaPrzypisanaPrawidlowo === undefined) {
                    result = false;
                }
            });
            return result
        }

        function materialBelkaCzyMaterialyPrzypisaneWszystkie() {
            var result = true;
            if (vm.dataObj.produkcjaDzial.czyTkaninaBelka === true && vm.dataObj.planningTkaniny) {
                if (vm.dataObj.planningTkaniny.length > 0) {
                    angular.forEach(vm.dataObj.planningTkaniny, function (grupa) {
                        if (grupa.materialWszystkiePrzypisanePrawidlowo === false || grupa.materialWszystkiePrzypisanePrawidlowo === undefined) {
                            result = false;
                        }
                    });
                }
            }
            return result;
        }

        function planningKalendarz() {

            resetPlanning();
            
            var dataToPost = {
                produkcjaDzial: vm.dataObj.produkcjaDzial,
                zamowieniaIds: [],
                dzienRoboczyZakres: {
                    czasStart: vm.dataObj.planningStart
                }
            };
            vm.isLoading = true;
            angular.forEach(vm.dataObj.zamowieniaWybrane, function (zamowienieWybr) {

                angular.forEach(zamowienieWybr.zamowienieKombiInfo.zamowienieKombi, function (zamKombi) {
                    dataToPost.zamowieniaIds.push(zamKombi.zamowienieKombiId);
                });
            });

            //pobierz sugerowany planning

            dF.postData('planning/planningKalendarz', dataToPost).then(function (res) {
                if (angular.isDefined(res.errors)) {
                    vm.dataObj.hasErrors = true;
                    vm.dataObj.errors = res.errors;
                    if (vm.dataObj.errors.length > 0) {
                        vm.isLoading = false;
                    }
                } else {
                    vm.dataObj.planningKalendarzZakres = res;
                    planningKalendarzDzienListUpdate();
                };
            }, function (error) {
                vm.isLoading = false;
            });

        }

        function planningKalendarzCP() {
            return vm.dataObj.zamowieniaWybrane.length > 0 &&
                    !vm.isLoading
        }

        function planningKalendarzDzienListUpdate() {
            vm.dataObj.planningKalendarzZakresWybrane = [];
            vm.dataObj.planningKalendarzRaportShort = [];
            vm.dataObj.planningPozycjeMagazynowe = [];
            vm.dataObj.planningTkaniny = [];

            var result = vm.dataObj.planningKalendarzZakresWybrane;
            var raportUpdate = {
                produkcjaDzial: vm.dataObj.produkcjaDzial,
                planningDniRobocze:[]
            };

            for (var i = 0; i < vm.dataObj.planningKalendarzZakresIdx; i++) {
                var dzien = vm.dataObj.planningKalendarzZakres.planningKalendarzDzienList[i];

                var resultOtp= {
                    dzienRoboczy: dzien.dzienRoboczy,
                    dzienRoboczyRefId: dzien.planningKalendarzDzien.dzienRoboczyRefId,
                    raportZaplanowane: dzien.planningKalendarzDzien.raportZaplanowane,
                    planningDzien:dzien.planningKalendarzDzien
                }

                var raportUpdateOtp = {
                    raportZaplanowane: dzien.planningKalendarzDzien.raportZaplanowane,
                    raportZaplanowaneStrata: dzien.planningKalendarzDzien.raportZaplanowaneStrata
                }


                raportUpdate.planningDniRobocze.push(raportUpdateOtp);
                result.push(resultOtp);
            }

            vm.dataObj.planningKalendarzRaportShort = [];
            dF.postData('planning/raportPrzelicz', raportUpdate).then(function (res) {
                vm.dataObj.planningKalendarzRaportShort = res.raport;
                vm.dataObj.planningPozycjeMagazynowe = res.pozycjeMagazynowe.pozycjeMagazynowe;
                vm.dataObj.czyPozycjeMagazynoweZapewnione = res.pozycjeMagazynowe.czyPozycjeMagazynoweZapewnione;
                
                vm.raport.planningMaterial = res.tkaniny;
                vm.dataObj.planningTkaniny = res.tkaniny;
                vm.isLoading = false;
                
            }, function (error) {
                vm.isLoading = false;
            });
            
        }

        function planningKalendarzDzienWybrany(dzien) {
            if (!angular.isDefined(vm.dataObj.planningKalendarzDni)) {
                vm.dataObj.planningKalendarzDni = [];
            }
            var result = vm.dataObj.planningKalendarzDni;


            var idx = result.indexOf(dzien);
            if (idx < 0) {
                result.push(dzien)
            } else {
                result.splice(idx, 1);
            }

//            console.log(dzien);
        }

        function planningZapisz() {
            vm.isLoading = true;
            var dataToPost = {
                produkcjaDzial: vm.dataObj.produkcjaDzial,
                planningKalendarzZakres: vm.dataObj.planningKalendarzZakresWybrane,
                tkaninaBelka: vm.dataObj.planningTkaniny,
                pozycjaMagazynowa: vm.dataObj.planningPozycjeMagazynowe
            }

            dF.postData('planning', dataToPost).then(function (res) {
                console.log(res);
                $state.go('planning');
            }, function (error) {
                console.log(error);
                vm.isLoading = false;
            });
        }

        function planningCanBeSave() {

            var ifBelki = vm.dataObj.produkcjaDzial.czyTkaninaBelka === true ? materialBelkaCzyMaterialyPrzypisaneWszystkie() : false;
            var ifPozMag = vm.dataObj.produkcjaDzial.czyPozycjaMagazynowa === true && angular.isDefined(vm.dataObj.czyPozycjeMagazynoweZapewnione) ? vm.dataObj.czyPozycjeMagazynoweZapewnione : false

            var res = ifBelki || ifPozMag === true ? false: true;
            return res;
        }
 






        


        function resetAll() {
            resetPlanning();
            resetZamowieniaWybrane();
            vm.dataObj.zamowieniaWybrane = [];
            vm.dataObj.zamowieniaBaza = [];
            vm.dataObj.planningInProgress = false;
        }

        function resetPlanning() {
            vm.dataObj.czyPozycjeMagazynoweZapewnione = undefined;
            vm.dataObj.planningKalendarzRaportShort = [];
            vm.dataObj.hasErrors = false;
            vm.dataObj.planningKalendarzZakres = null;
            vm.dataObj.planningKalendarzZakresWybrane = [];
            vm.dataObj.planningKalendarzZakresIdx = 1;

            vm.dataObj.planningTkaninaBelka = [];
            vm.dataObj.planningPozycjeMagazynowe=[];
        }

        function resetZamowieniaWybrane() {
            vm.dataObj.zamowieniaRaportLoaded = false;
        }



        function tableSearch() {
            console.log(this);
            if (this.searchShow === true) {
                this.searchText = '';
            }
            this.searchShow = !this.searchShow;
        }

        function navDelete() {
            cF.dialogTakNie('Czy na pewno usunąć planning Id: ' + vm.objId + ' ('+vm.dataObj.produkcjaDzial.nazwa+')', 'Zostaną usunięte wszelkie zapisy dotyczące planningu; przypisane belki tkanin, zarezerwowane pozycje magazynowe oraz zostaną zmienione statusy dni roboczych by ponownie mogły być zaplanowane').then(function (ok) {
                vm.isLoading = true;
                console.log('usun');
                dF.deleteData('planning/' + vm.objId).then(function (res) {
                    console.log(res);
                    $state.go('planning');
                }, function (error) { console.log(error); vm.isLoading = true; });
            }, function (nie) {
                vm.isLoading = false;
            })

            }

        function wybraneToArr(){
            var result=[];
            angular.forEach(vm.dataObj.zamowieniaWybrane, function(wybr){
                result.push(wybr.zamowienieId);
            });

            return result;
        }

        function zuzyciePrzelicz(baza) {
            if (angular.isUndefined(baza.isLoading)) {
                baza.isLoading = true;
            }
            baza.isLoading = true;
            dF.postData('zamowieniePomoc/zuzycieMaterialGrupa', baza).then(function (res) {
                baza.zuzycie = res.zuzycie;
                baza.isLoading = false;
            }, function (responseError) {

            });
        }

        function zamowieniaBaza() {
            vm.isLoading = true;
            vm.dataObj.zamowieniaRaportLoaded = false;
            dF.postData('zamowienie/ZamowieniaBazaPlanning', vm.dataObj.produkcjaDzial).then(function (res) {
                vm.dataObj.zamowieniaBaza = res.zamowienia;
                vm.isLoading = false;
                vm.dataObj.planningInProgress = true;
            }, function (error) {
                vm.isLoading = false;
            });
            return;
        }

    }
})();
