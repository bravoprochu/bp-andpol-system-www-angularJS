(function () {
    'use strict';

    angular
        .module('app')
        .factory('currentUser', currentUser);

    currentUser.$inject = ['$mdDialog', '$rootScope', '$q', '$state', '$window', 'userAccount'];

    function currentUser($mdDialog, $rootScope, $q, $state, $window, userAccount) {




        $rootScope.isLoggedIn = false;

        var profile = {
            userName: '',
            userEmail: '',
            expires: '',
            token: '',
            role: '',
        };

        var currentUserMenu = [];



        var clearProfile = function () {
            profile.userName = '';
            profile.token = '';
            profile.expires = '';
            profile.userEmail = '';
            currentUserMenu = [];
            $rootScope.isLoggedIn = false;
            $window.localStorage.removeItem('andpolSystem.currentUser');
        };

        var getProfile = function () {
            return profile;
        };

        var localStorageGet = function (key) {
            return window.localStorage.getItem(key);
        };

        var localStorageSet = function (key, value) {
            return window.localStorage.setItem(key, value);
        };


        var isLogged = function () {
            profile.isLoggedIn = $rootScope.isLoggedIn;
        };


        var sessionInProgress = function () {
            var defered = $q.defer();
            var sessionEnd = moment(new Date(profile.expires));
            var duration = moment.duration(sessionEnd.diff(moment()));
            if (duration.seconds() > 0 || duration.minutes() > 0 || duration.hours() > 0) {
                defered.resolve({
                    value: true,
                    info: "koniec sesji za: " + sessionEnds(),
                    userName: profile.userName,
                    roles: profile.roles
                });
            }
            else {
                $rootScope.isLoggedIn = false;
                defered.reject({
                    value: false,
                    info: "koniec sesji",
                });
            }
            return defered.promise;
        };

        var sessionEnds = function () {

            var sessionEnd = moment(new Date(profile.expires));
            var duration = moment.duration(sessionEnd.diff(moment()));

            var mDuration = moment(duration);
            var d = "dni";
            return duration.format("dd["+d+"] hh:mm:ss");
        };

        var setProfile = function (userName, userEmail, token, expiresTime,roles, role) {
            profile.userEmail = userEmail;
            profile.userName = userNameConv(userName);
            profile.expires = expiresTime;
            profile.token = token;
            profile.role = role;
            profile.roles = roles;
            $rootScope.isLoggedIn = isRoleSet();
            if (angular.isDefined($rootScope.fromState)) {
                $state.go($rootScope.fromState);
            }

            function isRoleSet() {
                if (profile.roles.length>0) {
                    window.localStorage.setItem("currentUser", JSON.stringify(profile));
                    return true;
                } else {
                    return false;
                }
            }
        };



        var userNameConv = function (userName) {
            if (angular.isString(userName)) {
                var n = userName.indexOf("@");

                if (n > 0) {
                    return userName.substring(0, n);
                } else return userName;
            }
        };





        function loginDlg() {
            return $mdDialog.show({
                templateUrl: 'app/common/dialogs/loginDlg.html',
                controller: loginDlgCtrl,
                controllerAs: 'vm',
                bindToController: true,
            });
        }


        function loginDlgCtrl() {
            var vm = this;
            vm.userData = {
                grant_type: "password",
            };
            vm.login = login;
            vm.title = "Zaloguj się";
            vm.loginEnter = loginEnter;
            vm.idzDo = idzDo;

            function idzDo(state) {
                $mdDialog.cancel();
                $state.go(state);

            }

            function login() {
                vm.loginFailed = false;
                vm.loginInProgress = true;
                userAccount.login.loginUser(vm.userData, function (response) {
                    setProfileFromLoadedToken(response);
                    vm.loginInProgress = false;
                    $mdDialog.hide(true);
                }, function (error) {
                    vm.loginInProgress = false;
                    vm.loginFailed = true;
                });
            };

            function loginEnter(event) {
                if (!vm.loginInProgress && vm.formDlgMain.$valid) {
                    if (event.charCode == 13 || event.code == 'Enter') {
                        login();
                    } else return;
                } else
                    return;
            };
        }


        function isAuthorized(viewName) {
            return $q(function (resolve, reject) {
                if ($rootScope.isLoggedIn && checkRoles(viewName)) {
                    resolve("ok !");
                } else {
                    return loginDlg().then(function (res) {
                        if (checkRoles(viewName)) {
                            resolve("ok !");
                        } else {
                            reject("Brak autoryzacji");
                        }
                    }, function (rej) {
                        console.log("dialog reject");
                    });
                }
            });
        };

        function checkRoles(viewName) {
            return profile.roles.indexOf(viewName)>=0 ? true: false
        }

        function setProfileFromLoadedToken(token) {
            profile.userEmail = token.userName;
            profile.userName = userNameConv(token.userName);
            profile.expires = token[".expires"];
            profile.token = token.access_token;
            profile.role = getUserRolesFromToken(token)[0],
            profile.roles = getUserRolesFromToken(token),
            $rootScope.isLoggedIn = true;
            setLocalStorage('andpolSystem.currentUser', token);
        }

        function getUserRolesFromToken(token) {

            var result = [];

            angular.forEach(token, function (value, key) {
                if (key.indexOf("userRole")==0) {
                    result.push(value);
                }

            });
            return result;
        }


        function checkLocalStorageForUserData() {
            console.log("checkLocalStorageForUserData");
            var prof = JSON.parse(window.localStorage.getItem("currentUser"));
            if (prof) {
                console.log("jest profile...");
                console.log("expires: ");
                console.log(prof.expires);
                
                var expires=new Date(prof.expires);

                if (expires > new Date()) {
                    console.log("profilDate expired");
                } else {
                    console.log("profil jest ok !");
                }
                setProfile(prof.userName, prof.userEmail, prof.token, prof.expires, prof.role);
                $rootScope.isLoggedIn = true;
                if (!sessionInProgress()) {
                    clearProfile();
                } else {
                    $rootScope.isLoggedIn = true;
                }
            }
        };

        function setLocalStorage(key, data) {
            var ls = $window.localStorage;
            ls.setItem(key, angular.toJson(data));
        };

        function getLocalStorage(key) {
            var ls = $window.localStorage[key];
            if (angular.isDefined(ls)) {
                return ls;
            } else {
                return null;
            }
        };

        function getProfileFromLocalStorage() {
            var lsProfile=getLocalStorage('andpolSystem.currentUser');
            if (lsProfile !== null) {
                var localProfile = angular.fromJson(lsProfile);
                var expiration = new Date(localProfile[".expires"]);
               if (expiration > new Date()) {
                    setProfileFromLoadedToken(angular.fromJson(lsProfile));
                } else {
                    return
                }
            }
        };




        return {
            checkRoles: checkRoles,
            checkLocalStorageForUserData: checkLocalStorageForUserData,
            clearProfile: clearProfile,
            currentUserMenu: currentUserMenu,
            getProfile: getProfile,
            getLocalStorage: getLocalStorage,
            getProfileFromLocalStorage: getProfileFromLocalStorage,
            isAuthorized: isAuthorized,
            loginDlg: loginDlg,
            sessionEnds: sessionEnds,
            sessionInProgress: sessionInProgress,
            setProfile: setProfile,
        };


    }
})();