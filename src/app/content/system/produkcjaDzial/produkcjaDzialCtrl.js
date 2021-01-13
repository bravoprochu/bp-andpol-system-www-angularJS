(function () {
    'use strict';

    angular
        .module('app')
        .controller('produkcjaDzialCtrl', produkcjaDzialCtrl);

    produkcjaDzialCtrl.$inject = ['$q','$filter','$mdDialog','commonFunctions','dataFactory']; 

    function produkcjaDzialCtrl($q, $filter, $mdDialog, cF, dF) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Działy produkcyjne';
        vm.subtitle = 'Zarządzanie'
        vm.danePomocnicze = {};


        vm.dzialSave = dzialSave;
        vm.dzialDelete = dzialDelete;

        vm.nowyDzial = {
            produkcjaDzialId:0
        }
        
        activate();

        function activate() {
            getData();
        }

        function getData() {
            var planningProdukcjaDzial=dF.getData('planning/produkcjaDzial');
            var dzialyProdukcyjne=dF.getData('bazaJednostek/produkcjaDzial');
            
            
            $q.all([planningProdukcjaDzial,dzialyProdukcyjne,])
                .then(function (res) {
                    vm.dataObj = res[0];
                    vm.danePomocnicze.produkcjaDzial = res[1];
                    vm.dataObjCopy = angular.copy(res[0]);

                    vm.startMode = true;

                }, function (err) {
                    vm.startMode = true;
                });
        }


        function dzialSave(dzial)
        {
            vm.inProgress = true;
            cF.dialogTakNie('Czy na pewno zapisać zmiany dla działu ' + dzial.nazwa + ' ?').then(function (tak) {
                dF.putData('planning/produkcjaDzial/' + dzial.produkcjaDzialId, dzial).then(function (res) {
                    var form = vm.formMain["form_" + dzial.produkcjaDzialId];
                    form.$setPristine();

                    if (dzial.produkcjaDzialId == 0) {
                        vm.dataObj.push(res.data);
                        vm.danePomocnicze.produkcjaDzial.push(res.data);
                        vm.nowyDzial = {
                            produkcjaDzialId: 0
                        };
                        vm.nowyShow = false;
                        getData();

                        
                    }
                    vm.inProgress = false;
                }, function (error) {
                    vm.inProgress = false;
                });
            }, function (nie) {

            })
        }

        function dzialDelete(dzial)
        {
            vm.inProgress=true
            cF.dialogTakNie('Czy na pewno usunąć dział ' + dzial.nazwa + ' ?').then(function (tak) {
                dF.deleteData('planning/produkcjaDzial/'+ dzial.produkcjaDzialId).then(function (res) {
                    vm.dataObj.splice(vm.dataObj.indexOf(dzial), 1);
                    vm.inProgress = false;

                }, function (error) {});
            }, function (nie) {

            })
        }

    }
})();
