var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore',
], function (qlik, app, us) {
    app.controller('boxplotCtrl', ['$scope', '$rootScope', '$q', '$translate', 'orderByFilter', function ($scope, $rootScope, $q, $translate, orderBy) {
        $scope.labelRegExp = new RegExp("^='|'$", "g");
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
                console.log(_model);
                $scope.ARRDIMENSIONS = _model.boxplotDef.qHyperCubeDef.qDimensions;
                if (_model.boxplotDef.qHyperCubeDef.qLayoutExclude) {
                    $scope.ARRDIMENSIONSALTERNATIVES = _model.boxplotDef.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions;
                    $scope.ALLDIMENSIONS = $scope.ARRDIMENSIONS.concat($scope.ARRDIMENSIONSALTERNATIVES);
                } else {
                    $scope.ALLDIMENSIONS = $scope.ARRDIMENSIONS
                }


                $scope.ARRMEASURES = _model.boxplotDef.qHyperCubeDef.qMeasures;
                if (_model.boxplotDef.qHyperCubeDef.qLayoutExclude) {
                    $scope.ARRMEASURESALTERNATIVES = _model.boxplotDef.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qMeasures;
                    $scope.ALLMEASURES = $scope.ARRMEASURES.concat($scope.ARRMEASURESALTERNATIVES);
                } else {
                    $scope.ALLMEASURES = $scope.ARRMEASURES
                }


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
                        var arrayDimensiones = _model.boxplotDef.qHyperCubeDef.qDimensions;
                        var numDimensionesAlternativas = _model.boxplotDef.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _model.boxplotDef.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions.length : 0;

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
                                var arrayDimensionesAlternativas = _propiedades.boxplotDef.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _propiedades.boxplotDef.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions : '';
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
                                "qPath": "/boxplotDef/qHyperCubeDef/qDimensions/" + dimension.index,
                                "qOp": "replace",
                                "qValue": JSON.stringify(dimensionAlternativa.DATOS)
                            },
                            {
                                "qPath": "/boxplotDef/qHyperCubeDef/qLayoutExclude/qHyperCubeDef/qDimensions/" + dimensionAlternativa.index,
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
                        $scope.$apply($scope.arrDimensiones);
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
                                            "qPath": "/boxplotDef/qHyperCubeDef/qDimensions/" + i,
                                            "qOp": "replace",
                                            "qValue": JSON.stringify(value.DATOS)
                                        }
                                    ]
                                    $scope.Patches.push(_patches);
                                    vis.model.applyPatches(_patches, true).then(function () {
                                        qBook.getEffectiveProperties().then(function (i) {
                                            var _propiedades = i;
                                            var currentDimensiones = _propiedades.boxplotDef.qHyperCubeDef.qDimensions;
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
                    }, 300);
                }
                asyncCallGetLisDimensions();




                function getMedidas() {
                    return new Promise(resolve => {
                        var arrayMeasures = _model.boxplotDef.qHyperCubeDef.qMeasures;
                        var numMeasuresAlternativas = _model.boxplotDef.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _model.boxplotDef.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qMeasures.length : 0;


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
                                var arrayMeasuresAlternativas = _propiedades.boxplotDef.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _propiedades.boxplotDef.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qMeasures : '';
                                $scope.arrMeasuresAlternativas = [];

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
                                "qPath": "/boxplotDef/qHyperCubeDef/qMeasures/" + medida.index,
                                "qOp": "replace",
                                "qValue": JSON.stringify(medidaAlternativa.DATOS)
                            },
                            {
                                "qPath": "/boxplotDef/qHyperCubeDef/qLayoutExclude/qHyperCubeDef/qMeasures/" + medidaAlternativa.index,
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
                        console.log($scope.arrMeasures)
                        setTimeout(() => { $scope.$apply($scope.arrMeasures); $scope.$digest(); }, 50);
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
                                            "qPath": "/boxplotDef/qHyperCubeDef/qMeasures/" + i,
                                            "qOp": "replace",
                                            "qValue": JSON.stringify(value.DATOS)
                                        }
                                    ]

                                    $scope.Patches.push(_patches);
                                    vis.model.applyPatches(_patches, true).then(function () {
                                        $scope.rebuild();
                                        qBook.getEffectiveProperties().then(function (i) {
                                            var _propiedades = i;
                                            var currentMeasures = _propiedades.boxplotDef.qHyperCubeDef.qMeasures;
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
                    }, 300);
                }
                asyncCallGetListMedidas();




                function resetShowAlternatives() {
                    return new Promise(resolve => {
                        angular.forEach($scope.arrDimensiones, function (value, key) {
                            $scope.arrDimensiones[key].showAlternatives = false;
                        });
                        angular.forEach($scope.arrMeasures, function (value, key) {
                            $scope.arrMeasures[key].showAlternatives = false;
                        });
                        resolve(true);
                    })
                }

                function getValue() {
                    return new Promise(resolve => {
                        $scope.app.model.engineApp.getObject(
                            {
                                "qId": $rootScope.OBJECTIDORIGIN
                            }
                        ).then(function (qBook) {
                            qBook.getEffectiveProperties().then(function (res) {
                                resolve(res.qUndoExclude.box.qHyperCubeDef.qDimensions[0].qDef.qSortCriterias[0]);
                            })
                        })
                    })
                }

                function askSortCriterias() {
                    return new Promise(resolve => {
                        getValue().then(function (result) {
                            var r = {
                                sortingBy: "",
                                orderBy: "",
                                sortingStr: ''
                            };
                            if (result.hasOwnProperty('qExpression') && result.qExpression !== 0) {
                                r.sortingBy = "qExpression";
                                r.orderBy = result.qExpression;
                                r.sortingStr = 'sortByExpression';
                            } else if (result.hasOwnProperty('qSortByNumeric') && result.qSortByNumeric !== 0) {
                                r.sortingBy = "qSortByNumeric";
                                r.orderBy = result.qSortByNumeric;
                                r.sortingStr = 'sortByNumeric';
                            } else if (result.hasOwnProperty('qSortByAscii') && result.qSortByAscii !== 0) {
                                r.sortingBy = "qSortByAscii";
                                r.orderBy = result.qSortByAscii;
                                r.sortingStr = 'sortByAscii';
                            } else {
                                r.sortingBy = "qSortByAscii";
                                r.orderBy = 0;
                                r.sortingStr = 'sortByAscii';

                            }
                            resolve(r)
                        });
                    })

                }

                function getDimensionOrden() {
                    return new Promise(resolve => {
                        $scope.app.model.engineApp.getObject(
                            {
                                "qId": $rootScope.OBJECTIDORIGIN
                            }
                        ).then(function (qBook) {
                            qBook.getEffectiveProperties().then(function (res) {
                                var _propiedades = res;
                                var showOrdenacion = _propiedades.boxplotDef.qHyperCubeDef.qDimensions.length > 1 ? true : false;
                                var _autoSort = _propiedades.boxplotDef.sorting.autoSort;
                                var sortingCriterias = _propiedades.boxplotDef.sorting.sortCriteria || '';
                                var dimensionCriterias = _propiedades.qUndoExclude.box.qHyperCubeDef.qDimensions[0].qDef.qSortCriterias[0];
                                $scope.dimensionCriterias = dimensionCriterias;
                                var _sortingBy = '';
                                var _sortingStr = '';
                                var orderBy = '';
                                if (dimensionCriterias.hasOwnProperty('sortByExpression') && dimensionCriterias.sortByExpression !== 0) {
                                    _sortingBy = "sortByExpression";
                                    orderBy = dimensionCriterias.sortByExpression;
                                } else if (dimensionCriterias.hasOwnProperty('qSortByNumeric') && dimensionCriterias.qSortByNumeric !== 0) {
                                    _sortingBy = "qSortByNumeric";
                                    orderBy = dimensionCriterias.qSortByNumeric;
                                } else if (dimensionCriterias.hasOwnProperty('qSortByAscii') && dimensionCriterias.qSortByAscii !== 0) {
                                    _sortingBy = "qSortByAscii";
                                    orderBy = dimensionCriterias.qSortByAscii;
                                } else {
                                    _sortingBy = "qSortByAscii";
                                    orderBy = 0;
                                }
                                resolve([showOrdenacion, orderBy, _autoSort, _sortingBy, sortingCriterias])
                            })
                        })
                    })
                }

                getDimensionOrden().then(function (result) {
                    if (result[0] != false) {
                        $scope.isOrdenable = true;
                        $scope.OrderBy = result[1];
                        $scope.AutoSort = result[2];
                        $scope.SortingBy = result[3];
                        $scope.SortCriterias = result[4];

                    } else {
                        $scope.isOrdenable = false;
                    }
                })

                $scope.changeOrden = function (val, autoSort, sortingBy) {
                    var _value = val;
                    var _autoSort = autoSort;

                    askSortCriterias().then(function (res) {
                        var _sortingBy = res.sortingBy;
                        var _sortingStr = res.sortingStr;
                        var r = $scope.dimensionCriterias;
                        $scope.setValue(r, "qExpression", $scope.SortCriterias.sortByExpression, _sortingBy, _value, _sortingStr);
                        $scope.setValue(r, "qSortByAscii", $scope.SortCriterias.sortByAscii, _sortingBy, _value, _sortingStr);
                        $scope.setValue(r, "qSortByNumeric", $scope.SortCriterias.sortByNumeric, _sortingBy, _value, _sortingStr);
                        $scope.setValue(r, "qSortByLoadOrder", $scope.SortCriterias.sortByLoadOrder, _sortingBy, _value, _sortingStr);
                    })
                }

                $scope.setValue = function (criterias, text, search, sortingBy, _value, sortingStr) {
                    var _qop = '';
                    var _patches = '';
                    if (sortingBy == text) {
                        qBook.getEffectiveProperties().then(function (i) {
                            var _propiedades = i;
                            var _autoSort = _propiedades.boxplotDef.sorting.autoSort;
                            if (_autoSort == true) {
                                var _elementId = 'elementId';
                                _patches = [
                                    {
                                        "qPath": "/boxplotDef/sorting/autoSort",
                                        "qOp": "replace",
                                        "qValue": JSON.stringify(false)
                                    }
                                    ,
                                    {
                                        "qPath": "/boxplotDef/sorting/elementId",
                                        "qOp": "add",
                                        "qValue": JSON.stringify(_elementId)
                                    }
                                ]
                            } else {
                                _patches = [
                                    {
                                        "qPath": "/boxplotDef/sorting/sortCriteria/" + sortingStr + "",
                                        "qOp": "replace",
                                        "qValue": JSON.stringify(_value)
                                    }
                                ]
                            }
                            console.log(_patches);
                            $scope.Patches.push(_patches);
                            vis.model.applyPatches(_patches, true)
                        })

                    }
                }

                getOrientacion().then(function (res) {
                    $scope.orientacion = res
                });

                function getOrientacion() {
                    return new Promise(resolve => {
                        var orientacion = _model.orientation;
                        resolve(orientacion);
                    })
                }

                $scope.changeOrientacion = function (orientacion) {
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
                        vis.model.applyPatches(_patches, true).then(function () {
                            $scope.orientacion = _orientacion;
                        });
                    }
                }


                function getValoresExtremos() {
                    return new Promise(resolve => {
                        var isExtremos;
                        isExtremos = _model.boxplotDef.elements.outliers.include;
                        resolve(isExtremos);
                    })
                }
                getValoresExtremos().then(function (res) {
                    $scope.valoresExtremos = res;
                })
                $scope.changeValoresExtremos = function () {
                    var isValorextremo = $('#valoresExtremos').prop('checked');
                    var _patches = [{
                        "qPath": "/boxplotDef/elements/outliers/include",
                        "qOp": "replace",
                        "qValue": JSON.stringify(isValorextremo)
                    }]
                    $scope.Patches.push(_patches);
                    vis.model.applyPatches(_patches, true);
                }

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
                }

                $scope.rebuild();

                $scope.clearPatchesModal = function () {
                    $scope.clearPatches();
                }

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

                }
                $scope.IsApplying = function ($event) {
                    $event.stopPropagation();
                    $scope.applying = true;
                    var dlgElem = angular.element("#modalDlg");
                    if (dlgElem) {
                        dlgElem.modal("hide");
                    }
                }

                $scope.cancelConfirm = function ($event) {
                    $event.stopPropagation();
                    $scope.applying = false;
                }

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
                    })
                }

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
                }

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
                });
                setTimeout(function () {
                    $rootScope.getAltoAcordeon();
                }, 300)
            })
        })
    }]);
});