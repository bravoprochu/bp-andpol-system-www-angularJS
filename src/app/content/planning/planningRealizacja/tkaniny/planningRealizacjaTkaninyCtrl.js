(function () {
    'use strict';

    angular
        .module('app')
        .controller('planningRealizacjaTkaninyCtrl', planningRealizacjaTkaninyCtrl);

    planningRealizacjaTkaninyCtrl.$inject = ['dataFactory']; 

    function planningRealizacjaTkaninyCtrl(dF) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Planning TkaninyBelka - realizacja';
        vm.subTitle= 'Raport zrealizowanych obszyć'

        vm.getData = getData;
        vm.dataObj = {};

        vm.navZapisz = navZapisz;

        activate();
        
            vm.startMode = true;

        function activate() {
            
            vm.dataObj.dzienRoboczy = new Date(moment().hour(0));
            getData();
        }


        function getData(date) {
            vm.isLoading = true;
            date = angular.isDefined(date) == true ? date : new Date();
            var dataToPost = {
                dzienRoboczy:vm.dataObj.dzienRoboczy
            }

            dF.postData('planning/realizacjaTkaniny/', dataToPost).then(function (res) {
                console.log(res);
                vm.dataObj.obszyciaByBelka = res.obszyciaByBelka;
                vm.dataObj.planningInfo = res.planningInfo;
                vm.isLoading = false;

            }, function (error) {
                vm.isLoading = false;
            });
        }

        function navZapisz() {
            vm.isLoading = true;
            dF.postData('planning/realizacjaTkaninyUpdate', vm.dataObj.obszyciaByBelka).then(function (res) {
                console.log(res);
                vm.dataObj.obszyciaByBelka = res.result;

                vm.isLoading = false;
            }, function (error) {
                vm.isLoading = false;
            });
        }
    }
})();
