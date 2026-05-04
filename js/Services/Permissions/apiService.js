define([
    'js/qlik',
    'app',
], function (qlik, app, site) {
    app.factory('apiService', ['$q', '$window', '$cookies', '$http', '$state', '$rootScope',
    function ($q, $window, $cookies, $http, $state, $rootScope) {

        var CONFIG = {
            host: "https://172.30.255.19",
            user: null,
            token: null,
            permissions: null,
            application_id: 1  
        };

        var _promise_login = null;
        function login() {
            var dfd = $q.defer();

            if(_promise_login) return _promise_login;
            _promise_login = dfd.promise;

            qlik.getGlobal(config).isPersonalMode(function (reply) {
                $http.post(`${CONFIG.host}/MzApi/api/v1/login/qs?application_id=${CONFIG.application_id}`).then(function (response) {
                    CONFIG.token = response.data.token_core;
                    CONFIG.token_refresh = response.data.token_core_refresh;
                    return $http.get(`${CONFIG.host}/MzApi/api/v1/me_core?token=${CONFIG.token}`);
                }).then(function (response) {
                    CONFIG.user = response.data.user;
                    return $http.get(`${CONFIG.host}/Permisos/api/v1/role_users/${CONFIG.user.id}?token=${CONFIG.token}`);
                }).then(function (response) {
                    CONFIG.user.role_id = response.data.role_id;
                    return $http.get(`${CONFIG.host}/Permisos/api/v1/me/options?token=${CONFIG.token}`);
                }).then(function (response) {
                    CONFIG.permissions = response.data;
                    $rootScope.permissions = CONFIG.permissions;                        
                    $rootScope.$broadcast('permisos_obtenidos', CONFIG.permissions);    
                    var datos = CONFIG.user;
                    return $http.post(`${CONFIG.host}/Deiteo/api/v1/verificaUsuarioMashupDeiteo?token=${CONFIG.token}`, datos);                    
                }).then(function (response) {
                    dfd.resolve(CONFIG);
                }).catch(function (err) {
                    console.error("apiService:", err);
                    CONFIG["permissions"] = [{
                        "option": "**",
                        "application_id": 1,
                        "inverse": false,
                        "rule": null
                    }];
                    $rootScope.permissions = CONFIG.permissions;                        
                    $rootScope.$broadcast('permisos_obtenidos', CONFIG.permissions);    
                    dfd.resolve(CONFIG);
                    dfd.reject(err);
                });

            });


            return _promise_login;
        }

        function getToken() {
            var dfd = $q.defer();
            if (CONFIG.token !== null) {
                dfd.resolve(CONFIG.token);
            } else {
                login().then(function () { dfd.resolve(CONFIG.token); });
            }
            return dfd.promise;
        }

        function getTokenRefresh(config) {
            return $http.post(`${CONFIG.host}/MzApi/api/v1/refreshtoken?token=${CONFIG.token}`, config).then(function (res) {
                return res.data;
            });
        }


        function isUserAdmin(){
            if(!CONFIG.user) return false;
            return CONFIG.user.role_id===1;
        }

        function isUserRol(idRol) {
            if (!CONFIG.user) return -1;
            var objRol_id = CONFIG.user.role_id;

            if (!objRol_id) {
                return -1;
            } else if (objRol_id === idRol) {
                return 1;
            } else {
                return 0;
            }

        }


        function getColumnas() {
            return getToken().then(function () {
                return $http.get(`${CONFIG.host}/Permisos/api/v1/permissions/all?token=${CONFIG.token}`,);
            }).then(function (res) {                
                return res.data;                
            });
        }

        function getPermissionsByRule(rule_name) {
            return getToken().then(function () {
                return $http.get(`${CONFIG.host}/Permisos/api/v1/permissions/rule/${rule_name}?token=${CONFIG.token}`);
            }).then(function (res) {
                if (res.data && res.data.length > 0)
                    return res.data;
                else
                    return null;
            });
        }

        function getOptionsOfUser(id) {
            return getToken().then(function () {
                return $http.get(`${CONFIG.host}/Permisos/api/v1/users/${id}/options?token=${CONFIG.token}`);
            }).then(function (res) {
                if (res.data && res.data.length > 0)
                    return res.data;
                else
                    return null;
            });
        }

        function getUser(userid) {
            return getToken().then(function () {
                return $http.get(`${CONFIG.host}/MzApi/api/v1/users/${userid}?token=${CONFIG.token}`);
            }).then(function (res) {
                if (res.data)
                    return res.data;
                else
                    return null;
            });
        }

        function getUserByDirectoryUserid(user_id, directory) {
            return getToken().then(function () {
                return $http.get(`${CONFIG.host}/MzApi/api/v1/users/${directory}/${user_id}?token=${CONFIG.token}`);
            }).then(function (res) {
                if (res.data)
                    return res.data;
                else
                    return null;
            });
        }        

        function checkOption(option) {
            if(!CONFIG.permissions || CONFIG.permissions.length<=0) return false;          

                        if(option.notshow === true) return false; 
            if(option.permissions===false) return true; 
            if(option.permissionAdmin===true) return isUserAdmin();

            var fPerm = CONFIG.permissions.find(function (perm) {
                return perm.option.includes("**") && option.name.startsWith(perm.option.replace("**", "")) || perm.option === option.name;
            });
            return fPerm !== undefined && fPerm.inverse === false;
        }

        function savePermissions(data){
            return getToken().then(function () {
                return $http.put(`${CONFIG.host}/Permisos/api/v1/permissions?token=${CONFIG.token}`, data);
            }).then(function (res) {
                return res;
            });
        }

        function assignGroupsRoles(data){
            return getToken().then(function () {
                return $http.put(`${CONFIG.host}/Permisos/api/v1/assign?token=${CONFIG.token}`, data);
            }).then(function (res) {

                return res;
            });
        }

        function deleteRule(rule){
            return getToken().then(function () {
                return $http.delete(`${CONFIG.host}/Permisos/api/v1/permissions/rule/${rule}?token=${CONFIG.token}`);
            }).then(function (res) {
                return res;
            });
        }       

        function newUser(data){
            return getToken().then(function () {
                return $http.put(`${CONFIG.host}/MzApi/api/v1/users?token=${CONFIG.token}`, data);
            }).then(function (res) {
                return res;
            });
        }

        function editUser(id, data){
            return getToken().then(function () {
                return $http.put(`${CONFIG.host}/MzApi/api/v1/users/${id}?token=${CONFIG.token}`, data);
            }).then(function (res) {
                return res;
            });
        }

        function deleteUser(id){
            return getToken().then(function () {
                return $http.delete(`${CONFIG.host}/MzApi/api/v1/users/${id}?token=${CONFIG.token}`);
            }).then(function (res) {
                return res;
            });
        }

        function getRolUser(id) {
            return getToken().then(function () {
                return $http.get(`${CONFIG.host}/Permisos/api/v1/role_users/${id}?token=${CONFIG.token}`);
            }).then(function (res) {
                return res;
            });
        }


        function newRole(role){
            return getToken().then(function () {
                return $http.put(`${CONFIG.host}/Permisos/api/v1/roles/?token=${CONFIG.token}`, role);
            }).then(function (res) {
                return res;
            });
        }

        function editRole(id,role){
            return getToken().then(function () {
                return $http.put(`${CONFIG.host}/Permisos/api/v1/roles/${id}?token=${CONFIG.token}`, role);
            }).then(function (res) {
                return res;
            });
        }

        function deleteRole(id){
            return getToken().then(function () {
                return $http.delete(`${CONFIG.host}/Permisos/api/v1/roles/${id}?token=${CONFIG.token}`);
            }).then(function (res) {
                return res;
            });
        }

        function newGroup(group){
            return getToken().then(function () {
                return $http.put(`${CONFIG.host}/Permisos/api/v1/groups?token=${CONFIG.token}`, group);
            }).then(function (res) {
                return res;
            });
        }

        function editGroup(id,group){
            return getToken().then(function () {
                return $http.put(`${CONFIG.host}/Permisos/api/v1/groups/${id}?token=${CONFIG.token}`, group);
            }).then(function (res) {
                return res;
            });
        }

        function deleteGroup(id){
            return getToken().then(function () {
                return $http.delete(`${CONFIG.host}/Permisos/api/v1/groups/${id}?token=${CONFIG.token}`);
            }).then(function (res) {
                return res;
            });
        }




                async function deleteSelected(data){
            var results = [];
            var errors = [];

            if(data.users && data.users.length>0){
                for(var i=0;i<data.users.length; i++){
                    await deleteUser(data.users[i].id).then(function(res){
                        res.model = data.users[i];
                        res.type = 'users';
                        res.data = { 
                            msj: "treepermissions.toast.userdelete", 
                            data: {user: data.users[i].fullname}
                        };
                        results.push(res);
                    }, function(error){
                        error.type = 'users';
                        error.model = data.users[i];
                        errors.push(error);
                    })                  
                }
            }

            if(data.groups && data.groups.length>0){
                for(var i=0;i<data.groups.length; i++){
                    await deleteGroup(data.groups[i].id).then(function(res){
                        res.model = data.groups[i];
                        res.type = 'groups';
                        res.data = { 
                            msj: "treepermissions.toast.groupdelete", 
                            data: {group: data.groups[i].name }
                        };
                        results.push(res);
                    }, function(error){
                        error.type = 'groups';
                        error.model = data.groups[i];
                        errors.push(error);
                    })
                }
            }

            if(data.roles && data.roles.length>0){
                for(var i=0;i<data.roles.length; i++){
                    await deleteRole(data.roles[i].id).then(function(res){
                        res.model = data.roles[i];
                        res.type = 'roles';
                        res.data = { 
                            msj: "treepermissions.toast.profiledelete", 
                            data: {role: data.roles[i].name }
                        };
                        results.push(res);
                    }, function(error){
                        error.type = 'roles';
                        error.model = data.roles[i];
                        errors.push(error);
                    })
                }
            }

            return {errors:errors, results: results};
        }

        function logout() {
            CONFIG.token = null;
            CONFIG.user = null;

            var prefix = $window.location.pathname.substr(0, $window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);
            if (!prefix || prefix == '') prefix = "/";
            $http.delete(`${$window.location.protocol}//${$window.location.hostname}:${$window.location.port}${prefix}qps/user`).then(function () {
                $window.top.location.href = `${$window.location.protocol}//${$window.location.hostname}/Siedco`;
            });
        };


        return {
            config: CONFIG,
            login: login,
            getToken: getToken,
            logout: logout,
            isUserAdmin: isUserAdmin,
            isUserRol: isUserRol,

            newUser: newUser,
            editUser: editUser,
            deleteUser: deleteUser,
            getRolUser: getRolUser,

            newRole: newRole,
            editRole: editRole,
            deleteRole: deleteRole,            
            newGroup: newGroup,
            editGroup: editGroup, 
            deleteGroup: deleteGroup,

            deleteSelected: deleteSelected,

            getColumnas: getColumnas,
            savePermissions: savePermissions,
            assignGroupsRoles: assignGroupsRoles,
            deleteRule: deleteRule,
            getPermissionsByRule: getPermissionsByRule,
            getOptionsOfUser: getOptionsOfUser,
            checkOption: checkOption,
            getUser: getUser,
            getUserByDirectoryUserid: getUserByDirectoryUserid,
            getTokenRefresh: getTokenRefresh

        };

    }]);
});