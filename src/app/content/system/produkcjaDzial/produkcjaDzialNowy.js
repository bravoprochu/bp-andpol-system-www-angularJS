(function() {
    'use strict';

    angular
        .module('app')
        .directive('produkcjaDzialNowy', produkcjaDzialNowy);

    produkcjaDzialNowy.$inject = ['$mdDialog'];
    
    function produkcjaDzialNowy ($mdDialog) {
        // Usage:
        //     <produkcjaDzialNowy></produkcjaDzialNowy>
        // Creates:
        // 
        var directive = {
            link: link,
            scope:{
                dzial: '=',
                inProgress:'=',
                produkcjaDzial: '=',
                deleteFn: '&',
                saveFn: '&',
                formWewn:'=formMain'
            },
            restrict: 'E',
            templateUrl:'app/content/system/produkcjaDzial/produkcjaDzialNowy.html'
        };
        return directive;

        function link(scope, element, attrs) {

            scope.copyDzial = angular.copy(scope.dzial);

            scope.dzialNadrzednyEditModal = dzialNadrzednyEditModal;
            scope.dzialCancel = dzialCancel;
            scope.dzialDelete = dzialDelete;
            scope.dzialSave = dzialSave;

            function dzialCancel() {
                scope.dzial = angular.copy(scope.copyDzial);
                scope.formMain.$setPristine();
            }

            function dzialDelete() {
                scope.deleteFn()(scope.dzial);
            }

            function dzialSave() {
                scope.saveFn()(scope.dzial);
            }


            function dzialNadrzednyEditModal(dzial) {
                console.log(dzial);
                dzialyNadrzednePrepare();
                $mdDialog.show({
                    templateUrl: 'app/content/system/produkcjaDzial/produkcjaDzialNadrzednyWybor.html',
                    controller: dzialNadrzednyCtrl,
                    controllerAs: 'vm',
                    bindToController: true,
                    locals: {
                        produkcjaDzial: scope.dzial,
                        danePomocnicze: scope.dzial.dzialyNadrzedne
                    }

                }).then(function (res) {
                    console.log(res);
                    dzial.nadrzednyIdsLista = angular.copy(res);
                    dzial.nadrzednyIds = res.toString();
                    scope.formMain.$setDirty();


                }, function (cancel) { });


                function dzialNadrzednyCtrl() {

                    var vm = this;
                    vm.dialogClose = dialogClose;
                    vm.dialogUpdate = dialogUpdate;

                    init();

                    function init() {
                        vm.wybrane = [];
                        angular.forEach(vm.locals.produkcjaDzial.nadrzednyIdsLista, function (id) {
                            for (var i = 0; i < vm.locals.danePomocnicze.length; i++) {
                                var item = vm.locals.danePomocnicze[i];
                                if (item.produkcjaDzialId == id) {
                                    vm.wybrane.push(item);
                                }
                            }
                        });
                    }


                    function dialogClose() {
                        $mdDialog.cancel();
                    }

                    function dialogUpdate() {
                        var result = [];
                        angular.forEach(vm.wybrane, function (wybr) {
                            result.push(wybr.produkcjaDzialId);
                        })
                        $mdDialog.hide(result);
                    }


                };

            }

            function dzialyNadrzednePrepare() {

                    scope.dzial.dzialyNadrzedne = [];
                    for (var i = 0; i < scope.produkcjaDzial.length; i++) {
                        var item = scope.produkcjaDzial[i];
                       
                        if (item.produkcjaDzialId != scope.dzial.produkcjaDzialId && item.poziomProdukcji == scope.dzial.poziomProdukcji-1) {
                            scope.dzial.dzialyNadrzedne.push(angular.copy(item));
                        }
                    }

            };
        
        }
    }

})();