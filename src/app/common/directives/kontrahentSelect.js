(function() {
    'use strict';

    angular
        .module('app')
        .directive('kontrahentSelect', kontrahentSelect);

    kontrahentSelect.$inject = ['$filter'];
    
    function kontrahentSelect ($filter) {

        var directive = {
            link: link,
            templateUrl:'app/common/directives/kontrahentSelect.html',
            restrict: 'EA',
            scope: {
                selectedItem: '=',
                danePomocnicze: '=',
                isDiss:'=',
                name: '@',
                title: '@'
            },
            //controller: kontrahentSelectCtrl,
            //controllerAs:'vm'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.title = angular.isDefined(scope.title) ? scope.title : 'Wybierz kontrahenta ';
            scope.isDisabled = angular.isDefined(attrs["isDisabled"]) ? false : scope.isDisabled ;
            scope.kontrahenci = $filter('limitTo')(scope.danePomocnicze, 5);
            scope.kontrahentSearch = kontrahentSearch;
            scope.kontrahentSelected = scope.selectedItem;
            scope.kontrahentWybierz = kontrahentWybierz;

            scope.$watch('selectedItem', function (newVal, oldVal) {
                if (newVal != null || newVal != oldVal || newVal != undefined) {
                    scope.kontrahentSelected = newVal;
                }
            });


            function kontrahentSearch() {
                if (scope.kontrahentSearchText === null) { return scope.kontrahenci; } else {
                    var res = $filter('filter')(scope.danePomocnicze, scope.kontrahentSearchText);
                    return $filter('limitTo')(res, 5);
                }
            }

            function kontrahentWybierz(kontrahent) {
                scope.selectedItem = kontrahent;
                scope.kontrahent = kontrahent;
            }

        }
    }

})();