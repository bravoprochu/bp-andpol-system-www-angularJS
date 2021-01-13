(function () {
    'use strict';

    angular
        .module('app')
        .controller('kontrahentDetailCtrl', kontrahentDetailCtrl);

    kontrahentDetailCtrl.$inject = ['$mdDialog', '$scope', '$state', '$stateParams', '$q', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function kontrahentDetailCtrl($mdDialog, $scope, $state, $stateParams, $q, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Kontrahent - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';
      
        
        vm.adresAnuluj = adresAnuluj;
        vm.adresAktualizuj = adresAktualizuj;
        vm.adresDodaj = adresDodaj;
        vm.adresEdytuj = adresEdytuj;
        vm.adresUsun = adresUsun;
        vm.danePomocniczeLista = {};
        vm.danePomocnicze = [];

        vm.danePomocnicze = {};

        vm.dealerDialog = dealerDialog;
        vm.dealerNewDelete = dealerNewDelete;
        vm.dealerNewSave = dealerNewSave;


        vm.dealersSortShow = dealersSortShow;
        vm.dealersTable = {
            order: 'nazwa',
            limit: 10,
            page: 1,
            search:dealersTableSearch
        };
        vm.info = '';
        
        vm.navZapisz = navZapisz;

        

        vm.dataObj = {
            adresyKontrahenta: [],
            czyDealerzy: false,
            czyDostawca: true,
            czyOdbiorca: true,

            kontrahentPlatnosc: {
                transportWcenie:true,
                status: "nowy",
                dupa:"blada"
            },

        };


        vm.dataObjAddr = {

        };

        vm.objId = parseInt($stateParams.id);
        vm.platnosci = platnosci;
        vm.startMode = false;
        vm.usun = usun;

        

//        =========================================-------------------------------------=============================================

        activate();

        function activate() {
            getById();
        }

        function adresAktualizuj(toDelete) {

            var ent = findEnt(vm.dataObjAddrCopy);
            var idx = vm.dataObj.dealer.indexOf(ent);
            vm.dataObj.dealer.splice(idx, 1);

            if (toDelete) {
                vm.dataObjAddr.status = statusCheck.check("del", vm.dataObjAddr);
                
            } else {
                vm.dataObjAddr.status = statusCheck.check("mod", vm.dataObjAddr);
            }

            if (vm.dataObjAddr.status !== null) {
                vm.dataObj.dealer.push(vm.dataObjAddr);
            }
            

            vm.dataObjAddr = {};
            vm.dataObjAddr.collapsed = true;
        }

        function adresAnuluj(toDelete) {
            vm.dataObjAddr = {};
            vm.dataObjAddr.collapsed = true;
        }

        function adresDodaj() {
            vm.dataObjAddr.status = "nowy";
            vm.dataObj.dealer.push(vm.dataObjAddr);
            vm.dataObjAddr = {};
        }

        function adresEdytuj(dane) {
            vm.dataObjAddrCopy = angular.copy(dane);
            vm.dataObjAddr = angular.copy(dane);
            vm.dataObjAddr.collapsed = false;
            vm.dataObjAddr.edycja = true;
        }

        function adresUsun() {
            adresAktualizuj(true);
        }


        function dealerDialog(ev, mode, data) {
            if (angular.isUndefined(data)) {
                data = {};
            }
            $mdDialog.show({
                bindToController:true,
                controller: dealerNewTmplCtrl,
                controllerAs: 'vm',
                locals: {
                    dataToPass: data,
                    mode:mode,
                },
                templateUrl: 'app/content/kontrahent/dealerNewTmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
            .then(function (zaktualizowane) {
                if (zaktualizowane!==true) {
                    dealerNewSave(zaktualizowane);
                }
            }, function (cancel) {
            });

            function dealerNewTmplCtrl() {
                var vm = this;
                var dataToPass = angular.copy(vm.locals.dataToPass);
                var mode = vm.locals.mode;
                if (mode == "clone") {
                    dataToPass.dealerId = 0;
                    dataToPass.status = "nowy";
                }



                vm.title = "";
                vm.dealerNewCopy = angular.copy(dataToPass);
                vm.dealerNew = angular.copy(dataToPass);
                vm.navCancel = navCancel;
                vm.navSave = navSave;

                if (mode == "new") { vm.title = "Nowy dealer"; vm.dealerNew.mode = 'new'; }
                if (mode == "edit") { vm.title = "Edycja danych dealera"; vm.dealerNew.mode = 'edit'; }
                if (mode == "clone") {
                    vm.title = "Sklonowanie danych dealera";
                    vm.dealerNew.mode = 'new';
                }
                function navCancel() {
                    $mdDialog.hide();
                };

                function navSave() {
                    $mdDialog.hide(vm.dealerNew);
                };
            };

        }

        function dealerNewDelete(ev, dane) {
            var confirm = $mdDialog.confirm()
            .title('Na pewno usunąć ?')
            .htmlContent('Czy na pewno usunąć <span><b>'+dane.nazwa+'</b></span>')
            .ariaLabel('usunacDlg')
            .targetEvent(ev)
            .ok('TAK, usuń')
            .cancel('Nie, anuluj !');
            $mdDialog.show(confirm).then(function () {
                
                if (dane.status == "nowy") {
                    var idx = vm.dataObj.dealer.indexOf(dane);
                    vm.dataObj.dealer.splice(idx, 1);
                } else {
                    dane.status = statusCheck.check('del', dane);
                }
                vm.formMain.$dirty = true;
            }, function () {

            });

        }

        function dealerNewSave(dane) {
            if (angular.isUndefined(dane)) return;
            if (dane.mode != "edit") {
                dane.status = "nowy";
                vm.dataObj.dealer.push(dane);
            } else {
                var adresy = vm.dataObj.dealer;
                for (var i = 0; i < adresy.length; i++) {
                    if (adresy[i].dealerId == dane.dealerId) { adresy[i] = dane; }
                }
               dane.status = statusCheck.check("mod", dane);
            }
            vm.formMain.$dirty = true;
        }

        function dealersSortShow(event) {

        }

        function dealersNav(el) {

        }

        function dealersTableSearch() {
            if (vm.dealersTable.searchShow === true) {
                vm.dealersTable.searchText = '';
                vm.dealersTable.searchShow = false;
            } else vm.dealersTable.searchShow = true;


        }

        function findEnt(ent) {
            var idx;
            angular.forEach(vm.dataObj.dealer, function (e) {
                if (e.id == ent.id) { idx=e; }
            });
            return idx;
        }

        function getById() {
            var pPlatnoscRodzaj = dF.getData('bazaJednostek/platnoscRodzaj');

            $q.all([pPlatnoscRodzaj])
                .then(function (dane) {
                    vm.danePomocnicze.platnoscRodzaj = dane[0];

                    if (vm.objId === 0) {
                        vm.dataObjAddr.collapsed = true;
                        vm.dataObj.typKontrahenta = 1;
                        vm.startMode = true;
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                        return;
                    } else {

                        dF.getData('kontrahent/' + vm.objId).then(function (data) {
                                vm.dataObj = data;
                                vm.startMode = true;
                                vm.dataObjCopy = angular.copy(vm.dataObj);
                        }, function (error) {

                        });

                    }
                });

        }




        function navZapisz() {
            vm.navZapiszDisabled = true;
            dF.putData('kontrahent/'+ vm.objId, vm.dataObj).then(function (response) {
                vm.navIdzDo();

            }, function (error) {

            });
        }




        function platnosci() {
            var p = vm.dataObj.kontrahentPlatnosc;
            if (p.transportWcenie) {
                p.StawkaTransport = null;
            }

        }


        function usun() {

            vm.dataObj.status = "usuniety";
            vm.dataObj.platnosci.status = "usuniety";
            angular.forEach(vm.dataObj.dealer, function (a) {
                a.status = "usuniety";
            });
            //console.log(vm.dataObj);

            dF.deleteData('kontrahent/'+ vm.objId).then(function (response) {
                vm.navIdzDo();
            }, function (error) {

            });
        }

    }
})();


