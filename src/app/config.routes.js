(function () {
    'use strict';

    var app = angular.module('app')
        .config(appRoutes);


    appRoutes.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function appRoutes($stateProvider, $urlRouterProvider, $locationProvider) {

        authorizeFn.$inject = ['$q', 'currentUser', 'commonFunctions'];

        function authorizeFn($q, currentUser, cF) {
            return currentUser.isAuthorized(this.data.viewName);
        };

        //        $locationProvider.html5Mode(true);

        $urlRouterProvider.when('', 'dashboard');
        $urlRouterProvider.otherwise('notFound');

        $stateProvider

            .state('main', {
                abstract: true,
                templateUrl: 'app/common/start.html',
                data: {
                    authorizationRequired: true
                }
            })

            .state('login', {
                url: "/login",
                templateUrl: "app/common/login.html",
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })

            .state('notFound', {
                url: "/notFound",
                templateUrl: "app/common/notFound.html",
                controller: 'notFoundCtrl',
                controllerAs: 'vm'
            })

            .state('authorizationError', {
                parent: 'main',
                url: '/authorizationError',
                templateUrl: 'app/common/authorizationError.html'
            })




            .state('dashboard', {
                parent: 'main',
                url: "/dashboard",
                templateUrl: "app/content/dashboard/dashboard.html",

                resolve: {
                    authorize: authorizeFn
                },
                controller: 'dashboardCtrl',
                controllerAs: 'vm',

                data: {
                    label: 'Dashboard',
                    viewName: 'Dashboard'
                }
            })


            .state('brygadzista', {
                parent: 'main',
                url: "/brygadzista",
                templateUrl: "app/content/produkcja/brygadzista/brygadzista.html",

                resolve: {
                    authorize: authorizeFn
                },
                controller: 'brygadzistaCtrl',
                controllerAs: 'vm',

                data: {
                    nazwaGrupy: 'Produkcja',
                    label: 'Brygadzista',
                    viewName: 'Brygadzista'
                }
            })

            .state('brygadzistaTkaniny', {
                parent: 'main',
                url: "/brygadzistaTkaniny",
                templateUrl: "app/content/planning/planningRealizacja/tkaniny/planningRealizacjaTkaniny.html",
                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Produkcja',
                    label: 'Brygadzista - Tkaniny',
                    viewName: 'Brygadzista'
                },
                controller: 'planningRealizacjaTkaninyCtrl',
                controllerAs: 'vm',
            })

            .state('platnosci', {
                parent: 'main',
                url: "/platnosci",
                templateUrl: "app/content/finanse/platnosci/platnosci.html",

                resolve: {
                    authorize: authorizeFn
                },
                controller: 'platnosciCtrl',
                controllerAs: 'vm',

                data: {
                    nazwaGrupy: 'Finanse',
                    label: 'Płatność przypomnienie',
                    viewName: 'FinansePrzypomnieniePlatnosci'
                }
            })

            .state('platnosciZaplacone', {
                parent: 'main',
                url: "/platnosciZaplacone",
                templateUrl: "app/content/finanse/platnosci/platnosciZaplacone.html",

                resolve: {
                    authorize: authorizeFn
                },
                controller: 'platnosciZaplaconeCtrl',
                controllerAs: 'vm',

                data: {
                    nazwaGrupy: 'Finanse',
                    label: 'Płatność przypomnienie - zapłacone',
                    viewName: 'FinansePrzypomnieniePlatnosci'
                }
            })

            .state('kontrahent', {
                parent: 'main',
                url: "/kontrahent",
                templateUrl: "app/content/kontrahent/kontrahent.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Kontrahent',
                    label: 'Kontrahenci',
                    viewName: 'Kontrahent'
                },
                controller: 'kontrahentCtrl',
                controllerAs: 'vm',
            })

            .state('kontrahentDetail', {
                parent: 'main',
                url: "/kontrahent/:id",
                templateUrl: "app/content/kontrahent/kontrahentDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Kontrahent'
                },
                controller: 'kontrahentDetailCtrl',
                controllerAs: 'vm',
            })

            .state('nazwyKombinacji', {
                parent: 'main',
                url: "/nazwyKombinacji",
                templateUrl: "app/common/viewBasic.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Normy',
                    label: 'Nazwy kombinacji',
                    viewName: 'Normy'
                },
                controller: 'nazwyKombinacjiCtrl',
                controllerAs: 'vm',
            })

            .state('nazwyKombinacjiDetail', {
                parent: 'main',
                url: "/nazwyKombinacji/:id",
                templateUrl: "app/common/viewSzczegoly.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Normy'
                },
                controller: 'nazwyKombinacjiDetailCtrl',
                controllerAs: 'vm',
            })

            .state('material', {
                parent: 'main',
                url: "/material",
                templateUrl: "app/content/tkaniny/material/material.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Tkaniny',
                    label: 'Nazwy grup tkanin',
                    viewName: 'Tkaniny'
                },
                controller: 'materialCtrl',
                controllerAs: 'vm',
            })

            .state('materialDetail', {
                parent: 'main',
                url: "/material/:id",
                templateUrl: "app/content/tkaniny/material/materialDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Tkaniny'
                },
                controller: 'materialDetailCtrl',
                controllerAs: 'vm',
            })

            .state('tkaninaBelka', {
                parent: 'main',
                url: "/tkaninaBelka",
                templateUrl: "app/content/tkaniny/tkaninaBelka/tkaninaBelka.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Tkaniny',
                    label: 'Ewidencja belek tkanin',
                    viewName: 'TkaninyBelki'
                },
                controller: 'tkaninaBelkaCtrl',
                controllerAs: 'vm',
            })

            .state('tkaninaBelkaDetail', {
                parent: 'main',
                url: "/tkaninaBelka/:id",
                templateUrl: "app/content/tkaniny/tkaninaBelka/tkaninaBelkaDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'TkaninyBelki'
                },
                controller: 'tkaninaBelkaDetailCtrl',
                controllerAs: 'vm',
            })

            .state('magPozycjaMagazynowa', {
                parent: 'main',
                url: "/magPozycjaMagazynowa",
                templateUrl: "app/content/magazyn/pozycjaMagazynowa/magPozycjaMagazynowa.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Magazyn',
                    label: 'Pozycje magazynowe',
                    viewName: 'MagazynPozycjaMagazynowa'
                },
                controller: 'magPozycjaMagazynowaCtrl',
                controllerAs: 'vm',
            })

            .state('magPozycjaMagazynowaDetail', {
                parent: 'main',
                url: "/magPozycjaMagazynowa/:id",
                templateUrl: "app/content/magazyn/pozycjaMagazynowa/magPozycjaMagazynowaDetail.html",

                resolve: {
                    //                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'MagazynPozycjaMagazynowa'
                },
                controller: 'magPozycjaMagazynowaDetailCtrl',
                controllerAs: 'vm',
            })

            .state('magMagazyn', {
                parent: 'main',
                url: "/magMagazyn",
                templateUrl: "app/content/magazyn/pozycjaMagazynowa/magPozycjaMagazynowa.html",

                resolve: {
                    //authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Magazyn',
                    label: 'Pozycje magazynowe [magazynier]',
                    viewName: 'MagazynMagazynier'
                },
                controller: 'magPozycjaMagazynowaCtrl',
                controllerAs: 'vm',
            })

            .state('magMagazynDetail', {
                parent: 'main',
                url: "/magMagazyn/:id",
                templateUrl: "app/content/magazyn/pozycjaMagazynowa/magPozycjaMagazynowaDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'MagazynMagazynier'
                },
                controller: 'magPozycjaMagazynowaDetailCtrl',
                controllerAs: 'vm',
            })

            .state('magPZ', {
                parent: 'main',
                url: "/magPZ",
                templateUrl: "app/content/magazyn/pz/magPz.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Magazyn',
                    label: 'PZ - Przyjęcia zewnętrzne',
                    viewName: 'MagazynPz',
                },
                controller: 'magPzCtrl',
                controllerAs: 'vm',
            })

            .state('magPZDetail', {
                parent: 'main',
                url: "/magPz/:id",
                templateUrl: "app/content/magazyn/pz/magPzDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'MagazynPz'
                },
                controller: 'magPzDetailCtrl',
                controllerAs: 'vm',
            })

            .state('magWz', {
                parent: 'main',
                url: "/magWz",
                templateUrl: "app/content/magazyn/wz/magWz.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Magazyn',
                    label: 'WZ - Wydania zewnętrzne',
                    viewName: 'MagazynWz',
                },
                controller: 'magWzCtrl',
                controllerAs: 'vm',
            })

            .state('magWzDetail', {
                parent: 'main',
                url: "/magWz/:id",
                templateUrl: "app/content/magazyn/wz/magWzDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'MagazynWz'
                },
                controller: 'magWzDetailCtrl',
                controllerAs: 'vm',
            })

            .state('pzTkaniny', {
                parent: 'main',
                url: "/pzTkaniny",
                templateUrl: "app/content/tkaniny/pzTkaniny/pzTkaniny.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Tkaniny',
                    label: 'PZ Tkaniny - Przyjęcia zewnętrzne',
                    viewName: 'TkaninyPz'
                },
                controller: 'pzTkaninyCtrl',
                controllerAs: 'vm',
            })

            .state('pzTkaninyDetail', {
                parent: 'main',
                url: "/pzTkaniny/:id",
                templateUrl: "app/content/tkaniny/pzTkaniny/pzTkaninyDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'TkaninyPz'
                },
                controller: 'pzTkaninyDetailCtrl',
                controllerAs: 'vm',
            })

            .state('obszycie', {
                parent: 'main',
                url: "/obszycie",
                templateUrl: "app/common/viewBasic.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Normy',
                    label: 'Obszycie elementów kombinacji',
                    viewName: 'Normy'
                },
                controller: 'obszycieCtrl',
                controllerAs: 'vm',
            })

            .state('obszycieDetail', {
                parent: 'main',
                url: "/obszycie/:id",
                templateUrl: "app/common/viewSzczegoly.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Normy'
                },
                controller: 'obszycieDetailCtrl',
                controllerAs: 'vm',
            })

            .state('fakturaZakupu', {
                parent: 'main',
                url: "/fakturaZakupu",
                templateUrl: "app/content/finanse/fakturaZakupu/fakturaZakupu.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Finanse',
                    label: 'Faktury zakupów',
                    viewName: 'FinanseFaktury'
                },
                controller: 'fakturaZakupuCtrl',
                controllerAs: 'vm',
            })

            .state('fakturaZakupuDetail', {
                parent: 'main',
                url: "/fakturaZakupu/:id",
                templateUrl: "app/content/finanse/fakturaZakupu/fakturaZakupuDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'FinanseFaktury'
                },
                controller: 'fakturaZakupuDetailCtrl',
                controllerAs: 'vm',
            })

            .state('fakturaSprzedazy', {
                parent: 'main',
                url: "/fakturaSprzedazy",
                templateUrl: "app/content/finanse/fakturaSprzedazy/fakturaSprzedazy.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Finanse',
                    label: 'Faktury sprzedazy',
                    viewName: 'FinanseFaktury'
                },
                controller: 'fakturaSprzedazyCtrl',
                controllerAs: 'vm',
            })

            .state('fakturaSprzedazyDetail', {
                parent: 'main',
                url: "/fakturaSprzedazy/:id",
                templateUrl: "app/content/finanse/fakturaSprzedazy/fakturaSprzedazyDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'FinanseFaktury'
                },
                controller: 'fakturaSprzedazyDetailCtrl',
                controllerAs: 'vm',
            })

            .state('planning', {
                parent: 'main',
                url: "/planning",
                templateUrl: "app/content/planning/planning.html",
                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Planning',
                    label: 'Planowanie produkcji',
                    viewName: 'Planning'
                },
                controller: 'planningCtrl',
                controllerAs: 'vm',
            })

            .state('planningDetail', {
                parent: 'main',
                url: "/planning/:id",
                templateUrl: "app/content/planning/planningDetail.html",
                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    viewName: 'Planning'
                },
                controller: 'planningDetailCtrl',
                controllerAs: 'vm',
            })

            .state('politykaCenowa', {
                parent: 'main',
                url: "/politykaCenowa",
                templateUrl: "app/content/finanse/politykaCenowa/politykaCenowa.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Finanse',
                    label: 'Polityka cenowa',
                    viewName: 'FinansePolitykaCenowa'
                },
                controller: 'politykaCenowaCtrl',
                controllerAs: 'vm',
            })

            .state('politykaCenowaDetail', {
                parent: 'main',
                url: "/politykaCenowa/:id",
                templateUrl: "app/content/finanse/politykaCenowa/politykaCenowaDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'FinansePolitykaCenowa'
                },
                controller: 'politykaCenowaDetailCtrl',
                controllerAs: 'vm',
            })

            .state('produkcjaDzial', {
                parent: 'main',
                url: "/produkcjaDzial",
                templateUrl: "app/content/system/produkcjaDzial/produkcjaDzial.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Planning',
                    label: 'Działy produkcyjne',
                    viewName: 'Planning'
                },
                controller: 'produkcjaDzialCtrl',
                controllerAs: 'vm',
            })

            .state('stanowiska', {
                parent: 'main',
                url: "/stanowiska",
                templateUrl: "app/content/produkcja/stanowiska/stanowiska.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Planning',
                    label: 'Stanowiska',
                    viewName: 'Planning'
                },
                controller: 'stanowiskaCtrl',
                controllerAs: 'vm',
            })

            .state('stanowiskaDetail', {
                parent: 'main',
                url: "/stanowiska/:id",
                templateUrl: "app/content/produkcja/stanowiska/stanowiskaDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Planning'
                },
                controller: 'stanowiskaDetailCtrl',
                controllerAs: 'vm',
            })

            .state('wykonczenie', {
                parent: 'main',
                url: "/wykonczenie",
                templateUrl: "app/content/wykonczenia/wykonczenie.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Normy',
                    label: 'Wykończenia - nazwy elementów',
                    viewName: 'Normy'
                },
                controller: 'wykonczenieCtrl',
                controllerAs: 'vm',
            })

            .state('wykonczenieDetail', {
                parent: 'main',
                url: "/wykonczenie/:id",
                templateUrl: "app/content/wykonczenia/wykonczenieDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Normy'
                },
                controller: 'wykonczenieDetailCtrl',
                controllerAs: 'vm',
            })

            .state('wykonczenieGrupa', {
                parent: 'main',
                url: "/wykonczenieGrupa",
                templateUrl: "app/content/wykonczenia/wykonczenieGrupa.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Normy',
                    label: 'Wykończenie - nazwy grup',
                    viewName: 'Normy'
                },
                controller: 'wykonczenieGrupaCtrl',
                controllerAs: 'vm',
            })

            .state('wykonczenieGrupaDetail', {
                parent: 'main',
                url: "/wykonczenieGrupa/:id",
                templateUrl: "app/common/viewSzczegoly.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Normy'
                },
                controller: 'wykonczenieGrupaDetailCtrl',
                controllerAs: 'vm',
            })

            .state('norma', {
                parent: 'main',
                url: "/norma",
                templateUrl: "app/content/norma/norma.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Normy',
                    label: 'Ewidencja norm',
                    viewName: 'Normy'
                },
                controller: 'normaCtrl',
                controllerAs: 'vm',
            })

            .state('normaDetail', {
                parent: 'main',
                url: "/norma/:id",
                templateUrl: "app/content/norma/normaDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Normy'
                },
                controller: 'normaDetailCtrl',
                controllerAs: 'vm',
            })


            .state('kalendarzDniRoboczych', {
                parent: 'main',
                url: "/kalendarzDniRoboczych",
                templateUrl: "app/content/planning/kalendarzDniRoboczych/kalendarzDniRoboczych.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Planning',
                    label: 'Kalendarz Dni Roboczych',
                    viewName: 'Planning'
                },
                controller: 'kalendarzDniRoboczychCtrl',
                controllerAs: 'vm',
            })

            .state('kalendarzDniRoboczychDetail', {
                parent: 'main',
                url: "/kalendarzDniRoboczych/:id",
                templateUrl: "app/content/planning/kalendarzDniRoboczych/kalendarzDniRoboczychDetail.html",
                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Planning',
                },
                controller: 'kalendarzDniRoboczychDetailCtrl',
                controllerAs: 'vm',
            })

            .state('qrCodeWydruk', {
                //            parent: 'main',
                url: "/qrCodeWydruk",
                templateUrl: "app/common/qrCodeWydruk.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'QrCode',
                    label: 'QrCode - Wydruk etykiet',
                    viewName: 'QrCode'
                },
                controller: 'qrCodeWydrukCtrl',
                controllerAs: 'vm',
            })

            .state('qrCodeWydrukDetail', {
                parent: 'main',
                url: "/qrCodeWydruk/:id",
                templateUrl: "app/common/qrCodeWydrukDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'QrCode'
                },
                controller: 'qrCodeWydrukDetailCtrl',
                controllerAs: 'vm',
            })

            .state('register', {
                parent: 'main',
                url: "/register",
                templateUrl: "app/common/register.html",
                controller: 'registerCtrl',
                controllerAs: 'vm',
            })

            .state('usersManagement', {
                parent: 'main',
                url: "/usersManagement",
                templateUrl: "app/content/system/usersManagement/usersManagement.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'System',
                    label: 'Zarządzanie użytkownikami',
                    viewName: 'Admin'
                },
                controller: 'usersManagementCtrl',
                controllerAs: 'vm',
            })

            .state('zamowienie', {
                parent: 'main',
                url: "/zamowienie",
                templateUrl: "app/content/zamowienie/zamowienie.html",

                resolve: {
                    authorize: authorizeFn
                },

                data: {
                    nazwaGrupy: 'Zamowienia',
                    label: 'Zamówienia',
                    viewName: 'Zamowienia'
                },
                controller: 'zamowienieCtrl',
                controllerAs: 'vm',
            })

            .state('zamowienieDetail', {
                parent: 'main',
                url: "/zamowienie/:id",
                templateUrl: "app/content/zamowienie/zamowienieDetail.html",

                resolve: {
                    authorize: authorizeFn,
                },

                data: {
                    viewName: 'Zamowienia'
                },
                controller: 'zamowienieDetailCtrl',
                controllerAs: 'vm',
            });

    };
})();