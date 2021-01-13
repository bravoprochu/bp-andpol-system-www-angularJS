(function () {
    'use strict';

    angular
        .module('app')
        .factory('qrCodeGen', qrCodeGen);

    qrCodeGen.$inject = ['$http', '$mdDialog', '$window', 'appSettings', 'currentUser', 'toastr'];

    function qrCodeGen($http, $mdDialog, $window, appSettings, currentUser, toastr) {
        var service = {
            qrCodeBasketAdd: qrCodeBasketAdd,
        }

        return service;


        function qrCodeBasketAdd(data, name) {
                return $mdDialog.show({
                    bindToController: true,
                    controller: qrCodeBasketAddCtrl,
                    controllerAs: 'vm',
                    locals: {
                        data: data,
                        name: name
                    },
                    templateUrl: 'app/common/dialogs/qrCodeBasketAddTmpl.html',
                });
          };

          function qrCodeBasketAddCtrl() {
              var vm = this;
              vm.data = vm.locals.data;
              vm.data.link = $window.location.href;

              vm.navAnuluj = navAnuluj;
              vm.navZapisz = navZapisz;

              function navAnuluj() {
                  $mdDialog.hide();
              }

              function navZapisz() {
                  var apiUrl = appSettings.serverPath + "/api/QrCodeBasket";
                  var httpConfig = {
                      method: 'POST',
                      url: apiUrl,
                      data:vm.data,
                      headers: {
                          'Authorization': function () { return "Bearer " + currentUser.getProfile().token; },
                      }
                  };
                  $http(httpConfig).then(function (response) {
                      toastr['success']('Zapis się powiódł, by wydrukować etykietę przejdź do: <span ui-sref="qrCodeWydruk" ><strong>qrCodeWydruk</strong></span>', vm.data.grupa);
                      $mdDialog.hide("Zapis w bazie prawidłowy")
                  }, function (error) {
                      toastr['error']('Zapis NIE powiódł się', vm.data.grupa);
                      $mdDialog.cancel("Nie udało zapisać się w bazie")
                  });
              }
          };
    }
})();