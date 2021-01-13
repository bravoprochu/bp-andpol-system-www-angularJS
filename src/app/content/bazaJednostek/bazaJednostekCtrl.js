(function () {
    'use strict';

    angular
        .module('app')
        .controller('bazaJednostekCtrl', bazaJednostekCtrl);

    bazaJednostekCtrl.$inject = ['$state', '$stateParams', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function bazaJednostekCtrl($state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Baza jednostek';
        vm.subTitle = 'Ewidencja towarów - edycja/tworzenie';


        vm.danePomocnicze = {
            grupa: [
                { grupaId: 1, nazwa: 'Ogólna' },
                { grupaId: 2, nazwa: 'Stolarnia' },
                {grupaId: 3, nazwa: 'Tapicernia'}
            ],
            vat: [
                { vatId: 1, nazwa: '23 %', value:0.23},
                { vatId: 2, nazwa: '8 %', value: 0.08},
                { vatId: 3, nazwa: '6 %', },
                { vatId: 4, nazwa: '5 %', },
                { vatId: 5, nazwa: '3 %', },
                { vatId: 6, nazwa: '0 %', value: null },
                { vatId: 7, nazwa: '8 %', value: null },
            ],
            jednostka: [
                { jednostkaId: 1, nazwa: 'szt.' },
                { jednostkaId: 2, nazwa: '100 szt.' },
                { jednostkaId: 3, nazwa: 'kpl.' },
                { jednostkaId: 4, nazwa: 'kg' },
                { jednostkaId: 5, nazwa: 'm2' },
            ],
            marza: [
                { marzaId: 1, nazwa: 'domyślna marża 20%', value: 0.2 },
                { marzaId: 2, nazwa: 'pianki 150%', value: 1.5 },
                { marzaId: 3, nazwa: 'hurtowo 15%', value: 0.15 },
                { marzaId: 4, nazwa: 'zerowa 0%', value: 0 },
            ]
        };
        vm.idzDo = idzDo;
        vm.isSmall = cF.isScreenSmall();

        vm.navZapisz = navZapisz;

        vm.dataObj = {};
        vm.objId = parseInt($stateParams.id);
        vm.usun = usun;




        activate();

        function activate() {
            getById();
        }

        function getById() {
            vm.startMode = true;
        }



        function navZapisz() {
            vm.navZapiszDisabled = true;
            dF.putData('magPozycjaMagazynowa' + vm.objId, vm.dataObj).then(function (response) {
                idzDo();
            }, function (error) {
                console.log(error);
            });
        }


        function usun() {
            dialogsService.confirm("Usuń", 'Czy na pewno chcesz usunąć ' + vm.dataObj.nazwa + ' ?')
                    .then(function () {
                        dF.delData('magPozycjaMagazynowa'+vm.objId).then(function (response) {
                            idzDo();
                        }, function (error) {
                        });
                    }, function () {

                    });
        }

    }
})();
