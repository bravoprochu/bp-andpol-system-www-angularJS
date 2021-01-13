(function () {
    'use strict';


    angular.module('app', [
        'ngLocale',
        'ngMaterial',
        'ui.router',
        'ngResource',
        'ngMessages',
        'ngAnimate',
        'ngSanitize',
        'toastr',
        'md.data.table',
        //'monospaced.qrcode',
        'ja.qr',
        'chart.js',
        //'qrScanner',
    ]).run(appRun);



    appRun.$inject = ['$rootScope', '$state', 'currentUser'];

    function appRun($rootScope, $state, cL) {
        moment.locale('PL');
        cL.getProfileFromLocalStorage();

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, options) {
            event.preventDefault();
            $state.go('authorizationError');
        });
    }


})();