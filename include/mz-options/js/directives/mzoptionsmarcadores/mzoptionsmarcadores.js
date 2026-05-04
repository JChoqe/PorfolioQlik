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
    app.directive('mzoptionsmarcadores', ['$rootScope',function ($rootScope) {

        var directiveDefinitionObject = {
            restrict: 'E',
            scope: true,
            templateUrl: 'include/mz-options/js/directives/mzoptionsmarcadores/mzoptionsmarcadores.html',
            link: function (scope, element, attrs) {
                // attrs.$observe('idapp', function () {                      
                //     scope._thisapp = $rootScope._thisCurrentApp;//qlik.openApp($('body').attr('data-app'), config);
                //     scope.ChangeBookmark(scope._thisapp);
                    
                // });
            },
            controller: ['$http', '$scope', '$rootScope', 'luiDialog', '$translate', '$state', 'mzApiGlobalService', function ($http, $scope, $rootScope, luiDialog, $translate, $state, mzApiGlobalService) {
                var deregister = $scope.$on("broadcast-marcadores", function (evt, data) {
                    $scope.isActive = $rootScope.isVisibleLinkMarcadores;
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem"); 
                });
                $scope.$on('$destroy', function destroyScope() {
                     deregister();
                });
                setTimeout(() => {
                    $scope.isActive = $rootScope.isVisibleLinkMarcadores;
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                }, 1200);
                function getValueState(){
                    return new Promise(resolve => {
                        $scope.isActive = $scope.isActive === false ? true : false;
                        resolve($scope.isActive)
                    })
                }

                $scope.anclarThis = async function (e) {
                    const valState = await getValueState();
                    actualizarVistaSegunValorState(valState);
                    actualizarMarcadores(valState);
                };
                
                function actualizarVistaSegunValorState(valState) {
                    $scope.message = $translate.instant(valState ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                    $rootScope.isVisibleLinkMarcadores = valState;
                }
                
                function actualizarMarcadores(valState) {
                    if (mzApiGlobalService.config.token !== null) {
                        const opcionIndex = 1; // Cambia el índice según la posición de Marcadores en ITEMSOPCIONES
                        $rootScope.ITEMSOPCIONES[opcionIndex].visible = valState;
                        mzApiGlobalService.actualizarOpcionMashup($rootScope.opcionMarcadores.opcion_id, valState);
                    }
                }
                
                

                

                $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                });

                var APP;
                let STATES = $state.get();
                var aBookmarksTitle = [];
                APP = $rootScope._thisCurrentApp;
                $scope.$watch('appID', function () {
                    APP = $rootScope._thisCurrentApp;                                                          
                });
                // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
                //     APP = $rootScope._thisCurrentApp;
                // });
                const createBookmar = (titulo,descripcion,pagina,bookmarkDefaultUser) =>{
                    return new Promise((resolve, reject) => {

                        // APP.model.engineApp.getAppLayout(
                        // ).then(function(qBook){
                        //     console.log(qBook);
                        // }).catch(function (error) {
                        //     reject(error);
                        // });


                        let title = titulo,
                            desc = descripcion,
                            sheet = pagina,
                            isUserPred = bookmarkDefaultUser;
                        APP.model.engineApp.createBookmark(
                            {
                                qInfo: {
                                    qType: "bookmark"
                                },
                                qMetaDef: {
                                    title: title,
                                    description: desc, 
                                    sheetId: sheet, 
                                    isUserPred: isUserPred,                                      
                                },
                                sheetId: sheet,
                                description: desc, 
                                creationDate: (new Date).toISOString()
                            }
                        ).then(function(qBook){
                            resolve(true);
                        }).catch(function (error) {
                            reject(error);
                        });
                    })
                }

                function deleteBookmarkDefault(defaultBookmark){
                    return new Promise(resolve => {
                        if(defaultBookmark.length > 0){
                            APP.model.engineApp.destroyBookmark({
                                qId: defaultBookmark[0].id
                            }).then(function(){
                                if($rootScope.AppdefaultBookmarkId){
                                    $rootScope.defaultBookmarkId = $rootScope.AppdefaultBookmarkId;
                                }
                                if ($rootScope.IsPersonalMode) {
                                    APP.doSave();
                                    resolve(true)                                                                                                                                                                                                                          
                                }else{
                                    resolve(true)
                                }                                
                            });                             
                        }else{
                            resolve(false)
                        }                        
                    })
                }
                $scope.deleteBookmark = function (ID) {
                    var _template = '<div class="lui-dialog lui-dialog-mz" style="width: 600px;"><div class="lui-dialog__header"><div class="lui-dialog__title">' + $translate.instant('views.modal.atencion') + '</div></div><div class="lui-dialog__body"><strong>' + $translate.instant('views.acciones.seeliminaraBookmar') + '</strong>. <br />' + $translate.instant('views.modal.accionnoback') + '</div><div class="lui-dialog__footer"><button class="lui-button  lui-dialog__button  close-button" ng-click="deleteBookmarkConfirm();">' + $translate.instant('views.modal.continuar') +'</button><button class="lui-button  lui-dialog__button" ng-click="closeDialog();">' + $translate.instant('views.modal.cerrar') + '</button></div></div>';
                    var dialog = luiDialog.show({
                        template: _template,
                        closeOnEscape: true,
                        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                            $scope.closeDialog = function () {
                                dialog.close();
                            }
                            $scope.deleteBookmarkConfirm = function () {
                                dialog.close();
                                var bookmark = $rootScope.listBookmarkDefault.filter(obj => {
                                    if (obj.defaultBookmarkId == ID) {
                                        return obj;
                                    }
                                });

                                deleteBookmarkDefault(bookmark).then(function(defaultBookmark){
                                    if ($rootScope.IsPersonalMode) {
                                        APP.bookmark.remove(ID).then(function () {
                                            APP.doSave();                                                                                                                                               
                                            $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.EliminarBookmark'), 'success');
                                        });
                                    } else {
                                        APP.bookmark.remove(ID);
                                        //APP.doSave();                                   
                                        $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.EliminarBookmark'), 'success');
                                    }
                                })
                                


                            }
                        }]
                    });
                }


                $scope.newBookmark = function () {
                    $http.get('include/mz-options/js/directives/mzoptionsmarcadores/_templates/addBookmark.html').then(function (response) {
                        var _template = response.data;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.bookmarkDefaultUser = false;
                                $scope.setProperties = ()=>{
                                    $scope.bookmarkDefaultUser = $('#bookmarkDefaultUser').prop('checked');
                                }
                                $scope.closeDialog = function () {
                                    dialog.close();
                                }
                                $scope.addBookmarkConfirm = function () {
                                    var
                                        titleBM = $scope.titleBookmark,
                                        descBM = $scope.desBookmark,
                                        sheetId = '';
                                    if (typeof titleBM === 'undefined' || titleBM === "") {
                                        $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.KObookmark'), 'warning');
                                    } else {
                                        var rest = $rootScope.listBookmark.filter(function(item){
                                            return item.title === titleBM;
                                        }).length > 0;      



                                        if (rest) {
                                            $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.Bookmarkexiste'), 'error');
                                        } else {  
                                            var _bookmarkDefaultUserExist;                                              
                                            var _ubicacionHoja;
                                            var _bookmarkDefaultUser = $('#bookmarkDefaultUser').prop('checked');

                                            
                                            if(_bookmarkDefaultUser == true){
                                                _ubicacionHoja = false;
                                            }else{
                                                _ubicacionHoja = $('#ubicacionHoja').prop('checked');
                                            }
                                            switch (_ubicacionHoja) {
                                                case true:
                                                    sheetId = $state.current.name;
                                                    break;
                                                case false:
                                                    sheetId = '';
                                                    break;
                                                default:
                                            }

                                            if(_bookmarkDefaultUser == true){
                                                    _bookmarkDefaultUserExist = $rootScope.listBookmark.find((state) => state.isDefaultBookmarkByUser == true);
                                                    if (_bookmarkDefaultUserExist){
                                                        replaceBoommarkByUser(titleBM, descBM, sheetId, _bookmarkDefaultUser, _bookmarkDefaultUserExist)
                                                    }else{
                                                        createBookmar(titleBM, descBM, sheetId, _bookmarkDefaultUser).then(function () {
                                                            if ($rootScope.IsPersonalMode) {
                                                                APP.doSave();
                                                            }
                                                            dialog.close();
                                                            $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.OKbookmark') + ' <br /><strong>" ' + titleBM + ' "</strong>', 'success');
                                                        });  
                                                    }
                                                }else{
                                                    createBookmar(titleBM, descBM, sheetId, _bookmarkDefaultUser).then(function () {
                                                        if ($rootScope.IsPersonalMode) {
                                                            APP.doSave();
                                                        }
                                                        dialog.close();
                                                        $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.OKbookmark') + ' <br /><strong>" ' + titleBM + ' "</strong>', 'success');
                                                    });
                                                }                                                                                                                                                    
                                        }
                                        return false;
                                    }
                                }
                                var deregister = $scope.$on("broadcast-close-modal-bookmark", function (evt) {
                                    $scope.closeDialog(); 
                                });
                                $scope.$on('$destroy', function destroyScope() {
                                    deregister();
                                });
                            }]
                        });
                    })




                }
                function updateBookmarkDefaultUser(bookmark){
                    return new Promise(async function (resolve, reject) {
                        APP.model.engineApp.getBookmark(
                            {
                                "qId": bookmark.id
                            }
                        ).then(function(qBook){
                            qBook.getProperties().then(function(reply){
                                reply.qMetaDef.isUserPred = false;
                                                                                                        
                                qBook.setProperties(reply).then(function(){                                                           
                                    if ($rootScope.IsPersonalMode) {
                                        APP.doSave();
                                    }                                   
                                    resolve();
                                }).catch((function(e) {
                                    throw new Error(e)
                                }))                                                                 
                            })                            
                        })
                        
                    })
                }
                function replaceBoommarkByUser(titleBM, descBM, sheetId, _bookmarkDefaultUser, _bookmarkDefaultUserExist){
                    $http.get('include/mz-options/js/directives/mzoptionsmarcadores/_templates/confirmBookmarkByUser.html').then(function (response) {
                        var _template = response.data;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.message = $translate.instant('message.Bookmarks.BookmarkByUserExist');
                                
                                $scope.closeDialog = function () {
                                    dialog.close();
                                }
                                $scope.addBookmarkConfirmByUser = async function () {
                                    await updateBookmarkDefaultUser(_bookmarkDefaultUserExist);
                                    createBookmar(titleBM, descBM, sheetId, _bookmarkDefaultUser).then(function () {
                                        if ($rootScope.IsPersonalMode) {
                                            APP.doSave();
                                        }
                                        dialog.close();
                                        $rootScope.$broadcast('broadcast-close-modal-bookmark');
                                        $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.OKbookmark') + ' <br /><strong>" ' + titleBM + ' "</strong>', 'success');
                                    });
                                }
                            }]
                        });
                    })
                } 
                
                $scope.publishBookmark = function(bookmark, method){

                    $http.get('include/mz-options/js/directives/mzoptionsmarcadores/_templates/confirmBookmarkPublic.html').then(function (response) {
                        var _template = response.data;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.message = $translate.instant("views.acciones.mensajebookmarkpublico");
                                $scope.closeDialog = function () {
                                    dialog.close();
                                }
                                switch (method) {
                                    case 1:
                                        $scope.isForpublic = true;
                                        break;
                                    case 2:
                                        $scope.isForpublic = false;
                                        break;
                                    default:
                                        break;
                                }
                                $scope.addBookmarkConfirmPublic = ()=>{
                                    $scope.closeDialog();
                                    APP.model.engineApp.getBookmark(bookmark.id).then(function(qBook){
                                        // console.log("qBook", qBook);
                                        return qBook.publish().then(function(){                                        
                                            $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.OKpublishBookmark'), 'success');
                                        });
                                    }).catch(function(err){
                                        console.error(err);
                                        $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.KOpublishBookmark'), 'error');
                                    });
                                }
                            }]
                        });
                    })
                };

                $scope.unPublishBookmark = function(bookmark, method){
                    $http.get('include/mz-options/js/directives/mzoptionsmarcadores/_templates/confirmBookmarkPrivate.html').then(function (response) {
                        var _template = response.data;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.message = $translate.instant("views.acciones.mensajebookmarkprivado");
                                $scope.closeDialog = function () {
                                    dialog.close();
                                }
                                switch (method) {
                                    case 1:
                                        $scope.isForpublic = true;
                                        break;
                                    case 2:
                                        $scope.isForpublic = false;
                                        break;
                                    default:
                                        break;
                                }
                                $scope.addBookmarkConfirmPrivate = ()=>{
                                    $scope.closeDialog();
                                    APP.model.engineApp.getBookmark(bookmark.id).then(function(qBook){
                                        $scope.closeDialog();
                                        // console.log("qBook", qBook);
                                        return qBook.unPublish().then(function(){                                        
                                            $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.OKunPublishBookmark'), 'success');
                                        });
                                    }).catch(function(err){
                                        console.error(err);
                                        $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.KOunpublishBookmark'), 'error');
                                    });
                                }
                            }]
                        });
                    })
                };

                
                $scope.applyBookmark = function (ID, bookmark) {
                    if(bookmark.sheetId){
                        let havesheetId = STATES.filter((state) => state.name == bookmark.sheetId ).length > 0;
                        if(havesheetId){
                            $state.go(bookmark.sheetId);
                        } 
                    }
                    
                    APP.bookmark.apply(ID);                                                         
                };

                $scope.editBookmark = function (ID, bookmark){
                    $http.get('include/mz-options/js/directives/mzoptionsmarcadores/_templates/editBookmark.html').then(function (response) {
                        var _template = response.data;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.IdBookmark = ID;
                                $scope.TitleBookmark = bookmark.title;
                                $scope.DescriptionBookmark = bookmark.description;
                                $scope.isDefaultBookmarkByUser = bookmark.isDefaultBookmarkByUser;
                                $scope.isDefaultBookmark =  $rootScope.defaultBookmarkId === bookmark.id ? true :false;

                                function clearDefaultBookmarkByUser(){
                                    return new Promise(resolve => {
                                        var _bookmar = $rootScope.listBookmark.find((bookmark) => bookmark.isDefaultBookmarkByUser == true);
                                        if(_bookmar){
                                            APP.model.engineApp.getBookmark(
                                                {
                                                    "qId": _bookmar.id
                                                }
                                            ).then(function(qBook){
                                                qBook.getProperties().then(async function(reply){
                                                    reply.qMetaDef.isUserPred = false;                                                                                                                                                  
                                                    qBook.setProperties(reply).then(function(){                                                            
                                                        if ($rootScope.IsPersonalMode) {
                                                            APP.doSave();
                                                        }
                                                        resolve();                                                   
                                                    }).catch((function(e) {
                                                        throw new Error(e)
                                                    })) 
                                                    
                                                   
                                                })
                                               
                                            })
                                        }else{
                                            resolve();
                                        }

                                        
                                        
                                    })
                                }
                                $scope.closeDialog = function () {
                                    dialog.close();
                                }
                                $scope.addBookmarkConfirm = function () {
                                    $scope.isDefaultBookmarkByUser = $('#bookmarkDefaultUser').prop('checked');
                                    console.log($scope.isDefaultBookmarkByUser)
                                    if (typeof $scope.TitleBookmark === 'undefined' || $scope.TitleBookmark === "") {
                                        $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.KObookmark'), 'warning');
                                    } else {
                                        APP.model.engineApp.getBookmark(
                                            {
                                                "qId": $scope.IdBookmark
                                            }
                                        ).then(function(qBook){
                                            qBook.getProperties().then(async function(reply){
                                                if($scope.isDefaultBookmarkByUser == true){                                                    
                                                    await clearDefaultBookmarkByUser();
                                                }
                                                reply.qMetaDef.isUserPred = $scope.isDefaultBookmarkByUser;
                                                reply.title = $scope.TitleBookmark;
                                                reply.description = $scope.DescriptionBookmark;
                                                reply.qMetaDef.title = $scope.TitleBookmark;
                                                reply.qMetaDef.description = $scope.DescriptionBookmark;                                                                                                           
                                                qBook.setProperties(reply).then(function(){                                                            
                                                    if ($rootScope.IsPersonalMode) {
                                                        APP.doSave();
                                                    }
                                                    dialog.close();
                                                    $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.OKbookmarkUpdate'), 'success');                                                           
                                                }).catch((function(e) {
                                                    throw new Error(e)
                                                })) 
                                                
                                               
                                            })
                                           
                                        })
                                        return false;
                                    }
                                }
                            }]
                        });
                    })
                    // console.log(ID)
                    // console.log(bookmark)
                    
                    // var _template = '<div class="lui-dialog lui-dialog-mz" style="width: 600px;"><div class="lui-dialog__header"><div class="lui-dialog__title">' + $translate.instant('views.acciones.editarmarcadores') + '</div></div><div class="lui-dialog__body"><label class="control-label" for="bmtitle">' + $translate.instant('views.modal.crearmarcadortitulo') + ':</label><input class="lui-input" id="bmtitle" ng-model="TitleBookmark"  maxlength="255" ng-value="TitleBookmark" type="text" autofocus><label class="control-label" for="bmdesc">' + $translate.instant('views.modal.crearmarcadordescripcion') + ':</label><textarea class="lui-textarea" id="bmdesc" ng-model="DescriptionBookmark" type="text" tabindex="0" maxlength="512"></textarea></div><div class="lui-dialog__footer"><button class="lui-button  lui-dialog__button" ng-click="closeDialog();">' + $translate.instant('views.modal.cerrar') + '</button><button class="lui-button  lui-dialog__button  close-button" ng-click="addBookmarkConfirm();">' + $translate.instant('views.modal.aceptar') +'</button></div></div>';
                    // var dialog = luiDialog.show({
                    //     template: _template,
                    //     closeOnEscape: true,
                    //     controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                    //         $scope.IdBookmark = ID;
                    //         $scope.TitleBookmark = bookmark.title;
                    //         $scope.DescriptionBookmark = bookmark.description; 
                    //         $scope.closeDialog = function () {
                    //             dialog.close();
                    //         }
                    //         $scope.addBookmarkConfirm = function () {
                    //             if (typeof $scope.TitleBookmark === 'undefined' || $scope.TitleBookmark === "") {
                    //                 $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.KObookmark'), 'warning');
                    //             } else {
                    //                 APP.model.engineApp.getBookmark(
                    //                     {
                    //                         "qId": $scope.IdBookmark
                    //                     }
                    //                 ).then(function(qBook){
                    //                     qBook.getProperties().then(function(reply){
                    //                         reply.title = $scope.TitleBookmark;
                    //                         reply.description = $scope.DescriptionBookmark;
                    //                         reply.qMetaDef.title = $scope.TitleBookmark;
                    //                         reply.qMetaDef.description = $scope.DescriptionBookmark;                                                                                                           
                    //                         qBook.setProperties(reply).then(function(){                                                            
                    //                             if ($rootScope.IsPersonalMode) {
                    //                                 APP.doSave();
                    //                             }
                    //                             dialog.close();
                    //                             $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.OKbookmarkUpdate'), 'success');                                                           
                    //                         }).catch((function(e) {
                    //                             throw new Error(e)
                    //                         })) 
                                            
                                           
                    //                     })
                                       
                    //                 })
                    //                 return false;
                    //             }
                    //         }
                    //     }]
                    // });
                }

                //Default bookmark
                $rootScope.isBlocked = false;
                function hasDefaultBookmar(){
                    return new Promise(resolve => {
                        var searching = $rootScope.listBookmarkDefault.filter(obj => {
                            if (obj.title == "defaultBookmarkId") {
                                return obj;
                            }
                        });
                        
                        resolve(searching)
                    })
                }

                $scope.setDefaultBookmark = function(ID) {
                    $rootScope.isBlocked = true;
                    var _today = new Date();
                    var timestamp = _today.getTime();    
                    var hoy = _today.toISOString();
                    var params = {
                        "qProp": {
                            "qInfo": {
                                "qId": "",
                                "qType": "bookmark"
                            },
                            "qMetaDef": {
                                "title": 'defaultBookmarkId',
                                "description": "",        
                                "createdDate": hoy,
                                "modifiedDate": hoy,
                                "timestamp": timestamp,
                                "defaultBookmarkId": ID, 
                                "isDefaultBookmark": true,      
                                "qSize": -1,
                            }
                        }
                    };
                    

                    hasDefaultBookmar().then(function(res){
                        var defaultBookmark = res;
                        if(defaultBookmark.length > 0){
                            APP.model.engineApp.getBookmark(
                                {
                                    "qId": defaultBookmark[0].id
                                }
                            ).then(function(qBook){
                                qBook.getProperties().then(function(reply){
                                    reply.qMetaDef.defaultBookmarkId = ID;
                                                                                                            
                                    qBook.setProperties(reply).then(function(){ 
                                        $rootScope.isBlocked = false;                                                           
                                        if ($rootScope.IsPersonalMode) {
                                            APP.doSave();
                                        }                                   
                                    }).catch((function(e) {
                                        throw new Error(e)
                                    }))                                                                 
                                })                            
                            })
                        }else{
                            APP.model.engineApp.createBookmark(params).then(function(){
                                $rootScope.isBlocked = false;
                                if ($rootScope.IsPersonalMode) {
                                    APP.doSave();
                                }
                            });
                        }
                    })


                }

            }]
        };
        return directiveDefinitionObject;
    }]);


});