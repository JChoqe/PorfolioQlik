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
    app.directive('mzpresentacion', [function () {

        var directiveDefinitionObject = {
            restrict: 'E',
            scope: false,
            templateUrl: 'include/mz-options/js/directives/mzpresentacion/mzpresentacion.html',
            link: function (scope, element, attrs) {

            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$state', '$element', 'mzApiGlobalService', function ($q, $scope, $rootScope, luiDialog, $translate, $state, $element, mzApiGlobalService) {                

                setTimeout(() => {
                    let _this_current_bar = $element.find('#CurrentSelectionsPresentacion')
                    $rootScope._thisCurrentApp.getObject(_this_current_bar, 'CurrentSelections').then(function(model){ 
                        $rootScope.lstModelCurrentSelections.push(model);
                    });
                }, 300);

                // var estadosDisponibles = $state.get().filter(function(estado) {
                //     return !estado.abstract && estado.name !== "";
                // });
            
                // $scope.irAlSiguienteEstado = function() {
                //     var estadoActual = $state.current.name;
                //     var indiceActual = estadosDisponibles.findIndex(function(estado) {
                //         return estado.name === estadoActual;
                //     });
            
                //     if (indiceActual !== -1 && indiceActual < estadosDisponibles.length - 1) {
                //         var siguienteEstado = estadosDisponibles[indiceActual + 1];
                //         $state.go(siguienteEstado.name);
                //     }
                // };
            
                // $scope.irAlEstadoAnterior = function() {
                //     var estadoActual = $state.current.name;
                //     var indiceActual = estadosDisponibles.findIndex(function(estado) {
                //         return estado.name === estadoActual;
                //     });
            
                //     if (indiceActual > 0) {
                //         var estadoAnterior = estadosDisponibles[indiceActual - 1];
                //         $state.go(estadoAnterior.name);
                //     }
                // };
            
                // // Escuchar eventos de teclado para ir al siguiente/anterior estado
                // angular.element(document).on('keydown', function(event) {
                //     if (event.key === 'ArrowRight') {
                //         $scope.irAlSiguienteEstado();
                //     } else if (event.key === 'ArrowLeft') {
                //         $scope.irAlEstadoAnterior();
                //     }
                // });


                // $rootScope.initPresentacion = () => {
                //     var _body = document.body;
                //     document.body.classList.add('body-presentacionfull-size');
                //     var _presentacion = document.querySelector('#page-container');
                //     $scope.fullSize = $scope.fullSize === false ? true : false;
                //     $(_body).fadeOut(100, "linear", function () {
                //         $(document).toggleFullScreen();
                //         $('.tooltip.bs-tooltip-bottom').remove();
                //         $(this).prepend(_presentacion).fadeIn(100, "linear", function () {
                //             setTimeout(() => {
                //                 qlik.resize();
                //                 setTimeout(() => {
                //                     $('[data-toggle="tooltip"]').bstooltip({
                //                         trigger: 'hover'
                //                     });
                //                 }, 300);
                //             }, 100);
                //         });
                //     })
                // }


            }]
        };
        return directiveDefinitionObject;
    }]);


});