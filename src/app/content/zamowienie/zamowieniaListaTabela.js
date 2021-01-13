(function() {
    'use strict';

    angular
        .module('app')
        .directive('zamowieniaListaTabela', zamowieniaListaTabela);

    zamowieniaListaTabela.$inject = ['commonFunctions'];
    
    function zamowieniaListaTabela (cF) {
        // Usage:
        //     <zamowieniaListaTabela></zamowieniaListaTabela>
        // Creates:
        // 
        var directive = {
            link: link,
            scope:{
                source: '=',
                title: '@',
                idzDo: '&',
                rowSelect:'='
            },
            restrict: 'E',
            templateUrl: 'app/content/zamowienie/zamowieniaListaTabela.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.table = {
                order: '-zamowienieId',
                limit: 10,
                page: 1,
                searchShow: false,
                rowLimitOpt: scope.source.length > 100 ? [10, 30, 100, scope.source.length] : [10, 30, 100],
                search: cF.tableSearch,
                edit: scope.idzDo(),
                rowSelect: scope.rowSelect
            };


            function tableSearch() {
                if (scope.table.searchShow === true) {
                    scope.table.searchText = '';
                }
                scope.table.searchShow = !scope.table.searchShow;
            }


            
        }
    }

})();