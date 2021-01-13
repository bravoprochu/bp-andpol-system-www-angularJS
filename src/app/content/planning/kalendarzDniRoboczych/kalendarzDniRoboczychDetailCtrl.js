(function () {
    'use strict';

    angular
        .module('app')
        .controller('kalendarzDniRoboczychDetailCtrl', kalendarzDniRoboczychDetailCtrl);

    kalendarzDniRoboczychDetailCtrl.$inject = ['$filter', '$q','$state', '$stateParams', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function kalendarzDniRoboczychDetailCtrl($filter, $q, $state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Kalendarz Dni Roboczych - szczegóły';
        vm.subTitle = 'Edycja/tworzenie nowego..';

        vm.navZapisz = navZapisz;
        vm.danePomocnicze = {};
        vm.dataObj = {};
        vm.objId = parseInt($stateParams.id);
        vm.startMode = false;
        vm.usun = usun;

        vm.czasPracyZakresDodaj = czasPracyZakresDodaj;
        vm.czasPracyZakresUsun = czasPracyZakresUsun;
        vm.czasPracyZakresUtworz = czasPracyZakresUtworz;
        vm.czasPracyZakresSzablonUtworz = czasPracyZakresSzablonUtworz;
        vm.czasPracyZakresSzablonUsun = czasPracyZakresSzablonUsun;
        vm.czasPracyZakresSzablonWczytaj = czasPracyZakresSzablonWczytaj;
        vm.czasDurationChange = czasDurationChange;

        vm.workingDayToClone = {
            day: new Date(),
            caption: 'Sklonuj dzień roboczy',
            loadData: workingDayToCloneByDate
        }

        vm.zakresUstawDaty = zakresUstawDaty;

        activate();

        function activate() {
            getById();
        }

        function czasDuration(timeStart, timeEnd) {
            if (!angular.isDate(timeStart) || !angular.isDate(timeEnd)) { return }

            var start = moment(timeStart);
            var end = moment(timeEnd);

            return moment(end.diff(start)).subtract(1, 'hours').format("HH:mm");
        }

        function czasDurationChange(dzial) {
            dzial.zakres.czasDuration= czasDuration(dzial.zakres.czasStart, dzial.zakres.czasEnd)
        }

        function czasPracyZakresGodzin(dzial) {
            var start, end, dur, durResult

            var zakresy = $filter('filter')(dzial.czasPracyZakres, { status: '!usuniety' });
            zakresy = $filter('orderBy')(zakresy, 'czasStart');

            if (zakresy == null) return;

            if (zakresy.length > 0) {
                angular.forEach(zakresy, function (z) {
                    if (z.czasStart && angular.isDate(z.czasStart) == false) {
                        z.czasStart = new Date(z.czasStart);
                        z.czasEnd = new Date(z.czasEnd);
                    }
                    if (angular.isUndefined(start) || z.czasStart < start) {
                        start = z.czasStart;
                    }
                    if (angular.isUndefined(end) || z.czasEnd > end) {
                        end = z.czasEnd;
                    }
                    if (angular.isUndefined(dur)) {
                        dur = moment.duration(z.czasDuration);
                    }
                    else {
                        dur = dur.add(moment.duration(z.czasDuration));
                    }
                });


                dzial.czasPracyStart = start;
                dzial.czasPracyEnd = end;
                dzial.czasPracyDuration = czasDuration(start, end);

                dzial.czasPrzerwy = new Date(moment.duration(dzial.czasPracyDuration).subtract(dur).subtract(1, 'Hours'));
                dzial.czasPracyZakresDuration = new Date(dur.subtract(1, 'Hours'));
            } else {
                dzial.czasPracyStart = null;
                dzial.czasPracyEnd = null;
                dzial.czasPracyDuration = null;
            }

        }

        function czasPracyZakresDodaj(dzial) {
            if (!angular.isDate(dzial.zakres.czasStart) ||
                !angular.isDate(dzial.zakres.czasEnd) ||
                dzial.zakres.czasDuration=="00:00"
                )
            {
                cF.info('warning', 'Nowy zakres czasu', 'Niewłaściwie wprowadzony czas');
                return
            }

            if (angular.isUndefined(dzial.czasPracyZakres)) {
                dzial.czasPracyZakres = [];
            }

            var temp = {
                czasStart: dzial.zakres.czasStart,
                czasEnd: dzial.zakres.czasEnd,
                czasDuration: dzial.zakres.czasDuration,
                uwagi: dzial.zakres.uwagi,
                status:"nowy",
            }

            if (czasPracyCzyWzakresie(dzial, temp) === false) {
                dzial.czasPracyZakres.push(temp);
                //reset default zakres
                dzial.zakres.czasStart = new Date(temp.czasEnd);
                dzial.zakres.czasEnd = new Date(moment(temp.czasEnd).add(2, 'Hours'));
                dzial.zakres.uwagi = "";
                czasDurationChange(dzial);

                //nowy zakres czasu pracy
                czasPracyZakresGodzin(dzial);
            };
            dzial.status = statusCheck.check('mod', dzial);
            produkcjaDzialStanowiska(dzial);
            vm.formMain.$setDirty();
        }

        function czasPracyCzyWzakresie(dzial, zakres) {
            var czasZakres = $filter('filter')(dzial.czasPracyZakres, { status: '!usuniety' });
            var wZakresie = false;
            for (var i = 0; i < czasZakres.length; i++) {
                var z = czasZakres[i];
                if ((zakres.czasStart >= z.czasStart && zakres.czasStart <= z.czasEnd) || (zakres.czasEnd>=z.czasStart && zakres.czasEnd<=z.czasEnd)) {
                    cF.info('warning', 'Dodanie nowego zakresu czasu pracy', 'Podany przedział czasu od: <strong>' + moment(zakres.czasStart).format("HH:mm") + '</strong> do <strong>' + moment(zakres.czasEnd).format("HH:mm") + '</strong> jest już w zakresie czasu pracy');
                    wZakresie = true;
                    break;
                }
            }
            return wZakresie;
        }

        function czasPracyZakresUtworz(dzial) {

            var dzienRoboczy = moment(vm.dataObj.dzienRoboczy);
           
            var czasStart = moment(dzienRoboczy.hour(6).minute(0).second(0).millisecond(0));
            var czasEnd = moment(czasStart).add(8,'hours');

            dzial.zakres.czasStart = new Date(czasStart);
            dzial.zakres.czasEnd = new Date(czasEnd);

            czasDurationChange(dzial);

        }

        function czasPracyZakresUsun(dzial, zakres) {
            var idx = dzial.czasPracyZakres.indexOf(zakres);
            var z = dzial.czasPracyZakres[idx];
            z.status = statusCheck.check('del', z);
            if (z.status == null) {
                dzial.czasPracyZakres.splice(idx, 1);
            }
            czasPracyZakresGodzin(dzial);
            dzial.status = statusCheck.check('mod', dzial);
            vm.formMain.$setDirty();
        }

        function czasPracyZakresSzablonUtworz(dzial) {
            if (!dzial.czasPracyZakresSzablonNazwaShow) {
                dzial.czasPracyZakresSzablonNazwaShow = true;
                return
            }
            if (dzial.czasPracyZakresSzablonNazwaShow && !dzial.czasPracyZakresSzablonNazwa) {
                dzial.czasPracyZakresSzablonNazwa = null;
                dzial.czasPracyZakresSzablonNazwaShow = false;
                return
            }

            cF.dialogTakNie('Zakres czasu, nowy szablon', 'Czy utworzyć w bazie szablon o nazwie <strong>' + dzial.czasPracyZakresSzablonNazwa + '</strong> ?').then(function (ok) {
                console.log('ok, zapisuje !');
                console.log(dzial);
                var tempRequest = {
                    nazwa: dzial.czasPracyZakresSzablonNazwa,
                    dzialProdukcyjny: dzial,
                    uwagi: 'póki co z hardcoded...'
                }
                
                dF.postData('KalendarzDniRoboczych/Szablon', tempRequest).then(function (res) {
                    console.log(res);
                    dzial.czasPracyZakresSzablonNazwa = '';
                    dzial.czasPracyZakresSzablonNazwaShow = false;
                    vm.danePomocnicze.szablon.push(res.result);
                }, function (error) {
                    console.log(error);
                });
            }, function (not) {
                console.log('nie zapisuję');
            });


        }

        function czasPracyZakresSzablonUsun(szablon) {
            cF.dialogTakNie('Zakres czasu, usuń szablon', 'Czy na pewno usunąć szablon o nazwie <strong>' + szablon.nazwa + '</strong> ?<br /><small> ?').then(function (ok) {
                dF.deleteData('kalendarzDniRoboczych/Szablon/'+szablon.kalendarzDniRoboczychSzablonId).then(function (res) {
                    var idx = vm.danePomocnicze.szablon.indexOf(szablon);
                    vm.danePomocnicze.szablon.splice(idx, 1);
                }, function (error) {

                });
            }, function (cancel) {
                
            })
        }

        function czasPracyZakresSzablonWczytaj(dzial, szablon) {
            var zakresCopy = angular.copy(dzial.czasPracyZakres);
            var zakresToKeep = [];
            for (var i = 0; i < zakresCopy.length; i++) {
                var z = zakresCopy[i];
                z.status = statusCheck.check('del', z);
                if (z.status == "usuniety") {
                    zakresToKeep.push(angular.copy(z));
                }
            }
            cF.dialogTakNie('Zakres czasu, wczytaj szablon', 'Czy wczytać szablon o nazwie <strong>' + szablon.nazwa + '</strong> ?<br /><small>Aktualne zakresy zostaną usunięte a na ich miejsce wczytany szablon</small>').then(function (ok) {
                dzial.czasPracyZakres = [];
                dzial.czasPracyZakres=angular.copy(szablon.dzialProdukcyjny.czasPracyZakres);
                angular.forEach(zakresToKeep, function (z) {
                    dzial.czasPracyZakres.push(z);
                });
                czasPracyZakresGodzin(dzial);
                dzial.status = statusCheck.check('mod', dzial);
                produkcjaDzialStanowiska(dzial);
            }, function (cancel) {
//                console.log('nie wczytuję..');



            });
        
        }

        function czasPracyZakresNaDzialyPrzygotuj() {
            if (vm.dataObj.produkcjaDzial.length == 0) {
                angular.forEach(vm.danePomocnicze.produkcjaDzial, function (dzial) {
                    var prodDzial = {
                        czasPracyZakres: [],
                        produkcjaDzial: dzial,
                        zakres: {},
                        zakresTemp: {},

                    }
                    vm.dataObj.produkcjaDzial.push(prodDzial);
                });
            } else {
                angular.forEach(vm.dataObj.produkcjaDzial, function (dzial) {
                    if (dzial.czasPracyDuration == null) {
                        dzial.czasPracyZakres = [];
                        dzial.zakres = {};
                        dzial.zakresTemp = {};
                        czasPracyZakresGodzin(dzial);
                    } else {
                        //gdy sa pobrane dane z bazy..
                        dzial.czasPracyEnd = new Date(dzial.czasPracyEnd);
                        dzial.czasPracyStart = new Date(dzial.czasPracyStart);
                        dzial.zakres = {};
                        dzial.zakresTemp = {};

                        czasPracyZakresGodzin(dzial);
                    }

                });

            }
        
        }

        function czasUstawNaDate(czas, data) {
            var dR = angular.isDate(data) ? data : moment(vm.dataObj.dzienRoboczy);
            var result = moment(czas).year(dR.year()).month(dR.month()).date(dR.date());
            return new Date(result);
        }

        function produkcjaDzialStanowiska(dzial) {
            if (dzial.produkcjaDzial.grupaRobocza===null) {
                for (var i = 0; i < vm.danePomocnicze.produkcjaDzial.length; i++) {
                    var item = vm.danePomocnicze.produkcjaDzial[i];
                    if (item.produkcjaDzialId == dzial.produkcjaDzial.produkcjaDzialId) {
                        dzial.produkcjaDzial.grupaRobocza = angular.copy(item.grupaRobocza);
                        break;
                    }

                }
            }
        }

        function getById(id) {
            var pProdukcjaDzial = dF.getData("bazaJednostek/produkcjaDzial");
            var pSzablon=dF.getData('kalendarzDniRoboczych/szablon')

            $q.all([pProdukcjaDzial, pSzablon]).then(function (data) {
                vm.danePomocnicze.produkcjaDzial = data[0];
                vm.danePomocnicze.szablon = data[1].result;

                if (vm.objId === 0) {
                    vm.dataObj.produkcjaDzial = [];
                    czasPracyZakresNaDzialyPrzygotuj();
                    vm.dataObj.dzienRoboczy = angular.isDate($state.current.data.day) == true ? new Date($state.current.data.day) : new Date();
                    $state.current.data.day = null;
                    zakresUstawDaty();
                    vm.dataObjCopy = angular.copy(vm.dataObj);
                    vm.startMode = true;
                } else {
                    dF.getData("kalendarzDniRoboczych/" + vm.objId).then(function (data) {
                        vm.dataObj = data.result;
                        vm.dataObj.dzienRoboczy = new Date(vm.dataObj.dzienRoboczy);
                        czasPracyZakresNaDzialyPrzygotuj();
                        zakresUstawDaty();
                        vm.startMode = true;
                        vm.dataObjCopy = angular.copy(vm.dataObj);
                    }, function (error) {
                    });
                }

            }, function (error) {
                powrot()
            })
        }

        function zakresUstawDaty() {
            angular.forEach(vm.danePomocnicze.szablon, function (dzial) {
                dzial.dzialProdukcyjny.czasPracyEnd = czasUstawNaDate(dzial.dzialProdukcyjny.czasPracyEnd);
                dzial.dzialProdukcyjny.czasPracyStart = czasUstawNaDate(dzial.dzialProdukcyjny.czasPracyStart);
                angular.forEach(dzial.dzialProdukcyjny.czasPracyZakres, function (z) {
                    z.czasStart = czasUstawNaDate(z.czasStart);
                    z.czasEnd = czasUstawNaDate(z.czasEnd);
                });
            });
            angular.forEach(vm.dataObj.produkcjaDzial, function (dzial) {
                dzial.zakres.czasStart = czasUstawNaDate(dzial.zakres.czasStart);
                dzial.zakres.czasEnd = czasUstawNaDate(dzial.zakres.czasEnd);
                if (dzial.czasPracyZakres && dzial.czasPracyZakres.length > 0) {
                    dzial.czasPracyEnd = czasUstawNaDate(dzial.czasPracyEnd);
                    dzial.czasPracyStart = czasUstawNaDate(dzial.czasPracyStart);
                    angular.forEach(dzial.czasPracyZakres, function (z) {
                        z.czasStart = czasUstawNaDate(z.czasStart);
                        z.czasEnd = czasUstawNaDate(z.czasEnd);
                    });
                }
            });
        }

        function navZapisz() {
            vm.inProgress = true;
            if (vm.dataObj.workingDayCloned && vm.objId > 0) {
                dF.deleteData('kalendarzDniRoboczych/' + vm.objId).then(function (response) {
                    dF.putData('kalendarzDniRoboczych/0', vm.dataObj).then(function (response) {
                        vm.inProgress = false;
                        powrot();
                    }, function (error) {
                        console.log(error);
                        vm.inProgress = false;
                    });
                }, function (err) { });
            } else {

                dF.putData('kalendarzDniRoboczych/' + vm.objId, vm.dataObj).then(function (response) {

                    vm.inProgress = false;
                    powrot();
                }, function (error) {
                    console.log(error);
                    vm.inProgress = false;
                });
            }

        }

        function workingDayToCloneByDate() {
            var vd = vm.workingDayToClone;
            var req = {
                dateStart: vd.day
            }
            var actDate = vm.dataObj.dzienRoboczy;

            dF.postData('KalendarzDniRoboczych/workingDayByDate', req).then(function (response) {
                if (response.workingDayId > 0) {
                    vd.caption = "Pobieram workingDayId: " + response.workingDayId+"...";
                    dF.getData("kalendarzDniRoboczych/" + response.workingDayId).then(function (data) {
                        console.log(data);
                        dzienRoboczyZrealizowanZamowieniaClear(data.result);
                        vm.dataObj = data.result;
                        vm.dataObj.workingDayCloned = true;
                        vm.dataObj.dzienRoboczy = actDate;
                        czasPracyZakresNaDzialyPrzygotuj();
                        zakresUstawDaty();
                        vd.caption = 'Sklonuj dzień roboczy';
                        vm.formMain.$setDirty();
                    }, function (error) {
                    });
                }
            }, function (error) {
                vd.caption = 'Sklonuj dzień roboczy';
            });


            function dzienRoboczyZrealizowanZamowieniaClear(dzien) {
                angular.forEach(dzien.produkcjaDzial, function (dzial) {
                    dzial.planningZamowienieKombiInfo = [];
                })
            }

        }

        function usun() {
            cF.dialogTakNie("Usuń", 'Czy na pewno chcesz usunąć cały dzień roboczy ?')
                    .then(function () {
                            dF.deleteData('kalendarzDniRoboczych/'+vm.objId).then(function (response) {
                                cF.info('warning', vm.title + ': Zapis w bazie danych', 'Usunięcie rekordu przebiegło prawidłowo');
                                vm.navIdzDo();
                            }, function (error) {
                                cF.info("error", vm.title, "Błąd danych", error);
                            });
                    }, function (cancel) {

                    });
        }

        function powrot() {
            $state.go("kalendarzDniRoboczych");
        }
    }
})();

