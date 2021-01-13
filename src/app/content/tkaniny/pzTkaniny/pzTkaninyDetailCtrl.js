(function () {
    'use strict';

    angular
        .module('app')
        .controller('pzTkaninyDetailCtrl', pzTkaninyDetailCtrl);

    pzTkaninyDetailCtrl.$inject = ['$filter','$mdMedia', '$mdDialog','$state', '$stateParams', '$q', 'commonFunctions',  'dataFactory'];

    function pzTkaninyDetailCtrl($filter, $mdMedia, $mdDialog, $state, $stateParams, $q, cF, dF) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'PZTkaniny - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.danePomocnicze = {};
       


        //vm.idzDo = idzDo;
        vm.isSmall = cF.isScreenSmall();
        vm.materialBelkaDostepne = materialBelkaDostepne;
        vm.materialBelkaRemove = materialBelkaRemove;

        vm.navCanDelete = false;
        vm.navDelete = navDelete;
        vm.navZapisz = navZapisz;


        vm.objId = parseInt($stateParams.id);

        vm.table = {
            limit: 10,
            order: '-id',
            page: 1,
            rowLimitOpt: [10, 30, 100],
            searchText: '',
            searchShow: false,
            search: function () {
                if (vm.table.searchShow === true) {
                    vm.table.searchText = '';
                }
                vm.table.searchShow = !vm.table.searchShow;
            },
            add: materialBelkaAdd
        };


        //        =========================================-------------------------------------=============================================

        activate();

        function activate() {
            getById();
        }



        function getById() {
            var pMaterialBelka = dF.getData('materialBelka/DoPotwierdzenia');


            $q.all([pMaterialBelka])
                .then(function (dane) {
                    vm.danePomocnicze.materialBelka = dane[0];

                    vm.table.rowLimitOpt = dane[0].length > 100 ? [10, 30, 100, dane[0].length] : [10, 30, 100];


                    if (vm.objId === 0) {

                        vm.dataObj = {
                            status: "nowy",
                            dataWystawienia: new Date(),
                            czyPowierzona:true,
                            materialBelka: [],
                            createdBy: cF.userName(),
                        };
                        materialBelkaDostepne();
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                        vm.startMode = true;
                        
                    } else {
                        dF.getData("materialBelka/pzTkaniny/" + vm.objId).then(function (data) {
                            data = data[0];
                            vm.dataObj = data;
                            vm.dataObj.dataWystawienia = new Date(data.dataWystawienia);
                            materialBelkaDostepne();
                            vm.navCanDelete = data.czyZaksiegowana == true ? false : true;
                            vm.startMode = true;
                        }, function (err) {

                        });
   


                    }

                }, function (error) {
                    console.log(error);
                });



        }

        function materialBelkaAdd(dane) {
            if (vm.dataObj.czyZaksiegowana == true) { return}
            vm.dataObj.materialBelka.push(dane);
            materialBelkaDostepne();
            vm.formMain.$setDirty();
        }


        function materialBelkaDostepne() {
            vm.dataObj.materialBelkaDost = $filter('roznica')(vm.danePomocnicze.materialBelka, vm.dataObj.materialBelka, 'id', 'id');
            materialBelkaGrupaPrzelicz();
        }

        function materialBelkaRemove() {
            console.log("remove");
            vm.formMain.$setDirty();
            materialBelkaDostepne();
        }

        function materialBelkaGrupaPrzelicz() {
            vm.dataObj.pzTkaninyPozycjaGrupa = [];
            var resObj = vm.dataObj.pzTkaninyPozycjaGrupa;

            angular.forEach(vm.dataObj.materialBelka, function (belka) {
                var grupaDane = belka.material.materialGrupaKontrahent;
                var grupaTemp = checkGrupa(belka.material.materialId, grupaDane.materialGrupaKontrahentId);

                var grupaObj = {
                    materialGrupaKontrahentId: grupaDane.materialGrupaKontrahentId,
                    materialBelkaId: belka.id,
                    materialId:belka.material.materialId,
                    nazwaMaterialu: belka.material.nazwa,
                    wartosc: belka.stanPoczatkowy,
                };

                if (grupaTemp === undefined) {
                    resObj.push(grupaObj);
                } else {
                    grupaTemp.wartosc += belka.stanPoczatkowy;
                }
            })


            function checkGrupa(matId, kontrId) {
                var result = undefined;
                angular.forEach(resObj, function (belka) {
                    if (belka.materialGrupaKontrahentId == kontrId && belka.materialId == matId) {
                        result = belka;
                    }
                })
                return result;
            }
        }



        function navDelete() {
            vm.inProgress=true
            cF.dialogTakNie('Czy na pewno usunąć PZ id: ' + vm.objId + " ??").then(function (ok) {
                dF.deleteData('materialBelka/pzTkaniny/' + vm.objId).then(function (success) {
                    
                    vm.navIdzDo();
                },function(error){
                    vm.inProgress = false;
            })
            }, function (cancel) {
                vm.inProgress = false;
            });
        }

        function navZapisz() {
            vm.inProgress = true;
            if (angular.isUndefined(vm.dataObj.materialBelka) || vm.dataObj.materialBelka.length === 0) {
                cF.info('warning', vm.title, "Nie wybrano żadnej belki materiałowej..");
                vm.inProgress = false;
                return;
            }

            cF.dialogTakNie("PZ Tkaniny - zapis danych", "Czy dane są sprawdzone ? Czy na pewno zapisać je w bazie ?").then(function (ok) {
                dF.putData("materialBelka/pzTkaniny/"+vm.objId, vm.dataObj).then(function (success) {
                    vm.navIdzDo();
                }, function(error){
                    console.log(error);
                    vm.inProgress = false;
                })
            }, function (cancel) {
                vm.inProgress = false;
            });
            
        }
    }
})();

