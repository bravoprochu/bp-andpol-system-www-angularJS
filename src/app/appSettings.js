(function () {
	'use strict';

	var app = angular.module('app');

      var serverPath = "http://localhost:36873";
//      var serverPath= "https://system.andpolspj.pl/dane";
//      var serverPath = "https://bravoprochu.ddns.net/dane";


	app.constant("appSettings", {
        serverPath: serverPath,
	    loginUrl: serverPath + "/Token",
	    registerUrl: serverPath + "/api/Account/Register",
	    usersManagementUrl: serverPath + "/api/usersManagement",

	});
})();