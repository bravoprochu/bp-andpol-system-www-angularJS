(function () {
    'use strict';

    angular
        .module('app')
        .controller('tkaninaBelkaDetailCtrl', tkaninaBelkaDetailCtrl);

    tkaninaBelkaDetailCtrl.$inject = ['$filter', '$mdDialog', '$mdMedia', '$state', '$stateParams', '$q', 'commonFunctions', 'dataFactory', 'statusCheck', 'qrCodeGen'];

    function tkaninaBelkaDetailCtrl($filter, $mdDialog, $mdMedia, $state, $stateParams, $q, cF, dF, statusCheck, qrCodeGen) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Tkanina belka - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowej belki..';
        vm.objId = parseInt($stateParams.id);

        vm.userName = cF.userName();
        vm.danePomocnicze = {};

        vm.materialyFiltered = materialyFiltered;
        vm.navZapisz = navZapisz;
        vm.navDelete = navDelete;

        vm.dataObj = {};
        vm.qrCodeGen = vm.objId > 0 ? true : false;
        vm.qrCodeGenFn = qrCodeGenFn;

        vm.startMode = false;
        vm.usun = usun;


        vm.rozchodInneAktualizuj = rozchodInneAktualizuj;
        vm.rozchodInneDel = rozchodInneDel;

        vm.table = {
            order: 'dataRozchodu',
        };


        //        =========================================-------------------------------------=============================================

        activate();

        function activate() {
            getById();

        }

        function getById() {
            var pMaterialy = dF.getData("material");
            var pRozchodMagRodzaj = dF.getData("bazaJednostek/rozchodMagRodzaj");
            $q.all([pMaterialy, pRozchodMagRodzaj])
                .then(function (data) {
                    vm.danePomocnicze.materialy = data[0];
                    vm.danePomocnicze.rozchodMagRodzaj = data[1];

                    if (vm.objId === 0) {
                        vm.dataObj.rozchodInne = [];
                        vm.dataObj.material = vm.danePomocnicze.materialy.length > 0 ? vm.danePomocnicze.materialy[0] : null;
                        vm.dataObj.status = "nowy";
                        vm.dataObj.createdBy = cF.userName();
                        vm.dataObj.czyAktywna = true;
                        vm.dataObj.dataPrzyjecia = new Date();
                        vm.startMode = true;
                        vm.dataObjCopy = angular.copy(vm.dataObj);

                    } else {
                        dF.getData('materialBelka/' + vm.objId).then(function (data) {
                            vm.dataObj = data[0];
                            vm.dataObj.dataPrzyjecia = new Date(vm.dataObj.dataPrzyjecia);
                            vm.dataObj.stan = {
                                rozchodInneTemp: [],
                                stanAktualnyTemp: data[0].stanAktualny
                            };
                            vm.dataObjCopy = angular.copy(vm.dataObj);
                            vm.startMode = true;
                            if (vm.dataObj.rozchodInne.length ==0 && vm.dataObj.planning==0) {
                                vm.navCanDelete = true;
                            }
                            vm.navCanDelete = true;

                        }, function (error) {

                        });
                    }


                }, function (error) {
                    console.log("$q.All error: ");
                    console.log(error);
                });

        }


        function materialyFiltered(searchText) {
            var result = $filter('filter')(vm.danePomocnicze.materialy, { nazwa: searchText });
            return result;
        }

        function navDelete() {
            vm.inProgress = true;
            cF.dialogTakNie('Czy na pewno usunąć belkę id: ' + vm.objId+ ' ?').then(function (ok) {
                dF.deleteData('materialBelka/' + vm.objId).then(function (success) {
                    vm.navIdzDo();
                }, function (error) {
                    vm.inProgress = false;
                })
            }, function (cancel) {
                vm.inProgress = false;
            });

            
        }

        function navZapisz() {
            vm.inProgress = true;
            vm.navZapiszDisabled = true;
            dF.putData('materialBelka/'+vm.objId, vm.dataObj).then(function (response) {
                vm.navIdzDo();
            }, function (error) {
                vm.isLoading = false;
            });
        }


        function qrCodeGenFn() {
            if (vm.objId === 0) { return; }
            var qrCode = {
                nazwa: vm.dataObj.material.nazwa + " [" + vm.dataObj.material.materialGrupaKontrahent.nazwa + "]",
                grupa: $state.current.name,
                uwagi: 'przyjecie: ' + vm.dataObj.dataPrzyjecia.toLocaleDateString() + '\n stanStart: ' + vm.dataObj.stanPoczatkowy + '\n fv: ' + vm.dataObj.fakturaNr
            };


            return qrCodeGen.qrCodeBasketAdd(qrCode).then(function (ok) {
                vm.navIsOpen = false;
                
            }, function (err) {
                console.log(err);
            });
        };

        function rozchodInneAktualizuj(mode, event, dane) {
            var dlgOpt = {
                bindToController: true,
                controller: dialogCtrl,
                controllerAs: 'vm',
                locals: {
                    stanAktualny: vm.dataObj.stan.stanAktualnyTemp,
                    danePomocnicze: {
                        rozchodMagRodzaj: vm.danePomocnicze.rozchodMagRodzaj
                    }
                },
                openForm: 'top',
                targetEvent: event,
                templateUrl: 'app/common/dialogs/tkaninaBelkaRozchod.html',
            };

            $mdDialog.show(dlgOpt).then(function (response) {
                if (mode == 'add') {
                    var rozchod = {
                        createdBy: vm.userName,
                        dataRozchodu: response.dataRozchodu,
                        rozchodMagRodzaj: response.rozchodMagRodzaj,
                        status: 'nowy',
                        uwagi: response.uwagi,
                        wartosc: response.wartosc
                    };
                    vm.dataObj.rozchodInne.push(rozchod);
                    vm.dataObj.stan.rozchodInneTemp.push(rozchod);
                    vm.dataObj.stan.stanAktualnyTemp -= response.wartosc;
                }
                if (mode == 'mod') {
                    dane.modifiedBy = vm.userName;
                    dane.dataRozchodu = response.dataRozchodu;
                    dane.rozchodMagRodzaj = response.rozchodMagRodzaj;
                    dane.status = statusCheck.check('mod', dane);
                    dane.uwagi = response.uwagi;
                    dane.wartosc = response.wartosc;
                    vm.dataObj.stan.stanAktualnyTemp += response.wartoscStart;
                    vm.dataObj.stan.stanAktualnyTemp -= response.wartosc;
                }

                vm.formMain.$setDirty();
            });
            /* @ngInject */
            dialogCtrl.$inject = ['$scope'];
            function dialogCtrl($scope) {
                var vm = this;
                vm.navSave = save;
                vm.navCancel = cancel;
                vm.stanMin = vm.locals.stanAktualny * (-1);
                vm.stanMax = vm.locals.stanAktualny;
                vm.title = "Rozchód (" + mode + ")";

                if (mode == 'add') {
                    vm.dane = {
                        dataRozchodu: new Date(),
                        jednostkaMiary: { nazwa: 'mb' },
                    };

                }
                if (mode == 'mod') {
                    vm.dane = angular.copy(dane);
                    vm.dane.wartoscStart = vm.dane.wartosc;
                    vm.dane.dataRozchodu = new Date(vm.dane.dataRozchodu);
                    vm.stanMax += vm.dane.wartosc;
                }

                function save() {
                    $mdDialog.hide(vm.dane);
                }
                function cancel() {
                    $mdDialog.cancel(vm.dane);
                }
            }


        }

        function rozchodInneDel(rozchod) {
            var wartosc = rozchod.wartosc;
            cF.dialogTakNie(vm.title, "Czy na pewno usunąć rozchód ?").then(function (ok) {
                var idx = vm.dataObj.rozchodInne.indexOf(rozchod);
                var wartosc = rozchod.wartosc;
                vm.dataObj.rozchodInne.splice(idx, 1);
                vm.dataObj.stan.stanAktualnyTemp += wartosc;
            }, function (not) {
            });

        }


        function usun() {

            dF.tkaninaBelka.del({ id: vm.objId }, function (response) {
                vm.navIdzDo();
            }, function (error) {

            });
        }




    }
})();

