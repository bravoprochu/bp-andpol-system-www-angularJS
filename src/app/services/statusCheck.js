(function () {
    'use strict';

    angular
        .module('app')
        .factory('statusCheck', statusCheck);

    statusCheck.$inject = [];

    function statusCheck() {

        return {
            przygotujDostepne: function (wybr, dost, porownanie) {
                angular.forEach(wybr, function (w) {
                    for (var d = 0; d < dost.length; d++) {
                        var aktDost = dost[d];
                        if (w[porownanie] == aktDost[porownanie]) {
                            dost.splice(d,1);
                        }
                    }
                });
                return dost;
            },
            przygotujDostepneKombi: function (wybr, dost, typ, porownanie) {
                var result = angular.copy(dost);
                var wybrKombi = [];

                if (wybr[typ].length === 0) {
                    return result;
                } else {

                    angular.forEach(wybr[typ], function (wk) {
                        wybrKombi.push(wk);
                    });
                    angular.forEach(wybrKombi, function (w) {
                        for (var d = 0; d < result.length; d++) {
                            if (w.nazwaKombinacji.id == result[d].id) {
                                result.splice(d, 1);
                            }
                        }
                    });
                    return result;
                }




            },

            przygotujDostepneWykonczenie: function (dane, dost) {

                angular.forEach(dane, function (d) {
                    for (var i = 0; i < dost.length; i++) {

                        if (dost[i].kombinacjaWykonczenieRef == d.kombinacjaWykonczenieRef) {

                        }
                    }
                });
            
            },


            
            check: function (opcja, dane, org) {
                var result;
                
                switch (opcja) {
                    case "add":
                        if (dane.status === null || "baza") { result = "nowy"; }
                        if (dane.status == "usuniety") { result = "baza"; }
                        if (dane.status == "zmieniony") { result = "zmieniony"; }
                        break;
                    case "del":
                        if (dane.status == "usuniety") { result = "usuniety"; }
                        if (dane.status == "baza") { result = "usuniety"; }
                        if (dane.status == "nowy") { result = null; }
                        if (dane.status == "zmieniony") { result = "usuniety";}

                        break;
                    case 'mod':
                        if (dane.status == "baza" || dane.status=="zmieniony")
                        {
                            if (angular.isUndefined(org)) {result = "zmieniony"; break;}
                            if (isOriginalDataChange(dane, org)) {
                                result = "zmieniony";
                                break;
                            } else result = "baza";
                        }
                        else {
                            if (dane.status === undefined || dane.status==null) { dane.status = "nowy"; }

                            result = dane.status;
                        }
                        break;

                    default:
                        result="jakiś inny przypadek ";
                }
                return result;
            },





            checkForm: function (formStatus, dane, org) {
                var result = '';
                if (formStatus.status == "baza" || formStatus.status == "zmieniony") {
                    if (dane != org) { result = "zmieniony"; } else { result = "baza"; }
                } else { result = formStatus.status; }
                return result;
            }
        };

        function isOriginalDataChange(dane, orgData) {
            var result = false;
            angular.forEach(orgData, function (d) {
                if (d.id == dane.id) {
                    if (dane.wartosc != d.wartosc) { result = true; }
                }
            });
            return result;
        }

    }
})();