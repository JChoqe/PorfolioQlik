/****************************************************************************************************************************************
Obtener el host de la extensión, por ejemplo, en localhost:4848/extensions/NombreExtension/Pagina.html
se obtiene /extensions/NombreExtension/
/************************************************************************************************************************************** */
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'jquery',
    'angular',
    dir + 'include/mz-options/js/app.js',
], function(qlik, $, angular, app) {

    app.provider('mzOptionsService', [function() {
        var me = this;
        this.URL = "";

        this.$get = ["$rootScope", "$http", "$q", "$state", "mzApiGlobalService", function($rootScope, $http, $q, $state, mzApiGlobalService) {
            var CONFIG = {
                //host: `${window.location.protocol}//${window.location.hostname}:3030`,
                host: mzApiGlobalService.config.host + "/Opciones",
                user: null,
                token: null
            };

            var _promise_login = null;

            var nombreMashup = dir.replace('/extensions/', '').replace('/', '').trim();

            function login() {
                var dfd = $q.defer();
    
                if(_promise_login) return _promise_login;
                _promise_login = dfd.promise;

                mzApiGlobalService.getToken().then(function (resp) {
                    CONFIG.token = mzApiGlobalService.config.token;
                    return $http.get(`${mzApiGlobalService.config.host}/MzApi/api/v1/me_core?token=${CONFIG.token}`);
                }).then(function(response) {
                    CONFIG.user = response.data.user;
                    dfd.resolve(CONFIG);
                }).catch(function (err) {
                    console.error("optionsmzApiGlobalService:", err);
                    dfd.reject(err);
                });

                return _promise_login;
            };

            function getToken() {
                var dfd = $q.defer();
                if (CONFIG.token !== null) dfd.resolve(CONFIG.token);
                login().then(function () { dfd.resolve(CONFIG.token) });
                return dfd.promise;
            };


            /* USUARIOS */
            function recuperarUsuarios() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/usuarios?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            function nuevoUsuario(user) {
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/usuarios?token=${CONFIG.token}`, user);
                }).then(function (res) {
                    return res;
                });
            }

            function editarUsuario(id, user){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/usuarios/${id}?token=${CONFIG.token}`, user);
                }).then(function (res) {
                    return res;
                });
            }

            function borrarUsuario(id){
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/api/v1/usuarios/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            /* OPCIONES */
            function recuperarOpciones() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/opciones?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            function nuevaOpcion(option) {
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/opciones?token=${CONFIG.token}`, option);
                }).then(function (res) {
                    return res;
                });
            }

            function editarOpcion(id, option){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/opciones/${id}?token=${CONFIG.token}`, option);
                }).then(function (res) {
                    return res;
                });
            }

            function borrarOpcion(id){
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/api/v1/opciones/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            /* MASHUPS */
            function recuperarMashups() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/mashups?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            function nuevoMashup(mashup) {
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/mashups?token=${CONFIG.token}`, mashup);
                }).then(function (res) {
                    return res;
                });
            }

            function editarMashup(id, mashup){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/mashups/${id}?token=${CONFIG.token}`, mashup);
                }).then(function (res) {
                    return res;
                });
            }

            function borrarMashup(id){
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/api/v1/mashups/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            function comprobarMashup() {
                var nuevoMashup = {nombre: nombreMashup};

                recuperarMashups().then(function(mashups){
                    mashups = mashups.filter(function(mashup) {
                        return mashup.nombre == nombreMashup;
                    });

                    //console.log('Mashups recuperados: ', mashups);
    
                    if(mashups.length > 0){
                        $rootScope.mashupId = $scope.mashups[0].id;
                    }else{
                        nuevoMashup(nuevoMashup).then(function (res){
                            var  mashup = res.data;
                            $rootScope.mashupId = mashup.id;
                        })
                    }

                    //console.log('Id mashup: ', $rootScope.mashupId);
                });
            }

            /* MODOS */
            function recuperarModos() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/modos?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            function nuevoModo(modo) {
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/modos?token=${CONFIG.token}`, modo);
                }).then(function (res) {
                    return res;
                });
            }

            function editarModo(id, modo){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/modos/${id}?token=${CONFIG.token}`, modo);
                }).then(function (res) {
                    return res;
                });
            }

            function borrarModo(id){
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/api/v1/modos/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }
            
            /* OPCIONES POR USUARIO Y MASHUP (fila completa)*/
            function recuperarOpcionesPorUsuarioMashup(mashupID) {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/usuarios_mashups_opciones/${mashupID}/?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            /* OPCION POR USUARIO Y MASHUP*/
            function recuperarOpcionPorUsuarioMashup(mashupID, opcionID) {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/usuarios_mashups_opciones/${mashupID}/${opcionID}/?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            function nuevaOpcionPorUsuarioMashup(opcion) {
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/usuarios_mashups_opciones?token=${CONFIG.token}`, opcion);
                }).then(function (res) {
                    return res;
                });
            }
            
            function editarOpcionPorUsuarioMashup(mashupID, opcionID, opcion){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/usuarios_mashups_opciones/${mashupID}/${opcionID}?token=${CONFIG.token}`, opcion);
                }).then(function (res) {
                    return res;
                });
            }

            function borrarOpcionPorUsuarioMashup(mashupID, opcionID){
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/api/v1/usuarios_mashups_opciones/${mashupID}/${opcionID}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            return {
                config: CONFIG,
                login: login,
                getToken: getToken,
                recuperarUsuarios: recuperarUsuarios,
                nuevoUsuario: nuevoUsuario,
                editarUsuario: editarUsuario,
                borrarUsuario: borrarUsuario,
                recuperarOpciones: recuperarOpciones,
                nuevaOpcion: nuevaOpcion,
                editarOpcion: editarOpcion,
                borrarOpcion: borrarOpcion,
                recuperarMashups: recuperarMashups,
                nuevoMashup: nuevoMashup,
                editarMashup: editarMashup,
                borrarMashup: borrarMashup,
                comprobarMashup: comprobarMashup,
                recuperarModos: recuperarModos,
                nuevoModo: nuevoModo,
                editarModo: editarModo,
                borrarModo: borrarModo,
                recuperarOpcionesPorUsuarioMashup : recuperarOpcionesPorUsuarioMashup,
                recuperarOpcionPorUsuarioMashup: recuperarOpcionPorUsuarioMashup,
                nuevaOpcionPorUsuarioMashup: nuevaOpcionPorUsuarioMashup,
                editarOpcionPorUsuarioMashup: editarOpcionPorUsuarioMashup,
                borrarOpcionPorUsuarioMashup: borrarOpcionPorUsuarioMashup
            }
        }]

    }])

});