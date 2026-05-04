/****************************************************************************************************************************************
Obtener el host de la extensión, por ejemplo, en localhost:4848/extensions/NombreExtension/Pagina.html
se obtiene /extensions/NombreExtension/
/***************************************************************************************************************************************/
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'jquery',
    'angular',
    dir + 'include/mz-alerting/js/app.js',
], function(qlik, $, angular, app) {

    app.provider('mzAlertingService', [function() {
        var me = this;
        this.URL = "";



        this.$get = ["$rootScope", "$http", "$q", "$state", "$translate", "apiService", function($rootScope, $http, $q, $state, $translate, apiService) {

            var _error = $translate.instant('alerting.label.configuracion.master.error');
            var _advertencia = $translate.instant('alerting.label.configuracion.master.advertencia');
            var _informacion = $translate.instant('alerting.label.configuracion.master.informacion');
            var _exito = $translate.instant('alerting.label.configuracion.master.exito');
            var _data = $translate.instant('alerting.label.configuracion.master.data');
            var _system = $translate.instant('alerting.label.configuracion.master.system');
            var _valorFijo = $translate.instant('alerting.label.configuracion.master.valorFijo');
            var _valorPorcentaje = $translate.instant('alerting.label.configuracion.master.valorPorcentaje');
            var _minmax = $translate.instant('alerting.label.configuracion.master.minmax');
            var _max = $translate.instant('alerting.label.configuracion.master.max');
            var _min = $translate.instant('alerting.label.configuracion.master.min');
     
            this.masters = {
                types: [{ name: _error, id: 'danger' }, { name: _advertencia, id: 'warning' }, { name: _informacion, id: 'info' }, { name: _exito, id: 'success' }],
                eventTypes: [{ name: _data, id: 'data' }, { name: _system, id: 'system' }],
                conditionTypes: [{ name: _valorFijo, id: 'static' }, { name: _valorPorcentaje, id: 'perc' }],
                rangeTypes: [{ name: _minmax, id: 'minmax' }, { name: _max, id: 'max' }, { name: _min, id: 'min' }]
            }; 

            var CONFIG = {
                //host: `${window.location.protocol}//${window.location.hostname}:6900`,
                host: apiService.config.host + "/Alertas",
                //host: "http://88.87.139.59:6900",
                //host: "http://localhost:6900",
                user: null,
                token: null,
                permissions: null
            };

            var _promise_login = null;

            function login() {
                var dfd = $q.defer();
    
                if(_promise_login) return _promise_login;
                _promise_login = dfd.promise;

                apiService.getToken().then(function (resp) {
                    CONFIG.token = apiService.config.token;
                    return $http.get(`${apiService.config.host}/MzApi/api/v1/me_core?token=${CONFIG.token}`);
                }).then(function (response) {
                    CONFIG.user = response.data.user;
                    dfd.resolve(CONFIG);
                }).catch(function (err) {
                    console.error("alertsApiService:", err);
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

            function comprobarDefiniciones() {
                /*Recuperar todas las definiciones*/
                return getAllDefinitions().then(function (definitions){
                    //console.log('Definitions: ', definitions);

                    //Recorrer definiciones recuperadas
                    definitions.forEach(definition => {
                        var appId = definition.app_id;
                        var objectId = definition.object_id;

                        var seAgrega = true;
                        var tipoClase = "definition";

                        cambiarClases(tipoClase, seAgrega, definition);

                        comprobarAlertas(appId, objectId);
                    });

                    $rootScope.alertasComprobadas = true;
                }).catch(function (error) {
                    console.log(error)
                });
            }

            function comprobarAlertas(app_id, object_id) {
                var appId = app_id;
                var objectId = object_id;
                
                getAlertsByObject(appId, objectId).then(function (alerts) {
                    if (alerts.length == 0){
                        //Añadir comprobación para que no vuelva a comprobar las alertas
                        if (!$rootScope.alertasComprobadas){
                            //Recuperar medidas del KPI de la definición
                            var qsApp = qlik.openApp(appId, config);
                            qsApp.getObjectProperties(objectId).then(function (model) {
                                model.getHyperCubeData('/qHyperCubeDef', [{
                                    qTop: 0,
                                    qLeft: 0,
                                    qWidth: 10,
                                    qHeight: 1000
                                }]).then(function (data) {
                                    var alerta = {
                                        alert_definition_id: definition.id,
                                        name: definition.name,
                                        message: definition.message,
                                        type: definition.type,
                                        app_id: appId,
                                        object_id: objectId,
                                        sheet: definition.sheet
                                    };
                                    var indice = definition.measure_index;

                                    var variables = {
                                        tipo_condicion: definition.condition_type,
                                        tipo_rango: definition.range_type,
                                        valor_min: definition.range_min,
                                        valor_max: definition.range_max,
                                        indice: definition.measure_index,
                                        valor_medida: String(data[0].qMatrix[0][indice].qText)
                                    }

                                    var alerta_cumple_condiciones = comprobarCondiciones(variables);

                                    if (alerta_cumple_condiciones){
                                        newAlert(alerta).then(function (res){
                                            //console.log('New alert: ', res);
                                            var seAgrega = true;
                                            var tipoClase = "alert";

                                            cambiarClases(tipoClase, seAgrega, alerta);
                                        });
                                    }
                                }).catch(function (error) {
                                    console.log(error)
                                });
                            });
                    
                        }
                    }else{
                        alerts.forEach(alert => {
                            var seAgrega = true;
                            var tipoClase = "alert";
    
                            cambiarClases(tipoClase, seAgrega, alert);
                        });
                    }
                    

                }).catch(function (error) {
                    console.log(error)
                });
                
            }

            function cambiarClases(tipo_clase, agregar, item){
                var appActual = $('body').attr('data-app');
                var appObjeto = item.app_id;

                if(appObjeto == appActual){
                    var tipoClase = String(tipo_clase).toLowerCase();
                    var seAgrega = agregar;
                    var objectId = item.object_id;

                    var type = item.type;

                    var target = document.getElementById(objectId);

                    if(target){
                        target.dataset.type = type;
                    }


                    if(target != null){
                        switch(tipoClase) {
                            case "definition":
                                if(seAgrega){
                                    target.classList.add("definicionActiva");
                                } else {
                                    target.classList.remove("definicionActiva");
                                }
                                break;
                            case "alert":
                                if(seAgrega){
                                    target.classList.add("alertaActiva");
                                } else {
                                    target.classList.remove("alertaActiva");
                                }
                                break;
                        }
                    }

                }

            }

            function comprobarCondiciones(variables){
                var seCumple = false;

                var tipo_condicion = variables.tipo_condicion;
                var tipo_rango = variables.tipo_rango;
                var valor_min = variables.valor_min;
                var valor_max = variables.valor_max;
                var valor_medida = variables.valor_medida;
                var segundoValor = -1;
                var longitudValor = 0;


                if (parseFloat(variables.valor_medida) < 1 && parseFloat(variables.valor_medida) > 0){
                    valor_medida = parseFloat(variables.valor_medida);
                }else{
                    valor_medida = valor_medida.replaceAll(".", "");
                    valor_medida = valor_medida.replaceAll(",", ".");
    
                    //Para los casos de los KPIs con dos medidas en su valor
                    segundoValor = valor_medida.indexOf("(");
                    longitudValor = valor_medida.length;

                    valor_medida =valor_medida.trim();
                }

                if (tipo_condicion == 'static'){
                    //Si el tipo de condición va a ser estático le quita la parte porcentual
                    valor_medida = segundoValor != - 1 ? parseFloat(valor_medida.substring(0, segundoValor)) : parseFloat(valor_medida);
                }else{
                    //Si no se queda con la parte porcentual
                    valor_medida = segundoValor != - 1 ? parseFloat(valor_medida.substring(segundoValor + 1, longitudValor - 2)) : parseFloat(valor_medida);
                }

                valor_medida = tipo_condicion != 'static' && valor_medida < 1 && valor_medida > 0 ? valor_medida * 100 : valor_medida;

                if (
                    (tipo_rango === 'min' && valor_medida < valor_min) ||
                    (tipo_rango === 'max' && valor_medida > valor_max) ||
                    (tipo_rango === 'minmax' && (valor_medida < valor_min || valor_medida > valor_max))
                ){
                    seCumple = true;
                }else{
                    seCumple = false;
                }

                return seCumple;

            }

            /* USUARIOS */
            function newUser(user){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/users?token=${CONFIG.token}`, user);
                }).then(function (res) {
                    return res;
                });
            }

            function editUser(id, user){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/users/${id}?token=${CONFIG.token}`, user);
                }).then(function (res) {
                    return res;
                });
            }

            function deleteUser(id){
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/api/v1/users/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            /* ALERTAS */
            function getAllAlerts() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/alerts?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res.data;
                });
            }

            function getAlert(id) {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/alerts/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res.data;
                });
            }

            function getAlertsByObject(appId, objectId){
                return getToken().then(function () {
                    var app_id_encoded = encodeURIComponent(appId);
                    return $http.get(`${CONFIG.host}/api/v1/alerts/${app_id_encoded}/${objectId}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res.data;
                });
            }

            function newAlert(alert){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/alerts/?token=${CONFIG.token}`, alert);
                }).then(function (res) {
                    $rootScope.$broadcast('mzAlertingUpdate');
                    return res;
                });
            }

            function editAlert(id, alert){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/alerts/${id}?token=${CONFIG.token}`, alert);                    
                }).then(function (res) {
                    $rootScope.$broadcast('mzAlertingUpdate');
                    return res;
                });
            }

            function deleteAlert(id){
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/api/v1/alerts/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    $rootScope.$broadcast('mzAlertingUpdate');
                    return res;
                });
            }

            /* DEFINICIONES ALERTAS */
            function getAllDefinitions() {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/alerts_definitions?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res.data;
                });
            }

            function getAlertDefinition(id) {
                return getToken().then(function () {
                    return $http.get(`${CONFIG.host}/api/v1/alerts_definitions/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res.data;
                });
            }

            function getDefinitionByObject(app_id, object_id){
                return getToken().then(function () {
                    var app_id_encoded = encodeURIComponent(app_id); 
                    return $http.get(`${CONFIG.host}/api/v1/alerts_definitions/${app_id_encoded}/${object_id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return $q(function(resolve, reject){                    
                        var alert_definition = res.data;

                        //new Object
                        var model = {
                            name: null,
                            message: null,
                            app_id: app_id,
                            type: 'info',
                            sheet: $state.current.name,
                            object_id: object_id,
                            measure_index: 0,
                            condition_type: 'static',
                            range_type: 'minmax',
                            range_max: 0,
                            range_min: 0
                        };
                        if(alert_definition.length>0) model = alert_definition[0];

                        //Masters
                        model.types = me.masters.types.find(function(item){ return item.id === model.type;});
                        model.range_type_data = me.masters.rangeTypes.find(function(item){ return item.id === model.range_type;});

                        //Hoja de Mashup. state:
                        var state = $state.get().find(function(state){
                            return state.name === model.sheet;
                        });
                        if(state && state.params && state.params.PATH && state.params.PATH.length>0){
                            var rutas = [];
                            for (var x = 0; x < state.params.PATH.length; x++){
                                $translate(state.params.PATH[x]).then(function (translation) {
                                    rutas.push(translation);
                                    if(rutas.length == state.params.PATH.length && !model.sheet_data)model.sheet_data = {id: state.name, name: rutas.join(" > ") };
                                }).catch(function(route){
                                    rutas.push(route);
                                    if(rutas.length == state.params.PATH.length && !model.sheet_data)model.sheet_data = {id: state.name, name: rutas.join(" > ") };
                                });
                            }
                        }

                        // QlikSense: app, gráfico y medidas
                        var qsApp = qlik.openApp(model.app_id, config);
                        model.app = {id: model.app_id, name: qsApp.model.layout.qTitle};
                        qsApp.visualization.get(model.object_id).then(function(vis){
                            if(vis.model.layout.medidas && vis.model.layout.medidas.length > 0){
                                var measures = vis.model.layout.medidas.map(function(med, index){
                                    return { name: med.label.data, id: index, value: med.value.data};
                                });
                            }else{
                                var measures = vis.model.layout.qHyperCube.qMeasureInfo.map(function(med, index){
                                    return { name: med.qFallbackTitle, id: index, value: med.qMax || med.qMin};
                                });
                            }
                            model.object = { id: model.object_id, name: vis.model.layout.title || "Sin título", measures: measures };
                            model.measure = measures[model.measure_index];

                        }).catch(function (error) {
                            console.log(error)
                        });

                        resolve(model);
                    });
                });
            }

            function newAlertDefinition(alert_definition){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/alerts_definitions/?token=${CONFIG.token}`, alert_definition);
                }).then(function (res) {
                    return res;
                });
            }

            function editAlertDefinition(id, alert_definition){
                return getToken().then(function () {
                    return $http.put(`${CONFIG.host}/api/v1/alerts_definitions/${id}?token=${CONFIG.token}`, alert_definition);
                }).then(function (res) {
                    return res;
                });
            }

            function deleteAlertDefinition(id){
                return getToken().then(function () {
                    return $http.delete(`${CONFIG.host}/api/v1/alerts_definitions/${id}?token=${CONFIG.token}`);
                }).then(function (res) {
                    return res;
                });
            }

            function read(alert) {
                alert.read_at = new Date();
                editAlert(alert.id, alert).then(function(res){
                    //console.log('Alert read: ', res.data);
                    //$rootScope.$broadcast('mzAlertingUpdate');
                });
                
            }

            function unRead(alert) {
                alert.read_at = null;
                editAlert(alert.id, alert).then(function(res){
                    //console.log('Alert unread: ', res.data);
                    //$rootScope.$broadcast('mzAlertingUpdate');
                });
                
            }

            function getMasters(){
                return $q.resolve(me.masters);
            }

            function getMastersList(appId) {
                var app = qlik.openApp(appId, config);
                var sessionObjectPrp = {
                    "qInfo": { "qType": "SessionList", "qId": "" },
                    "qDimensionListDef": {
                        "qType": "dimension",
                        "qData": { "title": "/qMetaDef/title", "tags": "/qMetaDef/tags", "grouping": "/qDim/qGrouping", "info": "/qDimInfos" },
                    },
                    "qMeasureListDef": {
                        "qType": "measure",
                        "qData": { "title": "/qMetaDef/title", "tags": "/qMetaDef/tags" },
                    }
                };

                return app.model.engineApp.createSessionObject(sessionObjectPrp).then(function(listObj) {
                    return listObj.getLayout();
                }).then(function(list) {
                    return {
                        dimensions: list.qDimensionList.qItems.map(function(item) {
                            return { id: item.qInfo.qId, name: item.qMeta.title };
                        }),
                        measures: list.qMeasureList.qItems.map(function(item) {
                            return { id: item.qInfo.qId, name: item.qMeta.title };
                        })
                    };
                })
            }

            return {
                config: CONFIG,
                login: login,
                getToken: getToken,                
                comprobarDefiniciones: comprobarDefiniciones,
                comprobarAlertas: comprobarAlertas,
                cambiarClases: cambiarClases,
                comprobarCondiciones: comprobarCondiciones,
                newUser: newUser,
                editUser: editUser,
                deleteUser: deleteUser,
                getAllAlerts: getAllAlerts,
                getAlert: getAlert,
                getAlertsByObject: getAlertsByObject,
                newAlert: newAlert,
                editAlert: editAlert,
                deleteAlert: deleteAlert,
                getAllDefinitions: getAllDefinitions,
                getAlertDefinition: getAlertDefinition,
                getDefinitionByObject: getDefinitionByObject,
                newAlertDefinition: newAlertDefinition,
                editAlertDefinition: editAlertDefinition,
                deleteAlertDefinition: deleteAlertDefinition,
                read:read,
                unRead: unRead,
                getMasters: getMasters,
                getMastersList: getMastersList
            }
        }]

    }])

});