(function () {
    'use strict';

    angular
        .module('app')
        .filter('bezPolskichZnakow', bezPolskichZnakow);
    
    function bezPolskichZnakow() {
        return function (data) {
            var result = '';
            if (typeof data === 'string') {
                var arr = [];
                var polskieZnaki = ["ę", "Ę", "ó", "Ó", "ą", "Ą", "ś", "Ś", "ł", "Ł", "ż", "Ż", "ź", "Ź", "ć", "Ć", "ń","Ń", ";", ",", ".", ":", "-"];
                var znaki =        ["e", "E", "o", "O", "a", "A", "s", "S", "l", "L", "z", "Z", "z", "Z", "c", "C", "n","N", "", "", "", "", ""];
                arr = data.split(" ");
                for (var i = 0; i < polskieZnaki.length; i++) {
                    while (data.indexOf(polskieZnaki[i]) >=0) {
                        data = data.replace(polskieZnaki[i], znaki[i]);
                    }
                }
                result = data;
            } else return;
            return result;
        };
    }
})();