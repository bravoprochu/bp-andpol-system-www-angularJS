(function() {
    'use strict';

    angular
        .module('app')
        .directive('selectAll', selectAll);

    selectAll.$inject = ['statusCheck'];
    
    function selectAll (statusCheck) {
        // Usage:
        //     <selectAll></selectAll>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                danePomocnicze: '=',
                desr: '@',
                formRef:'=',
                nazwa:'@',
                key: '@',
                parent:'=',
                selectedItems: '=',

                
            },
            templateUrl: 'app/common/directives/selectAll.html'
        };
        return directive;

        function link(scope, element, attrs) {

            scope.exists = exists;
            scope.toggle = toggle;
            scope.toggleAll = toggleAll;
            scope.toggleAllChecked = toggleAllChecked;
            scope.items = [];

            function init() {
                    angular.forEach(scope.selectedItems, function (item) {
                        scope.items.push(item);
                    });                
            }

            init();

            function exists(selectedItem) {
                for (var i = 0; i < scope.items.length; i++) {
                    var item=scope.items[i];
                    if (selectedItem[scope.key] == item[scope.key]) {
                        return true
                    }
                }
                return false;
            };

            function formUpdate() {
                if (angular.isDefined(scope.parent)) {
                    scope.formRef.$setDirty();
                    scope.parent.status = statusCheck.check('mod', scope.parent);
                }
            }

            function idxByKey(items, key, objectToCheck) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item[key] == objectToCheck[key]) {
                        return i;
                    }
                }
                return -1
            }

            function toggle(item) {
                var idx = idxByKey(scope.items, scope.key, item);
                if (idx > -1) {
                    scope.items.splice(idx, 1);
                    removeFromeSelectedItems();
                }
                else {
                    scope.items.push(item);
                    scope.selectedItems.push(item);

                }

                toggleAllChecked();
                formUpdate();

                function removeFromeSelectedItems() {
                    var idxSelectedItems = idxByKey(scope.selectedItems, scope.key, item);
                    scope.selectedItems.splice(idxSelectedItems, 1);
                }
            };

            function toggleAll()
            {
                var checked = toggleAllChecked();
                if (checked) {
                    scope.items = [];
                    var length= scope.selectedItems.length;
                    scope.selectedItems.splice(0, length);
                } else {
                    scope.items = [];
                    var length = scope.selectedItems.length;
                    scope.selectedItems.splice(0, length);
                    angular.forEach(scope.danePomocnicze, function (item) {
                        scope.items.push(item);
                        scope.selectedItems.push(item);
                    });
                }

                formUpdate();
            }

            function toggleAllChecked() {
                return scope.danePomocnicze.length == scope.items.length;
            }
        }
    }

})();