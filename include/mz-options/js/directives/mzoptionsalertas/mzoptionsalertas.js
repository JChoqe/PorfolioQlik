/****************************************************************************************************************************************
Obtener el host de la extensión, por ejemplo, en localhost:4848/extensions/NombreExtension/Pagina.html
se obtiene /extensions/NombreExtension/
/************************************************************************************************************************************** */
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'angular',
    dir + 'include/mz-options/js/app.js',
], function (qlik, angular, app) {
    app.directive('mzoptionsalertas', [function () {

        var directiveDefinitionObject = {
            restrict: 'E',
            scope: true,
            templateUrl: 'include/mz-options/js/directives/mzoptionsalertas/mzoptionsalertas.html',
            link: function (scope, element, attrs) {

            },
            controller: ['$q', '$scope', '$rootScope', '$translate', 'mzAlertingService', 'mzApiGlobalService', 'InitConfig', function ($q, $scope, $rootScope, $translate, mzAlertingService, mzApiGlobalService, InitConfig) {
                var deregister = $scope.$on("broadcast-alertas", function (evt) {
                    $scope.isActive = $rootScope.isVisibleLinkAlertas; 
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem"); 
                });
                $scope.$on('$destroy', function destroyScope() {
                    deregister();
                });
                setTimeout(() => {
                    $scope.isActive = $rootScope.isVisibleLinkAlertas; 
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                }, 1200);

                function getValueState() {
                    return new Promise(resolve => {
                        $scope.isActive = $scope.isActive === false ? true : false;
                        resolve($scope.isActive)
                    })
                }

                $scope.anclarThis = async function (e) {
                    const valState = await getValueState();
                    actualizarVistaSegunValorState(valState);
                    actualizarAlertas(valState);
                };
                
                function actualizarVistaSegunValorState(valState) {
                    $scope.message = $translate.instant(valState ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                    $rootScope.isVisibleLinkAlertas = valState;
                }
                
                function actualizarAlertas(valState) {
                    if (mzApiGlobalService.config.token !== null) {
                        $rootScope.ITEMSOPCIONES[0].visible = valState;
                        mzApiGlobalService.actualizarOpcionMashup($rootScope.opcionAlertas.opcion_id, valState);
                    }
                }
                

                $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                });
                function getArrayNotifications(arr) {
                    var defer = $q.defer();
                    angular.forEach(arr, function (value, key) {
                        if (value.read_at == null && value.app_id == $rootScope.appID) {
                            $scope.bubble = $scope.bubble + 1;
                            var item = {};
                            item.id = value.id;
                            item.name = value.name;
                            item.message = value.message;
                            item.type = value.type;
                            item.model = value;
                            $scope.arrAlertas.push(item);
                        }
                    })
                    defer.resolve($scope.arrAlertas);
                    return defer.promise;
                }



                $scope.InitLoadAlert = function () {
                    mzAlertingService.getAllAlerts().then(function (items) {
                        var arrItems = items;
                        $scope.arrAlertas = [];
                        $scope.numAlertas = arrItems.length;

                        $rootScope.BubbleAlerts = [];
                        function getBubble() {
                            $rootScope.BubbleAlerts = arrItems.filter(function (alert) {
                                return alert.read_at == null && alert.app_id == $rootScope.appID;
                            })
                        }
                        getBubble();
                        if ($scope.numAlertas > 0) {
                            getArrayNotifications(arrItems).then(function () {

                            })
                        }


                        //Eliminar Items Notificaciones

                        $scope.hideOptions = function ($event, model) {
                            var _el = $($event.currentTarget).parents('.item-notifications');
                            $(_el).animate({
                                opacity: 0,
                            },
                                600, 'swing').animate({
                                    height: '0px',
                                    width: '0px',
                                    padding: 0,
                                    display: 'none',
                                    minHeight: 0
                                },
                                    600, 'swing', function () {
                                        $(_el).remove();
                                        mzAlertingService.read(model);
                                    });
                        };
                    })
                }
                if (InitConfig.mzAlerting) {
                    $scope.InitLoadAlert();
                }

                $scope.$watch(function (scope) { return $rootScope.OpenOptionsPanel },
                    function (newValue, oldValue) {
                        if (newValue == true) {
                            if (InitConfig.mzAlerting) {
                                $scope.InitLoadAlert();
                            }
                        }
                    }
                );

            }]
        };
        return directiveDefinitionObject;
    }]);


});