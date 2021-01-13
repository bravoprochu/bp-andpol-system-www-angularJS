(function () {
    'use strict';

    angular
        .module('app')
        .directive('kontrahentDealerSelect', kontrahentDealerSelect);

    kontrahentDealerSelect.$inject = ['commonFunctions'];

    function kontrahentDealerSelect(cF) {
        // Usage:
        //     <kontrahentDealerSelect></kontrahentDealerSelect>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                danePomocnicze: '=',
                selectedItem: '='
            },
            templateUrl: 'app/common/directives/kontrahentDealerSelect.html'
        };
        return directive;

        function link(scope, element, attrs) {


        }
    }

})();