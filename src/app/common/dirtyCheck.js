(function () {
    'use strict';

    angular
        .module('app')
        .directive('dirtyCheck', dirtyCheck);

    dirtyCheck.$inject = [];

    function dirtyCheck() {
        // Usage:
        //     <dirtyCheck></dirtyCheck>
        // Creates:
        var directive = {
            restrict: 'A',
            require: ['^dirtyBag', '^ngModel']
        };

        return directive;

        function link(scope, el, attrs,ctrls) {
                    var dirtyBagCtrl = ctrls[0];
                    var ngModelCtrl = ctrls[1];

   
            var elName = dotRemove(attrs.ngModel);
            var daneOrg;          
            
            scope.$watch(function () { return ngModelCtrl.$modelValue; }, function (newVal, oldVal) {
                if (dirtyBagCtrl.dirtyBagStatus == "nowy" || dirtyBagCtrl.dirtyBagStatus === undefined) {return; }

                    var pDirtyBag = ctrls[0].dirtyBag;
                    var pStatus = dirtyBagCtrl.dirtyBagStatus;

                    if (angular.isUndefined(daneOrg)) {
                        daneOrg = oldVal;
                        return;
                    }


                    if (daneOrg !== undefined || daneOrg===null) {

                        if (newVal != daneOrg) {
                            pDirtyBag[elName] = true;
                        }
                        else  {

                            pDirtyBag[elName] = false;
                        }

                    }

                       if (pStatus == 'baza' || pStatus == 'zmieniony') {
                           if(isDirtyBagDirty()){
                                dirtyBagCtrl.updateStatus("zmieniony");               
                           } else {
                               dirtyBagCtrl.updateStatus("baza");
                           }
                       }
                });

            function isDirtyBagDirty() {
                var dirtyB=dirtyBagCtrl.dirtyBag;
                var result = false;
                for (var key in dirtyB) {
                    if (dirtyB[key] === true) {
                        result = true;
                    }
                }
                return result;
            }
            function dotRemove(dane) {
                return dane.split('.').join("");
            }


        }
    }
}());