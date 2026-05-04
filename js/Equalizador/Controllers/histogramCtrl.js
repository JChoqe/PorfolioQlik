

var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore'
], function (qlik, app, us) {
    app.controller('histogramCtrl', ['$scope', '$rootScope', '$q', '$translate', 'orderByFilter', function ($scope, $rootScope, $q, $translate, orderBy) {
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
                var _model = res;

                $scope.ARRDIMENSIONS = _model.qHyperCubeDef.qDimensions;
                $scope.ARRDIMENSIONSALTERNATIVES = _model.qHyperCubeDef.hasOwnProperty('qLayoutExclude') ? _model.qHyperCubeDef.qLayoutExclude.qHyperCubeDef.qDimensions : '';
                $scope.ARRDIMENSIONSALTERNATIVES.length > 0 ? $scope.ALLDIMENSIONS = $scope.ARRDIMENSIONS.concat($scope.ARRDIMENSIONSALTERNATIVES) : $scope.ALLDIMENSIONS = $scope.ARRDIMENSIONS;



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
                        setTimeout(() => {$scope.$apply($scope.arrDimensiones); $scope.$digest();}, 300);
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





