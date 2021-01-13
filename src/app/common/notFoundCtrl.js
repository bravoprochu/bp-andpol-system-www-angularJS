(function () {
    'use strict';

    angular
        .module('app')
        .controller('notFoundCtrl', notFoundCtrl);

    notFoundCtrl.$inject = ['$state', 'commonFunctions']; 

    function notFoundCtrl($state, cF) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'notFoundCtrl';
        vm.idzDo = idzDo;

        function idzDo() {
            $state.go('dashboard');
        }
    }
})();
