var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'moment',
    'angular',
    'underscore',
    dir + 'js/Directives/vistaspersonalizadas/services/getVisibleAppsService.js',
], function (qlik, app, moment, angular, us) {

    app.filter('getUserId', function () {
        return function (user) {
            if (user.includes('UserId=')) {
                let pares = user.split(';').map((item)=> item.trim());
                let objeto = {};
                pares.forEach(par => {
                    let [clave, valor] = par.split('=');
                    objeto[clave] = valor;
                });
                return objeto['UserId'];

            } else {
                return user;
            }            
        };
    });

    app.directive('vistaspersonalizadas', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'js/Directives/vistaspersonalizadas/vistaspersonalizadas.html',
            link: function (scope, element, attrs) {

            },
            controller: ['$scope', '$rootScope', '$translate', 'luiDialog', '$compile', '$http','$state', 'getVisibleAppsService', function ($scope, $rootScope, $translate, luiDialog, $compile, $http,$state, getVisibleAppsService) {
                var APP = '';
                $scope.$watch('$viewContentLoaded', function () {
                    $rootScope.deleteElement();                                                          
                });

                $scope.VIS = '';
                $scope.IDVIS = '';
                $scope.endSearch = false;
                $rootScope.listBookmarkPersonalizados = [];
                $scope.VISUALIZATIONAPP = '';
                $scope.ITEMLOAD = '';
                $scope.searchAll = '';
                $scope.resetSearchBookmark = () => {
                    $scope.searchAll = '';
                }
                $scope.showList = false;
                $scope.viewBoxes = function () {
                    $scope.showList = false;
                    setTimeout(function () {
                        qlik.resize();
                    }, 300);
                }
                $scope.viewList = function () {
                    $scope.showList = true;
                }


                $scope.InitLoaded = async function () {

                    const result = await getVisibleAppsService.getVisibleApps();
                    const _apps = result;
                    $scope.loop = 1;
                    angular.forEach(_apps, async function (value) {
                        const list = await getVisibleAppsService.asyncCallGetListadoBookmark(value.idapp);
                        $scope.loop = $scope.loop + 1;
                        if (list && list.length > 0 && list[0] !== null && list[0] !== undefined && list[0].length > 0) {
                            $rootScope.listBookmarkPersonalizados = $rootScope.listBookmarkPersonalizados.concat(list[0]);
                            $scope.$apply($rootScope.listBookmarkPersonalizados);
                        }
                        if ($scope.loop >= (_apps.length)) {
                            setTimeout(() => {                               
                                $rootScope.listBookmarkPersonalizados = us.uniq($rootScope.listBookmarkPersonalizados, 'id');
                                $scope.$apply($rootScope.listBookmarkPersonalizados);
                                $scope.endSearch = true;
                                $scope.loadGrid();
                                $('#load-visualizaciones').fadeOut(600).remove();
                            }, 300);
                        }
                    })
                }

                $scope.InitLoaded();

                $scope.applyBookmark = (item, $event) => {
                    $scope.ITEMLOAD = item;
                    $scope.VISUALIZATIONAPP = '';
                    $('#box-visualizaciones').addClass('objectvisible').promise().done(() => {
                        var APP = item.APP;
                        APP.model.waitForOpen.promise.then( async function () {
                            var $CurrentSelections = $(".CurrentSelections");
                            APP.getObject($CurrentSelections, 'CurrentSelections').then(function (model) {
                                $rootScope.lstModelCurrentSelections.push(model);
                                $('.qv-global-selections').parent('div').remove();
                            });


                        })



                        $scope.VISUALIZATIONAPP = APP;
                        setTimeout(() => {
                            APP.visualization.create(item.Object.visualization, [], item.Object).then(function (vis) {
                                $scope.VIS = vis;
                                $rootScope.lstModel.push(vis);
                                $scope.IDVIS = vis.id;
                                let HTMLDIRECTIVE = `<objectsense object-id="${$scope.IDVIS}" app-id="${item.indexApp}"></objectsense>`;
                                $('#inner-inject-object').append($compile(HTMLDIRECTIVE)($scope));
                            });
                        }, 800);

                    })
                }

                $scope.closeVis = () => {
                    $('#box-visualizaciones').removeClass('objectvisible');
                    try {
                        $scope.VIS.close();
                        $scope.VISUALIZATIONAPP.destroySessionObject($scope.IDVIS);
                        $('#inner-inject-object').empty();
                        $('#cover-full').fadeIn(300)
                    }
                    catch (error) {
                        console.log("error eliminando el objeto " + key + "\n" + error);
                    }

                }

                $scope.deleteBookmark = function (item, $event) {
                    var dialog = luiDialog.show({
                        template: `
                            <div class="lui-dialog lui-dialog-mz" style="width: 600px;">
                                <div class="lui-dialog__header">
                                    <div class="lui-dialog__title">${$translate.instant('views.modal.atencion')}</div>
                                </div>
                                <div class="lui-dialog__body">
                                    <strong>${$translate.instant('views.acciones.seeliminaraBookmar')}</strong>. 
                                    <br />
                                    ${$translate.instant('views.modal.accionnoback')}
                                </div>
                                <div class="lui-dialog__footer">                                    
                                    <button class="lui-button lui-dialog__button close-button" ng-click="deleteBookmarkConfirm();">${$translate.instant('views.modal.continuar')}</button>
                                    <button class="lui-button lui-dialog__button" ng-click="closeDialog();">${$translate.instant('views.modal.cerrar')}</button>
                                </div>
                            </div>`,
                        closeOnEscape: true,
                        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                            $scope.closeDialog = function () {
                                dialog.close();
                            };
                            $scope.deleteBookmarkConfirm = function () {
                                dialog.close();
                                var APP = item.APP;
                                let indexThis = $rootScope.listBookmarkPersonalizados.findIndex(objeto => objeto.id === item.id);
                                $rootScope.listBookmarkPersonalizados.splice(indexThis, 1);

                                if ($rootScope.IsPersonalMode) {
                                    APP.bookmark.remove(item.id).then(function () {
                                        APP.doSave();
                                        $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.EliminarBookmark'), 'success');

                                                                            });
                                } else {
                                    APP.bookmark.remove(item.id);
                                    $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('views.acciones.EliminarBookmark'), 'success');

                                                                    }
                                $scope.loadGrid();
                            }
                        }]
                    });
                };

                var deregister = $scope.$on("loadvisualizations", function (evt) {
                    if ($rootScope.lstModel && $rootScope.lstModel.length >= 1) {
                        angular.forEach($rootScope.lstModel, function (value, key) {
                            try {
                                value.close();
                            }
                            catch (error) {
                                console.log("error eliminando el objeto " + key + "\n" + error);
                            }

                                });
                        $rootScope.lstModel = [];
                        $rootScope.ITEMS = [];
                    }
                    $scope.applyBookmark($scope.ITEMLOAD)          
                });
                $scope.$on('$destroy', function destroyScope() {
                    deregister();
                });

                $scope.publishBookmark = function(bookmark, method){
                    APP = bookmark.APP;
                    $http.get('js/directives/vistaspersonalizadas/_templates/confirmBookmarkPublic.html').then(function (response) {
                        var _template = response.data;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.message = $translate.instant("views.acciones.mensajevisualizacionpublico");
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
                                        return qBook.publish().then(function(){ 
                                            bookmark.canDelete = true;
                                            bookmark.published = true;                                       
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
                    APP = bookmark.APP;
                    $http.get('js/directives/vistaspersonalizadas/_templates/confirmBookmarkPrivate.html').then(function (response) {
                        var _template = response.data;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.message = $translate.instant("views.acciones.mensajevisualizacionprivado");
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
                                        return qBook.unPublish().then(function(){
                                            bookmark.canDelete = false;
                                            bookmark.published = false;                                        
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
                $scope.filterRow = {
                    visible: true,
                    applyFilter: 'auto',
                };
                $scope.headerFilter = {
                    visible: true,
                };
                $scope.loadGrid = function () {
                    $scope.gridOptions = {
                        onInitialized(e) {
                            dataGrid = e.component;
                        },
                        keyExpr: 'id',
                        showColumnLines: true,
                        showRowLines: true,
                        showBorders: true,
                        rowAlternationEnabled: true,
                        hoverStateEnabled: true,
                        paging: {
                            pageSize: 20
                        },
                        pager: {
                            showPageSizeSelector: true,
                            allowedPageSizes: [20, 50, 100]
                        },
                        bindingOptions: {
                            dataSource: 'listBookmarkPersonalizados',
                            filterRow: 'filterRow',
                            headerFilter: 'headerFilter'
                        },
                        searchPanel: {
                            visible: true,
                            width: 240,
                            placeholder: $translate.instant("views.label.buscar")
                        },
                        columns: [
                            {
                                dataField: 'title',
                                caption: $translate.instant("grid.header.tituloGrafico")
                            }, {
                                dataField: 'creationDate',
                                caption: $translate.instant("grid.header.fecha-creacion"),                                
                                alignment: "right",
                                dataType: 'date',
                                format: 'dd/MM/yyyy'
                            }, ,
                            {
                                dataField: 'modificationDate',
                                caption: $translate.instant("grid.header.fecha-modificacion"),                                
                                alignment: "right",
                                dataType: 'date',
                                format: 'dd/MM/yyyy'
                            },
                            {
                                dataField: 'typeObject',
                                caption: $translate.instant("grid.header.tipo-grafico")
                            },
                            {
                                dataField: 'user',
                                caption: $translate.instant("grid.header.user")
                            },
                            {
                                dataField: 'APPNAME',
                                caption: $translate.instant("grid.header.seccion")
                            },
                            {
                                caption: $translate.instant('grid.header.acciones'),
                                width: 100,
                                allowEditing: false,
                                cellTemplate: 'accionesTemplate'
                            }
                        ]

                    };
                }

                var deregister = $scope.$on("reloadVisualizaciones", function (evt, data) {
                    if($scope.showList == true){
                        $state.forceReload();
                    }                        
                });
                $scope.$on('$destroy', function destroyScope() {
                    deregister();
                });
            }]
        };
    }]);

});