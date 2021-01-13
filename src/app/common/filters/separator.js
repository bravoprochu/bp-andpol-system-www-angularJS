(function () {
    'use strict';

    angular
        .module('app')
        .filter('separator', separator);

    function separator() {
        return function (input, sep, sign) {
            if (input === null || input===undefined) return;
            sep = sep === undefined ? 4 : sep;
            sign = sign === undefined ? ' ' : sign;
            var len = input.length;

            var resultArray = [];
            var resultArrayReverse = [];

            while (len > 0) {
                var str = input.substring(len - sep, len);
                resultArray.push(str);
                len = len - sep;
            }
            resultArrayReverse = resultArray.reverse();
            return resultArrayReverse.join(sign);
        };
    }
})();