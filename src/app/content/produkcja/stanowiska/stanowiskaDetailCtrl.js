(function () {
    'use strict';

    angular
        .module('app')
        .controller('stanowiskaDetailCtrl', stanowiskaDetailCtrl);

    stanowiskaDetailCtrl.$inject = ['$q','$state', '$stateParams', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function stanowiskaDetailCtrl($q, $state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'stanowiska - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.navZapisz = navZapisz;
        vm.danePomocnicze = {};
        vm.dataObj = {};
        vm.objId = parseInt($stateParams.id);
        vm.startMode = false;
        vm.usun = usun;


        activate();

        function activate() {
            getById();
        }

        function getById() {
            var produkcjaDzial = dF.getData("bazaJednostek/produkcjaDzial");

            $q.all([produkcjaDzial]).then(function (data) {

                vm.danePomocnicze.produkcjaDzial = data[0];

                if (vm.objId === 0) {
                    vm.startMode = true;
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                } else {
                    dF.getData("robocizna/"+vm.objId).then(function (data) {
                        vm.dataObj = data.result;
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                        vm.startMode = true;
                    }, function (error) {
                        powrot()
                    });
                }

            }, function (error) {
                powrot()
            })

        }


        function navZapisz() {
            vm.navZapiszDisabled = true;
            dF.putData('robocizna/'+vm.objId, vm.dataObj).then(function (response) {
                cF.info('success', vm.title + ': Zapis w bazie danych', 'Aktualizacja/zapis przebiegła prawidłowo');
                vm.navIdzDo();
            }, function (error) {
                cF.info("error", vm.title, "Błąd danych", error);

            });
        }


        function usun() {
            dialogsService.confirm("Usuń", 'Czy na pewno chcesz usunąć ' + vm.dataObj.nazwa + ' ?')
                    .then(function () {
                            dF.robocizna.del({ id: vm.objId }, function (response) {
                                cF.info('warning', vm.title + ': Zapis w bazie danych', 'Usunięcie rekordu przebiegło prawidłowo');
                                vm.navIdzDo();
                            }, function (error) {
                                cF.info("error", vm.title, "Błąd danych", error);
                            });
                    }, function () {
                    });
        }

        function powrot() {
            $state.go("stanowiska");
        }
    }
})();
