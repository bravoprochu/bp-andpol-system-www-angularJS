(function() {
    'use strict';

    angular
        .module('app')
        .directive('normaRobocizna', normaRobocizna);

    normaRobocizna.$inject = ['$filter','statusCheck'];
    
    function normaRobocizna ($filter, statusCheck) {
        // Usage:
        //     <normaRobocizna></normaRobocizna>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/content/norma/normaRobocizna.html',
            scope: {
                selectedItems:'=',
                produkcjaDzial: '=',
                watchForm:'='
            },
            //controller: normaRobociznaCtrl,
            //controllerAs:'vm'
        };
        return directive;

        function link(scope, element, attrs) {
            if (angular.isUndefined(scope.selectedItems)) {
                scope.selectedItems = [];
            }
            scope.dataChanged = dataChanged;
            scope.wybranyDzial = angular.copy(scope.produkcjaDzial[0]);
            scope.produkcjaDzialAdd = produkcjaDzialAdd;
            scope.produkcjaDzialChange = produkcjaDzialChange;
            scope.produkcjaDzialRemove = produkcjaDzialRemove;
            scope.produkcjaDzialWybrane = [];

            scope.grupaRoboczaAdd = grupaRoboczaAdd;
            scope.grupaRoboczaRemove = grupaRoboczaRemove;
            scope.grupaRoboczaChange = grupaRoboczaChange;



            produkcjaDzialWybranePrzelicz();
            produkcjaDzialDostPrzelicz();
            scope.startMode = true;
            init();

            
            function init() {
                angular.forEach(scope.selectedItems, function (dzial) {
                    angular.forEach(dzial.grupaRoboczaWybrane, function (grupaRobocza) {
                        grupaRoboczaChange(dzial)
                    })
                })
            }


            function dataChanged(dzial, grupaRobocza) {
                dzial.status = statusCheck.check('mod', dzial);
                if (angular.isDefined(grupaRobocza)) {
                    grupaRobocza.status = statusCheck.check('mod', grupaRobocza);
                }
            }

            function findById(where, idxField, id) {
                var res = undefined;
                for (var i = 0; i < where.length; i++) {
                    var whereEntity = where[i];
                    var whereEntityField = whereEntity[idxField];

                    if (whereEntityField == id) {
                        res = whereEntity;
                        break;
                        console.log("znalazlem !!!");
                    }
                }
                return res;
            }

            function grupaRoboczaChange(dzial) {
                grupaRoboczaWybranePrzelicz(dzial);
                grupaRoboczaDostPrzelicz(dzial);
            }

            function grupaRoboczaDostPrzelicz(dzial) {
                dzial.grupaRoboczaDost = $filter('roznica')(dzial.produkcjaDzial.grupaRobocza, dzial.grupaRoboczaWybraneTemp, 'id', 'id');
            }

            function grupaRoboczaAdd(dzial, dzialRoboczy) {
                if (dzialRoboczy == undefined) { return }
                dzial.status = statusCheck.check('mod', dzial);
                var t = findById(dzial.grupaRoboczaWybrane, 'robociznaId', dzialRoboczy.id);
                if (t !== undefined) {
                    dzialRoboczy.status = statusCheck.check('add', dzialRoboczy);
                } else {
                    dzialRoboczy.status = statusCheck.check('add', dzialRoboczy);
                    var temp = {
                        robocizna: dzialRoboczy,
                        robociznaId:dzialRoboczy.id,
                        wartosc: 1,
                        status: 'nowy'
                    };
                    dzial.grupaRoboczaWybrane.push(temp);
                }
                grupaRoboczaWybranePrzelicz(dzial);
                grupaRoboczaDostPrzelicz(dzial);
            }

            function grupaRoboczaRemove(dzial, dzialRoboczy) {
                dzial.status = statusCheck.check('mod', dzial);
                dzialRoboczy.status = statusCheck.check('del', dzialRoboczy);

                if (dzialRoboczy.status == null) {
                
                    var idx = dzial.grupaRoboczaWybrane.indexOf(dzialRoboczy);
                    console.log(idx);
                    dzial.grupaRoboczaWybrane.splice(idx,1)
                
                }

                grupaRoboczaChange(dzial);
                scope.watchForm.$setDirty();

            }

            function grupaRoboczaWybranePrzelicz(dzial) {
                dzial.grupaRoboczaWybraneTemp = [];
                if (dzial.grupaRoboczaWybrane.length > 0) {
                    for (var i = 0; i < dzial.grupaRoboczaWybrane.length; i++) {
                        var item = dzial.grupaRoboczaWybrane[i];
                        if (item.robocizna != null) {
                            {
                                if (dzial.grupaRoboczaWybraneTemp == undefined) { dzial.grupaRoboczaWybraneTemp = []; }
                                if (item.status != 'usuniety') {
                                    dzial.grupaRoboczaWybraneTemp.push(item.robocizna);
                                }
                            }
                        }
                    }
                }
            }

            function produkcjaDzialAdd(dzial) {
                var t = findById(scope.selectedItems, 'produkcjaDzialId', dzial.produkcjaDzialId);
                if (t !== undefined) {
                    t.status = statusCheck.check('add', t);
                } else {
                    var temp = {
                        produkcjaDzial: angular.copy(dzial),
                        produkcjaDzialId: dzial.produkcjaDzialId,
                        grupaRoboczaWybrane: [],
                        grupaRoboczaWybraneTemp: [],
                        grupaRoboczaDost: angular.copy(dzial.grupaRobocza),
                        wartosc: 30,
                        status: 'nowy'
                    }
                    scope.selectedItems.push(temp);
                }
                produkcjaDzialWybranePrzelicz();
                produkcjaDzialDostPrzelicz();
            }

            function produkcjaDzialChange(dzial) {
                dzial.grupaRoboczaDost = [];
                dzial.grupaRoboczaWybrane = [];
                dzial.grupaRoboczaWybraneTemp = [];

            }

            function produkcjaDzialDostPrzelicz() {
                scope.produkcjaDzialDost= $filter('roznica')(scope.produkcjaDzial, scope.produkcjaDzialWybrane, 'produkcjaDzialId', 'produkcjaDzialId');
            }

            function produkcjaDzialRemove(dzial) {
                var t = findById(scope.selectedItems, 'produkcjaDzialId', dzial.produkcjaDzialId);
                if (t !== undefined) {
                    t.status = statusCheck.check('del', t);

                    if (t.status == null) {
                        var idx = scope.selectedItems.indexOf(t);
                        scope.selectedItems.splice(idx, 1);
                    }
                }
                produkcjaDzialWybranePrzelicz();
                produkcjaDzialDostPrzelicz();
                scope.watchForm.$setDirty();
            }

            function produkcjaDzialWybranePrzelicz() {
                scope.produkcjaDzialWybrane = [];
                if (scope.selectedItems.length > 0) {
                    for (var i = 0; i < scope.selectedItems.length; i++) {
                        var item = scope.selectedItems[i];
                        if (item.produkcjaDzial != null) {
                            {
                                if (item.status != 'usuniety') {
                                    scope.produkcjaDzialWybrane.push(item.produkcjaDzial);
                                }
                            }
                        }
                    }
                }
            }

        }
    }



})();

