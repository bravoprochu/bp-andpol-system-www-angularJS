(function () {
    'use strict';

    angular
        .module('app')
        .controller('magPzDetailCtrl', magPzDetailCtrl);

    magPzDetailCtrl.$inject = ['$filter','$mdMedia', '$mdDialog','$state', '$stateParams', '$q', 'commonFunctions', 'currentUser', 'dataFactory', 'statusCheck'];

    function magPzDetailCtrl($filter, $mdMedia,$mdDialog, $state, $stateParams, $q, cF, currentUser, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'PZ - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.danePomocnicze = {
            dokumentTyp:[],
        };


        //vm.idzDo = idzDo;
        vm.isSmall = cF.isScreenSmall();

        vm.korektaAnuluj = korektaAnuluj;
        vm.korektaNew = false;
        vm.korektaUtworz = korektaUtworz;


        vm.korektaTable = {
            searchText: '',
//            order: 'pozycjaMagazynowa.nazwa',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: tableSearch,
            del: magPzPozycjaDelete,
            edit: magPZPozycjaEdytuj,
            save: magPZPozycjaSave,
        };
        

        vm.magazyn = {
            dane: function () {return magPozycjaMagazynowaLista; }
        };
        vm.dataObj = {};

        vm.navDelete = navDelete;
        vm.navZapisz = navZapisz;

        vm.magPZPozycjaDodaj = magPZPozycjaDodaj;
        vm.magPozycjaMagazynowaCreate = magPozycjaMagazynowaCreate;

        vm.objId = parseInt($stateParams.id);
        vm.pozycjaMagazynowaDane = pozycjaMagazynowaDane;

        vm.startMode = false;

        vm.table = {
            searchText: '',
            limit: 10,
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchShow: false,
            search: tableSearch,
            del:magPzPozycjaDelete,
            edit: magPZPozycjaEdytuj,
            save: magPZPozycjaSave,
        };

        //        =========================================-------------------------------------=============================================

        activate();

        function activate() {
            getById();
        }



        function getById() {

            var pKontrahenci = dF.getData("kontrahent/SmallList");
            var pPozycjaMagazynowa = dF.getData("magPozycjaMagazynowa/SmallList");
            var pJednDokumentTyp = dF.getData("bazaJednostek/dokumentTyp");
            var pJednostkaMiary = dF.getData("bazaJednostek/jednostkaMiary");
            var pGrupaZakladowa = dF.getData("bazaJednostek/grupaZakladowa");
            var pPodatekSkladka = dF.getData("bazaJednostek/podatekStawka");
            var pMarzaZakladowa = dF.getData("bazaJednostek/marzaZakladowa");


            $q.all([pKontrahenci, pPozycjaMagazynowa, pJednDokumentTyp, pJednostkaMiary, pGrupaZakladowa, pPodatekSkladka, pMarzaZakladowa])
                .then(function (dane) {
                    vm.danePomocnicze.kontrahenci = dane[0];
                    vm.danePomocnicze.pozycjaMagazynowa = dane[1];
                    vm.danePomocnicze.dokumentTyp = cF.wybierzTylko(dane[2],"nazwa", ["FV", "WZ"]);
                    vm.danePomocnicze.jednostkaMiary = dane[3];
                    vm.danePomocnicze.grupaZakladowa = dane[4];
                    vm.danePomocnicze.podatekStawka = dane[5];
                    vm.danePomocnicze.marzaZakladowa = dane[6];


                    if (vm.objId === 0) {
                        vm.magazyn = {

                        };

                        vm.dataObj = {
                            status: "nowy",
                            datyRazem: true,
                            dataWplywu: new Date(),
                            pzPozycja: [],
                            createdBy:currentUser.getProfile().userEmail,
                        };
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                        vm.startMode = true;
                    } else {
                        dF.getData("magPz/"+ vm.objId).then(function (data) {
                            vm.dataObj = data;
                            vm.dataObj.dataWplywu = new Date(vm.dataObj.dataWplywu);
                            vm.dataObj.dataWystawienia = new Date(vm.dataObj.dataWystawienia);

                            vm.navCanDelete = vm.dataObj.czyZaksiegowana ? false : true;
                            vm.dataObjCopy = angular.copy(vm.dataObj);
                            vm.startMode = true;
                        }, function (error) {
                        });
                    }

                }, function (error) {
                    console.log(error);
                });



        }


        function korektaAnuluj() {
            vm.dataObj.korekta = {};
            vm.korektaNew = !vm.korektaNew;
            vm.dataObj.status = "baza";
            vm.dataObj.czyKorekta = false;
        }

        function korektaUtworz() {
            if (vm.dataObj.pzKorekta.length > 0) {
                vm.dataObj.korekta = angular.copy(vm.dataObj.pzKorekta[0]);
            } else {
                vm.dataObj.korekta = angular.copy(vm.dataObj);
            }
            vm.dataObj.korekta.dataWplywu = new Date(vm.dataObj.korekta.dataWplywu);
            vm.dataObj.korekta.createdBy=currentUser.getProfile().userEmail;
            vm.korektaNew = !vm.korektaNew;
            vm.dataObj.status = "zmieniony";
            vm.dataObj.czyKorekta = true;
        }



        function pozycjaMagazynowaDane()
        {
            var result=[];
            var dane = vm.danePomocnicze.pozycjaMagazynowa;

            if (angular.isUndefined(vm.pozycjaMagazynowaSearchText)) {
                return dane;
            } else {
                result = $filter('filter')(dane, vm.pozycjaMagazynowaSearchText);
            }


            return result;

        }


        function magPZPozycjaDodaj() {
            var pzPozycjaRef = vm.dataObj.pzPozycja;
            if (vm.korektaNew) { pzPozycjaRef = vm.dataObj.korekta.pzPozycja;}


            if (angular.isUndefined(vm.magazyn.pozycjaMagazynowa)) { return; }
            if (!angular.isObject(vm.magazyn.pozycjaMagazynowa)) { return;}
            if (jestNaLiscie()) { return;}


            var pozMag = {
                pozycjaMagazynowa:angular.copy(vm.magazyn.pozycjaMagazynowa),
                ilosc: angular.copy(vm.magazyn.ilosc),
                status:'nowy'
            };

            pzPozycjaRef.push(pozMag);
            vm.magazyn.ilosc = undefined;
            vm.formMain.$setDirty()


            function jestNaLiscie() {
                var found = false;
                angular.forEach(pzPozycjaRef, function (pm) {
                    if (pm.pozycjaMagazynowa.pozycjaMagazynowaId == vm.magazyn.pozycjaMagazynowa.pozycjaMagazynowaId) {
                        found= true;
                    }
                });
                return found;
            }

        }

        function magPzPozycjaDelete(poz, arr) {
            var idx = arr.indexOf(poz);
            arr.splice(idx, 1);
        }

        function magPZPozycjaEdytuj(poz) {
            poz.editMode = true;
            poz.status = statusCheck.check("mod", poz);
            vm.formMain.$setDirty();
        }

        function magPZPozycjaSave(poz) {
            poz.editMode = false;
            vm.formMain.$setDirty();
        }


        function magPozycjaMagazynowaCreate(dPomoc, newName) {
            
            var searchText = vm.magPozycjaMagazynowaSearchText;
            $mdDialog.show({
                templateUrl: 'app/common/dialogs/pozycjaMagazynowaTmpl.html',
                controller: pozMagCreateCtrl,
                controllerAs: 'vm',
                fullscreen: true,
                parent: angular.element(document.body),
                clickOutsideToClose: false,
            }).then(function (formData) {
                var newPozMag = {
                    jednostka: formData.jednostka,
                    nazwa: formData.nazwa,
                    pozycjaMagazynowaId: formData.pozycjaMagazynowaId,
                    status: formData.status,
                    uwagi: formData.uwagi
                }
                vm.danePomocnicze.pozycjaMagazynowa.push(angular.copy(newPozMag));
                vm.magazyn.pozycjaMagazynowa = angular.copy(newPozMag);
                
            }, function (error) {
                console.log("błąd");
                console.log(error);
            });

            function pozMagCreateCtrl() {
                var vm = this;
                vm.title="Nowa pozycja magazynowa";
                vm.danePomocnicze = dPomoc;
                vm.navSave = navSave;
                vm.navCancel = navCancel;
                vm.dataObj = {
                    nazwa:searchText,
                    typTowaru: 2,
                    grupaZakladowa: vm.danePomocnicze.grupaZakladowa[0],
                    jednostkaMiary: vm.danePomocnicze.jednostkaMiary[7],
                    marzaZakladowa: vm.danePomocnicze.marzaZakladowa[0],
                    vatSprzedazy: vm.danePomocnicze.podatekStawka[0],
                    vatZakupu:vm.danePomocnicze.podatekStawka[0]
                };

                function navSave() {
                    if (vm.formPozMag.$valid === false) return;
                    vm.pozMagIsSaving = true;
                    dF.putData("magPozycjaMagazynowa/0", vm.dataObj).then(function (response) {
                        $mdDialog.hide(response);
                    }, function (error) {
                        $mdDialog.hide();
                    });

                }

                function navCancel() {
                    $mdDialog.hide("To po co trujesz !?");
                }

            }

        }

        function navDelete() {
            vm.inProgress=true
            cF.dialogTakNie('Czy na pewno usunąć PZ id: ' + vm.objId + " ??").then(function (ok) {
                dF.deleteData('magPz/' + vm.objId).then(function (success) {
                    
                    vm.navIdzDo();
                },function(error){
                    vm.inProgress = false;
            })
            }, function (cancel) {
                vm.inProgress = false;
            });
        }


        function navZapisz() {
            vm.navZapiszDisabled = true;
            if (angular.isUndefined(vm.dataObj.pzPozycja) || vm.dataObj.pzPozycja.length === 0) {
                cF.info('warning', vm.title, "Nie dodano żadnej pozycji magazynowej..");
                return;
            }

            cF.dialogTakNie("PZ - zapis danych", "Czy dane są sprawdzone ? Czy na pewno zapisać je w bazie ?").then(function () {
                dF.putData("magPz/"+vm.objId, vm.dataObj).then(function (response) {
                    vm.navIdzDo();
                }, function (error) {
                });
            });
            
        }


        function tableSearch() {
            if (vm.table.searchShow === true) {
                vm.table.searchText = '';
            }
            vm.table.searchShow = !vm.table.searchShow;
        }

        function usun() {

        }
    }
})();

