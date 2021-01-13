(function () {
    'use strict';

    angular
        .module('app')
        .factory('dirtyBagContainer', dirtyBagContainer);

    dirtyBagContainer.$inject = ['$http'];

    function dirtyBagContainer($http) {

        var dirtyBag = [];

        return dirtyBag;


        
    }
})();