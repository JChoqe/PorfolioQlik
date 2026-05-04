
define([
    'js/qlik',
    dir + 'include/mz-options/js/app.js',
], function (qlik,  app) {

	app.controller('mzOptionsCtrl', ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$state','$http','$compile', 'mzApiGlobalService', function ($q, $scope, $rootScope, luiDialog, $translate, $state,$http,$compile, mzApiGlobalService) {
        function initOptions(arr) {
            return new Promise(resolve => {
              if ($rootScope.ITEMSOPCIONES.length === 0) {
                $rootScope.ITEMSOPCIONES = arr.map(val => ({ opcion_id: val.id, opcion_descripcion: val.descripcion }));
              }
              resolve();
            })
          }
          // function loadOptions(item){
          //     return new Promise(resolve => { 
          //             const objetoCorrespondiente = $rootScope.ITEMSOPCIONES.find(obj => obj.opcion_id === item.opcion_id);    
          //             if (objetoCorrespondiente) {
          //                 objetoCorrespondiente.visible = item.visible;
          //                 var descripcion = objetoCorrespondiente.opcion_descripcion;
  
          //                 switch (descripcion) {
          //                     case "alertas":
          //                         $rootScope.opcionAlertas = objetoCorrespondiente;
          //                         $rootScope.isVisibleLinkAlertas = objetoCorrespondiente.visible;
          //                         break;
          //                     case "marcadores":
          //                         $rootScope.opcionMarcadores = objetoCorrespondiente;
          //                         $rootScope.isVisibleLinkMarcadores = objetoCorrespondiente.visible;
          //                         break;
          //                     case "filtros":
          //                         $rootScope.opcionFiltros = objetoCorrespondiente;
          //                         $rootScope.isVisibleLinkFilters = objetoCorrespondiente.visible;
          //                         break;
          //                     case "glosario":
          //                         $rootScope.opcionGlosario = objetoCorrespondiente;
          //                         $rootScope.isVisibleLinkGlosario = objetoCorrespondiente.visible;
          //                         break;
          //                     case "ayuda":
          //                         $rootScope.opcionAyuda = objetoCorrespondiente;
          //                         $rootScope.isVisibleLinkHelp = objetoCorrespondiente.visible;
  
          //                         break;
          //                     case "modos":
          //                         $rootScope.opcionModo = objetoCorrespondiente;
          //                         $rootScope.isVisibleLinkMode = objetoCorrespondiente.visible;
          //                         break;
          //                 }
          //             }
          //         resolve();
          //     })
          // }
  
          function loadOptions(items) {
            return new Promise(resolve => {
              const opcionesMapeo = {
                "alertas": { prop: "opcionAlertas", visibleProp: "isVisibleLinkAlertas", broadcastProp: 'broadcast-alertas' },
                "marcadores": { prop: "opcionMarcadores", visibleProp: "isVisibleLinkMarcadores", broadcastProp: 'broadcast-marcadores' },
                "filtros": { prop: "opcionFiltros", visibleProp: "isVisibleLinkFilters", broadcastProp: 'broadcast-filtros' },
                "glosario": { prop: "opcionGlosario", visibleProp: "isVisibleLinkGlosario", broadcastProp: 'broadcast-glosario' },
                "ayuda": { prop: "opcionAyuda", visibleProp: "isVisibleLinkHelp", broadcastProp: 'broadcast-ayuda' },
                "modos": { prop: "opcionModo", visibleProp: "isVisibleLinkMode", broadcastProp: 'broadcast-modos' }
              };
  
              const processOption = function (opcion) {
                const objetoCorrespondiente = $rootScope.ITEMSOPCIONES.find(obj => obj.opcion_id === opcion.opcion_id);
                if (objetoCorrespondiente) {
                  const { prop, visibleProp, broadcastProp } = opcionesMapeo[objetoCorrespondiente.opcion_descripcion];
                  objetoCorrespondiente.visible = opcion.visible;
                  $rootScope[prop] = objetoCorrespondiente;
                  $rootScope[visibleProp] = objetoCorrespondiente.visible;
                  $rootScope.$broadcast(broadcastProp);
                }
              };
  
              if (Array.isArray(items)) {
                items.forEach(processOption);
              } else {
                processOption(items);
              }
  
              resolve();
            });
          }
  
  
          async function createInitOptions(data) {
            await loadOptions(data);
          }
  
          if ($rootScope.ITEMSOPCIONES == 0) {
            mzApiGlobalService.recuperarOpciones().then(async function (opciones) {
              try {
                var opciones = opciones.data;
                //console.log(opciones);
                if (opciones.length > 0) {
                  await initOptions(opciones);
                  mzApiGlobalService.recuperarOpcionesMashup().then(async function (opcionesMashup) {
                    const OPCIONESMASHUP = opcionesMashup.data;
                    if (OPCIONESMASHUP.length > 0) {
                      await loadOptions(OPCIONESMASHUP);
                    } else {
                      $rootScope.ITEMSOPCIONES.forEach(function (opcion) {
                        mzApiGlobalService.crearOpcionMashup(opcion.opcion_id).then(async function (res) {
                          var opcion = res.data;
                          await createInitOptions(opcion)
                        });
                      })
                    }
                  })
                }
              } catch (error) {
                //INICIALIZAR LAS VARIABLES POR DEFECTO A TRUE
                initOptionsDefault();
                console.log(error);
                return false
              }
            }).catch(function (e) {
              //INICIALIZAR LAS VARIABLES POR DEFECTO A TRUE
              initOptionsDefault();
            });
          }
          var deregisterError = $scope.$on("broadcast-error", function (evt, data) {
            initOptionsDefault();
          });
          $scope.$on('$destroy', function destroyScope() {
            deregisterError();
          });
  
          $scope.limpiarOpciones = () => {
            if ($rootScope.ITEMSOPCIONES.length > 0) {
              $rootScope.ITEMSOPCIONES.forEach(item => {
                mzApiGlobalService.eliminarOpcionMashup(item.opcion_id)
              })
            }
          }
  
          async function initOptionsDefault() {
            $rootScope.isVisibleLinkAlertas = true;
            $rootScope.isVisibleLinkGlosario = true;
            $rootScope.isVisibleLinkMarcadores = true;
            $rootScope.isVisibleLinkFilters = true;
            $rootScope.isVisibleLinkHelp = true;
            $rootScope.isVisibleLinkMode = true;
          }

	}]);

});