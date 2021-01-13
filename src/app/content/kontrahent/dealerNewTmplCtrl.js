(function () {
    'use strict';

    angular
        .module('app')
        .controller('dealerNewTmplCtrl', dealerNewTmplCtrl);

    dealerNewTmplCtrl.$inject = ['$mdDialog'];

    function dealerNewTmplCtrl($mdDialog, dataToPass) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'dealerNewTmplCtrl';

        vm.answer = answer;
        vm.cancel = cancel;
        vm.dealerNew = dataToPass;



        function hide() {
            $mdDialog.hide();
        }

        function cancel() {
            console.log("cancel...");
        }

        function answer(answer) {
            $mdDialog.hide(answer);
        }

    }
})();
