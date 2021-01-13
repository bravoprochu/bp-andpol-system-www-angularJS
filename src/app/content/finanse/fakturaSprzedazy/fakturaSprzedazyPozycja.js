(function () {
    'use strict';

    angular
        .module('app')
        .directive('fakturaSprzedazyPozycja', fakturaSprzedazyPozycja);

    fakturaSprzedazyPozycja.$inject = ['commonFunctions'];

    function fakturaSprzedazyPozycja(cF) {
        // Usage:
        //     <fakturaSprzedazyPozycja></fakturaSprzedazyPozycja>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                czyKorekta: '=',
                danePomocnicze: '=',
                fakPozPrzelicz: '&',
                pozRemove: '&',
                readOnly: '=',
                ref: '=',
                stateId: '=',
                typ:'@'
                
            },
            templateUrl: 'app/content/finanse/fakturaSprzedazy/fakturaSprzedazyPozycja.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.dissByType = dissByType;
            scope.ref.podatekStawka = scope.ref.podatekStawka == null ?
                scope.danePomocnicze[cF.findInArr(scope.danePomocnicze, 4, 'jednPodatekStawkaId')] :
                scope.ref.podatekStawka;
            scope.fakturaPozycjaRemove = fakturaPozycjaRemove;
            scope.fakturaPozycjePrzelicz = fakturaPozycjePrzelicz;


            scope.$watch('czyKorekta', function (newVal) {
                scope.korekta = newVal;
                dissByType();
            })

            scope.$watch('ref.ilosc', function (newVal, oldVal) {
                fakturaPozycjePrzelicz();
            });

            function dissByType()
            {
                switch (scope.typ) {
                    case "przed":
                        scope.dissValue = true;
                        scope.dissName = true;
                        break;
                    case "zmiana":
                        scope.dissValue = true;
                        scope.dissName = true;
                        break;
                    case "po":
                        scope.dissName = false;
                        scope.dissValue = false;
                        //scope.dissValue = scope.korekta || scope.stateId==0 ? false : true;
                        //scope.dissName = scope.ref.status != "nowy" ? true : false;
                        break;
                }
            }

            function fakturaPozycjePrzelicz()
            {
                if (scope.ref.podatekStawka == null) { return; }
                    scope.ref.wartosc = scope.ref.wartosc && scope.typ=='zmiana' ? scope.ref.wartosc : scope.ref.ilosc * scope.ref.wartoscJedn;
                    scope.ref.podatekWartosc = scope.ref.wartosc * scope.ref.podatekStawka.wartosc;
                    scope.fakPozPrzelicz()(scope.ref);
            }

            function fakturaPozycjaRemove() {
                scope.pozRemove()(scope.ref)
            }

        }
    }

})();