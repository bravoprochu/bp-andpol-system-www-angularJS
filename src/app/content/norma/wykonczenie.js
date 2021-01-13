(function () {
    'use strict';

    angular
        .module('app')
        .directive('wykonczenie', wykonczenie);

    wykonczenie.$inject = ['$filter', '$mdDialog', 'statusCheck'];

    function wykonczenie($filter, $mdDialog, statusCheck) {
        // Usage:
        //     <wykonczenie></wykonczenie>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/norma/wykonczenie.html',
            require: '^form',
            scope: {
                naglowek: '@',
                wykonczenieNazwa: '@',
                selectedItems: '=',
                danePorownanie: '@',
                danePomocnicze: '=',
                danePomocniczeGrupa: '@',
                politykacenowa: '=',
                usun: '&'
            }
        };

        return directive;

        function link(scope, element, attrs, formMain) {
            scope.start = false;
            scope.politykaCenowaDodaj = politykaCenowaDodaj;
            scope.politykaCenowaUsun = politykaCenowaUsun;

            scope.wykonczenieDodaj = wykonczenieDodaj;
            scope.wykonczenieUsun = wykonczenieUsun;
            scope.dost = [];

            scope.wszystkieDodaj = wszystkieDodaj;
            scope.wszystkieUsun = wszystkieUsun;

            danePomocniczeGet();



            function danePomocniczeGet() {
                var data = angular.copy($filter('filter')(scope.danePomocnicze, { wykonczenieGrupa: { nazwa: scope.danePomocniczeGrupa } }));
                var selected = $filter('filter')(scope.selectedItems, { wykonczenieGrupa: { nazwa: scope.danePomocniczeGrupa } });
                scope.dost = statusCheck.przygotujDostepne(selected, angular.copy($filter('filter')(scope.danePomocnicze, { wykonczenieGrupa: { nazwa: scope.danePomocniczeGrupa } })), scope.danePorownanie);
                scope.start = true;
            }

            function wykonczenieDodaj(selectedItems) {
                //                    formRef.$setDirty();
                formMain.$setDirty();

                var idx = scope.dost.indexOf(selectedItems);
                scope.dost.splice(idx, 1);
                selectedItems.status = statusCheck.check('mod', selectedItems);
                scope.selectedItems.push(selectedItems);
            }

            function politykaCenowaDodaj(wykonczenie) {
                $mdDialog.show(dlgOpt).then(function (ok) {
                    if(ok.politykaCenowa){
                        wykonczenie.czyPolitykaCenowa=true;
                        wykonczenie.politykaCenowa=ok.politykaCenowa
                    } else {
                        wykonczenie.czyPolitykaCenowa=false;
                        wykonczenie.politykaCenowa=null;
                    }
                    wykonczenie.ilosc = ok.ilosc > 0 ? ok.ilosc : undefined;
                    wykonczenie.status=statusCheck.check('mod', wykonczenie);
                    formMain.$setDirty();
                })
                                console.log(wykonczenie);
            }

            function politykaCenowaUsun(wykonczenie) {
                wykonczenie.czyPolitykaCenowa=false;
                wykonczenie.politykaCenowa = null;
                wykonczenie.status=statusCheck.check('mod', wykonczenie);
                formMain.$setDirty();
                console.log(wykonczenie);
            }

            function wykonczenieUsun(selectedItems) {
                // formRef.$setDirty();
                formMain.$setDirty();
                var daneDoUsuniecia = angular.copy(selectedItems);

                if (selectedItems.status == "baza") {
                    selectedItems.status = statusCheck.check("del", selectedItems);
                } else {
                    var idx = scope.selectedItems.indexOf(selectedItems);
                    scope.selectedItems.splice(idx, 1);
                }
                scope.dost.push(daneDoUsuniecia);
            }

            function wszystkieDodaj() {
                angular.forEach(scope.dost, function (d) {
                    d.status = statusCheck.check('add', d);
                    scope.selectedItems.push(d);
                });
                scope.dost = [];
            }

            function wszystkieUsun() {
                var result = [];
                angular.forEach(scope.selectedItems, function (d) {
                    scope.dost.push(angular.copy(d));
                    d.status = statusCheck.check('del', d);
                    result.push(angular.copy(d));
                });
            }


            var dlgOpt = {
                bindToController: true,
                controller: function () {
                    var vm = this;
                    vm.selectedItem = undefined;
                    vm.dost = vm.locals.politykaCenowa;
                    vm.zapisz = function () {
                        var res = {
                            politykaCenowa: vm.selectedItem,
                            ilosc: vm.ilosc
                        }
                        $mdDialog.hide(res);
                    }
                    vm.anuluj = function () {
                        $mdDialog.cancel()
                    }
                },
                locals: {
                    politykaCenowa: scope.politykacenowa,
                },
                controllerAs: 'vm',
                templateUrl: 'app/content/norma/politykaCenowaAddDlg.html'


            }

        }

    }


})();