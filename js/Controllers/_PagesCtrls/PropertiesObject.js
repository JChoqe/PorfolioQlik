
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore'
], function (qlik, app, us) {

    app.controller('lineChartProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {
        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            $rootScope.listPropertieObjectModel.push(vis);
            function getEscalaLogaritmica(_idObject) {
                var _propiedades = _model;
                $scope.showEscalaLogaritmica = _propiedades.layout.measureAxis.logarithmic;
                $scope.escalaLogaritmicaLabel = '';
                switch ($scope.showEscalaLogaritmica) {
                    case true:
                        $scope.escalaLogaritmicaLabel = $scope.automatico;
                        break;
                    case false:
                        $scope.escalaLogaritmicaLabel = $scope.desactivado;
                        break;
                    default:
                }
                setTimeout(() => { $scope.$apply($scope.showEscalaLogaritmica, $scope.escalaLogaritmicaLabel) }, 0);
            }

            $scope.changeEscalaLogaritmica = function (event, showEscalaLogaritmica) {
                var dataEscalaLogaritmica = showEscalaLogaritmica;
                switch (dataEscalaLogaritmica) {
                    case true:
                        $scope.escalaLogaritmicaLabel = $scope.automatico;
                        break;
                    case false:
                        $scope.escalaLogaritmicaLabel = $scope.desactivado;
                        break;
                    default:
                }
                var _patches = [{
                    "qPath": "/measureAxis/logarithmic",
                    "qOp": "replace",
                    "qValue": JSON.stringify(dataEscalaLogaritmica)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }
            getEscalaLogaritmica();

            function getEtiquetaValores(_idObject) {
                var _propiedades = _model;
                $scope.showEtiquetaValores = _propiedades.layout.dataPoint.showLabels;
                $scope.etiquetaValoresLabel = '';
                switch ($scope.showEtiquetaValores) {
                    case true:
                        $scope.etiquetaValoresLabel = $scope.automatico;
                        break;
                    case false:
                        $scope.etiquetaValoresLabel = $scope.desactivado;
                        break;
                    default:
                }
                setTimeout(() => { $scope.$apply($scope.showEtiquetaValores, $scope.etiquetaValoresLabel) }, 0);
            }

            $scope.changeEtiquetaValores = function (event, showEtiquetaValores) {
                var dataEtiquetaValores = showEtiquetaValores;
                switch (dataEtiquetaValores) {
                    case true:
                        $scope.etiquetaValoresLabel = $scope.automatico;
                        break;
                    case false:
                        $scope.etiquetaValoresLabel = $scope.desactivado;
                        break;
                    default:
                }
                var _patches = [{
                    "qPath": "/dataPoint/showLabels",
                    "qOp": "replace",
                    "qValue": JSON.stringify(dataEtiquetaValores)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }

            getEtiquetaValores();

            $scope.tipoFormato = '';
            function getFormato() {
                return new Promise(resolve => {
                    var _propiedades = _model;
                    var tipoFormato = _propiedades.layout.lineType;
                    resolve(tipoFormato);
                })
            }

            function applyFormato() {
                getFormato().then(function (res) {
                    $scope.tipoFormato = res;
                    setTimeout(() => { $scope.$apply($scope.tipoFormato) }, 0);
                })
            }

            $scope.changeFormato = function (formato) {
                var tipoFormato = formato;
                if (tipoFormato == $scope.tipoFormato) {
                    return false;
                } else {
                    var _patches = [{
                        "qPath": "/lineType",
                        "qOp": "replace",
                        "qValue": JSON.stringify(tipoFormato)
                    }]
                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function () {
                        $scope.tipoFormato = formato;
                    });
                }
            }
            applyFormato();

            function getOrientacion() {
                return new Promise(resolve => {
                    var _propiedades = _model;
                    var orientacion = _propiedades.layout.orientation || '';
                    resolve(orientacion);
                })
            }

            getOrientacion().then(function (res) {
                $scope.orientacion = res;
                setTimeout(() => { $scope.$apply($scope.orientacion) }, 0);
            });

            $scope.changeOrientacion = function (orientacion) {
                var _propiedades = _model;
                var orientacionProp = _propiedades.layout.orientation;
                var _orientacion = orientacion;
                if (_orientacion == $scope.orientacion) {
                    return false;
                } else {
                    if (us.isUndefined(orientacionProp)) {
                        var _patches = [{
                            "qPath": "/orientation",
                            "qOp": "add",
                            "qValue": JSON.stringify(_orientacion)
                        }]
                    } else {
                        var _patches = [{
                            "qPath": "/orientation",
                            "qOp": "replace",
                            "qValue": JSON.stringify(_orientacion)
                        }]
                    }

                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function () {
                        $scope.orientacion = _orientacion;
                    });
                }
            }


            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getOrientacion().then(function (res) {
                        $scope.orientacion = res
                    });
                    applyFormato();
                    getEscalaLogaritmica();
                    getEtiquetaValores();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });

        });
    }]);
    app.controller('pieChartProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {

        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            $rootScope.listPropertieObjectModel.push(vis);
            function getPresentacion() {
                var _propiedades = _model;
                $scope.showAsDonut = _propiedades.layout.donut.showAsDonut;
                setTimeout(() => { $scope.$apply($scope.showAsDonut) }, 0);
            }

            $scope.changePresentacion = function (isDonut) {
                var _patches = [{
                    "qPath": "/donut/showAsDonut",
                    "qOp": "replace",
                    "qValue": JSON.stringify(isDonut)
                }]
                $scope.showAsDonut = isDonut;
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }
            getPresentacion();

            function etiquetaTipo() {
                var defer = $q.defer();
                var _propiedades = _model;
                var _labelMode = _propiedades.layout.dataPoint.labelMode;
                var _auto = _propiedades.layout.dataPoint.auto;
                defer.resolve([_labelMode, _auto]);
                return defer.promise;
            }

            function getEtiquetas() {
                etiquetaTipo().then(function ([res, auto]) {
                    $scope._auto = auto;
                    if ($scope._auto == true) {
                        $scope.typeEtiquetas = false;
                    } else {
                        $scope.typeEtiquetas = res;
                    }
                    setTimeout(() => { $scope.$apply($scope.typeEtiquetas, $scope._auto) }, 0);
                })
            }

            $scope.changeEtiqueta = function (etiqueta) {
                var _patches = [
                    {
                        "qPath": "/dataPoint/labelMode",
                        "qOp": "replace",
                        "qValue": JSON.stringify(etiqueta)
                    },
                    {
                        "qPath": "/dataPoint/auto",
                        "qOp": "replace",
                        "qValue": JSON.stringify(false)
                    }
                ]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }
            getEtiquetas();
            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getPresentacion();
                    getEtiquetas();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });
        });





    }]);
    app.controller('barChartProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {

        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            $rootScope.listPropertieObjectModel.push(vis);
            $scope.ARRDIMENSIONS = _model.layout.qHyperCube.qDimensionInfo;
            function getEtiquetaValores() {
                var _propiedades = _model;
                $scope.showEtiquetaValores = _propiedades.layout.dataPoint.showLabels;
                $scope.etiquetaValoresLabel = '';
                switch ($scope.showEtiquetaValores) {
                    case true:
                        $scope.etiquetaValoresLabel = $scope.automatico;
                        break;
                    case false:
                        $scope.etiquetaValoresLabel = $scope.desactivado;
                        break;
                    default:
                }
                setTimeout(() => { $scope.$apply($scope.showEtiquetaValores, $scope.etiquetaValoresLabel) }, 0);
            }
            $scope.changeEtiquetaValores = function (event, showEtiquetaValores) {
                var dataEtiquetaValores = showEtiquetaValores;
                switch (dataEtiquetaValores) {
                    case true:
                        $scope.etiquetaValoresLabel = $scope.automatico;
                        break;
                    case false:
                        $scope.etiquetaValoresLabel = $scope.desactivado;
                        break;
                    default:
                }
                var _patches = [{
                    "qPath": "/dataPoint/showLabels",
                    "qOp": "replace",
                    "qValue": JSON.stringify(dataEtiquetaValores)
                }];
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            };
            getEtiquetaValores();

            $scope.tipoFormato = '';
            function getFormato() {
                var _propiedades = _model;
                $scope.tipoFormato = _propiedades.layout.barGrouping.grouping;
                setTimeout(() => { $scope.$apply($scope.tipoFormato) }, 0);
            }

            $scope.changeFormato = function (formato) {
                var tipoFormato = formato;
                if (tipoFormato == $scope.tipoFormato) {
                    return false;
                } else {
                    var _patches = [{
                        "qPath": "/barGrouping/grouping",
                        "qOp": "replace",
                        "qValue": JSON.stringify(tipoFormato)
                    }];

                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function () {
                        $scope.tipoFormato = formato;
                        var _patchesMode = '';
                        if ($scope.ARRDIMENSIONS.length > 1) {
                            if (tipoFormato == 'grouped') {
                                _patchesMode = [{
                                    "qPath": "/qHyperCubeDef/qMode",
                                    "qOp": "replace",
                                    "qValue": JSON.stringify("S")
                                }];

                            } else {
                                _patchesMode = [{
                                    "qPath": "/qHyperCubeDef/qMode",
                                    "qOp": "replace",
                                    "qValue": JSON.stringify("K")
                                }];
                            }
                            vis.model.applyPatches(_patchesMode, true).then(function () {
                                $scope.Patches.push(_patchesMode);
                                $rootScope.$broadcast('_patches', _patches);
                            });
                        }

                    });
                }
            };
            getFormato();

            $scope.orientacion = '';
            function getOrientacion() {
                var _propiedades = _model;
                $scope.orientacion = _propiedades.layout.orientation;
                setTimeout(() => { $scope.$apply($scope.orientacion) }, 0);
            }
            $scope.changeOrientacion = function (orientacion) {
                var tipoFormato = orientacion;
                if (tipoFormato == $scope.orientacion) {
                    return false;
                } else {
                    var _patches = [{
                        "qPath": "/orientation",
                        "qOp": "replace",
                        "qValue": JSON.stringify(tipoFormato)
                    }];
                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function () {
                        $scope.orientacion = orientacion;
                    });
                }
            };
            getOrientacion();
            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getEtiquetaValores();
                    getFormato();
                    getOrientacion();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });
        });
    }]);    
    app.controller('comboChartProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {

        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            $rootScope.listPropertieObjectModel.push(vis);

            $scope.orientacion = '';
            async function getOrientacion() {
                var _propiedades = _model;
                $scope.orientacion = _propiedades.layout.orientation;
                setTimeout(() => { $scope.$apply($scope.orientacion) }, 0);
            }
            $scope.changeOrientacion = async function (orientacion) {
                var tipoFormato = orientacion;
                if (tipoFormato == $scope.orientacion) {
                    return false;
                } else {
                    var _patches = [{
                        "qPath": "/orientation",
                        "qOp": "replace",
                        "qValue": JSON.stringify(tipoFormato)
                    }];
                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function () {
                        $scope.orientacion = orientacion;
                    });
                }
            };


            async function getFormato() {
                var _propiedades = _model;
                $scope.tipoFormato = _propiedades.layout.barGrouping.grouping;
                setTimeout(() => { $scope.$apply($scope.tipoFormato) }, 0);
            }

            $scope.changeFormato = async function (formato) {
                var tipoFormato = formato;
                if (tipoFormato == $scope.tipoFormato) {
                    return false;
                } else {
                    var _patches = [{
                        "qPath": "/barGrouping/grouping",
                        "qOp": "replace",
                        "qValue": JSON.stringify(tipoFormato)
                    }]
                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function () {
                        $scope.tipoFormato = formato;
                    });
                }
            }


            async function V(e) {
                return e.qHyperCube.qMeasureInfo.filter((function (e) {
                    return e.series && "line" === e.series.type
                }
                )).length > 0
            }


            async function getValoresPerdidos() {                
                var _propiedades = _model;
                $scope.typeValoresPerdidos = _propiedades.layout.nullMode;
                var t = _propiedades.layout;
                $scope.isVisibleTipoValores = V(t) && t.qHyperCube.qMeasureInfo.length > 1;
                setTimeout(() => { $scope.$apply($scope.isVisibleTipoValores, $scope.typeValoresPerdidos) }, 0);                
            }

            $scope.cambiarTipoValores = async function (tipo) {
                var TipoValores = tipo;
                var _patches = [{
                    "qPath": "/nullMode",
                    "qOp": "replace",
                    "qValue": JSON.stringify(TipoValores)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true).then(function () {
                    $scope.typeValoresPerdidos = TipoValores;
                });

            }

            async function getPuntosDatos() {              
                var _propiedades = _model;
                $scope.puntosDatos = _propiedades.layout.dataPoint.show;                
                setTimeout(() => { $scope.$apply($scope.puntosDatos) }, 100);
            }

            $scope.cambiarPuntosDatos = async function (puntos) {
                var _puntosDatos = puntos;
                var _patches = [{
                    "qPath": "/dataPoint/show",
                    "qOp": "replace",
                    "qValue": JSON.stringify(_puntosDatos)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true).then(function () {
                    $scope.puntosDatos = _puntosDatos;
                });
            }
            getOrientacion();
            getFormato();
            getValoresPerdidos();
            getPuntosDatos();


            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getOrientacion();
                    getFormato();
                    getValoresPerdidos();
                    getPuntosDatos();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });
        });
    }]);
    app.controller('distributionPlotProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {

        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            $rootScope.listPropertieObjectModel.push(vis);

            async function getOrientacion() {
                var _propiedades = _model;
                $scope.orientacion = _propiedades.layout.orientation;
                setTimeout(() => { $scope.$apply($scope.orientacion) }, 0);
            }

                        $scope.changeOrientacion = async function (orientacion) {
                var _orientacion = orientacion;
                if (_orientacion == $scope.orientacion) {
                    return false;
                } else {
                    var _patches = [{
                        "qPath": "/orientation",
                        "qOp": "replace",
                        "qValue": JSON.stringify(_orientacion)
                    }]
                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function (replay) {
                        $scope.orientacion = _orientacion;
                    });
                }
            }

            async function getTamañoBurbujas() {
                var _propiedades = _model;
                $scope.BubbleSizes = _propiedades.layout.dataPoint.bubbleScales;
                $("#slider-range").slider({
                    range: false,
                    values: [$scope.BubbleSizes],
                    slide: function (event, ui) {
                        var _val = ui.values;
                        var _patches = [{
                            "qPath": "/dataPoint/bubbleScales",
                            "qOp": "replace",
                            "qValue": "[" + _val + "]"
                        }]
                        $scope.Patches.push(_patches);
                        $rootScope.$broadcast('_patches', _patches);
                        vis.model.applyPatches(_patches, true);
                    }
                });
            }


            async function getPuntosFluctuacion() {
                var _propiedades = _model;
                $scope.showPuntosFluctuacion = _propiedades.layout.dataPoint.displacement;
                $scope.puntosFluctuacionLabel = '';
                switch ($scope.showPuntosFluctuacion) {
                    case 'jitter':
                        $translate('equalizer.label.activado').then(function (translation) {
                            $scope.puntosFluctuacionLabel = translation;
                        });
                        $scope.isFluctuacion = true;
                        break;
                    case 'none':
                        $translate('equalizer.label.desactivado').then(function (translation) {
                            $scope.puntosFluctuacionLabel = translation;
                        });
                        $scope.isFluctuacion = false;
                        break;
                    default:
                }
                setTimeout(() => { $scope.$apply($scope.showPuntosFluctuacion, $scope.puntosFluctuacionLabel, $scope.isFluctuacion) }, 0);
            }
            $scope.changePuntosFluctuacion = function (event, isFluctuacion) {
                var dataFluctuacion = isFluctuacion;
                var puntosFluctuacion;
                switch (dataFluctuacion) {
                    case true:
                        $translate('equalizer.label.activado').then(function (translation) {
                            $scope.puntosFluctuacionLabel = translation;
                        });
                        puntosFluctuacion = 'jitter';
                        break;
                    case false:
                        $translate('equalizer.label.desactivado').then(function (translation) {
                            $scope.puntosFluctuacionLabel = translation;
                        });
                        puntosFluctuacion = 'none';
                        break;
                    default:
                }
                var _patches = [{
                    "qPath": "/dataPoint/displacement",
                    "qOp": "replace",
                    "qValue": JSON.stringify(puntosFluctuacion)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);


            }



                        getOrientacion();
            getTamañoBurbujas();
            getPuntosFluctuacion();

            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getOrientacion();
                    getTamañoBurbujas();
                    getPuntosFluctuacion();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });
        });
    }]);    
    app.controller('scatterPlotProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {

        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        $scope.getNombreDimensionAlternativa = function (item) {
            var nameDimensionAlt = '';
            var dfd = jQuery.Deferred();
            if (us.isUndefined(item.qLibraryId) || item.qLibraryId == '') {
                if (item.qDef.qLabelExpression === undefined || item.qDef.qLabelExpression == '') {
                    if (item.qDef.qFieldDefs === undefined) {
                        if (item.qDef.qLabel != undefined && item.qDef.qLabel != '') {
                            nameDimensionAlt = item.qDef.qLabel;
                        } else {
                            nameDimensionAlt = item.qDef.qDef;
                        }
                    } else {
                        if (item.qDef.qFieldDefs[0] != '') {
                            nameDimensionAlt = item.qDef.qFieldDefs[0];
                        } else {
                            nameDimensionAlt = item.qDef.qFieldLabels[0];
                        }
                    }
                    dfd.resolve(nameDimensionAlt);
                } else {
                    $scope.app.createGenericObject({
                        title: {
                            qStringExpression: item.qDef.qLabelExpression
                        }
                    }, function (reply) {
                            nameDimensionAlt = reply.title;
                            dfd.resolve(nameDimensionAlt);
                    });
                }

                            } else {
                $scope.app.getList('DimensionList', function (reply) {
                    var dimension = {};
                    var listaDimensiones = reply.qDimensionList.qItems;
                    listaDimensiones = listaDimensiones.filter(function (obj) {
                        var _needle = item.qLibraryId;
                        if (typeof _needle != "undefined" || _needle != "") {
                            if (obj.qInfo.qId == _needle) {
                                var name = obj.qData.hasOwnProperty('labelExpression') ? obj.qData.labelExpression : obj.qData.title;
                                dfd.resolve(name.trim());
                            }
                        }
                    });
                });
            }
            return dfd.promise();
        };
        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            $rootScope.listPropertieObjectModel.push(vis);

            function getEtiquetaNavegacion() {
                var _propiedades = _model;
                $scope.checkboxNavegacion = _propiedades.layout.navigation;
                $scope.etiquetaNavegacion = '';
                switch ($scope.checkboxNavegacion) {
                    case true:
                        $scope.etiquetaNavegacion = $scope.automatico;
                        break;
                    case false:
                        $scope.etiquetaNavegacion = $scope.desactivado;
                        break;
                    default:
                }
                setTimeout(() => { $scope.$apply($scope.checkboxNavegacion, $scope.etiquetaNavegacion) }, 0);
            }

            $scope.changeNavegacion = function () {
                var dataNavegacion = $('#checkboxNavegacion').prop('checked');
                $scope.checkboxNavegacion = dataNavegacion;
                switch ($scope.checkboxNavegacion) {
                    case true:
                        $scope.etiquetaNavegacion = $scope.automatico;
                        break;
                    case false:
                        $scope.etiquetaNavegacion = $scope.desactivado;
                        break;
                    default:
                }
                var _patches = [{
                    "qPath": "/navigation",
                    "qOp": "replace",
                    "qValue": JSON.stringify(dataNavegacion)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }


            function getShowLables(_idOject) {
                var _propiedades = _model;
                $scope.showLabel = _propiedades.layout.labels.mode;
                setTimeout(() => { $scope.$apply($scope.showLabel) }, 0);
            }

            $scope.changeLabel = function (_labelShow) {
                var _patches = [{
                    "qPath": "/labels/mode",
                    "qOp": "replace",
                    "qValue": JSON.stringify(_labelShow)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }

            function getResolution() {
                var _propiedades = _model;
                $scope.getNombreDimensionAlternativa(_propiedades.layout.qHyperCube.qDimensionInfo[0]).then(function (rest) {
                    var name = rest;
                    $scope.showCompressionResolution(name).then(function (res) {
                        $scope.isVisibleCompresionResolution = res;
                        var _resolution = _propiedades.layout.compressionResolution;
                        $("#slider-range-resolution").slider({
                            range: false,
                            min: 4,
                            max: 8,
                            values: [_resolution],
                            stop: function (event, ui) {
                                var _val = ui.value;
                                var _patches = [{
                                    "qPath": "/compressionResolution",
                                    "qOp": "replace",
                                    "qValue": JSON.stringify(_val)
                                }]
                                $scope.Patches.push(_patches);
                                $rootScope.$broadcast('_patches', _patches);
                                vis.model.applyPatches(_patches, true);

                            }
                        });

                    })
                })
            } 
            $scope.showCompressionResolution = (name) => {
                var defer = $q.defer();
                var u = 1e3;
                $scope.app.model.engineApp.createDimension(
                    {
                        "qInfo": {
                            "qId": "Dimension02",
                            "qType": "Dimension"
                        },
                        "qDim": {
                            "qGrouping": "N",
                            "qFieldDefs": [
                                name
                            ],
                            "qFieldLabels": [
                                name
                            ]
                        }
                    }
                ).then(function (qBook) {
                    qBook.qInfo.getLayout().then(function (res) {
                        defer.resolve(res && res.qDimInfos[0].qCardinal > u);
                    })
                })
                return defer.promise;
            }           
            function getBurbujas() {
                var _propiedades = _model;
                var ArrayMeasuresLength = _propiedades.layout.qHyperCube.qMeasureInfo;
                var MeasuresLength = ArrayMeasuresLength.length;
                if (MeasuresLength > 2) {
                    $scope.BubbleSizes = _propiedades.layout.dataPoint.rangeBubbleSizes;
                    $("#slider-range").slider({
                        range: true,
                        min: 1,
                        max: 20,
                        values: [$scope.BubbleSizes[0], $scope.BubbleSizes[1]],
                        stop: function (event, ui) {
                            var _val_1 = ui.values[0];
                            var _val_2 = ui.values[1];
                            var _patches = [{
                                "qPath": "/dataPoint/rangeBubbleSizes",
                                "qOp": "replace",
                                "qValue": "[" + _val_1 + "," + _val_2 + "]"
                            }]
                            $scope.Patches.push(_patches);
                            $rootScope.$broadcast('_patches', _patches);
                            vis.model.applyPatches(_patches, true);
                        }
                    });
                } else {
                    $scope.BubbleSizes = _propiedades.layout.dataPoint.bubbleSizes;
                    $("#slider-range").slider({
                        range: false,
                        max: 20,
                        values: [$scope.BubbleSizes],
                        stop: function (event, ui) {
                            var _val = ui.values;
                            var _patches = [{
                                "qPath": "/dataPoint/bubbleSizes",
                                "qOp": "replace",
                                "qValue": "[" + _val + "]"
                            }]
                            $scope.Patches.push(_patches);
                            $rootScope.$broadcast('_patches', _patches);
                            vis.model.applyPatches(_patches, true);
                        }
                    });
                }
            }



                        getEtiquetaNavegacion();
            getShowLables();
            getResolution();
            getBurbujas();
            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getEtiquetaNavegacion();
                    getShowLables();
                    getResolution();
                    getBurbujas();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });
        });
    }]);
    app.controller('boxplotProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {

        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        var _propiedades;

        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            _propiedades = _model;
            $rootScope.listPropertieObjectModel.push(vis);


            async function getOrientacion() {
                $scope.orientacion = _propiedades.layout.orientation;
                setTimeout(() => { $scope.$apply($scope.orientacion) }, 0);
            }

            $scope.changeOrientacion = async function (orientacion) {
                var _orientacion = orientacion;
                if (_orientacion == $scope.orientacion) {
                    return false;
                } else {
                    var _patches = [{
                        "qPath": "/orientation",
                        "qOp": "replace",
                        "qValue": JSON.stringify(_orientacion)
                    }]
                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function () {
                        $scope.orientacion = _orientacion;
                    });
                }
            }


            async function getValoresExtremos() {
                $scope.valoresExtremos = _propiedades.layout.boxplotDef.elements.outliers.include;
                setTimeout(() => { $scope.$apply($scope.valoresExtremos) }, 0);
            }

            $scope.changeValoresExtremos = async function () {
                var isValorextremo = $('#valoresExtremos').prop('checked');
                var _patches = [{
                    "qPath": "/boxplotDef/elements/outliers/include",
                    "qOp": "replace",
                    "qValue": JSON.stringify(isValorextremo)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }



            getValoresExtremos();
            getOrientacion();
            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getValoresExtremos();
                    getOrientacion();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });
        });
    }]);
    app.controller('treemapProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {

        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        var _propiedades;

        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            _propiedades = _model;
            $rootScope.listPropertieObjectModel.push(vis);

            function LabelsSettingsConfi() {
                var defer = $q.defer();
                var arrayLabelsSettings = _propiedades.layout.labels;
                defer.resolve(arrayLabelsSettings);
                return defer.promise;
            }

            async function getLabelsSettingsConfi() {
                LabelsSettingsConfi().then(function (result) {
                    $scope.cabeceras = result.auto;
                    $scope.headers = result.headers;
                    $scope.overlay = result.overlay;
                    $scope.leaves = result.leaves;
                    $scope.values = result.values;

                    $scope.isVisibleCabeceras = !$scope.cabeceras;
                    switch ($scope.cabeceras) {
                        case true:
                            $scope.textCabeceras = $scope.automatico;
                            break;
                        case false:
                            $scope.textCabeceras = $scope.personalizado;
                            break;
                    };

                    switch ($scope.headers) {
                        case true:
                            $scope.textHeaders = $scope.automatico;
                            break;
                        case false:
                            $scope.textHeaders = $scope.desactivado;
                            break;
                    };
                    switch ($scope.overlay) {
                        case true:
                            $scope.textOverlay = $scope.automatico;
                            break;
                        case false:
                            $scope.textOverlay = $scope.desactivado;
                            break;
                    }
                    $scope.isVisibleEtiquetas = $scope.leaves;
                    switch ($scope.leaves) {
                        case true:
                            $scope.textLeaves = $scope.automatico;
                            break;
                        case false:
                            $scope.textLeaves = $scope.desactivado;
                            break;
                    }

                    $scope.etiquetas = $scope.values;
                    switch ($scope.etiquetas) {
                        case true:
                            $scope.textEtiquetas = $scope.automatico;
                            break;
                        case false:
                            $scope.textEtiquetas = $scope.desactivado;
                            break;
                    }

                    setTimeout(() => { $scope.$apply(
                        $scope.cabeceras,
                        $scope.headers,
                        $scope.overlay,
                        $scope.leaves,
                        $scope.values,
                        $scope.isVisibleCabeceras,
                        $scope.isVisibleEtiquetas,
                        $scope.etiquetas,
                        $scope.textCabeceras,
                        $scope.textHeaders,
                        $scope.textOverlay,
                        $scope.textLeaves,
                        $scope.textEtiquetas
                        )}, 0);
                })
            }

            $scope.changeCabeceras = function ($event) {
                var element = $event.currentTarget;
                var _show = $(element).prop('checked');
                switch (_show) {
                    case true:
                        $scope.textCabeceras = $scope.automatico;
                        $scope.isVisibleCabeceras = false;
                        break;
                    case false:
                        $scope.textCabeceras = $scope.personalizado;
                        $scope.isVisibleCabeceras = true;
                        break;
                }
                var _patches = [{
                    "qPath": "/labels/auto",
                    "qOp": "replace",
                    "qValue": JSON.stringify(_show)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }

            $scope.changeHeaders = function ($event) {
                var element = $event.currentTarget;
                var _show = $(element).prop('checked');
                switch (_show) {
                    case true:
                        $scope.textHeaders = $scope.automatico;
                        break;
                    case false:
                        $scope.textHeaders = $scope.desactivado;
                        break;
                }
                var _patches = [{
                    "qPath": "/labels/headers",
                    "qOp": "replace",
                    "qValue": JSON.stringify(_show)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }

            $scope.changeOverlay = function ($event) {
                var element = $event.currentTarget;
                var _show = $(element).prop('checked');
                switch (_show) {
                    case true:
                        $scope.textOverlay = $scope.automatico;
                        break;
                    case false:
                        $scope.textOverlay = $scope.desactivado;
                        break;
                }
                var _patches = [{
                    "qPath": "/labels/overlay",
                    "qOp": "replace",
                    "qValue": JSON.stringify(_show)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }

            $scope.changeLeaves = function ($event) {
                var element = $event.currentTarget;
                var _show = $(element).prop('checked');
                switch (_show) {
                    case true:
                        $scope.textLeaves = $scope.automatico;
                        $scope.isVisibleEtiquetas = true;
                        break;
                    case false:
                        $scope.textLeaves = $scope.desactivado;
                        $scope.isVisibleEtiquetas = false;
                        break;
                }
                var _patches = [{
                    "qPath": "/labels/leaves",
                    "qOp": "replace",
                    "qValue": JSON.stringify(_show)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }


            $scope.changeEtiquetas = function ($event) {
                var element = $event.currentTarget;
                var _show = $(element).prop('checked');
                switch (_show) {
                    case true:
                        $scope.textEtiquetas = $scope.automatico;
                        break;
                    case false:
                        $scope.textEtiquetas = $scope.desactivado;
                        break;
                }
                var _patches = [{
                    "qPath": "/labels/values",
                    "qOp": "replace",
                    "qValue": JSON.stringify(_show)
                }]
                $scope.Patches.push(_patches);
                $rootScope.$broadcast('_patches', _patches);
                vis.model.applyPatches(_patches, true);
            }

            getLabelsSettingsConfi();
            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getLabelsSettingsConfi();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });
        });
    }]);
    app.controller('bulletchartProperties', ['$q', '$scope', '$rootScope', '$translate', function ($q, $scope, $rootScope, $translate) {

        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        $scope.app = $rootScope._thisCurrentApp;
        $scope.Patches = [];
        var _model;
        var vis;
        var _propiedades;

        $scope.app.visualization.get($rootScope.OBJECTIDORIGINPROPERTIES).then(function (viz) {
            vis = viz;
            _model = vis.model;
            _propiedades = _model;
            $rootScope.listPropertieObjectModel.push(vis);

            $scope.orientacion = '';
            function getOrientacion() {
                $scope.orientacion = _propiedades.layout.orientation;
                setTimeout(() => { $scope.$apply($scope.orientacion) }, 0);
            }
            $scope.changeOrientacion = function (orientacion) {
                var tipoFormato = orientacion;
                if (tipoFormato == $scope.orientacion) {
                    return false;
                } else {
                    var _patches = [{
                        "qPath": "/orientation",
                        "qOp": "replace",
                        "qValue": JSON.stringify(tipoFormato)
                    }];
                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(function () {
                        $scope.orientacion = orientacion;
                        setTimeout(() => { $scope.$apply($scope.orientacion) }, 0);
                    });
                }
            };
            async function getEtiquetaValores() {
                $scope.showEtiquetaValores = _propiedades.layout.dataPoint.showLabels;
                $scope.etiquetaValoresLabel = '';
                switch ($scope.showEtiquetaValores) {
                    case true:
                        $scope.etiquetaValoresLabel = $scope.automatico;
                        break;
                    case false:
                        $scope.etiquetaValoresLabel = $scope.desactivado;
                        break;
                    default:
                }
                setTimeout(() => { $scope.$apply($scope.showEtiquetaValores, $scope.etiquetaValoresLabel) }, 0);
            }

            $scope.changeEtiquetaValores = function (event, showEtiquetaValores) {                
                var dataEtiquetaValores = showEtiquetaValores;
                switch (dataEtiquetaValores) {
                    case true:
                        $scope.etiquetaValoresLabel = $scope.automatico;
                        break;
                    case false:
                        $scope.etiquetaValoresLabel = $scope.desactivado;
                        break;
                    default:
                }
                    var _patches = [{
                        "qPath": "/dataPoint/showLabels",
                        "qOp": "replace",
                        "qValue": JSON.stringify(dataEtiquetaValores)
                    }];
                    $scope.Patches.push(_patches);
                    $rootScope.$broadcast('_patches', _patches);
                    vis.model.applyPatches(_patches, true).then(()=>{
                        setTimeout(() => { $scope.$apply($scope.etiquetaValoresLabel) }, 0);
                    });    
            };

            getEtiquetaValores();
            getOrientacion();
            var deregister = $scope.$on("_Init_patches", function (evt, data) {
                setTimeout(() => {
                    getEtiquetaValores();
                    getOrientacion();
                }, 300);
            });
            $scope.$on('$destroy', function destroyScope() {
                deregister();
            });
        });
    }]);




    });