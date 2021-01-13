/// <reference path="nawigacjaSzczegoly.html" />
(function () {
    'use strict';

    angular
        .module('app')
        .directive('nawigacjaSzczegoly', nawigacjaSzczegoly);

    nawigacjaSzczegoly.$inject = ['$state','$rootScope', 'commonFunctions', 'statusCheck'];

    function nawigacjaSzczegoly($state, $rootScope, cF, statusCheck) {
        // Usage:
        //     <nawigacjaSzczegoly></nawigacjaSzczegoly>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/common/nawigacjaSzczegoly.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.formMainValid = false;
            scope.formMainDirty = false;

            var vm = angular.isDefined(scope.vm) ? scope.vm : scope.$parent.vm;

            vm.isLoggedIn = false;
            vm.errorCollection = [];
            vm.navIdzDo = navIdzDo;
            vm.navAnuluj = navAnuluj;
            vm.navCanSave = false;
            vm.navCanCancel = false;
            vm.test = test;

            $rootScope.$watch('isLoggedIn', function (newVal) {
                vm.isLoggedIn = newVal;
            })

            if (angular.isDefined(scope.vm)) {
                scope.$watch("vm.formMain.$dirty", function (newVal) {
                    scope.formMainDirty = newVal === true ? true : false;
                    navCheck();
                });

                scope.$watch("vm.formMain.$valid", function (newVal) {
                    scope.formMainValid = newVal === true ? true : false;
                    navCheck();
                });
            }

            scope.$watchCollection('vm.formMain.$error.required', function (newErrColl) {
                vm.errorCollection = [];
                angular.forEach(newErrColl, function (reqErr) {
                    if (angular.isObject(reqErr.$error.required)) {
                        angular.forEach(reqErr.$error.required, function (err) {
                                vm.errorCollection.push(err);
                        });
                    } else {
                        vm.errorCollection.push(reqErr);
                    }
                });
                vm.errorCollection.sort();
            });


            function navCheck() {
                if (scope.formMainValid && scope.formMainDirty) {
                    vm.navCanSave = true;
                    vm.dataObj.status = statusCheck.check('mod', vm.dataObj);
                    vm.navCanCancel = true;
                    vm.qrCodeGen = angular.isDefined(vm.qrCodeGenShow) ? true : false;
                } else {
                    vm.navCanSave = false;
                    vm.navCanCancel = true;
                }
            }

            function navIdzDo() {
                $state.go($state.current.name.replace("Detail", ""));
            }

            function navAnuluj() {
                cF.dialogTakNie(vm.title, "Czy na pewno anulować zmiany !?").then(function () {
                    vm.dataObj = angular.copy(vm.dataObjCopy);
                    vm.formMain.$setPristine();
                    cF.info('warning', vm.title, "Dane ZOSTAŁY anulowane...");
                }, function () {
                    cF.info('warning', vm.title, "Dane NIE zostały anulowane...");
                });

            }
            function test() {
                console.log("-------- vm -------");
                console.log(vm);
                console.log("-------- form Main ---------");
                console.log(vm.formMain);

            }
        }
    }

})();