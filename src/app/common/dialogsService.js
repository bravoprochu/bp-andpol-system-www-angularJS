(function () {
    'use strict';

    angular
        .module('app')
        .factory('dialogsService', dialogsService);

    dialogsService.$inject = ['$modal'];

    function dialogsService($modal) {
        var service = {
            confirm:confirm
        };

        return service;

        function confirm(title, message) {
            var modalInstance = $modal.open({
                templateUrl: 'app/common/confirmModal.html',
                controller: 'confirmModalCtrl',
                animation: false,
                controllerAs: 'vm',
                resolve: {
                    data: function () {
                        return {
                            title: title,
                            message: message,
                        };
                    }
                },
                size: 'sm'
            });

            return modalInstance.result;


        }
    }
})();