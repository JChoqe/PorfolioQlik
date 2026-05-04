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
    app.directive('mzoptionsglosario', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {

        var directiveDefinitionObject = {
            restrict: 'E',
            scope: true,
            templateUrl: 'include/mz-options/js/directives/mzoptionsglosario/mzoptionsglosario.html',
            link: function (scope, element, attrs) {
                attrs.$observe('idapp', function () {
                    scope._thisapp = $rootScope._thisCurrentApp;//qlik.openApp($('body').attr('data-app'), config);
                    //scope.ChangeGlosario(scope._thisapp);
                });
            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$state', 'InitConfig', 'mzApiGlobalService', function ($q, $scope, $rootScope, luiDialog, $translate, $state, InitConfig, mzApiGlobalService) {
                var deregister = $scope.$on("broadcast-glosario", function (evt, data) {                    
                    $scope.isActive = $rootScope.isVisibleLinkGlosario;
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem"); 
                });
                $scope.$on('$destroy', function destroyScope() {
                    deregister();
                });
                setTimeout(() => {
                    $scope.isActive = $rootScope.isVisibleLinkGlosario;
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
                    actualizarGlosario(valState);
                };
                
                function actualizarVistaSegunValorState(valState) {
                    $scope.message = $translate.instant(valState ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                    $rootScope.isVisibleLinkGlosario = valState;
                }
                
                function actualizarGlosario(valState) {
                    if (mzApiGlobalService.config.token !== null) {
                        const opcionIndex = 3; // Cambia el índice según la posición de Glosario en ITEMSOPCIONES
                        $rootScope.ITEMSOPCIONES[opcionIndex].visible = valState;
                        mzApiGlobalService.actualizarOpcionMashup($rootScope.opcionGlosario.opcion_id, valState);
                    }
                }
                




                $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                });


                // $scope.noGlosary = InitConfig.noGlosary;
                // $scope.glossaryArr = [];
                // $scope.loadGlosario = function (APP) {
                //     var defer = $q.defer();
                //     var arrGlossary = [];
                //     $scope.IdsMeasures = [];
                //     $scope.IdsDimensions = [];
                //     APP.getList("MeasureList", function (reply) {  

                //         $.each(reply.qMeasureList.qItems, function (key, value) {   
                //             var TAGS = value.qMeta.tags;                              
                //             if( !TAGS.some(r=> $scope.noGlosary.includes(r))){
                //                 var idMeasure= value.qInfo.qId;                                                                  
                //                 if(!$scope.IdsMeasures.includes(idMeasure)){
                //                     $scope.IdsMeasures.push(idMeasure);
                //                     APP.model.engineApp.getMeasure(
                //                         {
                //                             "qId": idMeasure
                //                         }
                //                     ).then(function(qBook){
                //                         qBook.getMeasure().then(function(res){ 
                //                             var str = $translate.instant('equalizer.label.medidas')
                //                             getItem(res,str,value, TAGS ).then(function(resultado){
                //                                 if(resultado.name != '-' && resultado.name != ''){
                //                                     arrGlossary.push(resultado);
                //                                 }
                //                             })                                                                             
                //                         })
                //                     }).catch(function (error){
                //                         console.log(error)
                //                     })
                //                 }

                //             }                                                             
                //         });
                //     });

                //     APP.getList("DimensionList", function (reply) {                                                                              
                //         $.each(reply.qDimensionList.qItems, function (key, value) {
                //             var TAGS = value.qMeta.tags;
                //             if( !TAGS.some(r=> $scope.noGlosary.includes(r))){
                //                 var idDimension = value.qInfo.qId;                                 
                //                 if(!$scope.IdsDimensions.includes(idDimension)){
                //                     $scope.IdsDimensions.push(idDimension);
                //                     APP.model.engineApp.getDimension(
                //                         {
                //                             "qId": idDimension
                //                         }
                //                     ).then(function(qBook){
                //                         qBook.getDimension().then(function(res){
                //                             var str = $translate.instant('equalizer.label.dimensiones')
                //                             getItem(res,str,value, TAGS).then(function(resultado){
                //                                 if(resultado.name != '-' && resultado.name != ''){
                //                                     arrGlossary.push(resultado);
                //                                 }

                //                             })
                //                         })

                //                     }).catch(function (error){
                //                         console.log(error)
                //                     }) 
                //                 }

                //             }                              
                //         });
                //     });
                //     defer.resolve(arrGlossary);
                //     return defer.promise;
                // };

                // function getExpression(val){  
                //     var defer = $q.defer();   
                //     var _val = val.trim();                 
                //     $scope._thisapp.createGenericObject({
                //         user: {
                //             qStringExpression: "=QVUser ()"
                //         },
                //         version: {
                //             qStringExpression: "=QlikViewVersion ()"
                //         },
                //         fields: {
                //             qStringExpression: _val
                //         }
                //         }, function (reply) {
                //             defer.resolve(reply.fields);                                
                //         });

                //     return defer.promise;
                // }

                // function getItem(r,str,val, TAGS) {
                //     var defer = $q.defer();
                //     var res = r;
                //     var value = val;
                //     var _tags = TAGS;
                //     if(res.hasOwnProperty('descriptionExpression')){
                //         var  _item = {};
                //         getExpression(res.descriptionExpression.qStringExpression.qExpr).then(function(rs){
                //              _item.descripcion = rs;
                //              _item.type = str;//value.qInfo.qType;
                //              if(res.qLabelExpression){
                //                  getExpression(res.qLabelExpression).then(function(rs){
                //                      _item.name = rs;
                //                      _item.tags = _tags;
                //                      defer.resolve(_item);                                        
                //                  })
                //              }else{
                //                  _item.name = value.qData.title;
                //                  _item.tags = _tags;
                //                  defer.resolve(_item); 
                //              }                                            
                //          });                                                                                       
                //      }else{
                //          var _item = {};
                //          if(res.hasOwnProperty('qLabelExpression')){
                //              getExpression(res.qLabelExpression).then(function(rs){
                //                  _item.name = rs;
                //                  _item.descripcion = value.qMeta.description;
                //                  _item.type = str;//value.qInfo.qType;
                //                  _item.tags = _tags;
                //                  defer.resolve(_item); 
                //              })
                //          }else{
                //              _item.name = value.qData.title;
                //              _item.descripcion = value.qMeta.description;
                //              _item.type = str;//value.qInfo.qType;
                //              _item.tags = _tags;
                //              defer.resolve(_item); 
                //          }                                        
                //      }                         
                //     return defer.promise;
                // }

                // $scope.ChangeGlosario = function (APP) {                    
                //     $scope.loadGlosario(APP).then(function (v) {
                //         $scope.glossaryArr = [];
                //         $scope.glossaryArr = v;
                //     });
                // };

                // $rootScope.$on('$translateChangeSuccess', function(event, current, previous) {
                //     $scope.ChangeGlosario($scope._thisapp);
                // });


                // $rootScope.OpenGlosary = false;
                // $rootScope.openGlosary = function () {
                //     $rootScope.OpenGlosary = $rootScope.OpenGlosary === false ? true : false;

                //     if ($rootScope.OpenGlosary == true) {
                //         $scope.ChangeGlosario($scope._thisapp);
                //     }

                // };                

            }]
        };
        return directiveDefinitionObject;
    }]);
});