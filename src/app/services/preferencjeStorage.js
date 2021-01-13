(function () {
    'use strict';

    angular
        .module('app')
        .factory('preferencjeStorage', preferencjeStorage);

    preferencjeStorage.$inject = ['$window','currentUser'];

    function preferencjeStorage($window, currentUser) {
        var userName =currentUser.getProfile().userEmail.replace('.', '');
        var localData = {}
       
        var service = {
            clear: clear,
            clearByKey:clearByKey,
            get: get,
            getByKey: getByKey,
            put: put
        };



        return service;

        function clear() {
            if (storageExists()) {
                $window.localStorage.removeItem(userName);
            }
        }

        function clearByKey(key) {
            if (storageExists()) {
                var store = get();
                delete store[key];
                storageSave(store);
            }
        }

        function getByKey(key) {
            var store = get();
            return store != null ? store[key] : null;

        }

        function get() {

            return storageExists() ? angular.fromJson($window.localStorage.getItem(userName)) : null;
        }


        function put(key, value) {
            var stor = storageInit();
            stor[key] = value;
            storageSave(stor)
        }

        function storageInit() {
            var localStore = get();
            return localStore != null ? localStore : {}
        }

        function storageSave(data) {
            $window.localStorage.setItem(userName, angular.toJson(data));
        }

        function storageExists() {
            
            if (angular.isDefined(localStorage.getItem(userName))) {
                return angular.isObject(angular.fromJson(localStorage.getItem(userName)));
            } else {
                return false
            }
        }

    }
})();