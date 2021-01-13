(function () {
    'use strict';

    angular
        .module('app')
        .controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$mdDialog', '$q', 'commonFunctions', 'dataFactory'];

    function dashboardCtrl($mdDialog, $q, cF, dF) {
        /* jshint validthis:true */
        var vm = this;

        vm.title = 'Dashboooardus';
        vm.subTitle = 'opissss i info...';
        vm.danePomocnicze = {};
        vm.dataObj = [];
        vm.dodajSprawe = dodajSprawe;

        vm.table = {
            limit: 10,
            order: '-dataZgloszenia',
            page: 1,
            rowLimitOpt: [5, 15, 100],
            searchText: '',
            searchShow: false,
            search: function () {
                if (vm.table.searchShow === true) {
                    vm.table.searchText = '';
                }
                vm.table.searchShow = !vm.table.searchShow;
            },
            edit: idzDo
        };

        activate();

        function activate() {
            getData();
        }



        function dodajSprawe() {
            var sprawkiDlg = $mdDialog.show({
                controller: dodajSpraweCtrl,
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/sprawkiTmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,

            });

            dodajSpraweCtrl.$inject=['$resource', 'currentUser', 'dataFactory'];
            function dodajSpraweCtrl($resource, currentUser, dF) {
                var vm = this;

                vm.navZapisz = navZapisz;
                vm.navAnuluj = navAnuluj;
                vm.data = {
                    //tytul: 'Kółko jest do bani',
                    //opis: 'Dlaczego po pojawieniu się tego robi się inaczej, czy nie mogłoby być jak..',
                    //grupa: 'kontrahenci',
                    priorytet: 1,
                    zglaszajacy: currentUser.getProfile().userEmail

                };


                function navAnuluj() {
                    $mdDialog.cancel('to po co dupe trujesz');
                }

                function navZapisz() {
                    dF.postData('sprawki', vm.data).then(function (data) {
                        $mdDialog.hide(data);
                    }, function (error) {

                    });
                }
            };

            sprawkiDlg.then(function (data) {
                vm.dataObj.sprawki.push(data);
            }, function (error) {
                console.log(error);
            });
        }

        function getData() {
            var pChangeLog = dF.getData('changeLog');
            var pSprawki = dF.getData('sprawki');

            $q.all([pChangeLog, pSprawki]).then(function (data) {
                vm.danePomocnicze.changeLog = data[0];
                vm.dataObj.sprawki = data[1];
                vm.startMode = true;

            }, function (error) {

            });
        }

        function idzDo(param) {

        }


    }
})();
