(function() {
    'use strict';

    angular
        .module('app')
        .directive('sessionEndsD', sessionEndsD);

    sessionEndsD.$inject = ['$interval', '$mdMedia', '$window', '$rootScope', 'commonFunctions', 'currentUser'];
    
    function sessionEndsD($interval, $mdMedia, $window, $rootScope, cF, currentUser) {
        // Usage:
        //     <sessionEndsD></sessionEndsD>
        // Creates:
        var directive={
            templateUrl: 'app/common/sessionEndsD.html',
            scope: true,
            controller: ctrl,
            controllerAs:'vm'
        };
        
        return directive;

        function ctrl() {
            /*jshint validthis: true */
            var vm = this;
            vm.isLoggedIn = false;
            vm.sessionEnds = '';
            vm.koniecSesji = 'Sprawdzam stan sesji..';
            vm.clearProfile = currentUser.clearProfile;
            vm.menuIsOpen = false;
            vm.screenSmall = $mdMedia('sm');



            $rootScope.$watch('isLoggedIn', function (newValue) {
                if (newValue) {
                    vm.sessionTimer = $interval(function () {
                        currentUser.sessionInProgress()
                        .then(function (data) {
                            vm.isLoggedIn = true;
                            vm.sessionEnds = data.info;
                            vm.userName = data.userName;
                            vm.roles = data.roles;
                        });
                    }, 1000);

                } else {
                    $interval.cancel(vm.sessionTimer);
                    wypad();
                }
                    
            });

            

            function wypad() {
                cF.info("warning", "Sesja", "Aktywna sesja się skończyła, zaloguj się ponownie...");
                vm.isLoggedIn = false;
                vm.koniecSesji = 'Koniec sesji...';
                currentUser.clearProfile();
                return;
            }
        }
    }

})();