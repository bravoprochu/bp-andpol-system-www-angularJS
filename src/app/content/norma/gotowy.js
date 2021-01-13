(function () {
    'use strict';

    angular
        .module('app')
        .directive('gotowy', gotowy);

    gotowy.$inject = ['$filter', 'commonFunctions'];

    function gotowy($filter, cF) {
        // Usage:
        //     <gotowy></gotowy>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: 'app/content/norma/gotowy.html',
            scope: {
                daneId: '@',
                danePomocnicze: '=',
                drugaWartosc: '@',
                formMain: '=',
                naglowek: '@',
                parentIndex: '@',
                selectedItems: '='
            },
        };
        return directive;

        function link(scope, element, attrs) {

            scope.danePomocniczeCopy = angular.copy(scope.danePomocnicze);

            scope.dostepne = dost;
            scope.gotowyChange = gotowyChange;
            scope.gotowyUsun = gotowyUsun;
            scope.wartoscChange = wartoscChange;

            //            scope.formName = scope.FormMain["frm_"+$filter('camelCase')(scope.naglowek)];
            //            console.log(scope.parentIndex);



            function dost() {
                return $filter('roznica')(scope.danePomocniczeCopy, $filter('filter')(scope.selectedItems, { status: '!usuniety' }), scope.daneId, 'idRef');
                // return $filter('roznica')(scope.danePomocniczeCopy, scope.selectedItems, 'id', 'idRef');
            }


            function gotowyChange(dane) {
                if (angular.isDefined(dane)) {

                    var found = false;
                    var foundId = 0;
                    for (var i = 0; i < scope.selectedItems.length; i++) {
                        var selected = scope.selectedItems[i];
                        if (selected.idRef == dane[scope.daneId]) {
                            foundId = selected[scope.daneId];
                            found = true;
                            break;
                        }
                    }


                    if (found) {
                        var usunieta = znajdz(foundId);
                        usunieta.status = "zmieniony";
                    } else {
                        dane.status = "nowy";
                        if (angular.isUndefined(dane.idRef)) {
                            dane.idRef = dane[scope.daneId];
                        }
                        scope.selectedItems.push(dane);
                    }

                }
            }

            function wartoscChange(pozycja) {
                pozycja.status = cF.statusCheck("mod", pozycja);
            }

            function znajdz(id) {
                for (var i = 0; i < scope.selectedItems.length; i++) {
                    if (scope.selectedItems[i].id == id) {
                        return scope.selectedItems[i];
                    }
                }
            }

            function gotowyUsun(dane) {
                if (dane.status === null) {
                    var idx = scope.selectedItems.indexOf(dane);
                    scope.selectedItems.splice(idx, 1);
                } else {
                    dane.status = cF.statusCheck('del', dane);
                }
                scope.formMain.$setDirty();
            }

            scope.start = true;


        }
    }

})();