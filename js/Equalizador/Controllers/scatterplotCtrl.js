
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore'
], function (qlik, app, us) {
    app.controller('scatterplotCtrl', ['$scope', '$rootScope', '$q', '$translate', 'orderByFilter', function ($scope, $rootScope, $q, $translate, orderBy) {
        $scope.labelRegExp = new RegExp("^='|'$", "g");
        $translate.onReady(function () {
            $scope.automatico = $translate.instant('equalizer.label.automatico');
            $scope.desactivado = $translate.instant('equalizer.label.desactivado');
            $scope.activado = $translate.instant('equalizer.label.activado');
        });
        qlik.on("error", function (error) {
            if (error.code == 8) {
                $translate('equalizer.modal.errormensaje').then(function (translation) {
                    $scope.errormensaje = translation;
                    $translate('equalizer.btn.cerrar').then(function (translation) {
                        $scope.cerrar = translation;
                        var customModal = $('<div id="custom-modal" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">' + error.message + '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><h3>' + $scope.errormensaje + '</h3></div><div class="modal-footer"><button class="btn btn-default close-error" type="button" data-dismiss="modal">' + $scope.cerrar + '</button></div></div></div></div>')
                        $('body').append(customModal);
                        var dlgElem = angular.element("#custom-modal");
                        if (dlgElem) {
                            dlgElem.modal("show");
                        }
                    });
                });
            }
            $(document).on('click', '.close-error', function () {
                $scope.clearPatches();
            });
        });

        $scope.blockEquializador = false;
        var _idObject = $rootScope.OBJECTID;
        $scope.app = $rootScope.APPEQUALIZER || $rootScope._thisCurrentApp;

        $scope.Patches = [];
        $scope.hasChanged = false;
        $scope.applying = false;
        $scope.canSave = false;
        $scope.closeEqualizador = function () {
            $rootScope.APPEQUALIZER = '';
            if ($scope.canSave == false) {
                $scope.AddStoragePatches();
                $('#box_equalizador').removeClass('active');
                setTimeout(function () {
                    $('#box_equalizador').empty();
                    $('body').removeClass('open-equalizador');
                    qlik.resize();
                }, 300);
            } else {
                if ($scope.Patches.length > 0) {
                    var dlgElem = angular.element("#modalDlg");
                    if (dlgElem) {
                        dlgElem.modal("show");
                    }
                } else {
                    $('#box_equalizador').removeClass('active');
                    setTimeout(function () {
                        $('#box_equalizador').empty();
                        $('body').removeClass('open-equalizador');
                        qlik.resize();
                    }, 300);
                }
            }
            $rootScope.clearObjectEqualizer();
        };



        $scope.app.model.engineApp.getObject(
            {
                "qId": $rootScope.OBJECTIDORIGIN
            }
        ).then(function (qBook) {
            qBook.getEffectiveProperties().then(function (res) {
                $scope.sortableDimensionsOptions = {};
                $scope.sortableMeasuresOptions = {};
                $scope.sortableOrdenOptions = {};

                var _model = res;
                $scope.MODEL = _model;
                $scope.ARRDIMENSIONS = _model.qHyperCubeDef.qDimensions;
                $scope.ARRDIMENSIONSALTERNATIVES = _model.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _model.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions : '';
                $scope.ARRDIMENSIONSALTERNATIVES.length > 0 ? $scope.ALLDIMENSIONS = $scope.ARRDIMENSIONS.concat($scope.ARRDIMENSIONSALTERNATIVES) : $scope.ALLDIMENSIONS = $scope.ARRDIMENSIONS;



                $scope.ARRMEASURES = _model.qHyperCubeDef.qMeasures;
                $scope.ARRMEASURESALTERNATIVES = _model.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _model.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qMeasures : '';
                $scope.ARRMEASURESALTERNATIVES.length > 0 ? $scope.ALLMEASURES = $scope.ARRMEASURES.concat($scope.ARRMEASURESALTERNATIVES) : $scope.ALLMEASURES = $scope.ARRMEASURES;


                if (sessionStorage.length > 0) {
                    if (sessionStorage["Object" + $rootScope.OBJECTIDORIGIN]) {
                        $scope.Patches = JSON.parse(sessionStorage.getItem("Object" + $rootScope.OBJECTIDORIGIN));
                        $scope.hasChanged = true;
                    }
                }

                var vis;
                $scope.app.visualization.get($rootScope.OBJECTIDORIGIN).then(function (viz) {
                    vis = viz;
                });

                function getDimensions() {
                    return new Promise(resolve => {
                        var arrayDimensiones = _model.qHyperCubeDef.qDimensions;
                        var numDimensionesAlternativas = _model.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _model.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions.length : 0;

                        $scope.expandibleDimensions = false;

                        if (numDimensionesAlternativas > 0) {
                            $scope.expandibleDimensions = true;
                        }

                        var listDimensiones = [];
                        arrayDimensiones.forEach(function (value, i) {
                            $rootScope.getNombreDimensionAlternativa(value).then(function (rest) {
                                var $dim = $scope.ALLDIMENSIONS.filter(obj => {
                                    if (obj.qDef.cId == value.qDef.cId) {
                                        return obj;
                                    }
                                });
                                var v = {};
                                v.init = false;
                                v.orden = arrayDimensiones.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                v.index = arrayDimensiones.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                v.active = '';
                                v.sortable = value.qDef.autoSort;
                                v.iconSortable = arrayDimensiones.length > 1 ? true : false;
                                v.showAlternatives = false;
                                v.name = rest;
                                v.id = value.qDef.cId;
                                v.isField = true;
                                v.uniqueId = $rootScope.randomString(20, '');
                                v.DATOS = $dim[0]
                                listDimensiones.push(v);
                            })
                        })
                        setTimeout(() => {
                            resolve(listDimensiones)
                        }, 600);
                    })
                }

                function getDimensionsAlternativas(item) {
                    return new Promise(resolve => {
                        $scope.app.model.engineApp.getObject(
                            {
                                "qId": $rootScope.OBJECTIDORIGIN
                            }
                        ).then(function (qBook) {
                            qBook.getEffectiveProperties().then(function (res) {
                                var arrAlt = [];
                                var _propiedades = res;
                                var arrayDimensionesAlternativas = _propiedades.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _propiedades.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions : '';
                                $scope.arrDimensionesAlternativas = [];

                                var v = {};
                                v.active = true;
                                v.orden = -1;
                                v.index = item.index;
                                v.sortable = item.sortable;
                                v.iconSortable = item.iconSortable;
                                v.showAlternatives = item.showAlternatives;
                                v.name = item.name;
                                v.id = item.id;
                                v.isField = item.isField;
                                v.uniqueId = $rootScope.randomString(20, '');
                                v.DATOS = item.DATOS;
                                arrAlt.push(v);
                                angular.forEach(arrayDimensionesAlternativas, function (value, i) {
                                    $rootScope.getNombreDimensionAlternativa(value).then(function (rest) {
                                        var $dim = $scope.ALLDIMENSIONS.filter(obj => {
                                            if (obj.qDef.cId == value.qDef.cId) {
                                                return obj;
                                            }
                                        })
                                        var v = {};
                                        v.orden = arrayDimensionesAlternativas.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                        v.index = arrayDimensionesAlternativas.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                        v.active = '';
                                        v.sortable = value.qDef.autoSort;
                                        v.iconSortable = $scope.arrDimensiones.length > 1 ? true : false;
                                        v.showAlternatives = false;
                                        v.name = rest;
                                        v.id = value.qDef.cId;
                                        v.isField = true;
                                        v.uniqueId = $rootScope.randomString(20, '');
                                        v.DATOS = $dim[0];
                                        arrAlt.push(v);
                                    })
                                })
                                setTimeout(() => {
                                    resolve(arrAlt);
                                }, 600);
                            })
                        })
                    })
                }
                $scope.dimensionCliked = function (event, item) {
                    if (item.showAlternatives == true) {
                        item.showAlternatives = false;
                    } else {
                        item.init = true;
                        getDimensionsAlternativas(item).then(function (res) {
                            $scope.arrDimensionesAlternativas = res;
                            resetShowAlternatives().then(function (rest) {
                                item.init = false;
                                item.showAlternatives = item.showAlternatives === false ? true : false;
                                setTimeout(function () {
                                    $scope.$apply($scope.arrDimensionesAlternativas);
                                }, 100);
                            })
                        })
                    }
                }

                $scope.alternativeDimensionItemClicked = function ($event, dimension, dimensionAlternativa) {
                    if (!dimensionAlternativa.active) {
                        $scope.blockEquializador = true;
                        var _patches = [
                            {
                                "qPath": "/qHyperCubeDef/qDimensions/" + dimension.index,
                                "qOp": "replace",
                                "qValue": JSON.stringify(dimensionAlternativa.DATOS)
                            },
                            {
                                "qPath": "/qHyperCubeDef/qLayoutExclude/qHyperCubeDef/qDimensions/" + dimensionAlternativa.index,
                                "qOp": "replace",
                                "qValue": JSON.stringify(dimension.DATOS)
                            }
                        ]

                        $scope.Patches.push(_patches);
                        vis.model.applyPatches(_patches, true).then(function () {
                            angular.forEach($scope.arrDimensionesAlternativas, function (value, key) {
                                $scope.arrDimensionesAlternativas[key].active = false;
                            })

                            dimensionAlternativa.active = true;

                            actualizaIndexDimension(dimensionAlternativa.index, dimensionAlternativa.id, dimension.index, dimension.id).then(function (res) {
                                dimension.orden = dimensionAlternativa.orden;
                                dimension.sortable = dimensionAlternativa.sortable;
                                dimension.iconSortable = dimensionAlternativa.iconSortable;
                                dimension.name = dimensionAlternativa.name;
                                dimension.id = dimensionAlternativa.id;
                                dimension.isField = dimensionAlternativa.isField;
                                dimension.DATOS = dimensionAlternativa.DATOS;
                                dimension.active = false;
                                $scope.blockEquializador = false;
                            })
                        });
                    } else {
                        return false;
                    }
                }
                function actualizaIndexDimension(indexAlt, cIdAlt, index, cId) {
                    return new Promise(resolve => {
                        var _dimensionIndex = $scope.arrDimensionesAlternativas.map(function (e) { return e.id; }).indexOf(cId);
                        var _dimensionAlternativeIndex = $scope.arrDimensionesAlternativas.map(function (e) { return e.id; }).indexOf(cIdAlt);
                        $scope.arrDimensionesAlternativas[_dimensionIndex].index = indexAlt;
                        $scope.arrDimensionesAlternativas[_dimensionAlternativeIndex].index = index;
                        resolve(_dimensionAlternativeIndex)
                    })
                }
                async function asyncCallGetLisDimensions() {
                    const result = await getDimensions();
                    setTimeout(() => {
                        $scope.arrDimensiones = [];
                        $scope.arrDimensiones = orderBy(result, 'index', false);
                        setTimeout(() => { $scope.$apply($scope.arrDimensiones); $scope.$digest(); }, 300);
                        $scope.sortableDimensionsOptions = {
                            "forcePlaceholderSize": false,
                            "forceHelperSize": true,
                            "placeholder": "sortable-placeholder",
                            "axis": "y",
                            "cursor": "move",
                            "containment": "parent",
                            "distance": 10,
                            "revert": true,
                            "tolerance": "pointer",
                            "opacity": 1,
                            "items": "li:not(.noSort)",
                            "helper": function (e, item) {
                                var _clone = item.clone();
                                _clone = $(_clone).find('.mz-list_header-title').html();
                                _clone = '<li class="itemClone"><div class="mz-list_header-title">' + _clone + '</div></li>';
                                return _clone;
                            },
                            start: function (event, ui) {
                                var _placeholder = ui.item;
                                _placeholder = $(_placeholder).find('.mz-list_header-title').html();
                                _placeholder = '<li class="itemClone"><div class="mz-list_header-title">' + _placeholder + '</div></li>';
                                ui.placeholder.html(_placeholder);
                                angular.forEach($scope.arrDimensiones, function (value, key) {
                                    $scope.arrDimensiones[key].showAlternatives = false;
                                    $scope.rebuild();
                                });
                            },
                            stop: function (event, ui) {
                                var _new_orden_list = [];
                                $("#sortableListDimensiones > li.itemDimension").each(function (index) {
                                    var _thisItem = $(this).attr('data-item');
                                    _new_orden_list.push(angular.fromJson(_thisItem));
                                });
                                _new_orden_list.forEach(function (value, i) {
                                    var _patches = [
                                        {
                                            "qPath": "/qHyperCubeDef/qDimensions/" + i,
                                            "qOp": "replace",
                                            "qValue": JSON.stringify(value.DATOS)
                                        }
                                    ]
                                    $scope.Patches.push(_patches);
                                    vis.model.applyPatches(_patches, true).then(function () {
                                        qBook.getEffectiveProperties().then(function (i) {
                                            var _propiedades = i;
                                            var currentDimensiones = _propiedades.qHyperCubeDef.qDimensions;
                                            currentDimensiones.forEach(function (value, i) {
                                                var $index = currentDimensiones.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                                var $oldIndex = $scope.arrDimensiones.map(function (e) { return e.id; }).indexOf(value.qDef.cId);
                                                $scope.arrDimensiones[$oldIndex].index = $index;
                                                $scope.arrDimensiones[$oldIndex].orden = $index;
                                            })
                                            console.log($scope.arrDimensiones, 'Actualizadas');
                                        })
                                    }).catch(function (e) {
                                        console.log(e)
                                    });
                                });

                            }
                        }
                        if ($scope.arrDimensiones.length < 2) {
                            $scope.sortableDimensionsOptions = {
                                disabled: true
                            };
                        }
                    }, 600);
                }
                asyncCallGetLisDimensions();

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


                function getMedidas() {
                    return new Promise(resolve => {
                        var arrayMeasures = _model.qHyperCubeDef.qMeasures;
                        var numMeasuresAlternativas = _model.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _model.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qMeasures.length : 0;


                        $scope.expandibleMeasures = false;
                        if (numMeasuresAlternativas > 0) {
                            $scope.expandibleMeasures = true;
                        }
                        var listMeasures = [];
                        arrayMeasures.forEach(function (value, i) {
                            $rootScope.getNombreMeasureAlternativa(value).then(function (rest) {
                                var $Measure = $scope.ALLMEASURES.filter(obj => {
                                    if (obj.qDef.cId == value.qDef.cId) {
                                        return obj;
                                    }
                                });


                                var v = {};
                                v.init = false;
                                v.orden = arrayMeasures.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                v.index = arrayMeasures.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                v.active = '';
                                v.sortable = value.qDef.autoSort;
                                v.iconSortable = arrayMeasures.length > 1 ? true : false;
                                v.showAlternatives = false;
                                v.name = rest;
                                v.id = value.qDef.cId;
                                v.isField = true;
                                v.DATOS = $Measure[0];
                                v.uniqueId = $rootScope.randomString(20, '');
                                listMeasures.push(v);
                            })
                        })
                        setTimeout(() => {
                            resolve(listMeasures)
                        }, 600);

                    })
                }

                function getMeasuresAlternativas(item) {
                    return new Promise(resolve => {
                        $scope.app.model.engineApp.getObject(
                            {
                                "qId": $rootScope.OBJECTIDORIGIN
                            }
                        ).then(function (qBook) {
                            qBook.getEffectiveProperties().then(function (res) {
                                var arrAlt = [];
                                var _propiedades = res;
                                var arrayMeasuresAlternativas = _propiedades.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _propiedades.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qMeasures : '';
                                $scope.arrMeasuresAlternativas = [];

                                var v = {};
                                v.init = false;
                                v.active = true;
                                v.orden = -1;
                                v.index = item.index;
                                v.sortable = item.sortable;
                                v.iconSortable = item.iconSortable;
                                v.showAlternatives = item.showAlternatives;
                                v.name = item.name;
                                v.id = item.id;
                                v.isField = item.isField;
                                v.uniqueId = $rootScope.randomString(20, '');
                                v.DATOS = item.DATOS;
                                arrAlt.push(v);

                                angular.forEach(arrayMeasuresAlternativas, function (value, i) {
                                    $rootScope.getNombreMeasureAlternativa(value).then(function (rest) {
                                        var $Measure = $scope.ALLMEASURES.filter(obj => {
                                            if (obj.qDef.cId == value.qDef.cId) {
                                                return obj;
                                            }
                                        })

                                        var v = {};
                                        v.orden = arrayMeasuresAlternativas.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                        v.index = arrayMeasuresAlternativas.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                        v.active = '';
                                        v.sortable = value.qDef.autoSort;
                                        v.iconSortable = $scope.arrMeasures.length > 1 ? true : false;
                                        v.showAlternatives = false;
                                        v.name = rest;
                                        v.id = value.qDef.cId;
                                        v.isField = true;
                                        v.uniqueId = $rootScope.randomString(20, '');
                                        v.DATOS = $Measure[0];
                                        arrAlt.push(v);

                                    })
                                })
                                setTimeout(() => {
                                    resolve(arrAlt);
                                }, 600);

                            })
                        })
                    })
                }

                $scope.measuresCliked = function (event, item) {
                    if (item.showAlternatives == true) {
                        item.showAlternatives = false;
                    } else {
                        item.init = true;
                        getMeasuresAlternativas(item).then(function (res) {
                            $scope.arrMeasuresAlternativas = res;
                            resetShowAlternatives().then(function (rest) {
                                item.init = false;
                                item.showAlternatives = item.showAlternatives === false ? true : false;
                                setTimeout(() => {
                                    $scope.$apply($scope.arrMeasuresAlternativas);
                                }, 100);
                            })
                        })
                    }
                }

                $scope.alternativeMeasuresItemClicked = function ($event, medida, medidaAlternativa) {
                    if (!medidaAlternativa.active) {
                        $scope.blockEquializador = true;
                        var _patches = [
                            {
                                "qPath": "/qHyperCubeDef/qMeasures/" + medida.index,
                                "qOp": "replace",
                                "qValue": JSON.stringify(medidaAlternativa.DATOS)
                            },
                            {
                                "qPath": "/qHyperCubeDef/qLayoutExclude/qHyperCubeDef/qMeasures/" + medidaAlternativa.index,
                                "qOp": "replace",
                                "qValue": JSON.stringify(medida.DATOS)
                            }
                        ]


                        $scope.Patches.push(_patches);
                        vis.model.applyPatches(_patches, true).then(function () {
                            angular.forEach($scope.arrMeasuresAlternativas, function (value, key) {
                                $scope.arrMeasuresAlternativas[key].active = false;
                            })

                            medidaAlternativa.active = true;

                            actualizaIndexMeasure(medidaAlternativa.index, medidaAlternativa.id, medida.index, medida.id).then(function (res) {
                                medida.orden = medidaAlternativa.orden;
                                medida.sortable = medidaAlternativa.sortable;
                                medida.iconSortable = medidaAlternativa.iconSortable;
                                medida.showAlternatives = true;
                                medida.name = medidaAlternativa.name;
                                medida.id = medidaAlternativa.id;
                                medida.isField = medidaAlternativa.isField;
                                medida.DATOS = medidaAlternativa.DATOS;
                                medida.active = false;
                                $scope.blockEquializador = false;
                            })
                        });


                    } else {
                        return false;
                    }
                }
                function actualizaIndexMeasure(indexAlt, cIdAlt, index, cId) {
                    return new Promise(resolve => {
                        var _medidaIndex = $scope.arrMeasuresAlternativas.map(function (e) { return e.id; }).indexOf(cId);
                        var _medidaAlternativeIndex = $scope.arrMeasuresAlternativas.map(function (e) { return e.id; }).indexOf(cIdAlt);
                        $scope.arrMeasuresAlternativas[_medidaIndex].index = indexAlt;
                        $scope.arrMeasuresAlternativas[_medidaAlternativeIndex].index = index;
                        resolve(_medidaAlternativeIndex);
                    })
                }

                async function asyncCallGetListMedidas() {
                    const result = await getMedidas();
                    setTimeout(() => {
                        $scope.arrMeasures = [];
                        $scope.arrMeasures = orderBy(result, 'index', false);
                        setTimeout(() => { $scope.$apply($scope.arrMeasures); $scope.$digest(); }, 300);
                        $scope.sortableMeasuresOptions = {
                            "forcePlaceholderSize": true,
                            "placeholder": "sortable-placeholder",
                            "axis": "y",
                            "cursor": "move",
                            "containment": "parent",
                            "scrollSensitivity": 0,
                            "distance": 10,
                            "revert": true,
                            "tolerance": "pointer",
                            "opacity": 0.5,
                            "items": "li:not(.noSort)",
                            "helper": function (e, item) {
                                var _clone = item.clone();
                                _clone = $(_clone).find('.mz-list_header-title').html();
                                _clone = '<li class="itemClone"><div class="mz-list_header-title">' + _clone + '</div></li>';
                                return _clone;
                            },
                            start: function (event, ui) {
                                var _placeholder = ui.item;
                                _placeholder = $(_placeholder).find('.mz-list_header-title').html();
                                _placeholder = '<li class="itemClone"><div class="mz-list_header-title">' + _placeholder + '</div></li>';
                                ui.placeholder.html(_placeholder);
                                angular.forEach($scope.arrMeasures, function (value, key) {
                                    $scope.arrMeasures[key].showAlternatives = false;
                                    $scope.rebuild();
                                });
                            },
                            stop: function (event, ui) {
                                var _new_orden_list = [];

                                $("#sortableListMeasures > li.itemMeasure").each(function (index) {
                                    var _thisItem = $(this).attr('data-item');
                                    _new_orden_list.push(angular.fromJson(_thisItem));
                                });
                                _new_orden_list.forEach(function (value, i) {
                                    var _patches = [
                                        {
                                            "qPath": "/qHyperCubeDef/qMeasures/" + i,
                                            "qOp": "replace",
                                            "qValue": JSON.stringify(value.DATOS)
                                        }
                                    ]

                                    $scope.Patches.push(_patches);
                                    vis.model.applyPatches(_patches, true).then(function () {
                                        $scope.rebuild();
                                        qBook.getEffectiveProperties().then(function (i) {
                                            var _propiedades = i;
                                            var currentMeasures = _propiedades.qHyperCubeDef.qMeasures;
                                            currentMeasures.forEach(function (value, i) {
                                                var $index = currentMeasures.map(function (e) { return e.qDef.cId; }).indexOf(value.qDef.cId);
                                                var $oldIndex = $scope.arrMeasures.map(function (e) { return e.id; }).indexOf(value.qDef.cId);
                                                $scope.arrMeasures[$oldIndex].index = $index;
                                                $scope.arrMeasures[$oldIndex].orden = $index;
                                            })
                                        })
                                    });
                                });
                            }
                        }
                        if ($scope.arrMeasures.length < 2) {
                            $scope.sortableMeasuresOptions = {
                                disabled: true
                            };
                        }
                    }, 600);
                }
                asyncCallGetListMedidas();


                function resetShowAlternatives() {
                    var defer = $q.defer();
                    angular.forEach($scope.arrDimensiones, function (value, key) {
                        $scope.arrDimensiones[key].showAlternatives = false;
                    });
                    angular.forEach($scope.arrMeasures, function (value, key) {
                        $scope.arrMeasures[key].showAlternatives = false;
                    });

                    defer.resolve(true);
                    return defer.promise;
                }

                function getEtiquetaNavegacion() {
                    var _propiedades = _model;
                    $scope.checkboxNavegacion = _propiedades.navigation;
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
                    vis.model.applyPatches(_patches, true);
                }
                getEtiquetaNavegacion();

                function getShowLables(_idOject) {
                    var _propiedades = _model;
                    $scope.showLabel = _propiedades.labels.mode;
                }

                $scope.changeLabel = function (_labelShow) {
                    var _patches = [{
                        "qPath": "/labels/mode",
                        "qOp": "replace",
                        "qValue": JSON.stringify(_labelShow)
                    }]
                    $scope.Patches.push(_patches);
                    vis.model.applyPatches(_patches, true);
                }
                getShowLables();



                function getResolution() {
                    var _propiedades = _model;

                    $rootScope.getNombreDimensionAlternativa(_propiedades.qHyperCubeDef.qDimensions[0]).then(function (rest) {
                        var name = rest;
                        $scope.showCompressionResolution(name).then(function (res) {
                            $scope.isVisibleCompresionResolution = res;
                            var _resolution = _propiedades.compressionResolution;
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
                                    vis.model.applyPatches(_patches, true);

                                }
                            });

                        })
                    })




                }
                getResolution();

                function getBurbujas() {
                    var _propiedades = _model;
                    var ArrayMeasuresLength = _propiedades.qHyperCubeDef.qMeasures;
                    var MeasuresLength = ArrayMeasuresLength.length;
                    if (MeasuresLength > 2) {
                        $scope.BubbleSizes = _propiedades.dataPoint.rangeBubbleSizes;
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
                                vis.model.applyPatches(_patches, true);
                            }
                        });
                    } else {
                        $scope.BubbleSizes = _propiedades.dataPoint.bubbleSizes;
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
                                vis.model.applyPatches(_patches, true);
                            }
                        });
                    }
                }
                getBurbujas();

                function getColor() {
                    var _propiedades = _model;
                    $scope.checkColor;
                    $scope.colorBurbuja = _propiedades.color.mode;
                    $scope.modoColor = _propiedades.color.auto;
                    if ($scope.colorBurbuja == 'primary' && $scope.modoColor == true) {
                        $scope.checkColor = 'primary'
                    }
                    if ($scope.colorBurbuja == 'primary' && $scope.modoColor == false) {
                        $scope.checkColor = 'unico'
                    }
                    if ($scope.colorBurbuja == 'byDimension' && $scope.modoColor == false) {
                        $scope.checkColor = 'byDimension'
                    }
                    if ($scope.colorBurbuja == 'byMeasure' && $scope.modoColor == false) {
                        $scope.checkColor = 'byMeasure'
                    }
                }

                $scope.changeColor = function (colorMode) {
                    var _auto;
                    switch (colorMode) {
                        case 'primary':
                            _auto = true;
                            colorMode = 'primary';
                            break;
                        case 'unico':
                            _auto = false;
                            colorMode = 'primary';
                            break;
                        case 'byDimension':
                            _auto = false;
                            colorMode = 'byDimension';
                            break;
                        case 'byMeasure':
                            _auto = false;
                            colorMode = 'byMeasure';
                            break;
                    }



                    var _patches = [{
                        "qPath": "/color/mode",
                        "qOp": "replace",
                        "qValue": JSON.stringify(colorMode)
                    }]

                    var _patchesAuto = [{
                        "qPath": "/color/auto",
                        "qOp": "replace",
                        "qValue": JSON.stringify(_auto)
                    }]

                    $scope.Patches.push(_patches, _patchesAuto);
                    vis.model.applyPatches(_patches, true).then(function () {
                        vis.model.applyPatches(_patchesAuto, true)
                    });


                }
                getColor();

                function getLeyendas() {
                    var _propiedades = _model;
                    $scope.checkboxLeyendas = _propiedades.legend.show;
                    switch ($scope.checkboxLeyendas) {
                        case true:
                            $scope.showLeyendas = $scope.automatico;
                            break;
                        case false:
                            $scope.showLeyendas = $scope.desactivado;
                            break;
                        default:
                    }
                }

                $scope.changeLeyendas = function () {
                    var _legend = $('#checkboxLeyendas').prop('checked');

                    $scope.checkboxLeyendas = _legend;
                    switch ($scope.checkboxLeyendas) {
                        case true:
                            $scope.showLeyendas = $scope.automatico;
                            break;
                        case false:
                            $scope.showLeyendas = $scope.desactivado;
                            break;
                        default:
                    }


                    var _patches = [{
                        "qPath": "/legend/show",
                        "qOp": "replace",
                        "qValue": JSON.stringify(_legend)
                    }];
                    $scope.Patches.push(_patches);
                    vis.model.applyPatches(_patches, true);

                };

                $scope.posicionLeyenda = '';
                function getPosicionLeyenda() {
                    var _propiedades = _model;
                    $scope.posicionLeyenda = _propiedades.legend.dock;
                }

                $scope.cambiarPosicionLeyenda = function (valor) {
                    if (valor != null) {
                        var _position = valor;
                        var _patches = [{
                            "qPath": "/legend/dock",
                            "qOp": "replace",
                            "qValue": JSON.stringify(_position)
                        }];
                        $scope.Patches.push(_patches);
                        vis.model.applyPatches(_patches, true).then(function () {
                            $scope.posicionLeyenda = _position;
                        });
                    }
                };
                getLeyendas();
                getPosicionLeyenda();

                function getScalecolor() {
                    var _propiedades = _model;
                    $scope.value = _propiedades.color.measureScheme;
                    $scope.app.theme.getApplied().then(function (qtheme) {
                        $scope.arrayScales = [];
                        var arrayColors = qtheme.properties.scales;
                        angular.forEach(arrayColors, function (value, key) {
                            var item = {}
                            var _scale = value.scale;
                            _scale = _scale.filter(function (el) {
                                return el != null;
                            });
                            var stilo = '';
                            stilo = getBackground(_scale, "gradient" === value.type, true);
                            item.estilo = stilo;
                            item.name = value.name;
                            item.value = value.propertyValue;
                            $scope.arrayScales.push(item);
                        })
                    })

                }

                var o = "-moz-linear-gradient(left";
                var s = "-webkit-linear-gradient(left";
                var d = " -o-linear-gradient(left";
                var u = "-ms-linear-gradient(left";
                var f = "linear-gradient(to right";
                function getBackground(e, t, n) {
                    var i;
                    var a;
                    var r;
                    a = "";
                    r = ")";
                    if (n)
                        if (t)
                            for (i = e.length - 1; i >= 0; i--)
                                a += ", ".concat(e[i], " ").concat(100 / (e.length - 1) * (e.length - 1 - i), "%");
                        else
                            for (i = e.length - 1; i >= 0; i--) {
                                a += ", ".concat(e[i], " ").concat(100 / e.length * (e.length - 1 - i), "%");
                                a += ", ".concat(e[i], " ").concat(100 / e.length * (e.length - i), "%")
                            }
                    else if (t)
                        for (i = 0; i < e.length; i++)
                            a += ", ".concat(e[i], " ").concat(100 / (e.length - 1) * i, "%");
                    else
                        for (i = 0; i < e.length; i++) {
                            a += ", ".concat(e[i], " ").concat(100 / e.length * i, "%");
                            a += ", ".concat(e[i], " ").concat(100 / e.length * (i + 1), "%")
                        }
                    return "background:".concat(e[e.length / 2], "; background:").concat(o).concat(a).concat(r, "; background:").concat(s).concat(a).concat(r, "; background:").concat(d).concat(a).concat(r, "; background:").concat(u).concat(a).concat(r, "; background:").concat(f).concat(a).concat(r);
                }

                $scope.cambiaScale = function (item) {
                    var _scaleValue = item.value;
                    $scope.value = _scaleValue;
                    var _patches = [{
                        "qPath": "/color/measureScheme",
                        "qOp": "replace",
                        "qValue": JSON.stringify(_scaleValue)
                    }]
                    $scope.Patches.push(_patches);
                    vis.model.applyPatches(_patches, true);

                }

                getScalecolor();


                function getTitles() {
                    $scope.showTitles = _model.showTitles;
                    if (_model.title.hasOwnProperty('qStringExpression')) {
                        $rootScope.getTituloExpresion(_model.title.qStringExpression.qExpr).then(function (res) {
                            $scope.titleObject = res;
                        })
                    } else {
                        $scope.titleObject = _model.title;
                    }

                    if (_model.subtitle.hasOwnProperty('qStringExpression')) {
                        $rootScope.getTituloExpresion(_model.subtitle.qStringExpression.qExpr).then(function (res) {
                            $scope.subTitleObject = res;
                        })
                    } else {
                        $scope.subTitleObject = _model.subtitle;
                    }

                    if (_model.footnote.hasOwnProperty('qStringExpression')) {
                        $rootScope.getTituloExpresion(_model.footnote.qStringExpression.qExpr).then(function (res) {
                            $scope.footnoteObject = res;
                        })
                    } else {
                        $scope.footnoteObject = _model.footnote;
                    }

                    $scope.titulosLabel = '';
                    switch ($scope.showTitles) {
                        case true:
                            $scope.titulosLabel = $scope.activado;
                            break;
                        case false:
                            $scope.titulosLabel = $scope.desactivado;
                            break;
                        default:
                    }
                }

                $scope.changeShowTitles = function ($event, showTitles) {
                    var dataTitles = showTitles;
                    switch (dataTitles) {
                        case true:
                            $scope.titulosLabel = $scope.activado;
                            break;
                        case false:
                            $scope.titulosLabel = $scope.desactivado;
                            break;
                        default:
                    }
                    var _patches = [{
                        "qPath": "/showTitles",
                        "qOp": "replace",
                        "qValue": JSON.stringify(dataTitles)
                    }]
                    $scope.Patches.push(_patches);
                    vis.model.applyPatches(_patches, true);
                }

                $scope.changeTitle = function (valor) {
                    var Titles = valor;
                    $scope.titleObject = valor;
                    var _patches = [{
                        "qPath": "/title",
                        "qOp": "replace",
                        "qValue": JSON.stringify(Titles)
                    }]
                    $scope.Patches.push(_patches);
                    vis.model.applyPatches(_patches, true);
                }

                $scope.changeSubTitle = function (valor) {
                    var SubTitle = valor;
                    $scope.subTitleObject = valor;
                    var _patches = [{
                        "qPath": "/subtitle",
                        "qOp": "replace",
                        "qValue": JSON.stringify(SubTitle)
                    }]
                    $scope.Patches.push(_patches);
                    vis.model.applyPatches(_patches, true);

                }
                $scope.changeFootnote = function (valor) {
                    var Footnote = valor;
                    $scope.footnoteObject = valor;
                    var _patches = [{
                        "qPath": "/footnote",
                        "qOp": "replace",
                        "qValue": JSON.stringify(Footnote)
                    }]
                    $scope.Patches.push(_patches);
                    vis.model.applyPatches(_patches, true);
                }
                getTitles();

                $scope.rebuild = function () {
                    setTimeout(function () {
                        $scope.$apply();
                    }, 300);

                };
                $scope.rebuild();


                $scope.clearPatchesModal = function () {
                    $scope.clearPatches();
                };
                $scope.clearPatches = function () {
                    $scope.app.visualization.get($rootScope.OBJECTIDORIGIN).then(function (viz) {
                        $scope.Patches = [];
                        viz.model.clearSoftPatches().then(function () {
                            if (sessionStorage["Object" + $rootScope.OBJECTIDORIGIN]) {
                                sessionStorage.removeItem("Object" + $rootScope.OBJECTIDORIGIN);
                            }
                            $scope.closeEqualizador();
                        });
                    });
                }

                $scope.addPatchesModal = function ($event) {
                    $scope.addPatches();
                    setTimeout(function () {
                        $scope.closeEqualizador();
                    }, 400);

                };

                $scope.IsApplying = function ($event) {
                    $event.stopPropagation();
                    $scope.applying = true;
                    var dlgElem = angular.element("#modalDlg");
                    if (dlgElem) {
                        dlgElem.modal("hide");
                    }
                };

                $scope.cancelConfirm = function ($event) {
                    $event.stopPropagation();
                    $scope.applying = false;
                };

                $scope.addPatches = function ($event) {
                    $('body').append('<div class="flex-loader-cover"><div class="loaderEquializador">Loading...</div></div>');
                    var IDOBJECT = $rootScope.OBJECTID;
                    asyncpatches(IDOBJECT).then(function (res) {
                        $scope.app.doReload().then(function (result) {
                            $scope.app.doSave();
                            $scope.applying = false;
                            $scope.Patches = [];
                            $('.flex-loader-cover').remove();
                            $scope.closeEqualizador();
                        });
                    });
                };

                function asyncpatches(IDOBJECT) {
                    var defer = $q.defer();

                    $scope.app.visualization.get(IDOBJECT).then(function (vis) {
                        var _viz = vis;
                        var _count = 0;
                        angular.forEach($scope.Patches, function (value, key) {
                            _viz.model.applyPatches(value, false);
                            _count = key;
                        });
                        defer.resolve(_count);
                    });
                    return defer.promise;
                }

                $scope.checkPatches = function () {
                    if ($scope.Patches.length > 0) {
                        return false;
                    } else {
                        return true;
                    }
                };

                $scope.AddStoragePatches = function () {
                    if ($scope.Patches.length > 0) {
                        sessionStorage.setItem("Object" + $rootScope.OBJECTIDORIGIN, JSON.stringify($scope.Patches));
                    }
                };

                $scope.needToConfirm = false;
                window.onbeforeunload = askConfirm;
                function askConfirm() {
                    if ($scope.needToConfirm) {
                        return 'Estas seguro?';
                    }
                }

                $scope.$watchCollection('Patches', function (newValue, oldValue) {
                    if ($scope.canSave == true) {
                        if ($scope.Patches.length > 0) {
                            $scope.needToConfirm = true;
                        } else {
                            $scope.needToConfirm = false;
                        }
                    }
                }, true);


                $rootScope.getAltoAcordeon();
                $(window).resize(function () {
                    $rootScope.getAltoAcordeon();
                    qlik.resize(_idObject);
                });
            })
        })
    }]);
});