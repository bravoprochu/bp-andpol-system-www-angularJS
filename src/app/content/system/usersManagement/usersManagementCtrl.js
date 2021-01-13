(function () {
    'use strict';

    angular
        .module('app')
        .controller('usersManagementCtrl', usersManagementCtrl);

    usersManagementCtrl.$inject = ['$q', '$state', '$stateParams', 'commonFunctions', 'dataFactory', 'statusCheck'];

    function usersManagementCtrl($q, $state, $stateParams, cF, dF, statusCheck) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Zarządzanie uprawnieniami użytkowników';
        vm.subTitle = '';

        vm.navZapisz = navZapisz;

        vm.brygadzistaAddNew = brygadzistaAddNew;
        vm.brygadzistaDelete = brygadzistaDelete;


        vm.dataObj = {};
        vm.danePomocnicze = {};
        vm.isDetail = true;
        vm.objId = parseInt($stateParams.id);
        vm.startMode = false;
        vm.userRoleChange = userRoleChange;
        vm.userRoleDelete = userRoleDelete;
        vm.usun = usun;




        activate();

        function activate() {
            getById();
        }

        function brygadzistaAddNew() {
            var dataToAdd = {
                user: vm.brygadzista.user,
                produkcjaDzial: vm.brygadzista.produkcjaDzial,
            }

            var brygInBaza = brygadzistaCheckIfExist(dataToAdd);
            if (brygInBaza < 0) {
                dataToAdd.status = statusCheck.check('add', dataToAdd);
                vm.dataObj.brygadzista.push(dataToAdd)
                vm.formMain.$setDirty();
            } else {
                vm.dataObj.brygadzista[brygInBaza].status = statusCheck.check('add', vm.dataObj.brygadzista[brygInBaza]);
            }
        }

        function brygadzistaCheckIfExist(bryg) {
            var found = -1
            for (var i = 0; i < vm.dataObj.brygadzista.length; i++) {
                var brygadzistaBaza=vm.dataObj.brygadzista[i];
                if (bryg.user.nazwa == brygadzistaBaza.user.nazwa && bryg.produkcjaDzial.produkcjaDzialId==brygadzistaBaza.produkcjaDzial.produkcjaDzialId) {
                    found = i;
                    break;
                }
            }
            return found;
        }

        function brygadzistaDelete(bryg)
        {
            bryg.status = statusCheck.check('del', bryg);
            if (bryg.status == null) {
                vm.dataObj.brygadzista.splice(vm.dataObj.brygadzista.indexOf(bryg), 1);
            } else {
                vm.formMain.$setDirty();
            }
        }

        function getById() {
            var produkcjaDzial = dF.getData('bazaJednostek/produkcjaDzial');
            var usersMng = dF.getData('usersManagement');

            $q.all([usersMng, produkcjaDzial]).then(function (data) {
                vm.danePomocnicze.roles = data[0].roles;
                vm.danePomocnicze.users = data[0].users;
                vm.danePomocnicze.produkcjaDzial = data[1];
                vm.dataObj.users = data[0].users;
                vm.dataObj.brygadzista = angular.isDefined(data[0].brygadzista)==true ? data[0].brygadzista : [];
                vm.dataObjCopy = angular.copy(vm.dataObj);
                vm.startMode = true;
            }, function (error) {
            });

        }

        function navZapisz() {
            vm.navZapiszDisabled = true;
            cF.dialogTakNie(vm.title, "Czy na pewno zapisać dane w bazie ?").then(function (response) {
                dF.postData('usersManagement', vm.dataObj).then (function (response) {
                    getById();
                    vm.startMode = false;
                }, function (error) {
                });
            }, function (responseNot) {

            });
        }


        function userRoleDelete(user) {
            cF.dialogTakNie(vm.title, "Czy na pewno chcesz usunąć użytkownika " + user.nazwa + " ?").then(function (response) {
                user.status = statusCheck.check('del', user);
                vm.formMain.$setDirty();
            }, function (responseNot) {

            });
            
        }

        function userRoleChange(user) {
            console.log(user.userRole);

        }

        function usun() {
            dF.obszycie.del({ id: vm.objId }, function (response) {
                cF.info('warning', vm.title + ': Zapis w bazie danych', 'Usunięcie rekordu przebiegło prawidłowo');
                vm.navIdzDo();
            }, function (error) {
                cF.info("error", vm.title, "Błąd danych", error);
            });
        }
    }
})();
