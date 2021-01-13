(function () {
    'use strict';

    angular
        .module('app')
        .controller('normaDetailCtrl', normaDetailCtrl);

    normaDetailCtrl.$inject = ['$state', '$stateParams', '$q', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function normaDetailCtrl($state, $stateParams, $q, cF,  dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Norma - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.danePomocnicze = {};

        vm.dodajNowy = dodajNowy;
        vm.kombiDodaj = kombiDodaj;
        vm.kombiDodajWszystkie = kombiDodajWszystkie;
        vm.kombiUsun = kombiUsun;
        vm.kombiWykonczenieSklonuj = kombiWykonczenieSklonuj;
        vm.normaClone = normaClone;
        vm.normaUsun = normaUsun;
        vm.dataObj = {
            kombinacje: [],
        };

        vm.opcjeWykonczenia = [
        ];
        vm.opcjeWykonczenia2 = [];

        vm.navZapisz = navZapisz;

        vm.nazwyKombinacji = [];
        vm.objId = parseInt($stateParams.id);

        vm.startMode = false;
        vm.usun = usun;


//        =========================================-------------------------------------=============================================

        activate();

        function activate() {
            getById();
        }

        function danePomocniczeGet() {
            dF.getData("nazwyKombinacji").then(function (data) {
                statusCheck.przygotujDostepneKombi(vm.dataObj, data, "kombinacje");
                vm.nazwyKombinacji = data;
            }, function (error) {

            });
        }

        function dodajNowy() {
            var nowy = {
                nazwa: vm.dataObj.nazwa,
                uwagi: vm.dataObj.uwagi
            };

            dF.norma.post(vm.dataObj,
                function (data) {
                    vm.navIdzDo();
                }, function (error) {
                });
        }

        function getById() {

            var pDanePomocniczeNormaAll = dF.getData("norma/pomocAll");
            var pNazwyKombinacji = dF.getData('norma/pomocNazwyKombinacji');
            var pWykonczenieGrupa = dF.getData('wykonczenieGrupa');
            var pWykonczenie = dF.getData('wykonczenie');
            var pProdukcjaDzial = dF.getData('bazaJednostek/produkcjaDzial');
            var pPolitykaCenowa = dF.getData('finPolitykaCenowa');
            

            $q.all([pDanePomocniczeNormaAll, pNazwyKombinacji, pWykonczenieGrupa, pWykonczenie, pProdukcjaDzial, pPolitykaCenowa])
                .then(function (dane) {

                    vm.danePomocnicze=dane[0];
                    vm.nazwyKombinacjiCopy = dane[1];
                    vm.danePomocnicze.wykonczenieGrupa = dane[2];
                    vm.danePomocnicze.wykonczenie = dane[3];
                    vm.danePomocnicze.produkcjaDzial = dane[4];
                    vm.danePomocnicze.politykaCenowa = dane[5];
                    wykonczenieGrupaPrzygotuj();


                if (vm.objId === 0) {
                    vm.dataObj = {
                        kombinacje: [],
                    };

                    vm.nazwyKombinacji = angular.copy(vm.nazwyKombinacjiCopy);
                    vm.startMode = true;
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                } else {
                    dF.getData("norma/"+ vm.objId).then(function (data) {
                        vm.dataObj = data;
//                        opcjeWykonczeniaPrzypiszFn()
                        vm.nazwyKombinacji = statusCheck.przygotujDostepneKombi(vm.dataObj, vm.nazwyKombinacjiCopy, "kombinacje");
                        vm.startMode = true;
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                    }, function (error) {
                    });
                }

                }, function (error) {

                console.log(error);
            });


            function opcjeWykonczeniaPrzypiszFn() {
                angular.forEach(vm.dataObj.kombinacje, function (kombi) {
                    kombi.opcjeWykonczenia = angular.copy(vm.opcjeWykonczenia);
                });
            }

            function wykonczenieGrupaPrzygotuj() {
                angular.forEach(vm.danePomocnicze.wykonczenieGrupa, function (wg) {
                    vm.opcjeWykonczenia.push(wg);
                });
            }

        }


        function kubatura(kombi) {
            return (kombi.wysokosc * kombi.szerokosc * kombi.glebokosc) / 1000000;
        }

        function kombiDodaj(nazwyKombi) {

            var dane = {
                etapyProdukcyjne: [],
                nazwaKombinacji: nazwyKombi,
                kombinacjaObszycie: [],
                kombinacjaPozycjaMagazynowa: [],
                kombinacjaWykonczenie:[],
                kombinacjaRobocizna: [],
                opcjeWykonczenia: angular.copy(vm.opcjeWykonczenia),
                wypych:angular.copy(vm.danePomocnicze.wypych),
            };
            dane.status = statusCheck.check("add", dane);
            if (dane.status != "baza") {
                vm.dataObj.kombinacje.push(dane);
            }

            var idx = vm.nazwyKombinacji.indexOf(nazwyKombi);
            vm.nazwyKombinacji.splice(idx, 1);
            vm.formMain.$setDirty();
        }

        function kombiDodajWszystkie() {
            console.log(vm.nazwyKombinacji.length);
            for (var i = 0; i < vm.nazwyKombinacji.length; i++) {
                kombiDodaj(vm.nazwyKombinacji[i]);
            }
        }

        function kombiUsun(dane) {
            cF.dialogTakNie('Kombinacja norma', 'Czy na pewno chcesz usunąć ?').then(function () {
                vm.nazwyKombinacji.push(dane.nazwaKombinacji);
                dane.status = statusCheck.check("del", dane);
                if (dane.status != "usuniety") {
                    var idx = vm.dataObj.kombinacje.indexOf(dane);
                    vm.dataObj.kombinacje.splice(idx, 1);
                }
                vm.formMain.$setDirty();
            });
        }

        function kombiWykonczenieSklonuj(kombi) {
            cF.dialogTakNie("Norma", "Czy sklonować wybrane opcje kombinacji do wszystkich 'nowych' kombinacji ?").then(function(ok){
                var opcjeWykonczenia = angular.copy(kombi.opcjeWykonczenia);
                var kombinacjaWykonczenie = angular.copy(kombi.kombinacjaWykonczenie);
                var kombinacjaObszycie = angular.copy(kombi.kombinacjaObszycie);
                var kombinacjaRobocizna = angular.copy(kombi.kombinacjaRobocizna);
                angular.forEach(kombinacjaObszycie, function (obsz) {
                    obsz.status = "nowy";
                });
                angular.forEach(kombinacjaWykonczenie, function (wyk) {
                    wyk.status = "nowy";
                });

                angular.forEach(kombinacjaRobocizna, function (dzial) {
                    dzial.status = "nowy"
                    angular.forEach(dzial.grupaRoboczaWybrane, function (grupaRobocza) {
                        grupaRobocza.status = "nowy";
                    });
                })

                angular.forEach(vm.dataObj.kombinacje, function (kombi) {
                    if (kombi.status == "nowy" && kombi.kombinacjaWykonczenie.length === 0) {
                        kombi.opcjeWykonczenia = angular.copy(opcjeWykonczenia);
                        kombi.kombinacjaWykonczenie = angular.copy(kombinacjaWykonczenie);
                        kombi.status = statusCheck.check('add', kombi);
                    }
                    if (kombi.status == "nowy" && kombi.kombinacjaObszycie.length === 0) {
                        kombi.kombinacjaObszycie = angular.copy(kombinacjaObszycie);
                        kombi.status = statusCheck.check('add', kombi);
                    }
                    if (kombi.status == "nowy" && kombi.kombinacjaRobocizna.length === 0) {
                        kombi.kombinacjaRobocizna = angular.copy(kombinacjaRobocizna);
                        kombi.status = statusCheck.check('add', kombi);
                    }
                });
                vm.formMain.$setDirty();
            }, function (cancel) {

            })
        }

        function navZapisz() {
//            vm.navZapiszDisabled = true;
            vm.inProgress = true;
            dF.putData("norma/"+ vm.objId, vm.dataObj).then(function (response) {
                $state.go('norma');
            }, function (error) {

            });
        }

        function normaClone() {
            cF.dialogTakNie(vm.title, "Czy na pewno chcesz utworzyć nową normę na bazie tej !?<br/><em><small>(wszystkie pozycje zostaną skopiowane, nazwa nowej normy to: <strong>'" + vm.dataObj.nazwa + "_clone'</strong>)</em><br />Po zapisaniu wracam do listy norm..</small>")
                .then(function () {
                    vm.nazwaOld=vm.dataObj.nazwa;
                    vm.dataObj.nazwa = vm.dataObj.nazwa + "_clone";
                    normaClonePrzygotujStatusy();
                    dF.putData("norma/0", vm.dataObj, function (response) {
                        vm.navIdzDo();
                        }, function (error) {
                            vm.dataObj = angular.copy(vm.dataObjCopy);
                        });
            }, function () {
            });
        }

        function normaUsun() {
            cF.dialogTakNie(vm.title, "Czy na pewno chcesz usunąć normę ??<br /> <em><small>Norma zostanie usunięta o ile nie jest powiązana relacjami np. zamówienia itp...</small><em>")
                .then(function () {
                    dF.deleteData("norma/"+ vm.objId).then(function (response) {
                        cF.info('success', vm.title + ': Zapis w bazie danych', 'Aktualizacja/zapis przebiegła prawidłowo');
                        vm.navIdzDo();
                    }, function (error) {
                        vm.dataObj = angular.copy(vm.dataObjCopy);
                        cF.info("error", vm.title, "cos sie skopalo", error);
                    });
                }, function () {
                    cF.info('warning', vm.title, "No to nie..");
                });
        }

        function normaClonePrzygotujStatusy() {
            vm.dataObj.status = "nowy";
            angular.forEach(vm.dataObj.kombinacje, function (k) {
                k.status = "nowy";
                ustawStatusWkolekcji(k.etapyProdykcyjne, "nowy");
                ustawStatusWkolekcji(k.kombinacjaObszycie, "nowy");
                ustawStatusWkolekcji(k.kombinacjaPozycjaMagazynowa, "nowy");
                ustawStatusWkolekcji(k.kombinacjaRobocizna, "nowy");
                ustawStatusWkolekcji(k.kombinacjaWykonczenie, "nowy");
            });
        }

        function ustawStatusWkolekcji(coll, status) {
            if (angular.isUndefined(coll)) { return; }
            if (coll.length === 0) { return; }
            angular.forEach(coll, function (obj) {
                obj.status = status;
            });
        }

        function usun() {

            dF.norma.del({ id: vm.objId }, function (response) {
                cF.info('warning', vm.title + ': Zapis w bazie danych', 'Usunięcie rekordu przebiegło prawidłowo');
                vm.navIdzDo();
            }, function (error) {
                cF.info("error", vm.title, "Błąd danych", error);
            });
        }



    }
})();

