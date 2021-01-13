(function () {
    'use strict';

    angular
        .module('app')
        .filter('roznica', roznica);
    
    function roznica() {
        return function (list1, list2, porownanie1, porownanie2) {
            list1 = angular.copy(list1);
            porownanie1= angular.isDefined(porownanie1) ? porownanie1 : "id";
            porownanie2= angular.isDefined(porownanie2) ? porownanie2 : "idRef";
            var result = [];
           
            for (var i = 0; i < list1.length; i++) {
                var poz1=list1[i];
                var found=false;
                for (var n = 0; n < list2.length; n++) {
                    var poz2 = list2[n];
                    //sprawdza warunek gdy element jest obiektem (nie jest undefined)
                    if (angular.isDefined(poz2)) {
                        if (poz1[porownanie1] == poz2[porownanie2]) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                        result.push(poz1);
                }
            }
            return result;
        };
    }
})();