(function () {
    'use strict';

    angular
        .module('app')
        .directive('datyDokumentu', datyDokumentu);

    datyDokumentu.$inject = ['$window'];

    function datyDokumentu($window) {
        // Usage:
        //     <datyDokumentu></datyDokumentu>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                isDisabled:'=',
                ref: '=',
            },
            templateUrl: 'app/content/finanse/finanseShared/datyDokumentu.html'
        };
        return directive;

        function link(scope, element, attrs) {
            var pozycje = attrs["pozycje"];
            scope.pozycje = angular.isDefined(pozycje) ? parseInt(pozycje) : 0

            switch (scope.pozycje) {
                case 1:
                    scope.ref.dataWystawienia = angular.isDefined(scope.ref.dataWystawienia) ? scope.ref.dataWystawienia : new Date();

                    break;
                case 2:
                    scope.ref.dataWystawienia = angular.isDefined(scope.ref.dataWystawienia) ? scope.ref.dataWystawienia : new Date();
                    scope.ref.dataSprzedazy = angular.isDefined(scope.ref.dataSprzedazy) ? scope.ref.dataSprzedazy : new Date();
                    break;
                default:
                    scope.ref.dataWystawienia = angular.isDefined(scope.ref.dataWystawienia) ? scope.ref.dataWystawienia : new Date();
                    scope.ref.dataSprzedazy = angular.isDefined(scope.ref.dataSprzedazy) ? scope.ref.dataSprzedazy : new Date();
                    scope.ref.dataWplywu = angular.isDefined(scope.ref.dataWplywu) ? scope.ref.dataWplywu : new Date();
            }



            scope.datyTeSame = function (typDaty) {
                if (!scope.datyRazem) { return; }

                switch (typDaty) {
                    case 'wystawienia':
                        scope.ref.dataSprzedazy = scope.ref.dataWystawienia;
                        scope.ref.dataWplywu = scope.ref.dataWystawienia;
                        break;
                    case 'sprzedazy':
                        scope.ref.dataWystawienia = scope.ref.dataSprzedazy;
                        scope.ref.dataWplywu = scope.ref.dataSprzedazy;
                        break;
                    case 'wplywu':
                        scope.ref.dataSprzedazy = scope.ref.dataWplywu;
                        scope.ref.dataWystawienia = scope.ref.dataWplywu;
                        break;
                }
            }
        }
    }

})();