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
    dir + 'include/mz-options/js/app.js'
], function (qlik, angular, us, app) {
    app.directive('mzoptionshelp', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {

        var directiveDefinitionObject = {
            restrict: 'E',
            scope: true,
            templateUrl: 'include/mz-options/js/directives/mzoptionshelp/mzoptionshelp.html',
            link: function (scope, element, attrs) {

            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$state', 'mzApiGlobalService', function ($q, $scope, $rootScope, luiDialog, $translate, $state, mzApiGlobalService) {
                var deregister = $scope.$on("broadcast-ayuda", function (evt, data) {
                    $scope.isActive = $rootScope.isVisibleLinkHelp;
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                });
                $scope.$on('$destroy', function destroyScope() {
                    deregister();
                });
                setTimeout(() => {
                    $scope.isActive = $rootScope.isVisibleLinkHelp;
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
                    actualizarAyuda(valState);
                };
                
                function actualizarVistaSegunValorState(valState) {
                    $scope.message = $translate.instant(valState ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                    $rootScope.isVisibleLinkHelp = valState;
                }
                
                function actualizarAyuda(valState) {
                    if (mzApiGlobalService.config.token !== null) {
                        const opcionIndex = 4; // Cambia el índice según la posición de Ayuda en ITEMSOPCIONES
                        $rootScope.ITEMSOPCIONES[opcionIndex].visible = valState;
                        mzApiGlobalService.actualizarOpcionMashup($rootScope.opcionAyuda.opcion_id, valState);
                    }
                }
                


                $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                });

                $scope.initVideosHelp = () => {
                    if ($rootScope.CARGAVIDEOSFULL == false) {
                        asyncCallGetLisContent();
                    }
                }

                async function getLisContent() {
                    return new Promise(resolve => {
                        var sessionApp = qlik.sessionApp();
                        arrContent = [];
                        sessionApp.model.waitForOpen.promise.then(() => {
                            sessionApp.model.engineApp.getLibraryContent(
                                {
                                    "qName": $rootScope.FolderContent
                                }
                            ).then(function (qBook) {
                                $.each(qBook.qList, function (key, value) {
                                    arrContent.push(value.qUrl)
                                })
                                resolve(arrContent);
                            })
                                .catch(function (e) {
                                    resolve(arrContent);
                                })
                        }).catch(function (e) {
                            console.log(e)
                        })
                    })
                }


                async function asyncCallGetLisContent() {
                    // if($rootScope.HasVideos == true){
                    const result = await getLisContent();
                    if (result.length > 0) {
                        var extension = '.mp4';
                        var x = result.filter(function (file) {
                            return file.indexOf(extension) !== -1;
                        });
                        $rootScope.urlContentLibrary = x;
                        $rootScope.noVideos = false;
                        $rootScope.CARGAVIDEOSFULL = true;
                        $rootScope.loadVideos = true;
                    } else {
                        $rootScope.noVideos = true;
                        $rootScope.CARGAVIDEOSFULL = true;
                        $rootScope.loadVideos = true;
                    }
                    setTimeout(() => {
                        $scope.$apply($rootScope.urlContentLibrary, $rootScope.noVideos, $rootScope.CARGAVIDEOSFULL, $rootScope.loadVideos);
                    }, 100);
                    // }
                }


            }]
        };
        return directiveDefinitionObject;
    }]);
});