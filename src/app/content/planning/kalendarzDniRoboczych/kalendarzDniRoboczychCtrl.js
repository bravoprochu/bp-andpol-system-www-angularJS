(function () {
    'use strict';

    angular
        .module('app')
        .controller('kalendarzDniRoboczychCtrl', kalendarzDniRoboczychCtrl);

    kalendarzDniRoboczychCtrl.$inject = ['$filter', '$q','$state', '$stateParams', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function kalendarzDniRoboczychCtrl($filter, $q, $state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Kalendarz Dni Roboczych';
        vm.subTitle = '';

        vm.danePomocnicze = {};
        vm.dataObj = {};
        vm.startMode = false;
        vm.idzDo = idzDo;

        vm.dateRange = dateRange;
        vm.miechNext = miechNext;
        vm.miechPrev = miechPrev;


  
        activate();

        function activate() {
            getById();
        }

        function dateRange(dateStart) {
            cF.dateRange(null, 'KalendarzDniRoboczych', false).then(function (res) {
                vm.inProgress = true;
                vm.info = '';
                getData(res);
            });
        }

        function getById() {
            var dateRange = monthBasedOnDate(moment());
            var kalendarz = dF.postData("kalendarzDniRoboczych/dateRange", dateRange);

            $q.all([kalendarz]).then(function (data) {
                vm.dataObj.kalendarz = data[0].result;
                vm.subTitle = data[0].info;
                vm.startMode = true;
            }, function (error) {
                
            })


        }

        function getData(dateRange) {
            vm.inProgress = true;
            dF.postData('kalendarzDniRoboczych/dateRange', dateRange).then(function (data) {
                vm.dataObj.kalendarz = data.result;
                vm.subTitle = data.info;
                vm.inProgress = false;
            }, function (error) {
                vm.inProgress = false;
            });
        }

        function idzDo(param, dzienRoboczy) {
            $state.get('kalendarzDniRoboczychDetail').data.day =new Date(dzienRoboczy);
            $state.go('kalendarzDniRoboczychDetail', { id: param});
        }

        function miechNext() {
            var actMiech = moment(vm.dataObj.kalendarz.dateEnd).add(1,'M');
            getData(monthBasedOnDate(actMiech));
        };

        function miechPrev() {
            var actMiech = moment(vm.dataObj.kalendarz.dateStart).subtract(1, 'M');
            getData(monthBasedOnDate(actMiech));
        };

        function monthBasedOnDate(date) {
            var result = {};
            result.dateStart = moment(date).date(1);
            result.dateEnd = moment(date).endOf('month');
            return result
        }
    }
})();

