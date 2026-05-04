var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'moment',
], function (qlik, app, moment) {
    app.directive('favoritos', ['InitConfig', '$translate', '$rootScope', function factory(InitConfig, $translate, $rootScope) {

        var directiveDefinitionObject = {
            priority: 0,
            restrict: 'E',
            templateNamespace: 'html',
            templateUrl: 'js/Directives/favoritos/favoritos.html',
            scope: false,
            bindToController: false,
            link: function (scope, element, attrs) {

            },
            controller: ['$injector', '$q', '$http', '$compile', '$scope', '$rootScope', '$state', 'luiDialog', 'getAppService', 'getDefaulltBookmarkService', 'InitConfig', function ($injector, $q, $http, $compile, $scope, $rootScope, $state, luiDialog, getAppService, getDefaulltBookmarkService, InitConfig) {

                if ($rootScope.mzFavoritos) {
                    $scope.wellcomeFavoritos = $translate.instant('Favorites.Wellcome');
                    $scope.searchTextFavorites = '';
                    let mzApiGlobalService = $injector.get('mzApiGlobalService');
                    $scope.favoritesTitleBox = "";
                    $rootScope.arrFavorites = [];
                    $scope.nameAppLoad = '';
                    $scope.appActive = {
                        index: ''
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

                    var deregister = $scope.$on("reloadFavoritos", function (evt, data) {
                        if($scope.showList == true){
                            $state.forceReload();
                        }                        
                    });
                    $scope.$on('$destroy', function destroyScope() {
                        deregister();
                    });

                    $scope.closePartial = function () {
                        $scope.favoritesFullSize = false;
                    }
                    function compararFechasDescendente(a, b) {
                        return b.fecha_at - a.fecha_at;
                      }
                    function getFavorites() {
                        var defer = $q.defer();
                        $rootScope.arrFavorites = [];
                        try {
                            mzApiGlobalService.getFavs().then(function (dataFavorites) {
                                var _lang = $translate.use();           
                                moment.locale(_lang);
                                var formatdate = '';

                                angular.forEach(dataFavorites, function (value, key) {

                                    var option = {};
                                    option.idApp = value.app_id;
                                    option.nameApp = value.app_name;
                                    option.object_id = value.object_id;
                                    option.fecha_at = moment(value._created_at).format('DD/MM/YYYY');
                                    option.created_at = moment(value._created_at).format('DD/MM/YYYY');
                                    option.uiSref = value.location;
                                    option.title_object = value.title_object || '-';
                                    option.icon = value.icon || 'lui-icon lui-icon--pivot-table lui-list__aside';
                                    option.visualization = value.visualization || 'pivot-table'
                                    $rootScope.arrFavorites.push(option)
                                });
                                defer.resolve($rootScope.arrFavorites.sort(compararFechasDescendente));

                            })
                        } catch {
                            console.error("alertsApiService:", err);
                            $rootScope.deleteElement();
                            defer.reject(err);
                        }

                        return defer.promise;
                    }



                                         function loadFavorites() {
                        getFavorites().then(function (res) {
                            $rootScope.deleteElement();
                            $scope.loadGrid();
                            setTimeout(() => {
                                $('.body-menu-list').addClass('visible');
                            }, 300);
                        }).catch((err) => {
                            console.error("alertsApiService:", err);
                            $rootScope.deleteElement();
                        })
                    }

                    $scope.favoritesFullSize = false;
                    $scope.toggleFullsize = function (event) {
                        $scope.favoritesFullSize = $scope.favoritesFullSize === false ? true : false;
                        setTimeout(function () {
                            qlik.resize();
                        }, 600);
                    };
                    $scope.toggleItemFullsize = (item, $event) => {
                        var objectID = item.object_id;
                        var indeApp = item.idApp




                                                 $rootScope.isFullSize = true;                            
                        $('body').addClass("body-full-size");
                        let newScope = $scope.$parent.$new();                            

                        $injector.invoke(function () {

                            $('contextmenu').remove();                            
                            let _el = $compile(`<div id="fullsizeContainer">                                
                            <objectsense class="object-full-size-copy" object-id="${objectID}" bar-selection="true" ` + (typeof indeApp != 'undefined' ? `app-id="${indeApp}"` : '' )+ `></objectsense></div>`)(newScope);
                            $(document.body).prepend(_el);
                            $('#main-content .qv-global-search-container').removeClass( "qv-global-search-container" ).addClass( "qv-global-search-container-01" );                                                              
                        });  








                    }
                    $scope.clearFullItem = () => {
                        $('favoritesfullsize').remove();
                        $rootScope.ISFAVORITOFULLSIZE = false;
                    }

                    $scope.deleteFavorite = function (itemFavorite) {
                        var IDOBJECT = itemFavorite.object_id;
                        var LOCATION = itemFavorite.uiSref
                        $http.get('js/Directives/favoritos/dialog-template.ng.html').then(function (response) {
                            var _template = response.data;
                            var dialog = luiDialog.show({
                                template: _template,
                                closeOnEscape: true,
                                input: {OBJECTFAVORITE: $rootScope.arrFavorites, OPCIONESGRID : $scope.gridOptions, ITEMFAVORITO : itemFavorite },                               
                                controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                    $scope.closeDialog = function () {
                                        dialog.close();
                                    };
                                    $scope.actionOK = function () {
                                        dialog.close();
                                        var _item = $('.isFavoriteItem[data-id=' + $scope.ITEMFAVORITO.object_id + ']')
                                        mzApiGlobalService.deleteFav($scope.ITEMFAVORITO.object_id, $scope.ITEMFAVORITO.uiSref).then(async function (res) {
                                            await $(_item).addClass('removeItem').promise();
                                            setTimeout(() => {
                                                $(_item).remove();
                                                $('.item-favorite.full-size').remove();
                                                $rootScope.ISFAVORITOFULLSIZE = false;
                                                $rootScope.arrFavorites = $scope.OBJECTFAVORITE.filter((item) => item.object_id !== $scope.ITEMFAVORITO.object_id);
                                                setTimeout(() => { $scope.$apply($rootScope.arrFavorites) }, 0);
                                            }, 800);
                                        });

                                                                            }
                                }]
                            });
                        })
                    }

                    $scope.limit = 6;
                    $scope.loadMore = function () {
                        $scope.limit += 3;
                    };

                    async function getApp(IDAPP) {
                        return new Promise(resolve => {
                            var indexApp = IDAPP;
                            $rootScope.indexApp = IDAPP;
                            if ($rootScope.lstModelCurrentSelections && $rootScope.lstModelCurrentSelections.length >= 1) {
                                angular.forEach($rootScope.lstModelCurrentSelections, function (value, key) {
                                    try {
                                        value.close();
                                    }
                                    catch (error) {
                                        console.log("error eliminando el objeto " + key + "\n" + error);
                                    }

                                });
                                $rootScope.lstModelCurrentSelections = [];
                            }
                            if ($rootScope.Apps[indexApp]) {
                                getDefaulltBookmarkService.getBookmarkId([$rootScope.Apps[indexApp]]);
                                resolve($rootScope.Apps[indexApp]);
                            } else {
                                resolve(getAppService.getDataApp(InitConfig.arrApps[indexApp].idapp)); 
                            }
                        })
                    }

                    $scope.loadApp = async (item, event) => {

                        var $STATE = $state.get().filter(obj => {
                            if (obj.name == item.uiSref) {
                                return obj;
                            }
                        });
                        let $FILTERS = $STATE[0].params.IDFILTRO.value || $STATE[0].params.IDFILTRO;

                        const result = await getApp(item.idApp);
                        let _thisApp = result;
                        $scope.nameAppLoad = '<i class="lui-icon lui-icon--application"></i>' + InitConfig.arrApps[item.idApp].name;
                        $scope.appActive.index = item.idApp;
                        $rootScope._thisCurrentApp = _thisApp;
                        let $CurrentSelections = $(".CurrentSelections");
                        _thisApp.getObject($CurrentSelections, 'CurrentSelections').then(function (model) {
                            $rootScope.lstModelCurrentSelections.push(model);
                            $('.qv-global-selections').parent('div').remove();
                            if ($FILTERS) {
                                $rootScope.IdFiltros = $FILTERS;
                                switch (typeof ($FILTERS)) {
                                    case 'string':
                                        $rootScope.isArray = false;
                                        break;
                                    default:
                                        $rootScope.isArray = true;
                                }
                            }
                            setInterval(() => { $scope.$apply($rootScope.IdFiltros, $rootScope.isArray) }, 0);
                            $rootScope.MANUALLOADCONTENTAPP();
                        });

                    }
                    loadFavorites();

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
                            keyExpr: 'object_id',
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
                                dataSource: 'arrFavorites',
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
                                    dataField: 'title_object',
                                    caption: $translate.instant("grid.header.tituloGrafico")
                                }, {
                                    dataField: 'visualization',
                                    caption: $translate.instant("grid.header.tipoGrafico")
                                }, ,
                                {
                                    dataField: 'nameApp',
                                    caption: $translate.instant("grid.header.seccionGrafico")
                                },
                                {
                                    dataField: 'object_id',
                                    caption: $translate.instant("grid.header.idGrafico")
                                },
                                {
                                    dataField: 'created_at',
                                    caption: $translate.instant("grid.header.fechaCreación"),
                                    dataType: 'date',
                                    alignment: "right",
                                    format: 'dd/MM/yyyy'
                                },
                                {
                                    dataField: 'uiSref',
                                    caption: $translate.instant("grid.header.rutaLocalizacion")
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

                    $scope.goToLocation = function(row){
                        var URL = row.data.uiSref
                        $state.go(URL,{idFav: row.data.object_id});
                    }
                    $scope.deleteFavoriteGrid = function(row){                    
                        $scope.deleteFavorite(row.data);
                    }
                }


            }]
        }
        return directiveDefinitionObject;
    }]);

});