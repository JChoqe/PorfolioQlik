var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    '../text!./_templates/DeleteFavorite-template.html',
    '../text!./_templates/themes-template.html',
    './_templates/propertiesobjects/propertiesobjects',
], function (qlik, app, DeleteFavoriteTemplate, PopoverTemplate) {
    app.directive('objectsense', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {
        return {
            bindToController: true,
            restrict: 'E',
            replace: false,
            scope: true,
            templateUrl: 'js/Directives/objectsense/objectsense.html',
            link: function (scope, element, attrs) {
                scope.ObjectId = String(attrs.objectId).trim();
                scope.AppId = attrs.appId;
                scope.HideSpeel = attrs.hideSpeel;
                scope.BarSelection = attrs.barSelection;
                var qvid = String(attrs.objectId).trim();
                var $this = element.find('.qlik-embed');
                scope.asyncCallGetObject(qvid, $this);
            },
            controller: ['$injector','$http', '$q', '$scope', '$rootScope', '$compile', '$attrs', 'luiDialog', 'luiPopover', '$translate', '$state', '$element', '$stateParams', function ($injector,$http, $q, $scope, $rootScope, $compile, $attrs, luiDialog, luiPopover, $translate, $state, $element, $stateParams) {

                $scope.model = '';
                $scope.isInit = false;
                $scope.HideSpeel = true;
                let mzApiGlobalService = '';
                if ($rootScope.mzFavoritos) {
                    mzApiGlobalService = $injector.get('mzApiGlobalService');
                }

                function getObjectApp() {
                    return new Promise(resolve => {
                        if (typeof $attrs.appId != "undefined") {
                            if (typeof $rootScope.Apps != "undefined" && typeof $rootScope.Apps[$attrs.appId] == "object") {
                                resolve($rootScope.Apps[$attrs.appId])
                            } else {
                                let _app = ''
                                _app = qlik.openApp(InitConfig.arrApps[$attrs.appId].idapp, config);
                                if (typeof $rootScope.Apps != "undefined") {
                                    $rootScope.Apps[$attrs.appId] = _app;
                                } else {
                                    $rootScope.Apps = InitConfig.arrApps;
                                    $rootScope.Apps[$attrs.appId] = _app;
                                }
                                resolve(_app)
                            }

                        } else {
                            resolve($rootScope._thisCurrentApp);
                        }
                    })
                }

                $scope.asyncCallGetObject = (qvid, $this) => {
                    getObjectApp().then(function(result){
                        let PARENTCONTAINER = $($this).parents('.box_object');
                        $scope.ThisApp = result;
                        $scope.hasEqualizador = false;
                        $scope.hasViewTable = false;
                        $scope.isFilterPane = false;
                        $scope.hasProperties = false;                        
                        $scope.kpiClass = '';
                        var _oInteraction = false;
                        var _interactionObject = $element.attr("data-interaction");
                        if (_interactionObject === 'none') {
                            _oInteraction = true;
                        }
                        $scope.SHOWSELECTIONBAR = false;
                        if ($scope.IsKpi == true && $scope.IsKpi == 'true') {
                            $scope.IsKpi = 'true';
                            $scope.kpiClass = 'mz-object-kpi';
                        }

                        if($scope.BarSelection == 'true'){
                            let _this_current_bar = $element.find('#CurrentSelectionsFullSize')
                            $scope.ThisApp.getObject(_this_current_bar, 'CurrentSelections').then(function(model){ 
                                $rootScope.lstModelCurrentSelections.push(model);
                            });
                        }



                                    $scope.ThisApp.visualization.get(qvid).then(function (vis) {
                            $scope.VISCURRENT = vis;
                            $scope.typeObject =  vis.model?.enigmaModel?.layout?.visualization || vis.model.layout.qInfo.qType;
                            switch ($scope.typeObject) {
                                case 'linechart':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'barchart':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'bulletchart':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'scatterplot':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'piechart':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'boxplot':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'distributionplot':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'combochart':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'map':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'treemap':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = true;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'histogram':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'table':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = false;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'pivot-table':
                                    $scope.hasEqualizador = true;
                                    $scope.hasViewTable = true;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'gauge':
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'container':
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.isContainer = true;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'filterpane':
                                    $scope.isFilterPane = true;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = true;
                                    break;
                                case 'MzGenaro':
                                    $scope.isMzGenaro = true;
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'MzKPI':
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.HideSpeel = true;
                                    $scope.IsKpi = true;
                                    $scope.kpiClass = 'mz-object-kpi';
                                    $scope.hasProperties = false;
                                    break;
                                case 'kpi':
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.HideSpeel = true;
                                    $scope.IsKpi = true;
                                    $scope.kpiClass = 'mz-object-kpi';
                                    $scope.hasProperties = false;
                                    break;
                                case 'qlik-word-cloud':
                                case 'qlik-sankey-chart-ext':
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                case 'qlik-variable-input':
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = true;
                                    break;
                                case 'qlik-trellis-container':
                                    $scope.isMzGenaro = true;
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = false;
                                    break;
                                default:
                                    $scope.hasEqualizador = false;
                                    $scope.hasViewTable = false;
                                    $scope.hasProperties = false;
                                    $scope.HideSpeel = true;
                            };
                            if($stateParams.idFav && $stateParams.idFav == qvid){
                                var elemento = $("[data-qlik-objid='" + $stateParams.idFav + "']");
                                if($(elemento).parents('.box_mix').length > 0){
                                    $(elemento).parents('.box_mix').addClass('favorite-item-look');
                                    setTimeout(() => {
                                        $(elemento).parents('.box_mix').removeClass('favorite-item-look');  
                                    }, 5000);
                                }else{
                                    $(elemento).addClass('favorite-item-look');
                                    setTimeout(() => {
                                        $(elemento).removeClass('favorite-item-look');  
                                    }, 5000);
                                }                                                                
                            }

                                var ObjectTypesExcludes  = ['MzKPI','kpi', 'sn-layout-container']
                            if(vis.model.layout.showTitles == false || vis.model.layout.title == undefined){
                                if (!ObjectTypesExcludes.some(r => $scope.typeObject.includes(r))) {
                                    $element.addClass('object_no_title');
                                }

                                                           }
                            vis.show($this, {
                                "noInteraction": _oInteraction,
                                onRendered: function () { 

                                                                                                   setTimeout(() => { $scope.$apply($scope.hasEqualizador, $scope.hasViewTable, $scope.kpiClass, $scope.HideSpeel, $scope.IsKpi, $scope.isMzGenaro, $scope.isFilterPane, $scope.hasProperties, $scope.isContainer) }, 0);

                                    $scope.SHOWSELECTIONBAR = vis?._scopes[0]?.object?.layout?.qSelectionInfo?.qInSelections || false;
                                    $scope.SHOWSELECTIONBAR == true ? $(PARENTCONTAINER).addClass('SHOWSELECTIONBAR') : $(PARENTCONTAINER).removeClass('SHOWSELECTIONBAR');

                                        if ($scope.isInit == false) {                                        
                                        $scope.isInit = true;

                                            $rootScope.round = $rootScope.round + 1;
                                        if ($('#' + qvid).parents('#listaMenuContenidos').length > 0) {
                                            $rootScope.lstModelPartial.push(vis);
                                        } else {
                                            $rootScope.lstModel.push(vis);
                                        }


                                                if ($rootScope.round >= $rootScope.itemsObject) {
                                            $rootScope.deleteElement();
                                        }
                                        if ($scope.isContainer) {
                                            var arrObjectContainer = vis.model.items.items
                                            arrObjectContainer.forEach(function (value, i) {
                                                $scope.ThisApp.visualization.get(value.childId).then(function (vis) {
                                                    var item = {};
                                                    item.id = value.childId;
                                                    item.vis = vis;
                                                    $rootScope.ITEMS.push(item);
                                                })
                                            })
                                        } else {
                                            var item = {};
                                            item.id = qvid;
                                            item.vis = vis;
                                            $rootScope.ITEMS.push(item);
                                        }
                                        if ($rootScope.mzFavoritos) {
                                            $scope.FavoritesTxt = $translate.instant('Favorites.label.addFavorites');
                                            $scope.isFavorite = function (id) {
                                                var IDOBJECT = id;
                                                mzApiGlobalService.getFav(IDOBJECT, $state.current.name).then(function (res) {
                                                    if (res) {
                                                        $scope.FavoritesTxt = $translate.instant('Favorites.label.deltetFavorites');
                                                        var hasIcon = $('#' + IDOBJECT).find('.ISFavorite');
                                                        var _el = $compile(`<div class="ISFavorite" ng-click="deleteFavoriteStar('` + IDOBJECT + `')"></div>`)($scope);
                                                        if (hasIcon.length == 0) {
                                                            $('#' + IDOBJECT).find('.qv-object-title').append(_el);
                                                        }
                                                    } else {
                                                        $scope.FavoritesTxt = $translate.instant('Favorites.label.addFavorites');
                                                        $('#' + IDOBJECT).find('.qv-object-title .ISFavorite').remove()
                                                    }
                                                })
                                            }
                                            $scope.isFavorite(qvid);
                                        }

                                        }
                                }
                            });
                        }).catch(function (error) {
                            $rootScope.round = $rootScope.round + 1;
                            if ($rootScope.round >= $rootScope.itemsObject) {
                                $rootScope.deleteElement();
                            }
                            $scope.ObjectNotFound = true;                        
                            $($this).empty().append('<div class="object-not-found">No se ha podido cargar el objeto.</br>Consulte con el proveedor</div>');
                            let _parentFavorito = $($this).parents('.item-favorite');
                            if(_parentFavorito.length > 0){
                                $(_parentFavorito).addClass('ObjectNotFound')
                            }
                        });

                            $scope.deleteFavoriteStar = function (id) {
                            if ($rootScope.mzFavoritos) {
                                var IDOBJECT = id;
                                var dialogLogoutTemplate = DeleteFavoriteTemplate;
                                var _template = dialogLogoutTemplate;
                                var dialog = luiDialog.show({
                                    template: _template,
                                    closeOnEscape: true,
                                    controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                        $scope.closeDialog = function () {
                                            dialog.close();
                                        };
                                        $scope.deleteFavorite = function () {
                                            mzApiGlobalService.deleteFav(IDOBJECT, $state.current.name).then(function (res) {
                                                $scope.closeDialog();
                                                $('contextmenu').remove();
                                                $('.speeldial-center').removeClass('activo');
                                                $('#' + IDOBJECT).find('.qv-object-title .ISFavorite').remove();
                                                $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('Favorites.alert.deleteToFavorites'), 'success');
                                            })
                                        }
                                    }]
                                });     
                            }

                                                    }

                            $scope.showThemes = ($event) => {
                            var element = $event.currentTarget;
                            var popover = luiPopover.show({
                                template: PopoverTemplate,
                                closeOnEscape: true,
                                closeOnOutside: true,
                                dock: "center",
                                alignTo: element,
                                showArrow: false,
                                input: {
                                    aplication:$scope.ThisApp,
                                },    
                                controller: ['$scope', '$rootScope', '$element', function ($scope, $rootScope, $element) {
                                    $scope.ThisApp = $scope.input.aplication;
                                    $scope._patches = [];
                                    var deregister = $scope.$on("_patches", function (evt, data) {
                                        $scope._patches = data;
                                    });
                                    $scope.$on('$destroy', function destroyScope() {
                                        deregister();
                                    });

                                        if (sessionStorage.length > 0) {
                                        if (sessionStorage["ObjectProperties" + $rootScope.OBJECTIDORIGINPROPERTIES]) {
                                            $scope._patches = JSON.parse(sessionStorage.getItem("ObjectProperties" + $rootScope.OBJECTIDORIGINPROPERTIES));
                                        }
                                    }
                                    $scope.IDTHEME = '';
                                    $scope.ObjectId = qvid;
                                    $scope.haveTheme = false;
                                    $($element).parent().addClass('mz-popover-overlay');
                                    $($element).draggable({
                                        cursor: "crosshair",
                                        handle: ".lui-popover__header",
                                        containment: "body"
                                    })
                                    $scope.closePopover = function () {
                                        if ($rootScope.listPropertieObjectModel && $rootScope.listPropertieObjectModel.length >= 1) {
                                            angular.forEach($rootScope.listPropertieObjectModel, function (value, key) {
                                                try {
                                                    value.close();
                                                }
                                                catch (error) {
                                                    console.log("error eliminando el objeto " + key + "\n" + error);
                                                }

                                                });
                                            $rootScope.listPropertieObjectModel = [];
                                        }
                                        if ($scope._patches.length > 0) {
                                            sessionStorage.setItem("ObjectProperties" + $rootScope.OBJECTIDORIGINPROPERTIES, JSON.stringify($scope._patches));
                                        }
                                        popover.close();
                                    };
                                    function populateQlikTheme(qlik, name) {
                                        qlik.getThemeList().then(function (list) {
                                            var $dropdown = $(".cmbThemes");
                                            $dropdown.empty();
                                            list.forEach(function (value) {
                                                if (value.id == name) {
                                                    $dropdown.append($("<option selected />").val(value.id).text(value.name));
                                                } else {
                                                    if (value.id.includes('-Pallete-Theme')) {
                                                        $dropdown.append($("<option />").val(value.id).text(value.name));
                                                    }

                                                    }
                                            });
                                        });
                                    }
                                    $(document).on('change', '.cmbThemes', function (event) {
                                        $scope.arrayScales = [];
                                        var name = $(this).val();
                                        $scope.IDTHEME = name;
                                        $scope.haveTheme = true;

                                            getScaleColors(name).then((res) => {
                                            $scope.arrayScales = res;
                                            setTimeout(() => {
                                                $scope.$apply($scope.arrayScales);
                                            }, 300);
                                        })
                                    });
                                    $scope.changeThemes = () => {
                                        qlik.theme.apply($scope.IDTHEME).then(() => {
                                            $scope.haveTheme = false;
                                            $rootScope.ThemesInit = $scope.IDTHEME;
                                        });
                                    }

                                        const getScaleColors = (name) => {
                                        return new Promise(resolve => {
                                            qlik.theme.get(name).then(function (qtheme) {
                                                var arr = [];
                                                var obj = qtheme.properties._variables;
                                                var map = new Map(Object.entries(obj));
                                                angular.forEach(map, function (value, key) {
                                                    if (key.includes('@colorTheme')) {
                                                        var item = {};
                                                        item.color = value;
                                                        arr.push(item);
                                                    }
                                                });
                                                resolve(arr)
                                            })
                                        })
                                    }
                                    populateQlikTheme(qlik, $rootScope.ThemesInit);
                                    $scope.ThisApp.theme.getApplied().then(function (qtheme) {
                                        getScaleColors(qtheme.id).then((res) => {
                                            $scope.arrayScales = res;
                                            setTimeout(() => {
                                                $scope.$apply($scope.arrayScales);
                                            }, 300);
                                        })
                                    })

                                        $scope.clearPatches = function () {
                                        $scope.ThisApp.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
                                            viz.model.clearSoftPatches().then(function () {
                                                $scope._patches = [];
                                                if (sessionStorage["ObjectProperties" + $rootScope.OBJECTIDORIGINPROPERTIES]) {
                                                    sessionStorage.removeItem("ObjectProperties" + $rootScope.OBJECTIDORIGINPROPERTIES);
                                                }
                                                $rootScope.$broadcast('_Init_patches');
                                                $scope.ThisApp.destroySessionObject(viz.qInfo.qId);
                                            });
                                        });
                                    }
                                }]
                            });

                            }
                        var deregister = $scope.$on("dataviewtable", function (evt, data) {
                            if (qvid == data[1]) {
                                $scope.hasProperties = data[0];
                            }
                        });
                        $scope.$on('$destroy', function destroyScope() {
                            deregister();
                        });
                    });

                }
            }]
        };
    }]);

});