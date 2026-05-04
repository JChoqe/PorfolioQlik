define([
    'js/qlik',
    'app',
], function (qlik, app, site) {
    app.factory('mzApiGlobalService', ['$rootScope', '$q', '$window', '$cookies', '$http', '$state',
        function ($rootScope, $q, $window, $cookies, $http, $state) {

            var CONFIG = {
                host: $rootScope.APICONFIG.host,
                user: null,
                token: null,
                permissions: null,
                application_id: $rootScope.APICONFIG.application_id
            };

            var requestConfig;

            var _promise_login = null;
            function login() {
                var dfd = $q.defer();

                if (_promise_login) return _promise_login;
                _promise_login = dfd.promise;


                $http.post(
                    `${CONFIG.host}/MzApi/api/v1/login/qs?application_id=${CONFIG.application_id}`, null, {
                }).then(function (response) {
                    CONFIG.token = response.data.token;
                    CONFIG.token_refresh = response.data.token_refresh;
                    requestConfig = {
                        headers: {
                            'Authorization': 'Bearer ' + CONFIG.token,
                        }
                    };
                    return $http.get(`${CONFIG.host}/MzApi/api/v1/me?token=${CONFIG.token}`);
                }).then(function (response) {
                    CONFIG.user = response.data.user;
                    dfd.resolve();
                }).catch(function (err) {
                    $rootScope.$broadcast('broadcast-error');
                    console.error("apiService:", err);
                    dfd.reject(err);
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
            function getFavs() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/Global/api/favoritos/getFavoritosByUser`, requestConfig);
                }).then(function (res) {
                    return res.data;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function getFav(id, location) {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/Global/api/favoritos/getFavorito?object_id=${id}&location=${location}`, requestConfig);
                }
                ).then(function (res) {
                    return res.data;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function newFav(data) {
                return getToken().then(function () {
                    return $http.post(`${CONFIG.host}/Global/api/favoritos/createFavorito`, data, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function deleteFav(id, location) {
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/Global/api/favoritos/deleteFavorito?object_id=${id}&location=${location}`, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }


            function logout() {
                CONFIG.token = null;
                CONFIG.user = null;

                var prefix = $window.location.pathname.substr(0, $window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);
                if (!prefix || prefix == '') prefix = "/";
                console.log(`DELETE ${$window.location.protocol}//${$window.location.hostname}:${$window.location.port}${prefix}qps/user`);

                return qlik.getGlobal(config).isPersonalMode(function (reply) {
                    if (reply.qReturn) {
                        $window.close();
                    } else {
                        $http.get(`${$window.location.protocol}//${$window.location.hostname}:${$window.location.port}${prefix}qps/user`).then(function (res) {
                            let $LOCATION = `${$window.location.protocol}//${$window.location.hostname}:${$window.location.port}${prefix}qps/`;
                            let $LOGOUTURI = `${$window.location.protocol}//${$window.location.hostname}/hub/`;
                            return $http.delete(`${$window.location.protocol}//${$window.location.hostname}:${$window.location.port}${prefix}qps/user`).then(function (res) {
                                location.replace(`${$LOCATION}logout?targetUri=${$LOGOUTURI}`);
                            }).catch(function (err) {
                                console.error(err);
                            });

                        }).catch(function (err) {
                            console.error(err);
                        });
                    }
                });
            };


            function recuperarOpciones() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/Global/api/opciones/getAllOptions`, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function recuperarOpcionesMashup() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/Global/api/opciones/getAllUsuarioMashupOpcion`, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function crearOpcionMashup(data) {
                return getToken().then(function () {
                    return $http.post(`${CONFIG.host}/Global/api/opciones/createUsuarioMashupOpcion?opcion_id=${data}`, null, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }
            function actualizarOpcionMashup(id_options,val) {
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/Global/api/opciones/updateUsuarioMashupOpcion?opcion_id=${id_options}&visible=${val}`, null, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function eliminarOpcionMashup(id_options) {
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/Global/api/opciones/deleteUsuarioMashupOpcion?opcion_id=${id_options}`, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function obtenerIdiomas() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/Global/api/idiomas/getAllIdiomas`, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function crearAyudaObjeto(data) {
                return getToken().then(function () {
                    return $http.post(`${CONFIG.host}/Global/api/ayudas/createAyudaObjeto`, data, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function actualizarAyudaObjeto(data) {
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/Global/api/ayudas/updateAyudaObjeto`, data, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }


            function obtenerAyudaObjeto(id_objeto,id_idioma) {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/Global/api/ayudas/getAyudaObjetoByIdioma?object_id=${id_objeto}&idioma_id=${id_idioma}`, requestConfig);
                }).then(function (res) {
                    return res;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function existeAyudaObjeto(id_objeto,id_idioma) {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/Global/api/ayudas/getAyudaObjetoByIdioma?object_id=${id_objeto}&idioma_id=${id_idioma}`, requestConfig);
                }).then(function (res) {
                    return res.data !== null;
                }).catch(function (e) {
                    console.log(e);
                });
            }

            function getRolesUsuario() {
                return new Promise(async (resolve) => {
                    try {
                        if (window.location.host.toLowerCase().includes("localhost")) {
                            resolve(true);
                            return;
                        }

                                                const _Xrfkey = 'xn9THyy9AzXwdPj1';
                        const { protocol, hostname } = $window.location;
                        const userResponse = await $http.get(`${protocol}//${hostname}${prefix}qps/user?Xrfkey=${_Xrfkey}`, {
                            headers: { 'X-Qlik-XrfKey': _Xrfkey }
                        });

                                    const { userDirectory, userId } = userResponse.data;
                        const userQueryResponse = await $http.get(`${protocol}//${hostname}${prefix}qrs/User?filter=userDirectory+eq+%27${userDirectory}%27+and+userId+eq+%27${userId}%27&orderby=name+asc&Xrfkey=${_Xrfkey}`, {
                            headers: { 'X-Qlik-XrfKey': _Xrfkey }
                        });

                                    const ID = userQueryResponse.data[0].id;
                        const userDetailsResponse = await $http.get(`${protocol}//${hostname}${prefix}qrs/User/${ID}?Xrfkey=${_Xrfkey}`, {
                            headers: { 'X-Qlik-XrfKey': _Xrfkey }
                        });

                                    const { customProperties } = userDetailsResponse.data;
                        const ayudaObjetos = customProperties && customProperties.find((property) => {
                            return property.definition.name === "EditarAyuda";
                        });

                                                resolve(ayudaObjetos !== undefined && ayudaObjetos.value === 'SI');

                                            } catch (error) {
                        console.error(error);
                        resolve(false);
                    }
                });
            }

                        return {
                config: CONFIG,
                login: login,
                getToken: getToken,
                getTokenRefresh: getTokenRefresh,
                logout: logout,
                getFavs: getFavs,
                getFav: getFav,
                newFav: newFav,
                deleteFav: deleteFav,
                recuperarOpciones: recuperarOpciones,
                recuperarOpcionesMashup: recuperarOpcionesMashup,
                crearOpcionMashup: crearOpcionMashup,
                actualizarOpcionMashup: actualizarOpcionMashup,
                eliminarOpcionMashup:eliminarOpcionMashup,
                obtenerIdiomas:obtenerIdiomas,
                obtenerAyudaObjeto:obtenerAyudaObjeto,
                crearAyudaObjeto,crearAyudaObjeto,
                actualizarAyudaObjeto:actualizarAyudaObjeto,
                existeAyudaObjeto:existeAyudaObjeto,
                getRolesUsuario:getRolesUsuario
            };

        }]);
});