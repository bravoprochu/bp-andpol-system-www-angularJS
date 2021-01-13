(function () {
    'use strict';

    angular
        .module('app')
        .controller('politykaCenowaDetailCtrl', politykaCenowaDetailCtrl);

    politykaCenowaDetailCtrl.$inject = ['$filter','$mdMedia','$state', '$stateParams', '$q', 'commonFunctions','currentUser', 'dataFactory', 'statusCheck'];

    function politykaCenowaDetailCtrl($filter, $mdMedia, $state, $stateParams, $q, cF, currentUser, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.objId = parseInt($stateParams.id);
        vm.title = 'Polityka cenowa';
        vm.subTitle = 'Edycja/tworzenie nowego dokumentu..';


        vm.danePomocnicze = {};

        vm.isSmall = cF.isScreenSmall();
        vm.dataObj = {};
        vm.navZapisz = navZapisz;
        vm.startMode = false;
        //        =========================================-------------------------------------=============================================

        activate();

        function activate() {
            getById();
            //vm.startMode = true;
        }


        function getById() {
            var pKontrahenci = dF.getData("kontrahent/kontrahentZdealerem");

            $q.all([pKontrahenci])
                .then(function (dane) {
                    
                    vm.danePomocnicze.kontrahenci = dane[0];
                    
                    if (vm.objId === 0) {
                        vm.dataObj = {
                            createdBy: currentUser.getProfile().userEmail,
                            reguly:przygotujReguly()
                        };
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                        vm.startMode = true;
                    } else {
                        dF.getData('finPolitykaCenowa/'+vm.objId).then(function (dane) {
                            vm.dataObj = dane;
                            vm.dataObjCopy = angular.copy(vm.dataObj);
                            vm.startMode = true;
                        }, function (error) {
                            idzDo();
                        });
                    }


                }, function (error) {
                    console.log(error);
                });

            function przygotujReguly() {
                var result = [];

                angular.forEach(vm.danePomocnicze.kontrahenci, function (k) {
                    var tempObj = {
                        kontrahent: k,
                        wartosc: null,
                        typRozliczenia: 1,
                        czyAktywna: false,
                    };

                    result.push(tempObj);
                    
                });
                return result;
            }
        }

        function navZapisz() {
            vm.navZapiszDisabled = true;
            cF.dialogTakNie(vm.title, "Czy na pewno zapisać dane w bazie ?").then(function () {
                dF.putData('finPolitykaCenowa/'+ vm.objId, vm.dataObj).then(function (response) {
                    vm.navIdzDo();
                }, function (error) {
                });
            }, function () {

            });

        }

        function usun() {

        }
    }
})();

