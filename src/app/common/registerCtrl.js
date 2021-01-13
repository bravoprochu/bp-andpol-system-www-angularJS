(function () {
    'use strict';

    angular
        .module('app')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$state','$timeout','commonFunctions', 'dataFactory', 'userAccount'];

    function registerCtrl($state, $timeout, cF, dataFactory, userAccount) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'Rejestracja';
        vm.subTitle='Tworzenie nowego użytkownika';
        vm.dataObj = {

        };
        vm.startMode = true;

        vm.register = register;

        function register() {
            vm.formSubmited = true;
            var userData = {
                "Email": vm.dataObj.email,
                "Password": vm.dataObj.password,
                "ConfirmPassword": vm.dataObj.rePassword
            };

            vm.alerts = [];

            userAccount.registration.registerUser(userData,
                function (data) {
                    cF.info('success', "Rejestracja", "Zarejestrowano użytkownika ! " + vm.dataObj.email);
                    $timeout(function () {
                        vm.formSubmited = false;
                        vm.dataObj = {};
                        $state.go('dashboard');
                    }, 3000);
                    
                },
            function (response) {
                vm.formSubmited = false;

                if (response.status == -1) { cF.info('warning', 'Register', 'Jakiś globalny błąd serwera... Proszę to zgłosić administratorowi'); }
                else
                if (angular.isDefined(response.data.modelState)) {
                        var modelState = response.data.modelState;
                        angular.forEach(modelState, function (state) {
                            cF.info('warning', 'Register', state[0]);
                        });
                }
            });
           
        }
    }
})();
