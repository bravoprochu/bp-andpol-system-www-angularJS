(function () {
    'use strict';

    angular
        .module('app')
        .filter('camelCase', camelCase);


    camelCase.$inject = ['$filter'];

    function camelCase($filter) {
        return function (data) {
            var result = '';
            if (angular.isUndefined(data)) { return; }
            if (typeof data === 'string') {
                data = data.trim();
                data = $filter('bezPolskichZnakow')(data);
                var arr = [];
                arr = data.split(" ");
                for (var i = 0; i < arr.length; i++) {
                    var word = arr[i].toLowerCase();
                    var firstLetter = word.charAt(0);
                    firstLetter = i === 0 ? firstLetter.toLowerCase() : firstLetter.toUpperCase();
                    word = firstLetter + word.substring(1, word.length);
                    arr[i] = word;
                    //gdy poprzedni ma tylko jedna litere, musi byc z malej..
                    if (i > 1) {
                        if (arr[i - 1].length == 1) {
                            arr[i] = word.toLowerCase();
                        }
                    }
                }
                result = arr.join("");
            }

            //            result = $filter('bezPolskichZnakow')(result);
            return result;
        };
    }
})();