(function() {
    'use strict';

    angular
        .module('app')
        .directive('selectPomocnicze', selectPomocnicze);

    selectPomocnicze.$inject = ['$filter', 'statusCheck'];
    
    function selectPomocnicze ($filter, statusCheck) {
        // Usage:
        //     <selectPomocnicze></selectPomocnicze>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: 'app/common/directives/selectPomocnicze.html',
            scope: {
                danePomocnicze: '=',
                formName: '=?',
                idzDo: '&?',
                inputName:'@',
                placeholder: '@',
                required: '@',
                searchText: '=?',
                statusUpdate:'=',
                selectedItem: '=',
            },
        };
        return directive;

        function link(scope, element, attrs) {

            scope.pomocniczeSearch = pomocniczeSearch;
            scope.pomocniczeWybierz = pomocniczeWybierz;

            IdzDoSprawdzStatus();



            scope.$watch("selectedItem", function (newVal) {
                if (angular.isDefined(newVal)) {
                    pomocniczeWybierz(newVal);
                }
            });



            scope.$watchCollection("danePomocnicze", function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.danePomocnicze = newVal;
                }
            });

            function IdzDoSprawdzStatus() {
                return scope.idzDo === undefined ? scope.idzDoUndefined = true : scope.idzDoUndefined = false;
            }


            function pomocniczeSearch() {
                if (scope.searchText === null) {
                    scope.selectedItem = undefined;
                    return scope.danePomocnicze;
                } else
                {
                    return $filter('filter')(scope.danePomocnicze, scope.searchText);
                }
            }

            function pomocniczeWybierz(pomocnicze) {
                if (pomocnicze === null || pomocnicze===undefined) { return }
                if (pomocnicze!==null) { scope.searchText = pomocnicze.nazwa; }
                if (angular.isDefined(scope.statusUpdate)) {
                    scope.statusUpdate.status = statusCheck.check('mod', scope.statusUpdate);
                }
            }



        }
    }

})();