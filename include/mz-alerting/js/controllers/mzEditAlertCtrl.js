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
    dir + 'include/mz-alerting/js/app.js',
], function(qlik, $, angular, app) {

    app.controller('mzEditAlertCtrl', ['$rootScope', '$scope', 'mzAlertingService', '$state', 'toast', 'luiDialog', '$http','$translate' 
    ,  function($rootScope, $scope, mzAlertingService, $state, toast, luiDialog, $http, $translate) {
        $scope.darkView = $rootScope.darkView;
        $scope.step = 1;

        var mensajeCreacionAlerta = $translate.instant('alerting.toast.mensajeCreacionAlerta');
        var mensajeEliminacionAlerta = $translate.instant('alerting.toast.mensajeEliminacionAlerta');
        var mensajeCreacionDefinicion = $translate.instant('alerting.toast.mensajeCreacionDefinicion');
        var mensajeEliminacionDefinicion = $translate.instant('alerting.toast.mensajeEliminacionDefinicion');
        var mensajeActualizacionDefinicion = $translate.instant('alerting.toast.mensajeActualizacionDefinicion');

        function toastAlertsMsj(clase, message, data) {
            //Estilo toast
            $('.angularjs-toast').css('margin-top', '226px', 'important');
            var duracionMilisegundos = 1000;
            toast.create({ timeout: duracionMilisegundos, message: message, className: clase, dismissible: true });

            setTimeout(function(){
                if(message == mensajeCreacionAlerta 
                    || message == mensajeEliminacionAlerta 
                    || message == mensajeEliminacionDefinicion) {
                        $rootScope.cerrarDialog();
                    }
                
                //Dejar el estilo original
                $('.angularjs-toast').css('margin-top', '40px');
            }, duracionMilisegundos + 250);
        }

        // Datos de modelo
        $scope.model = $scope.input.definition;

        // maestros
        mzAlertingService.getMasters().then(function(masters){
            // console.log("$scope.model", $scope.model.app)
            $scope.masters = masters;

            $scope.masters.apps = [$scope.model.app];
            $scope.masters.sheets = [$scope.model.sheet_data];

            // console.log("$scope.masters", $scope.masters);
        });


        $scope.isMin = function(){
            if(!$scope.model || !$scope.model.range_type_data || !$scope.model.range_type_data.id) return false;
            return $scope.model.range_type_data.id === 'minmax' || $scope.model.range_type_data.id === 'min';
        }
        $scope.isMax = function(){
            if(!$scope.model || !$scope.model.range_type_data || !$scope.model.range_type_data.id) return false;
            return $scope.model.range_type_data.id === 'minmax' || $scope.model.range_type_data.id === 'max';
        }

        $scope.save = function(model) {
            //Trapaceria temporal para guardar correctamente el range_type y el measure_index
            model.range_type = $scope.model.range_type_data.id;
            model.measure_index = $scope.model.measure.id;
            model.type = $scope.model.types.id;
            
            var alert_definition = model;
            //console.log("SAVE", alert_definition);

            var variables = {
                tipo_condicion: $scope.model.condition_type,
                tipo_rango: $scope.model.range_type,
                valor_min: $scope.model.range_min,
                valor_max: $scope.model.range_max,
                indice: $scope.model.measure_index,
                valor_medida: String($scope.model.measure.value)
            }

            if (alert_definition.id){
                var alerta = {
                    alert_definition_id: alert_definition.id,
                    name: alert_definition.name,
                    message: alert_definition.message,
                    type: alert_definition.type,
                    app_id: alert_definition.app_id,
                    object_id: alert_definition.object_id,
                    sheet: alert_definition.sheet
                };

                mzAlertingService.editAlertDefinition(alert_definition.id, alert_definition).then(function (res){
                    //console.log('Update definition: ', res.data);
                    mzAlertingService.getAlertsByObject(alert_definition.app_id, alert_definition.object_id).then(function (alerts){
                        //Recuperar las alertas existentes (si las hubiera)
                        if (alerts.length > 0){
                            alerta.id = alerts[0].id;
    
                            var alerta_cumple_condiciones = mzAlertingService.comprobarCondiciones(variables);

                            if (alerta_cumple_condiciones){
                                //Si recupera alerta y se cumplen las condiciones se actualizan sus datos
                                mzAlertingService.editAlert(alerta.id, alerta).then(function(res){
                                    //console.log('Update alert: ', res.data);
                                    var seAgrega = true;
                                    var tipoClase = "alert";

                                    mzAlertingService.cambiarClases(tipoClase, seAgrega, alerta);                                    
                                }).catch(function (error) {
                                    console.log(error)
                                });
                            }else{
                                //Si recupera alerta pero ya no se cumplen las condiciones la borra
                                mzAlertingService.deleteAlert(alerta.id).then(function(res){
                                    //console.log('Delete alert: ', res.data);
                                    var seAgrega = false;
                                    var tipoClase = "alert";

                                    mzAlertingService.cambiarClases(tipoClase, seAgrega, alerta);
                                    
                                }).catch(function (error) {
                                    console.log(error)
                                });
                            }
                            
                        }else{
                            //Si no recupera ninguna alerta existente pero cumple las condiciones crea una nueva alerta
                            var alerta_cumple_condiciones = mzAlertingService.comprobarCondiciones(variables);

                            if (alerta_cumple_condiciones){
                                mzAlertingService.newAlert(alerta).then(function (res){
                                    var seAgrega = true;
                                    var tipoClase = "alert";

                                    mzAlertingService.cambiarClases(tipoClase, seAgrega, res.data);

                                    toastAlertsMsj('alert-success', mensajeCreacionAlerta);
                                }).catch(function (error) {
                                    console.log(error);
                                });
                            }                            
                        }
                    }).catch(function (error) {
                        console.log(error)
                    });                    

                    toastAlertsMsj('alert-success', mensajeActualizacionDefinicion);
                }).catch(function (error) {
                    console.log(error)
                });
            }else{
                mzAlertingService.getDefinitionByObject(alert_definition.app_id, alert_definition.object_id).then(function (definition){
                    //Comprobar que no exista ya una defiinición alerta ya creada
                    if (!definition.id){
                        mzAlertingService.newAlertDefinition(alert_definition).then(function (res){
                            var seAgrega = true;
                            var tipoClase = "definition";

                            mzAlertingService.cambiarClases(tipoClase, seAgrega, res.data);
                                                            
                            toastAlertsMsj('alert-success', mensajeCreacionDefinicion);

                            var alert_definition = res.data;
        
                            if(alert_definition.id){
                                var alerta = {
                                    alert_definition_id: alert_definition.id,
                                    name: alert_definition.name,
                                    message: alert_definition.message,
                                    type: alert_definition.type,
                                    app_id: alert_definition.app_id,
                                    object_id: alert_definition.object_id,
                                    sheet: alert_definition.sheet
                                };
        
                                mzAlertingService.getAlertsByObject(alert_definition.app_id, alert_definition.object_id).then(function (alerts){
                                    //Con los datos guardados de la definición se crea nueva alerta;
                                    if (alerts.length == 0){
                                            var alerta_cumple_condiciones = mzAlertingService.comprobarCondiciones(variables);

                                            if (alerta_cumple_condiciones){
                                                mzAlertingService.newAlert(alerta).then(function (res){
                                                    var seAgrega = true;
                                                    var tipoClase = "alert";

                                                    mzAlertingService.cambiarClases(tipoClase, seAgrega, res.data);

                                                    toastAlertsMsj('alert-success', mensajeCreacionAlerta);
                                                }).catch(function (error) {
                                                    console.log(error);
                                                });
                                            }
                                    }
                                }).catch(function (error) {
                                    console.log(error)
                                });
                            }
                        }).catch(function (error) {
                            console.log(error)
                        });
                    }
                });
            }
        }

        $scope.openDelete = function(model) {
            $http.get('include/mz-alerting/js/partials/deleteDefinitionDialog.html').then(function (response) {
                var plantillaHTML = response.data;

                var dialog = luiDialog.show({
                    template: plantillaHTML,
                    closeOnEscape: true,
                    input: { definition: model },
                    controller: ['$scope', '$rootScope', 'mzAlertingService', function ($scope, $rootScope, mzAlertingService) {
                        $scope.delete = function(model) {
                            //console.log("DELETE");
                
                            var alerts = 0;
                            var definition = model;
                            var definition_id = definition.id;
                            var appID = definition.app_id;
                            var objectId = definition.object_id;

                            mzAlertingService.getAlertsByObject(appID, objectId).then(function (res){
                               alerts = res;
                
                               //console.log('Alerts: ', alerts.length);
                
                               if(alerts.length == 0 || alerts === 0){
                                   mzAlertingService.deleteAlertDefinition(definition_id).then(function (res){
                                       //console.log('Delete definition: ', res.data);
                                       var seAgrega = false;
                                       var tipoClase = "definition";

                                       mzAlertingService.cambiarClases(tipoClase, seAgrega, definition);

                                       toastAlertsMsj('alert-success', mensajeEliminacionDefinicion);
                                       dialog.close();
                                   }).catch(function (error) {
                                       console.log(error);
                                   });
                               }else{
                                   mzAlertingService.deleteAlert(alerts[0].id).then(function (res){
                                       //console.log('Delete alerts: ', res.data);
                                       var seAgrega = false;
                                       var tipoClase = "alert";

                                       mzAlertingService.cambiarClases(tipoClase, seAgrega, alerts[0]);

                                       mzAlertingService.deleteAlertDefinition(definition_id).then(function (res){
                                           //console.log('Delete definition: ', res.data);
                                           var seAgrega = false;
                                           var tipoClase = "definition";
    
                                           mzAlertingService.cambiarClases(tipoClase, seAgrega, definition);

                                           toastAlertsMsj('alert-success', mensajeEliminacionAlerta);

                                           dialog.close();

                                       }).catch(function (error) {
                                           console.log(error);
                                       });
                                   }).catch(function (error) {
                                       console.log(error);
                                   });
                               }
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                    }]
                });
            });
        }
    }]);
});