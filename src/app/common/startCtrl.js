(function () {
    'use strict';

    angular
        .module('app')
        .controller('startCtrl', startCtrl);

    startCtrl.$inject = ['$mdDialog', '$mdMedia', '$rootScope', '$state','$window', 'commonFunctions', 'currentUser'];

    function startCtrl($mdDialog, $mdMedia, $rootScope, $state, $window, cF, currentUser) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'startCtrl';
        vm.isLoggedIn = false;
        //        vm.isSmall = $mdMedia('sm') || $mdMedia('md');
        vm.isSmall = cF.isScreenSmall;
        vm.contenHeaderHeight = 60;
        vm.contentMainHeight = $window.innerHeight - vm.contenHeaderHeight-100;
        vm.contentFooterHeight = 40;
        vm.idzDo = idzDo;
        vm.logIn = logIn;
        vm.menu = [];
        vm.menuIsOpen = true;
        vm.przygotujMenu = przygotujMenu;

        $rootScope.$watch('menuIsOpen', function (newVal) {
            vm.menuIsOpen = newVal;
        });

        $rootScope.$watch('isLoggedIn', function (newVal) {
            if (newVal) {
                przygotujMenu();
                vm.isLoggedIn = true;
            } else {
                vm.isLoggedIn = false;
                cF.info('error', "Nie jest zalogowany !");
                vm.menu = [];
            }
        });

        function idzDo(link) {
            $state.go(link);
        }

        function logIn() {
            var roles = $state.current.data.viewName;
            currentUser.loginDlg().then(function (res) {
                if (currentUser.checkRoles(roles)) {
                    return
                } else {
                    cF.info('warning', 'Routing', 'Brak autoryzacji');
                    $state.go('authorizationError');
                }
            }, function (rej) {

            });
        }
        
        function przygotujMenu() {
            var profile = currentUser.getProfile();
            var menu = [];
            angular.forEach($state.get(), function (state) {

                //pozbieraj grupy:

                if (angular.isDefined(state.data) && angular.isDefined(state.data.viewName) && angular.isDefined(state.data.label)) {
                    angular.forEach(profile.roles, function (role) {
                        if (role == state.data.viewName) {
                            vm.menu.push(state);
                        }
                    });
                }
            });
        }
        
    }
})();
