(function () {
    'use strict';

    angular
        .module('app')
        .factory('userAccount', userAccount);

    userAccount.$inject = ['$resource', 'appSettings'];

    function userAccount($resource, appSettings) {
              
        return {
            registration: $resource(appSettings.registerUrl, null,
            {
                'registerUser': {
                    method: 'POST'
                },
            }),
            login: $resource(appSettings.loginUrl, null,
            {
                'loginUser': {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    transformRequest: function (data, headersGetter) {
                        var str = [];
                        for (var d in data) {
                            str.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                        }
                        return str.join("&");
                    }
                },
            }),
        };
    }
})();