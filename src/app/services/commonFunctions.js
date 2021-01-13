(function () {
    'use strict';

    angular
        .module('app')
        .factory('commonFunctions', commonFunctions);

    commonFunctions.$inject = ['$rootScope', '$mdDialog', '$mdPanel', '$mdMedia', '$q', '$state', '$timeout', '$window', 'currentUser', 'toastr', 'qrCodeGen', 'preferencjeStorage'];

    function commonFunctions($rootScope, $mdDialog, $mdPanel, $mdMedia, $q, $state, $timeout, $window, currentUser, toastr, qrCodeGen, pref) {

        var panelIdCount = 0;

        return {
            backTo: backTo,
            chartData: chartData,
            checkByUniqueKey: checkByUniqueKey,
            dateRange: dateRange,
            dialogTakNie: dialogTakNie,
            error:error,
            findInArr: findInArr,
            isScreenSmall: isScreenSmall,
            info: info,
            minDate: minDate,
            pdfGen: pdfGen,
            panelDefault: panelDefault,
            pref:pref,
            qrScanner: qrScanner,
            screenWidth: $window.innerWidth,
            screenHeigh: $window.innerHeight,
            statusCheck: statusCheck,
            qrList: [],
            tableSearch: tableSearch,
            unique: unique,
            userName: userName,
            usunKlamry: usunKlamry,
            wybierzTylko: wybierzTylko
        };


        


        function panelDefault() {
            panelIdCount++
            return {
                attachTo: angular.element(document.body),
                controllerAs: 'vm',
                focusOnOpen: true,
                hasBackdrop: true,
                id: panelIdCount,
                locals: {},
                panelClass: 'panelBox',
                position: $mdPanel.newPanelPosition().absolute().center(),
            }
        }

        function backTo(state) {
            $state.go(state);
        }

        function chartData(baseData, data, labels, series) {

            var defer = $q.defer();
             
            var resultData={};
            resultData.data = [];
            resultData.labels = [];
            resultData.series = [];

            for (var s = 0; s < series.length; s++) {
                var seria = series[s];
                var tempArr = [];
                var labelsDodano = false;
                angular.forEach(baseData, function (dane) {
                    tempArr.push(dane[data])
                    if (!labelsDodano) {
                        resultData.labels.push(dane[labels])
                    }
                });
                labelsDodano = true;
                resultData.data.push(tempArr);
            }

            angular.forEach(series, function (seria) {
                resultData.series.push(seria);
            });

            defer.resolve(resultData);
            return defer.promise;
        }

        function checkByUniqueKey(resArr, id) {
            var result = undefined
            if (resArr.length == 0) { return result; }
            angular.forEach(resArr, function (item) {
                if (item["uniqueKey"] == id) {
                    result = item;
                }
            })
            return result;
        }

        function dateRange(dateStart, nazwaPola, isMaxDate, dateEnd) {
            if (dateStart === null || dateStart === undefined) {
                dateStart = kwartalResult;
            }
            var prefData = pref.getByKey($state.current.name);
            var prefDateRange = undefined;
            if (prefData!= null) {
                prefDateRange = angular.isDefined(prefData.dateRange) ? prefData.dateRange : null;
            }
         

            var kwartal = moment().subtract(2, 'months');
            var kwartalResult = new Date(kwartal.year() + "-" + kwartal.month() + "-1");
            var isMaxDate=angular.isDefined(isMaxDate)==true ? undefined: new Date
            dateStart = prefDateRange != null ? new Date(prefDateRange.dateStart) : kwartalResult;
            dateEnd = prefDateRange != null ? new Date(prefDateRange.dateEnd) : new Date();

            var ds = !!dateStart ? dateStart : kwartalResult;

            var nazwaPola = !!nazwaPola ? nazwaPola : "dataWystawienia";

            return $mdDialog.show({
                templateUrl: 'app/common/dialogs/dateRange.html',
                controller: dialogCtrl,
                controllerAs: 'vm',
                bindToController:true
            });



            function dialogCtrl() {
                
                var vm = this;
                vm.prefActive = prefDateRange != null ? true : false;
                vm.dateStart = new Date(dateStart);
                vm.dateEnd = new Date(dateEnd);
                vm.maxDate = isMaxDate;
                vm.minDate = minDate();
                vm.navSave = navSave;
                vm.navCancel = navCancel;
                vm.nazwaPola = nazwaPola;
                vm.getThisMonth = getThisMonth;
                vm.prefDel = prefDel;
                vm.prefGet = prefGet;
                vm.prefPut = prefPut;
               
                function prefDel() {
                    delete prefData['dateRange'];
                    pref.put($state.current.name, prefData);
                    vm.prefActive = false;
                }

                function prefGet() {
                    vm.dateStart = dateStart;
                    vm.dateEnd = dateEnd;
                };
                function prefPut() {
                    var dr = {
                        dateStart: vm.dateStart,
                        dateEnd: vm.dateEnd
                    };

                    if (prefDateRange != null) {
                        prefDateRange.dateRange = dr;
                    } else {
                        prefDateRange = {
                            dateRange:dr
                        }
                    }
                    pref.put($state.current.name, prefDateRange);
                    vm.prefActive = true;
                }
                function navSave() {
                    $mdDialog.hide({ dateStart: vm.dateStart, dateEnd: vm.dateEnd });
                }
                function navCancel() {
                    $mdDialog.cancel();
                }
                function getThisMonth() {
                    vm.dateEnd = new Date(moment(moment().format("YYYY-MM") + "-1").add(-1, 'days').format("YYYY-MM-DD"));
                    vm.dateStart = new Date(moment().add(-1, 'months').format("YYYY-MM") + "-1");
                    

                }
            }



        }

        function dialogTakNie(title, question) {
            var confirm = $mdDialog.confirm()
            .title(title)
            .htmlContent(question)
            .ariaLabel('dialogTakNie')
            .ok('Tak')
            .cancel('Nie');

            return $mdDialog.show(confirm);
        };

        function error(err) {
            console.log('cF error handler:');
            console.log(err);
        }

        function findInArr(searchWhere, searchWhat, key )
        {
            var idx = -1;
            //dest
            for (var i = 0; i < searchWhere.length; i++) {
                var searchWhereArr = searchWhere[i];
                if (searchWhereArr[key] === (angular.isObject(searchWhat) ? searchWhat[key] : searchWhat)) {
                    idx = i;
                    break
                }
            }
            return idx;
        }

        function isScreenSmall() {
            if ($mdMedia('xs') || $mdMedia('sm')) {
                return true;
            }
            return false;
        }

        function minDate() {
            return new Date("2016-02-01");
        }

        function pdfGen(res, fileName)
        {
            var file = new Blob([res], {
                type: 'application/pdf'
            });
            //trick to download store a file having its URL
            var fileURL = URL.createObjectURL(file);
            var a = document.createElement('a');
            a.href = fileURL;
            a.target = '_blank';
            a.download = angular.isDefined(fileName) ? fileName : 'filename.pdf';
            document.body.appendChild(a);
            a.click();
        }

        function statusCheck (opcja, dane, org) {
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
                    if (dane.status == "zmieniony") { result = "usuniety"; }

                    break;
                case 'mod':
                    if (dane.status == "baza" || dane.status == "zmieniony") {
                        if (angular.isUndefined(org)) { result = "zmieniony"; break; }
                        if (isOriginalDataChange(dane, org)) {
                            result = "zmieniony";
                            break;
                        } else result = "baza";
                    }
                    else {
                        if (dane.status === undefined || dane.status == null) { dane.status = "nowy"; }

                        result = dane.status;
                    }
                    break;

                default:
                    result = "jakiś inny przypadek ";
            }
            return result;
        }

        function tableSearch(){
            if (angular.isUndefined(this.searchShow)) {
                this.searchShow = false;
            }
            this.searchText = this.searchShow ? this.searchText : null;
            this.searchShow = !this.searchShow;
        }

        function isOriginalDataChange(dane, orgData) {
            var result = false;
            angular.forEach(orgData, function (d) {
                if (d.id == dane.id) {
                    if (dane.wartosc != d.wartosc) { result = true; }
                }
            });
            return result;
        }

        function qrScanner() {
            return $mdDialog.show({
                controller: function ($window) {
                    var vm = this;
                    vm.close = close;
                    vm.onError = onError;
                    vm.onSuccess = onSuccess;
                    vm.scanResult = null;
                    vm.scanResultPrzekaz = true;
                    vm.screenWidth = $window.innerWidth / 3 < 240 ? 240 : $window.innerWidth / 3;
                    function close() {
                        $mdDialog.hide(vm.scanResult);
                    }
                    function onError(error) {
                        console.log(error);
                    }
                    function onSuccess(data) {
                        if (vm.scanResultPrzekaz) {
                            $mdDialog.hide(data);
                        } else {
                            vm.scanResult = data;
                        }
                    }
                    function onVideoError(error) {
                        alert("camera video error");
                    }
                },
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/qrScannerTmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
            });
        }

        function info(type, title, message, obj) {
            if (type == "error") {
                if (angular.isDefined(obj)) {
                    toastr[type](message + " - " + obj.data.message, title);
                }
            } else {
                toastr[type](message, title);
            }
        }

        function usunKlamry(str) {
            var result = str;
            var znakiDoUsuniecia = ["[", "]"];

            for (var i = 0; i < znakiDoUsuniecia.length; i++) {
                result = result.replace(znakiDoUsuniecia[i], "");
            }
            return result;
        }

        function userName() {
            return currentUser.getProfile().userEmail;
        }

        function unique(origArr, compareParam) {
            var newArr = [],
                origLen = origArr.length,
                found, x, y;

            for (x = 0; x < origLen; x++) {
                var aktualnyOrigArr = origArr[x];
                found = undefined;
                for (y = 0; y < newArr.length; y++) {
                    var aktualnyNewArr = newArr[y];
                    if (aktualnyOrigArr[compareParam] === aktualnyNewArr[compareParam]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    newArr.push(aktualnyOrigArr);
                }
            }
            return newArr;
        }

        function wybierzTylko(obj, ident, nazwyDokumentow) {
            var result = [];
            angular.forEach(obj, function (dokTyp) {
                angular.forEach(nazwyDokumentow, function (nazwaDok) {
                    if (dokTyp[ident] == nazwaDok) result.push(dokTyp);
                });
            });
            return result;
        }





    }
})();
