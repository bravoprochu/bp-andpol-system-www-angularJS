(function() {
    'use strict';

    angular
        .module('app')
        .directive('planningZamowienieKombiInfo', planningZamowienieKombiInfo);

    planningZamowienieKombiInfo.$inject = [];
    
    function planningZamowienieKombiInfo () {
        // Usage:
        //     <planningZamowienieKombiInfo></planningZamowienieKombiInfo>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope:{
                danePomocnicze: '=',
                title: '@',
                subTitle:'@',
                isOpen: '@',
                isDisabled: '@',
                line1: '@',
                line2: '@',
                line3: '@',
                parentForm:'='

            },
            templateUrl:'app/content/planning/planningZamowienieKombiInfo.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.dataChange = dataChange;
            scope.doneAll = doneAll;
            scope.isOver = isOver;
            scope.elementyZaplanowaneShow = angular.isDefined(scope.isOpen)==true ? scope.isOpen : false;



            function dataChange(zam) {
                zam.status = "zmieniony";
            }


            function doneAll(filtered, isDone) {
                angular.forEach(filtered, function (zam) {
                    zam.isDone = isDone;
                    dataChange(zam)
                });
                scope.parentForm.$setDirty();
            }

            function isOver($event) {
                $event.stopImmediatePropagation();
            }

        }
    }

})();