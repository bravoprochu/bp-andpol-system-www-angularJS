(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataFactory', dataFactory);

    dataFactory.$inject = ['$http', '$resource', '$q', 'appSettings', 'currentUser', 'toastr', '$mdPanel'];



    function dataFactory($http, $resource, $q, appSettings, currentUser, toastr, $mdPanel) {

        var panelIsLoadingCount = 1;
        var panelIsLoadingAnim = $mdPanel.newPanelAnimation()
            .withAnimation({
                open: 'demo-dialog-custom-animation-open',
                close: 'demo-dialog-custom-animation-close'
            });

        var panelIsLoadingPos = $mdPanel.newPanelPosition().absolute().center();
        var panelIsLoadingConfig = {
            attachTo: angular.element(document.body),
            hasBackdrop:true,
            controller: panelIsLoadingCtrl,
            controllerAs: 'vm',
            locals:{},
            position: panelIsLoadingPos,

            templateUrl: 'app/common/dialogs/isLoading.html',
            clickOutsideToClose: false,
            escapeToClose: false,
            focusOnOpen: true,
        }

        panelIsLoadingCtrl.$inject=['$scope','$window', 'commonFunctions'];
        function panelIsLoadingCtrl($scope, $window, cF) {
            var vm = this;
            vm.info = $scope.vm.mdPanelRef.config.locals.info;
            vm.screenSmall = cF.isScreenSmall();
            vm.diameter = function () {
                return $window.outerHeight < $window.outerWidth ? Math.round($window.outerHeight / 2) : Math.round($window.outerWidth / 2);
            };
        }

        function getPanelIsLoadingConfig(info) {
            panelIsLoadingCount++
            panelIsLoadingConfig.id = "isLoadingPanel" + panelIsLoadingCount;
            panelIsLoadingConfig.locals.info = info;
            return panelIsLoadingConfig;
            
        }


        function errorHandler(error) {
            var descr = [];
            
            if (error.data === null || error.status === -1) {
                descr.push("Błąd połączenia z serwerem lub serwer nie odpowiada")
                return descr
            }

            if (error.status === 404) {
                descr.push("Nie znaleziono rekordu");
                return descr;
                
            }

            if (error.data.message !== null) {
                descr.push(error.data.message);
                if (error.data.messageDetail != -null) {
                    descr.push(error.data.messageDetail);
                }
                return descr;
            }
            descr.push("najwyraźniej coś jeszcze gorszego");
            
            return descr;
        };

        function info(type, title, message, obj) {
               return  toastr[type](message, title);
        };

        function getData(url) {
            var panelRef = $mdPanel.create(getPanelIsLoadingConfig("GET "+ url))
            panelRef.open();

            var deffered = $q.defer();
                    var apiUrl = appSettings.serverPath + "/api/" + url;

                    var httpConfig = {
                        method: 'GET',
                        url: apiUrl,
                        headers: {
                            'Authorization': function () { return "Bearer " + currentUser.getProfile().token; },
                        }
                    };

                    $http(httpConfig).then(function (response) {
                        deffered.resolve(response.data);
                        if (angular.isArray(response.data)) {
                            var length = angular.isArray(response.data) ? ". Razem: " + response.data.length : "";
                            if (response.data.length > 0) {
                                info('success', "Dane z serwera", "Dane " + url + " zostały pobrane" + length);
                            }
                        } else {
                            info('success', "Dane z serwera <strong>" + url+"</strong>", response.data.info);
                        }
                        panelRef.close();
                        panelRef.destroy();

                    }, function (error) {
                        info('warning', "Błąd ", errorHandler(error).join(', '));
                        panelRef.close();
                        panelRef.destroy();
                        deffered.reject("dupa");

                    });

            return deffered.promise;
        };

        function postData(url, data, isFile) {

            var panelRef = $mdPanel.create(getPanelIsLoadingConfig("POST "+ url))
            panelRef.open();
            var deffered = $q.defer();
            var apiUrl = appSettings.serverPath + "/api/" + url;

            var httpConfig = {
                method: 'POST',
                data:data,
                url: apiUrl,
                headers: {
                    'Authorization': function () { return "Bearer " + currentUser.getProfile().token; },
                },
                responseType: angular.isDefined(isFile) ? 'arraybuffer' : undefined
            };

            $http(httpConfig).then(function (response) {
                deffered.resolve(response.data);
                if (angular.isArray(response.data)) {
                    var length = angular.isArray(response.data) ? ". Razem: " + response.data.length : "";
                    info('success', "Dane z serwera", "Dane " + url + " zostały pobrane" + length);
                } else {
                    info('success', "Dane z serwera " + url, response.data.info);
                }
                panelRef.close();
                panelRef.destroy();
            }, function (error) {
                info('warning', "Błąd ", errorHandler(error).join(', '));
                panelRef.close();
                panelRef.destroy();
                deffered.reject("dupa");
            });
            return deffered.promise;
        }

        function putData(url, data) {
            var panelRef = $mdPanel.create(getPanelIsLoadingConfig("UPDATE" + url));
            panelRef.open();

            var deffered = $q.defer();
            var apiUrl = appSettings.serverPath + "/api/" + url;

            var httpConfig = {
                method: 'PUT',
                data: data,
                url: apiUrl,
                headers: {
                    'Authorization': function () { return "Bearer " + currentUser.getProfile().token; },
                }
            };

            $http(httpConfig).then(function (response) {
                deffered.resolve(response.data);
                if (angular.isArray(response.data)) {
                    var length = angular.isArray(response.data) ? ". Razem: " + response.data.length : "";
                    if (response.data.length > 0) {
                        info('success', "Dane z serwera", "Dane " + url + " zostały pobrane" + length);
                    }
                }
                if (response.data.info) {
                    info('success', "Dane z serwera" + url, response.data.info);
                } else {
                    info('success', "Dane z serwera", "Dane " + url, "Dane zostały zapisane prawidłowo");
                }
                panelRef.close();
                panelRef.destroy();

            }, function (error) {
                info('warning', "Błąd ", errorHandler(error).join(', '));
                panelRef.close();
                panelRef.destroy();
                deffered.reject("dupa");
            });


            return deffered.promise;
        }
        
        function deleteData(url) {
            var panelRef = $mdPanel.create(getPanelIsLoadingConfig("DELETE "+url));
            panelRef.open();
            var deffered = $q.defer();
            var apiUrl = appSettings.serverPath + "/api/" + url;

            var httpConfig = {
                method: 'DELETE',
                url: apiUrl,
                headers: {
                    'Authorization': function () { return "Bearer " + currentUser.getProfile().token; },
                }
            };

            $http(httpConfig).then(function (response) {
                info('warning', response.data.info);
                panelRef.close();
                panelRef.destroy();
                deffered.resolve(response.data);
            }, function (error) {
                info('error', "Błąd ", errorHandler(error).join(', '));
                panelRef.close();
                panelRef.destroy();
                deffered.reject("dupa");
            });
            return deffered.promise;
        }





        return {
            deleteData:deleteData,
            getData: getData,
            postData: postData,
            putData:putData,
        };
    };

})();