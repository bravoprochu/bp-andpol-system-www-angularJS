(function () {
    'use strict';

    angular
        .module('app')
        .controller('magPozycjaMagazynowaDetailCtrl', magPozycjaMagazynowaDetailCtrl);

    magPozycjaMagazynowaDetailCtrl.$inject = ['$filter','$mdDialog','$q','$state', '$stateParams',  'commonFunctions', 'dataFactory', 'statusCheck'];

    function magPozycjaMagazynowaDetailCtrl($filter, $mdDialog, $q, $state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Pozycja magazynowa';
        vm.subTitle = 'Ewidencja towarów - edycja/tworzenie';


        vm.danePomocnicze = {};
       
        vm.screenSmall = cF.isScreenSmall();

        vm.navZapisz = navZapisz;

        vm.dataObj = {};


        vm.objId = parseInt($stateParams.id);
        vm.przyjecieZewnetrzneIdzDo=przyjecieZewnetrzneIdzDo;

        vm.rozchodInneAdd = rozchodInneAdd;
        vm.rozchodPrzeliczWartosci = rozchodPrzeliczWartosci;
        vm.rozchodZaktualizujDane = rozchodZaktualizujDane;

        vm.startMode = false;

        vm.tablePrzyjecieZewnetrzne = {
            searchText: '',
            order: '-dataWplywu',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: function () {
                if (this.searchShow === true) {
                    this.searchText = '';
                }

                this.searchShow = !this.searchShow;
            }
        };

        vm.tableRozchod = {
            searchText: '',
            order: '-dataRozchodu',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: function () {
                if (this.searchShow === true) {
                    this.searchText = '';
                }

                this.searchShow = !this.searchShow;

            },
            edit: rozchodInneAdd,
            del:rozchodInneDel
        };

        vm.tableWz = {
            searchText: '',
            order: '-magWzId',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: function () {
                if (this.searchShow === true) {
                    this.searchText = '';
                }

                this.searchShow = !this.searchShow;
            },
        };

        vm.tableZakupy = {
            searchText: '',
            order: '-dataSprzedazy',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: function () {
                if (this.searchShow === true) {
                    this.searchText = '';
                }

                this.searchShow = !this.searchShow;
            },
        };

        vm.usun = usun;
        vm.zakupyIdzDo = zakupyIdzDo;

        activate();

        function activate() {
            getById();
        }

        function getById() {

            var pJednostkaMiary = dF.getData("bazaJednostek/jednostkaMiary");
            var pGrupaZakladowa = dF.getData("bazaJednostek/grupaZakladowa");
            var pPodatekSkladka = dF.getData("bazaJednostek/podatekStawka");
            var pMarzaZakladowa = dF.getData("bazaJednostek/marzaZakladowa");
            var pRozchodMagRodzaj = dF.getData("bazaJednostek/rozchodMagRodzaj");


            $q.all([pJednostkaMiary, pGrupaZakladowa, pPodatekSkladka, pMarzaZakladowa, pRozchodMagRodzaj])
                .then(function (result) {

                vm.danePomocnicze.jednostkaMiary = result[0];
                vm.danePomocnicze.grupaZakladowa = result[1];
                vm.danePomocnicze.podatekStawka = result[2];
                vm.danePomocnicze.marzaZakladowa = result[3];
                vm.danePomocnicze.rozchodMagRodzaj = result[4];

                if (vm.objId === 0) {
                    vm.dataObj = {
                        status: "nowy",
                        typTowaru: 2,
                        rozchodInne:[]
                    };
                    vm.startMode = true;
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                } else {


                    var dataResult=$state.current.name === "magPozycjaMagazynowaDetail" ?
                           dataResult = dF.getData("magPozycjaMagazynowa/"+ vm.objId) :
                           dataResult = dF.getData("magPozycjaMagazynowa/magazynier/"+vm.objId);

                    dataResult.then(function (data) {
                        vm.dataObj = data;
                        vm.tablePrzyjecieZewnetrzne.rowLimitOpt = data.przyjecieZewnetrzne.length > 100 ? [10, 30, 100, data.przyjecieZewnetrzne.length] : [10, 30, 100];
                        vm.tableRozchod.rowLimitOpt = data.rozchodInne.length > 100 ? [10, 30, 100, data.rozchodInne.length] : [10, 30, 100];
                        if (data.zakupy != null) {
                            vm.tableZakupy.rowLimitOpt = data.zakupy.length > 100 ? [10, 30, 100, data.zakupy.length] : [10, 30, 100];
                        };
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                        vm.startMode = true;

                    }, cF.error);
                }
//$q.all error..
                }, cF.error);





        }

        function navZapisz() {
            vm.navZapiszDisabled = true;
            cF.dialogTakNie(vm.title, "Czy na pewno zapisać dane Pozycji magazynowej ?").then(function () {
                dF.putData("magPozycjaMagazynowa/"+ vm.objId, vm.dataObj).then(function (response) {
                    vm.navIdzDo();
                }, function (error) {
                    console.log(error);
                });
            }, function (error) {
                console.log(error);
            });


        }

        function przyjecieZewnetrzneIdzDo(whereTo) {
            $state.go('magPZDetail', { id: whereTo });
        }

        function rozchodInneAdd(data, mode) {

            mode = angular.isDefined(mode) ? mode : "new";
            data = angular.isDefined(data) ? data : {};

            data.jednostkaMiary = vm.dataObj.jednostkaMiary;

            $mdDialog.show({
                controller: rozchodInneCtrl,
                controllerAs: 'vm',
                bindToController: true,
                locals: {
                    dataToPass: data,
                    danePomocnicze: vm.danePomocnicze.rozchodMagRodzaj,
                    mode:mode,
                    stany: vm.dataObj.stan,
                    userName:cF.userName()
                },
                templateUrl: 'app/common/dialogs/rozchodInne.html',
                parent: angular.element(document.body),

                clickOutsideToClose: true
            })
            .then(function (result) {
                if (angular.isUndefined(result)) { return; }
                vm.formMain.$setDirty();
                result.status = statusCheck.check("mod", result);
                result = result.mode == "edit" ? rozchodZaktualizujDane(result, vm.dataObj.rozchodInne) : dodajNowy();

                vm.dataObj.stanTempShow = true;

                vm.dataObj.stan.stanAktualnyTemp = vm.dataObj.stan.razemPz - rozchodPrzeliczWartosci(vm.dataObj.rozchodInne);
                vm.dataObj.stan.razemRozchodInneTemp = rozchodPrzeliczWartosci(vm.dataObj.rozchodInne);
                
                
                function dodajNowy() {
                    vm.dataObj.rozchodInne.push(result);
                }
            }, function (cancel) {
            });
            
            
            
            
            function rozchodInneCtrl() {
                var vm=this;
                vm.title = "";

                vm.dane = angular.copy(vm.locals.dataToPass);
                vm.dane.createdBy = vm.locals.userName;
                vm.dane.stanAktualny = vm.locals.stany.stanAktualny.toFixed(2);

                vm.stanMin = (vm.locals.stany.razemRozchodInne) * -1;
                vm.stanMax = vm.locals.stany.stanRzeczywisty;

                if (vm.locals.mode == 'new') {
                    var d = new Date();
                    vm.dane.dataRozchodu = d;
                    vm.dane.id = d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
                    
                    if (angular.isDefined(vm.locals.stany.razemRozchodInneTemp)) {
                        vm.stanMax = vm.locals.stany.stanAktualnyTemp;
                        vm.stanMin = vm.locals.stany.razemRozchodInneTemp * -1;
                        vm.dane.stanAktualny = vm.locals.stany.stanAktualnyTemp.toFixed(2);
                    }
                }

                if (vm.locals.mode == 'edit') {
                    var wart = angular.copy(vm.dane.wartosc);
                    vm.stanMax = wart+vm.locals.stany.stanAktualnyTemp;
                    vm.stanMin = (wart + vm.locals.stany.razemRozchodInne) * -1;
                    vm.dane.stanAktualny = vm.locals.stany.stanAktualnyTemp.toFixed(2);
                }

                vm.navCancel = navCancel;
                vm.navSave = navSave;

                if (mode == "new") { vm.title = "Nowy rozchód"; vm.dane.mode = 'new'; }
                if (mode == "edit") { vm.title = "Edycja rozchodu"; vm.dane.mode = 'edit';}


                function navCancel() {
                    $mdDialog.hide();
                }

                function navSave() {
                    $mdDialog.hide(vm.dane);
                }

        };

            
        }




        function rozchodInneDel(data) {
            var idx = vm.dataObj.rozchodInne.indexOf(data);
            vm.dataObj.rozchodInne.splice(idx, 1);
            vm.dataObj.stan.stanAktualnyTemp = vm.dataObj.stan.razemPz - rozchodPrzeliczWartosci(vm.dataObj.rozchodInne);
            vm.dataObj.stan.razemRozchodInneTemp = 0-rozchodPrzeliczWartosci(vm.dataObj.rozchodInne);
        }


        function rozchodPrzeliczWartosci(collRef) {
            var result = 0;
            angular.forEach(collRef, function (poz) {
                result += poz.wartosc;
            });
            return result;
        }

        function rozchodZaktualizujDane(data, collRef) {
            for (var i = 0; i < collRef.length; i++) {
                if (collRef[i].id == data.id) {
                    var wartoscOld = collRef[i].wartosc;
                    collRef[i] = angular.copy(data);
                }
            }
        }

        function usun() {
            dialogsService.confirm("Usuń", 'Czy na pewno chcesz usunąć ' + vm.dataObj.nazwa + ' ?')
                    .then(function () {
                        dF.deleteData("magPozycjaMagazynowa/"+ vm.objId).then(function (response) {
                            vm.navIdzDo();
                        }, function (error) {
                        });
                    }, function () {

                    });
        }

        function zakupyIdzDo(whereTo) {
            $state.go("fakturaZakupuDetail", { id: whereTo });
        }

    }
})();
