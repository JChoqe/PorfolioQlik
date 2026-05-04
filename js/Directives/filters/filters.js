var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'angular',
], function (qlik, app, angular) {
    app.directive('filters', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'js/Directives/filters/filters.html',
            link: function (scope, element, attrs) {
                function checkIsIn(arr, value) {
                    return new Promise((resolve, reject) => {
                        let $arr = arr, $val = value;
                        if($arr){
                            var $index = $arr.map(function (e) { return $arr.id; }).indexOf($val.id);
                        }else{
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
                            angular.forEach(arr, function (value, key) {
                                var _options = {};
                                if (InitConfig.multilanguage == true) {
                                    _options.title = $translate.instant(value.title);
                                } else {
                                    _options.title = value.title;
                                }
                                _options.icon = value.icon;
                                _options.id = value.idFiltro;
                                scope.listPaneles.push(_options);
                            });

                            $rootScope.$on('$translateChangeSuccess', function () {
                                angular.forEach(arr, function (value, key) {
                                    scope.listPaneles[key].title = $translate.instant(value.title);
                                });
                            });

                            break;
                        default:
                            scope.paneles = false;
                    }
                    deferred.resolve();
                    return deferred.promise();
                }

                function clearArrFilters() {
                    return new Promise(resolve => {
                        if ($rootScope.lstModelFilters && $rootScope.lstModelFilters.length >= 1) {
                            angular.forEach($rootScope.lstModelFilters, function (value, key) {
                                try {
                                    value.close();
                                }
                                catch (error) {
                                    console.log("error eliminando el objeto " + key + "\n" + error);
                                }

                            });
                            $rootScope.lstModelFilters = [];
                        }
                        resolve(true);
                    })
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
                        $(_this).parents('#filters-panel .box_object_filter_item').height(_altoFiltro);

                        resolve(true);
                    })
                }

                attrs.$observe('idfiltro', async function () {
                    scope.getAltoAcordeonFilters();
                    if (attrs.idfiltro != '') {
                        await clearArrFilters();
                        await checkIsarray();


                        $('#filters-panel .box_object_filter_item').height(0);
                        scope._thisapp = $rootScope._thisCurrentApp;
                        var _object = element.find('.qlik-embed.filtrosHome');
                        $(_object).each(function () {
                            var _this = $(this);
                            var qvid = $(_this).attr('data-qlik-objid');
                            scope._thisapp.visualization.get(qvid).then(async function (vis) {
                                await setAltoFIlters(vis, _this);
                                vis.show(_this, {
                                    onRendered: function () {
                                        checkIsIn($rootScope.lstModelFilters, vis.id).then((res) => {
                                            if (res == -1) {
                                                $rootScope.lstModelFilters.push(vis);
                                            }
                                        })

                                    }
                                });
                            }).catch(function (error) {
                            });
                        });



                    }
                });
            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', function ($q, $scope, $rootScope, luiDialog, $translate) {

                var APP = $rootScope._thisCurrentApp;
                $scope.selState = APP.selectionState();
                var listener = function () {
                    $scope.disabledSelections = {};
                    $scope.disabledSelections.back = $scope.selState.backCount < 1 ? true : false;
                    $scope.disabledSelections.forward = $scope.selState.forwardCount < 1 ? true : false;
                    setTimeout(function () {
                        $scope.$apply($rootScope.listFiltros);
                    }, 150);
                };
                $scope.selState.OnData.bind(listener);

                $scope.back = () => {
                    APP.back();
                }
                $scope.forward = () => {
                    APP.forward()
                }


                $scope.clearAllFilter = function (e) {
                    e.preventDefault();
                    APP.clearAll();
                }
                $scope.clearAllFields = () => {
                    APP.clearAll();
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
                $scope.lockFilter = function (field, e) {
                    e.preventDefault();
                    var _field = field
                    APP.field(_field).lock();
                }

                $('#selections').on('click', function (e) {
                    e.stopPropagation();
                });


                $rootScope.OpenFiltros = false;
                $rootScope.toggleFilters = function ($event) {
                    $event.stopPropagation();   
                    $rootScope.OpenBookmark = false; 
                    $rootScope.OpenAlerting = false;                
                    $rootScope.OpenFiltros = $rootScope.OpenFiltros === false ? true : false;
                    $rootScope.OpenOptionsPanel = false;
                    switch ($rootScope.OpenFiltros) {
                        case false:
                            $rootScope.OpenFiltersSelected = false;
                            break;
                        default:
                            break;
                    }
                    setTimeout(() => {
                        $('#filters-panel #cuerpoFiltros .qlik-embed').each(function () {
                            var idFiltro = $(this).attr('data-qlik-objid');
                            qlik.resize(idFiltro);
                        });
                    }, 310);
                };

                $rootScope.OpenFiltersSelected = false;
                $scope.toggleFiltersSelected = function ($event) {
                    $event.stopPropagation();
                    $rootScope.OpenFiltersSelected = $rootScope.OpenFiltersSelected === false ? true : false;
                }


                $scope.openCollapse = function (ID) {
                    setTimeout(function () {
                        qlik.resize(ID);
                    }, 150);
                };

                $scope.getAltoAcordeonFilters = function () {
                    setTimeout(function () {
                        var altoHeaders = 0;
                        $('#filters-panel #cuerpoFiltros .card-header').each(function () {
                            altoHeaders = altoHeaders + $(this).outerHeight();
                        });
                        var altoSection = $('#cuerpoFiltros #accordion').outerHeight();
                        var altoItems = altoSection - altoHeaders;
                        $('#filters-panel #cuerpoFiltros #accordion .innerCollapse').height(altoItems);
                    }, 200);
                };


                $(window).resize(function () {
                    $scope.getAltoAcordeonFilters();
                });




                $scope.selectAll = function (item) {
                    APP.field(item.field).selectAll().then(function () {
                        setTimeout(function () {
                            $scope.$apply(item.isSelectAny = true);
                            $scope.$apply(item.isSelectAll = true);
                        }, 150);


                    });
                }

                $scope.selectPosibles = function (item) {
                    APP.field(item.field).selectPossible().then(function () {
                    });
                }

                $scope.selectAlternativos = function (item) {
                    APP.field(item.field).selectAlternative().then(function () {
                    });
                }

                $scope.selectExcluidos = function (item) {
                    APP.field(item.field).selectExcluded().then(function () {
                    });
                }
            }]
        };
    }]);

});