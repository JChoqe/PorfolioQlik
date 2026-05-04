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
    app.directive('mzoptionsfilters', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {

        var directiveDefinitionObject = {
            restrict: 'E',
            scope: true,
            templateUrl: 'include/mz-options/js/directives/mzoptionsfilters/mzoptionsfilters.html',
            link: function (scope, element, attrs) {
                // scope.lstModel = [];
                scope.listPaneles = [];
                function checkIsIn(arr, val) {
                    return new Promise((resolve, reject) => {
                        let $arr = arr, $val = val;
                        if ($arr) {
                            var $index = $arr.map(function (e) { return $arr.id; }).indexOf($val.id);
                        } else {
                            var $index = -1
                        }
                        resolve($index);
                    })
                }
                function checkIsarray() {
                    scope.listPaneles = [];
                    var deferred = $.Deferred();
                    switch ($rootScope.isArray) {
                        case true:
                        case 'true':
                            scope.paneles = true;
                            var arr = JSON.parse(attrs.idfiltro);
                            angular.forEach(arr, function (val, key) {
                                var _options = {};
                                if (InitConfig.multilanguage == true) {
                                    _options.title = $translate.instant(val.title);
                                } else {
                                    _options.title = val.title;
                                }
                                _options.icon = val.icon;
                                _options.id = val.idFiltro;
                                scope.listPaneles.push(_options);
                            });
                            $rootScope.$on('$translateChangeSuccess', function () {
                                angular.forEach(arr, function (val, key) {
                                    scope.listPaneles[key].title = $translate.instant(val.title);
                                });
                            });

                            break;
                        default:
                            scope.paneles = false;
                    }
                    deferred.resolve();
                    return deferred.promise();
                }

                function setAltoFIlters(mod, el){
                    return new Promise(resolve => {
                        var vis = mod;
                        var _this = el
                        var _items;
                        var _altoFiltro = 0;
                        var _itemsLength = 0;

                        _items = vis.model.pureLayout;
                        if (_items != undefined) {
                            _itemsLength = vis.model.pureLayout.qChildList.qItems.length;

                        } else {
                            _itemsLength = vis.model.layout.qChildList.qItems.length;
                        }
                        _altoFiltro = (_itemsLength * 42) + 10;
                        $(_this).parents('#filters-panel-options .box_object_filter_item').css('height', _altoFiltro);

                        resolve(true);
                    })
                }
                $rootScope.InitFiltersOptions = () => {
                    scope.getAltoAcordeonFilters();
                    if (attrs.idfiltro != '') {
                        checkIsarray().then(function (res) {
                            $('#filters-panel-options .box_object_filter_item').height(0);
                            scope._thisapp = $rootScope._thisCurrentApp;//qlik.openApp($('body').attr('data-app'), config); 
                            if (scope._thisapp) {
                                var _object = element.find('.qlik-embed.filtrosHomePanel');
                                $(_object).each(function () {
                                    var _this = $(this);
                                    var qvid = $(_this).attr('data-qlik-objid');
                                    scope._thisapp.visualization.get(qvid).then(async function (vis) {
                                        await setAltoFIlters(vis, _this);
                                        vis.show(_this, {
                                            onRendered: function () {
                                                checkIsIn($rootScope.lstModelFiltersOptions, vis.id).then((res) => {
                                                    if (res == -1) {
                                                        $rootScope.lstModelFiltersOptions.push(vis);
                                                    }
                                                })
                                            }
                                        });
                                    }).catch(function (error) {
                                        //console.log(error)
                                    });
                                });
                            } else {
                                console.log('No existe una aplicación para obtener los Filtros');
                            }

                        });
                    }
                }
                $rootScope.InitFiltersOptions();

                const clearArrFDIlters = () => {
                    return new Promise(resolve => {
                        if ($rootScope.lstModelFiltersOptions && $rootScope.lstModelFiltersOptions.length >= 1) {
                            angular.forEach($rootScope.lstModelFiltersOptions, function (value, key) {
                                try {
                                    value.close();
                                }
                                catch (error) {
                                    console.log("error eliminando el objeto " + key + "\n" + error);
                                }

                            });
                            $rootScope.lstModelFiltersOptions = [];
                        }
                        resolve(true);
                    })
                }
                attrs.$observe('idfiltro', function (newVal, oldVal) {
                    clearArrFDIlters().then(() => {
                        $rootScope.InitFiltersOptions();
                    })

                });
            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$state', 'mzApiGlobalService', function ($q, $scope, $rootScope, luiDialog, $translate, $state, mzApiGlobalService) {
                var deregister = $scope.$on("broadcast-filtros", function (evt, data) {
                    $scope.isActive = $rootScope.isVisibleLinkFilters;
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem"); 
                });
                $scope.$on('$destroy', function destroyScope() {
                    deregister();
                });
                setTimeout(() => {
                    $scope.isActive = $rootScope.isVisibleLinkFilters;
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
                    actualizarFiltros(valState);
                };
                
                function actualizarVistaSegunValorState(valState) {
                    $scope.message = $translate.instant(valState ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                    $rootScope.isVisibleLinkFilters = valState;
                }
                
                function actualizarFiltros(valState) {
                    if (mzApiGlobalService.config.token !== null) {
                        const opcionIndex = 2; // Cambia el índice según la posición de Filtros en ITEMSOPCIONES
                        $rootScope.ITEMSOPCIONES[opcionIndex].visible = valState;
                        mzApiGlobalService.actualizarOpcionMashup($rootScope.opcionFiltros.opcion_id, valState);
                    }
                }
                

                $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                    $scope.message = $translate.instant($scope.isActive ? "views.acciones.desanclaritem" : "views.acciones.anclaritem");
                });

                var APP = $rootScope._thisCurrentApp;

                $scope.clearAllFilter = function (e) {
                    e.preventDefault();
                    APP.clearAll();
                    $('#linkAbreFiltros a[data-toggle=dropdown]').dropdown('toggle');
                }

                $scope.clearItemFilter = function (field, e) {
                    e.preventDefault();
                    var _field = field
                    APP.field(_field).clear();
                    setTimeout(function () {
                        if ($rootScope.listFiltros.length < 1) {
                            $('#linkAbreFiltros a[data-toggle=dropdown]').dropdown('toggle');
                        }
                    }, 600)
                }

                $scope.unlockFilter = function (field, e) {
                    e.preventDefault();
                    var _field = field
                    APP.field(_field).unlock();
                }

                $('#selections').on('click', function (e) {
                    e.stopPropagation();
                });

                $scope.openCollapse = function (ID) {
                    setTimeout(function () {
                        qlik.resize(ID);
                    }, 200);
                };
                $rootScope.resizeFilters = function (ID) {
                    $scope.getAltoAcordeonFilters();
                    var idFiltros = $('.notificationsScroll .filtrosHomePanel').attr('data-qlik-objid');
                    setTimeout(function () {
                        qlik.resize(idFiltros);
                    }, 200);
                }


                $scope.getAltoAcordeonFilters = function () {
                    setTimeout(function () {
                        var altoHeaders = 0;
                        $('.content-section-configurador .cuerpoFiltros .card-header').each(function () {
                            altoHeaders = altoHeaders + $(this).outerHeight();
                        });
                        var altoSection = $('.content-section-configurador .cuerpoFiltros .accordion').outerHeight();
                        var altoItems = altoSection - altoHeaders;
                        $('.content-section-configurador .cuerpoFiltros .accordion .innerCollapse').height(altoItems);
                    }, 600);
                };



                $(window).resize(function () {
                    $scope.getAltoAcordeonFilters();
                });

            }]
        };
        return directiveDefinitionObject;
    }]);


});