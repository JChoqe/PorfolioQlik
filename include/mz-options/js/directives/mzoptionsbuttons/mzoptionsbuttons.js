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
    app.directive('mzoptionsbuttons', [function () {

        var directiveDefinitionObject = {
            restrict: 'E',
            scope: false,
            templateUrl: 'include/mz-options/js/directives/mzoptionsbuttons/mzoptionsbuttons.html',
            link: function (scope, element, attrs) {

            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$state', '$compile', 'mzApiGlobalService', function ($q, $scope, $rootScope, luiDialog, $translate, $state, $compile, mzApiGlobalService) {                
                //Estructura de options en base de datos
                // [{
                //     descripcion:"alertas",
                //     id: 1
                // },
                // {
                //     descripcion:"marcadores",
                //     id: 2
                // },
                // {
                //     descripcion:"filtros",
                //     id: 3
                // },
                // {
                //     descripcion:"glosario",
                //     id: 4
                // },
                // {
                //     descripcion:"ayuda",
                //     id: 5
                // },
                // {
                //     descripcion:"modos",
                //     id: 6
                // }]

                //Full Screen Página
                $scope.changeScreeenView = function () {
                    $(document).toggleFullScreen();
                }
                $scope.isFullScreen = false;
                $(document).bind("fullscreenchange", function () {
                    ($(document).fullScreen() ? $scope.isFullScreen = true : $scope.isFullScreen = false);
                });

                //Mostrar panel de configuración
                $rootScope.OpenOptionsPanel = false;
                $rootScope.toggleMzOptions = function ($event) {
                    $event.stopPropagation();
                    $rootScope.OpenOptionsPanel = $rootScope.OpenOptionsPanel === false ? true : false;
                    if ($rootScope.OpenOptionsPanel) {
                        var idFiltros = $('.notificationsScroll .filtrosHomePanel').attr('data-qlik-objid');
                        $rootScope.resizeFilters(idFiltros);
                    }

                }

                //Mostrar vista a pantalla completa
                $rootScope.initPresentacion = () => {
                    var _body = document.body;
                    document.body.classList.add('body-presentacionfull-size');
                    var _presentacion = document.querySelector('#page-container');
                    var _headerPresentacion = $compile('<mzpresentacion></mzpresentacion>')($scope);
                    // $scope.isFullScreen = $scope.isFullScreen === false ? true : '';
                    $(_body).fadeOut(0, "linear", function () {
                        $scope.isFullScreen == false ? $(document).toggleFullScreen() : '';
                        $('#page-container').prepend(_headerPresentacion);
                        $(this).prepend(_presentacion).fadeIn(100, "linear", function () {
                            setTimeout(() => {
                                qlik.resize();
                            }, 100);
                        });
                    })
                }
                $rootScope.closePresentacion = ()=>{                    
                    document.body.classList.remove('body-presentacionfull-size');
                    var _body = document.querySelector('#cover-main-view');
                    var _presentacion = document.querySelector('#page-container');
                    $('mzpresentacion').remove();
                    // $scope.isFullScreen = $scope.isFullScreen === false ? false : '';
                    $(_body).fadeOut(100, "linear", function () {
                        // $scope.isFullScreen == true ? $(document).toggleFullScreen() : '';
                        $('.qv-global-selections').parent('div').remove()
                        $(this).prepend(_presentacion).fadeIn(300, "linear", function () {
                            setTimeout(() => {
                                qlik.resize();
                            }, 100);
                        });
                    })
                }
            }]
        };
        return directiveDefinitionObject;
    }]);


});