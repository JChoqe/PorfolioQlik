/****************************************************************************************************************************************
Obtener el host de la extensión, por ejemplo, en localhost:4848/extensions/NombreExtension/Pagina.html
se obtiene /extensions/NombreExtension/
/************************************************************************************************************************************** */
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'angular',
    'underscore',
    dir + 'include/mz-options/js/app.js',
], function (qlik, angular, us, app) {
    app.directive('mzoptionsmode', [function () {

        var directiveDefinitionObject = {
            restrict: 'E',
            scope: false,
            templateUrl: 'include/mz-options/js/directives/mzoptionsmode/mzoptionsmode.html',
            link: function (scope, element, attrs) {

            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$state', 'InitConfig', 'mzApiGlobalService', function ($q, $scope, $rootScope, luiDialog, $translate, $state, InitConfig, mzApiGlobalService) {
                var deregister = $scope.$on("broadcast-modos", function (evt, data) {
                    $scope.isActive = $rootScope.isVisibleLinkMode;
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem"); 
                });
                $scope.$on('$destroy', function destroyScope() {
                    deregister();
                });
                setTimeout(() => {
                    $scope.isActive = $rootScope.isVisibleLinkMode;
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
                    actualizarModo(valState);
                };
                
                function actualizarVistaSegunValorState(valState) {
                    $scope.message = $translate.instant(valState ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                    $rootScope.isVisibleLinkMode = valState;
                }
                
                function actualizarModo(valState) {
                    if (mzApiGlobalService.config.token !== null) {
                        const opcionIndex = 5; // Cambia el índice según la posición de Modo en ITEMSOPCIONES
                        $rootScope.ITEMSOPCIONES[opcionIndex].visible = valState;
                        mzApiGlobalService.actualizarOpcionMashup($rootScope.opcionModo.opcion_id, valState);
                    }
                }
                


                $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                });

                $scope.toggleModeColorOptions = function () {
                    var newEle = angular.element('<div class="mz-block"><div id="logo-block"></div><div class="flex-loader-cover"><div class="loaderEquializador">Loading...</div></div></div>');
                    var target = document.getElementById('main');
                    angular.element(target).append(newEle);
                    $rootScope.modoWhite = $rootScope.modoWhite === false ? true : false;

                    switch ($rootScope.modoWhite) {
                        case true:
                            $('body').removeClass('mz-dark').addClass('mz-white');
                            $rootScope.ThemesInit = InitConfig.ThemesInit;
                            $rootScope.ThemesChange = InitConfig.ThemesChange;
                            $rootScope.setQlikTheme(qlik, $rootScope.ThemesInit);
                            $rootScope.darkView = false;
                            break;
                        case false:
                            $('body').removeClass('mz-white').addClass('mz-dark');
                            $rootScope.ThemesInit = InitConfig.ThemesChange;
                            $rootScope.ThemesChange = InitConfig.ThemesInit;
                            $rootScope.setQlikTheme(qlik, $rootScope.ThemesInit);
                            $rootScope.darkView = true;
                            break;
                        default:
                            $('body').removeClass('mz-white');
                            break;
                    }
                    $state.reload();
                }

            }]
        };
        return directiveDefinitionObject;
    }]);


});