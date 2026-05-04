var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'extIncludeRoot/pdfmake/pdfmake.min',
    'extIncludeRoot/pdfmake/vfs_fonts',
    'extIncludeRoot/html2canvas.min',
    '../text!./_templates/template-add-state.html',
    '../text!./_templates/template-export-pdf.html',
    dir + 'js/Directives/compareobject/errorcontrol/errorcontrol.js'
], function (qlik, app, pdfmake, vfs_fonts, html2canvas, templateAddState, templateExportPdf) {
    app.directive('compareobject', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {
        return {
            restrict: 'E',
            replace: false,
            scope: false,
            templateUrl: 'js/Directives/compareobject/compareobject.html',
            link: function (scope, element, attrs) {
                scope.ObjectId = String(attrs.objectId).trim();
                var qvid = String(attrs.objectId).trim();
                scope.asyncCallGetObject(qvid);
            },
            controller: ['$injector', '$http', '$q', '$scope', '$rootScope', '$compile', '$attrs', 'compareobjectService', 'luiPopover', '$translate', '$state', '$element', 'luiDialog', function ($injector, $http, $q, $scope, $rootScope, $compile, $attrs, compareobjectService, luiPopover, $translate, $state, $element, luiDialog) {
                if (!$rootScope.InitCompare || $rootScope.InitCompare == false) {
                    $rootScope.InitCompare = true;
                    $rootScope.lstModelFieldMain = []; 
                    $rootScope.lstModelField = []; 
                }


                function generateId() {
                    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                        var t = 16 * Math.random() | 0;
                        var n = "x" === e ? t : 3 & t | 8;
                        return n.toString(16)
                    })
                }
                function generateUniqueId(longitud) {
                    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    let cadena = '';
                    for (let i = 0; i < longitud; i++) {
                        const indiceAleatorio = Math.floor(Math.random() * alfabeto.length);
                        cadena += alfabeto.charAt(indiceAleatorio);
                    }
                    return cadena;
                }

                function construirURLFuenteRelativa(ruta, fuenteRelativa) {
                    const rutaBase = ruta;
                    return window.location.origin + dir + rutaBase + fuenteRelativa;
                }
                pdfMake.fonts = {
                    Roboto: {
                        normal: construirURLFuenteRelativa('fonts/Roboto/', 'Roboto-Regular.ttf'),
                        bold: construirURLFuenteRelativa('fonts/Roboto/', 'Roboto-Medium.ttf'),
                        italics: construirURLFuenteRelativa('fonts/Roboto/', 'Roboto-Italic.ttf'),
                        bolditalics: construirURLFuenteRelativa('fonts/Roboto/', 'Roboto-MediumItalic.ttf')
                    },
                    Montserrat: {
                        normal: construirURLFuenteRelativa('fonts/Montserrat/', 'Montserrat-Regular.otf'),
                        bold: construirURLFuenteRelativa('fonts/Montserrat/', 'Montserrat-Bold.otf'),
                        italics: construirURLFuenteRelativa('fonts/Montserrat/', 'Montserrat-Thin.ttf'),
                        bolditalics: construirURLFuenteRelativa('fonts/Montserrat/', 'Montserrat-UltraLight.otf')
                    },
                }

                $scope.loading = `<div class="mz-block blockloading">
                        <div class="boxes">
                            <div class="box">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="box">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="box">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="box">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        <span id="loading-txt">{{'views.label.esperar' | translate}} </span>
                    </div>`

                $rootScope.COMPAREMODULE = true;
                $rootScope.NAMESTATES = [];
                $rootScope.LISTSESSIONCOMPARE = [];
                $scope.sameObject = false;
                $scope.estados = 0;
                $scope.VISUALOBJECTORIGINAL = '';
                $scope.VISUALOBJECTSELECTED = '';
                $scope.VISUALSAMEOBJECT = '';
                $scope.IDVIS = '';
                $scope.isInit = false;
                $scope.VISUALOBJECTCOMPARE = [];
                $scope.isShowFilter = true;
                $scope.ShowLoading = true;
                $scope.disableddPdf = true;
                $scope.IDOBJETOINICIAL = '';
                $scope.IDOBJECTCOMPARE = '';
                $scope.IDOBJECTSESION = '';
                $scope.OBJECTIDCOMPARE = '';
                $scope.TYPEOBJECT = '';
                $scope.INITOBJECTSELECTED = false;
                $scope.sameObjectInit = false;
                $scope.isViewGrafico = true;
                $scope.isDownload = false;
                $scope.columView = true;

                var badSheetTitles = ['filtros', 'mi nueva hoja', 'test', 'prueba'];
                var listener = '', selState = '';

                $rootScope.$on('$translateChangeSuccess', function () {
                    $scope.showfieldItems();
                    $('[data-toggle="tooltip"]').bstooltip('dispose');
                    setTimeout(() => {
                        $('[data-toggle="tooltip"]').bstooltip({
                            trigger: 'hover'
                        });
                    }, 600);
                });


                $scope.asyncCallGetObject = async (qvid) => {


                    ('appId' in $attrs) ? ($scope.ThisApp = $rootScope.Apps[$attrs.appId]) : ($scope.ThisApp = $rootScope._thisCurrentApp);
                    $rootScope.ThisAppCompare = $scope.ThisApp;
                    var _oInteraction = true;
                    var _oSelection = false;
                    $scope.ENGINEQBOOK = '';
                    $scope.nameEstadoInicial = generateId(30);
                    $scope.ThisApp.model.enigmaModel.addSessionAlternateState($scope.nameEstadoInicial).then(function () {
                        setTimeout(() => {
                            $scope.InitLoad()
                        }, 2000);

                    });

                    $scope.InitLoad = function () {
                        $scope.ThisApp.getObject(qvid).then(function (model) {
                            $scope.TYPEOBJECT = model.layout.visualization;

                            model.getProperties().then(function (prp) {
                                $scope.ThisApp.model.enigmaModel.createSessionObject(prp).then(function (sessionObject) {
                                    $scope.IDOBJECTSESION = sessionObject.id;
                                    sessionObject.getProperties().then(function (prpSession) {
                                        $scope.ThisApp.visualization.create(model.layout.visualization, [], prpSession).then(function (vis) {
                                            $scope.VISUALOBJECTORIGINAL = vis;
                                            $scope.IDVIS = qvid;
                                            $scope.OBJECTIDCOMPARE = $scope.IDVIS;
                                            $scope.IDOBJETOINICIAL = vis.id;
                                            $scope.VISUALOBJECTORIGINAL.setOptions({
                                                qStateName: $scope.nameEstadoInicial
                                            });
                                            $scope.VISUALOBJECTORIGINAL.show("cover-object-sense-compare", {
                                                "noSelections": _oSelection,
                                                onRendered: function () {
                                                    if ($scope.isInit == false) {
                                                        $('[data-toggle="tooltip"]').bstooltip({
                                                            trigger: 'hover'
                                                        });
                                                        $scope.isInit = true;
                                                        $scope.ShowLoading = false;
                                                    }
                                                }
                                            }).then(function () {


                                                $scope.asyncCallGetListField()
                                                var option = {};
                                                option.stateName = $scope.nameEstadoInicial;
                                                option.selecciones = $scope.ARRSELECCIONESCOMPARE;
                                                option.active = true;
                                                option.stateNameTxt = 'Estado Inicial';
                                                $rootScope.NAMESTATES.push(option);
                                                $scope.nameEstadoObject = $rootScope.NAMESTATES.find((state) => state.active == true).stateNameTxt;
                                                $scope.initSelectionObjectState($rootScope.NAMESTATES.find((state) => state.active == true).stateName);
                                            }).finally(function(){

                                            });
                                        })
                                    })
                                })


                            })

                        });
                    }






                    $scope.reloadObject = function (e) {
                        $('#cover-object-sense-compare').prepend($compile($scope.loading)($scope)).promise().done(function () {
                            $scope.VISUALOBJECTORIGINAL.close();
                            $scope.ThisApp.destroySessionObject($scope.idSessionFilters);
                            $scope.ThisApp.destroySessionObject($scope.IDOBJECTSESION);
                            $scope.InitLoad();
                        })

                    }

                    $scope.$watchCollection('NAMESTATES', function (newValue, oldValue) {
                        if ($rootScope.NAMESTATES && $rootScope.NAMESTATES.length > 0) {
                            $scope.nameEstadoObject = $rootScope.NAMESTATES.find((state) => state.active == true).stateNameTxt;
                        }
                    }, true);



                    $scope.loadState = async function (state) {
                        compareobjectService.clearFiltersMain().then(function () {
                            angular.forEach($rootScope.NAMESTATES, function (value, key) {
                                value.active = false;
                            })
                            state.active = true;

                            $scope.nameEstadoObject = $rootScope.NAMESTATES.find((state) => state.active == true).stateNameTxt;

                            $scope.initSelectionObjectState($rootScope.NAMESTATES.find((state) => state.active == true).stateName);
                            return compareobjectService.addFiltersMainOpened($scope.listFieldMain);
                        })
                            .then(function (arrFiltersActives) {
                                angular.forEach(arrFiltersActives, function (value, key) {
                                    $scope.addFieldMain(null, value)
                                })
                                setTimeout(() => {
                                    $scope.VISUALOBJECTORIGINAL.setOptions({
                                        qStateName: state.stateName
                                    })
                                }, 300);

                            })

                    }

                    $scope.closeCompare = function (event) {
                        $scope.ShowLoading = true;
                        selState.OnData.unbind(listener);
                        try {
                            $('[data-toggle="tooltip"]').bstooltip('dispose');
                        } catch (error) {
                            console.log(error)
                        }

                        compareobjectService.deleteStates($scope.ThisApp, $rootScope.NAMESTATES).then(function () {
                            deregister();
                            $(document.body).removeClass('body-compare compare-row-view body-compare-full-size');
                            setTimeout(() => {
                                $('body#main').find('#fullsizeCompareContainer').empty().remove().promise().done(function () {
                                    try {
                                        if ($scope.VISUALOBJECTORIGINAL) $scope.VISUALOBJECTORIGINAL.close();
                                        if ($scope.VISUALSAMEOBJECT) $scope.VISUALSAMEOBJECT.close();
                                        if ($scope.VISUALOBJECTSELECTED) $scope.VISUALOBJECTSELECTED.close();
                                        $scope.ThisApp.destroySessionObject($scope.idSessionFilters);
                                        $scope.ThisApp.destroySessionObject($scope.IDOBJECTSESION);

                                        if ($rootScope.lstModelField && $rootScope.lstModelField.length >= 1) {
                                            angular.forEach($rootScope.lstModelField, function (value, key) {
                                                try {
                                                    value.close();
                                                }
                                                catch (error) {
                                                    console.log("error eliminando el objeto " + key + "\n" + error);
                                                }

                                            });
                                            $rootScope.lstModelField = [];
                                        }
                                        if ($rootScope.lstModelFieldMain && $rootScope.lstModelFieldMain.length >= 1) {
                                            angular.forEach($rootScope.lstModelFieldMain, function (value, key) {
                                                try {
                                                    value.close();
                                                }
                                                catch (error) {
                                                    console.log("error eliminando el objeto " + key + "\n" + error);
                                                }

                                            });
                                            $rootScope.lstModelFieldMain = [];
                                        }

                                        if ($rootScope.LISTSESSIONCOMPARE && $rootScope.LISTSESSIONCOMPARE.length >= 1) {
                                            angular.forEach($rootScope.LISTSESSIONCOMPARE, function (value, key) {
                                                try {
                                                    let thisApp = $rootScope.Apps.find((aplication) => aplication.id == value.appId);
                                                    let id = value.idSession;
                                                    thisApp.destroySessionObject(id).then((res) => {
                                                    });
                                                }
                                                catch (error) {
                                                    console.log("error eliminando el objeto " + key + "\n" + error);
                                                }

                                            });
                                            $rootScope.LISTSESSIONCOMPARE = [];
                                        }



                                        if ($rootScope.ISVISTAPERSONALIZADA == true) {
                                            $rootScope.$broadcast('loadvisualizations');
                                            $rootScope.COMPAREMODULE = false;
                                        } else {
                                            $rootScope.COMPAREMODULE = false;
                                        }

                                    }
                                    catch (error) {
                                        $('body#main').find('#fullsizeCompareContainer').remove();
                                        console.log("error eliminando el objeto ");
                                    }
                                });
                            }, 300);

                        }).finally(() => {
                            $rootScope.InitCompare = false;
                            $scope.$destroy();
                        });
                    }

                    $rootScope.$on("$stateChangeStart", function () { 
                        if ($rootScope.InitCompare == true) {
                            $scope.closeCompare();
                        }
                    })



                    $scope.asyncCallGetListField = async () => {
                        const resultMain = await compareobjectService.createFieldList($scope.ThisApp);
                        $scope.listFieldMain = resultMain;
                        $scope.listFieldMainSize = resultMain.length;
                        const result = await compareobjectService.createFieldList($scope.ThisApp);
                        $scope.listField = result;
                        $scope.listFieldSize = result.length;

                    }

                    $scope.addFieldMain = function (e, item) {
                        if (item.active == false) {
                            item.active = true;
                            var _stateName = $rootScope.NAMESTATES.find((state) => state.active == true).stateName;
                            let _el = $compile(`<div class="qv-gs-listbox"><div class="clearField" ng-click="clearFielMain('${item.qName}')"><i class="ri-close-circle-line"></i></div><fiellistboxstate object-field="${item.qNameVal}" state-name="${_stateName}"></fiellistboxstate></div>`)($scope);
                            $('#compare-filters-scroll-main').append(_el);
                        } else {
                            var objectVisual = $rootScope.lstModelFieldMain.find((visual) => visual.model.layout.title == item.qName);
                            if (objectVisual) {
                                try {
                                    var box = $('#compare-filters-scroll-main .qv-gs-listbox[data-id=' + objectVisual.id + ']');
                                    var indexThis = $rootScope.lstModelFieldMain.map(el => el.id).lastIndexOf(objectVisual.id);
                                    $(box).removeClass('animate__animated animate__fadeIn').promise().done(function () {
                                        setTimeout(() => {
                                            $(this).remove();
                                            item.active = false;
                                            $rootScope.lstModelFieldMain.splice(indexThis, 1);
                                            objectVisual.close();
                                        }, 0);

                                    })
                                }
                                catch (e) {
                                    console.log("error eliminando el objeto \n" + e);
                                }
                            } else {
                                item.active = false;
                            }
                        }

                    }

                    $scope.clearFielMain = function (name) {
                        var objectVisual = $rootScope.lstModelFieldMain.find((visual) => visual.model.layout.title == name);
                        if (objectVisual) {
                            try {
                                var box = $('#compare-filters-scroll-main .qv-gs-listbox[data-id=' + objectVisual.id + ']');
                                var indexThis = $rootScope.lstModelFieldMain.map(el => el.id).lastIndexOf(objectVisual.id);
                                $(box).removeClass('animate__animated animate__fadeIn').promise().done(function () {
                                    setTimeout(() => {
                                        setTimeout(() => {
                                            $(this).remove();
                                        }, 300);
                                        var itemFiel = $scope.listFieldMain.find((item) => item.qName == name)
                                        itemFiel.active = false;
                                        $rootScope.lstModelFieldMain.splice(indexThis, 1);
                                        objectVisual.close();
                                    }, 0);

                                })
                            }
                            catch (e) {
                                console.log("error eliminando el objeto \n" + e);
                            }
                        }
                    }

                    $scope.addField = function (e, item) {
                        if (item.active == false) {
                            item.active = true;
                            let _el = $compile(`<div class="qv-gs-listbox"><div class="clearField" ng-click="clearFiel('${item.qName}')"><i class="ri-close-circle-line"></i></div><fiellistbox object-field="${item.qNameVal}"></fiellistbox></div>`)($scope);
                            $('#compare-filters-scroll').append(_el);
                        } else {
                            var objectVisual = $rootScope.lstModelField.find((visual) => visual.model.layout.title == item.qName);
                            if (objectVisual) {
                                try {
                                    var box = $('#compare-filters-scroll .qv-gs-listbox[data-id=' + objectVisual.id + ']');
                                    var indexThis = $rootScope.lstModelField.map(el => el.id).lastIndexOf(objectVisual.id);
                                    $(box).removeClass('animate__animated animate__fadeIn').promise().done(function () {
                                        setTimeout(() => {
                                            $(this).remove();
                                            item.active = false;
                                            $rootScope.lstModelField.splice(indexThis, 1);
                                            objectVisual.close();
                                        }, 0);

                                    })
                                }
                                catch (e) {
                                    console.log("error eliminando el objeto \n" + e);
                                }

                            }
                        }

                    }

                    $scope.clearFiel = function (name) {
                        var objectVisual = $rootScope.lstModelField.find((visual) => visual.model.layout.title == name);
                        if (objectVisual) {
                            try {
                                var box = $('#compare-filters-scroll .qv-gs-listbox[data-id=' + objectVisual.id + ']');
                                var indexThis = $rootScope.lstModelField.map(el => el.id).lastIndexOf(objectVisual.id);
                                $(box).removeClass('animate__animated animate__fadeIn').promise().done(function () {
                                    setTimeout(() => {
                                        setTimeout(() => {
                                            $(this).remove();
                                        }, 300);
                                        var itemFiel = $scope.listField.find((item) => item.qName == name)
                                        itemFiel.active = false;
                                        $rootScope.lstModelField.splice(indexThis, 1);
                                        objectVisual.close();
                                    }, 0);

                                })
                            }
                            catch (e) {
                                console.log("error eliminando el objeto \n" + e);
                            }
                        }
                    }

                    $scope.clearSearch = function () {
                        $scope.query = '';
                    }
                    $scope.clearSearchObject = function () {
                        $scope.queryobject = '';
                    }

                    $scope.placeholdersearch = $translate.instant('GlobalSelections.FilterDimensions');
                    $scope.showfield = false;
                    $scope.filterFunction = 'dimension';
                    $scope.showfieldItems = function () {
                        switch ($scope.showfield) {
                            case true:
                                $scope.filterFunction = '';
                                $scope.placeholdersearch = $translate.instant('GlobalSelections.FilterDimensionsAndFields');
                                break;
                            case false:
                                $scope.filterFunction = 'dimension';
                                $scope.placeholdersearch = $translate.instant('GlobalSelections.FilterDimensions');
                                break;
                            default:
                                break;
                        }
                    }


                    $scope.ARRSELECCIONESCOMPARE = [];
                    $scope.initSessionFilter = false;
                    $scope.ThisApp.getList("SelectionObject", function (reply) {
                        if ($scope.initSessionFilter == false) {
                            $scope.initSessionFilter = true;
                            var SESSIONLIS = {};
                            $scope.idSessionFilters = reply.qInfo.qId;
                            SESSIONLIS.idSession = reply.qInfo.qId;
                            SESSIONLIS.appId = $scope.ThisApp.id;
                            $rootScope.LISTSESSIONCOMPARE.push(SESSIONLIS);
                        }
                        var arrFiltros = [];
                        $.each(reply.qSelectionObject.qSelections, function (key, value) {
                            var option = {};
                            option.index = key;
                            option.fieldName = value.qField;
                            option.selectedStr = value.qSelected;
                            arrFiltros.push(option);

                        })
                        $scope.ARRSELECCIONESCOMPARE = arrFiltros;
                    });


                    $scope.initSelectionObjectState = function (stateName) {
                        if (listener) {
                            selState.OnData.unbind(listener);
                        }

                        selState = $scope.ThisApp.selectionState(stateName);
                        listener = function () {
                            var arrFiltros = [];
                            $.each(selState.selections, function (key, value) {
                                var option = {};
                                option.index = key;
                                option.fieldName = value.fieldName;
                                option.selectedStr = value.qSelected;
                                arrFiltros.push(option);
                            })
                            $scope.ARRSELECCIONES = arrFiltros;
                        };
                        selState.OnData.bind(listener); 

                        $scope.ThisApp.field('Año').selectValues(['null'], true, true);






                    }





                    $scope.openSameObject = function () {
                        if ($scope.sameObjectInit == false) {
                            $scope.sameObjectInit = true;
                            compareobjectService.deleteVisualSeledted($scope.VISUALOBJECTSELECTED).then(function () {
                                var idObject = $scope.ObjectId;
                                $scope.IDOBJECTCOMPARE = idObject;
                                $scope.ThisApp.visualization.get(idObject).then(function (vis) {
                                    $scope.VISUALSAMEOBJECT = vis;
                                    vis.show("cover-object-sense-compare-selected", {
                                        onRendered: function () {
                                        }
                                    }).then(function () {
                                        $rootScope.lstModel.push(vis);

                                        if ($rootScope.ISVISTAPERSONALIZADA == false) {
                                            $scope.VISUALOBJECTSELECTED = vis;
                                        }
                                        $scope.sameObject = true;
                                        $scope.disableddPdf = false;
                                        $scope.INITOBJECTSELECTED = true;
                                    });
                                }).catch(function (e) {
                                    console.log(e)
                                })
                            });
                        } else {
                            $scope.VISUALSAMEOBJECT.show("cover-object-sense-compare-selected", {
                                onRendered: function () {
                                }
                            }).then(function () {
                                $scope.IDOBJECTCOMPARE = $scope.ObjectId;
                                $scope.VISUALOBJECTSELECTED = $scope.VISUALSAMEOBJECT;
                                $scope.sameObject = true;
                                $scope.disableddPdf = false;
                                $scope.INITOBJECTSELECTED = true;
                            });
                        }
                        angular.forEach($scope.listObject, function (value, key) {
                            value.active = value.id == $scope.ObjectId ? true : false;
                        })
                    }

                    $scope.addObjectTolist = function (item) {
                        setTimeout(() => { $scope.$apply($scope.listObject) }, 100);
                        $('#cover-object-sense-compare-selected').prepend($compile($scope.loading)($scope)).promise().done(function () {
                            angular.forEach($scope.listObject, function (value, key) {
                                value.active = false;
                            })
                            item.active = true;

                            compareobjectService.deleteVisualSeledted($scope.VISUALOBJECTSELECTED).then(function () {
                                var idObject = item.id;
                                $scope.IDOBJECTCOMPARE = idObject;
                                $scope.ThisAppCompare.visualization.get(idObject).then(function (vis) {
                                    $scope.VISUALOBJECTSELECTED = vis;
                                    vis.show("cover-object-sense-compare-selected", {
                                        onRendered: function () {
                                        }
                                    }).then(function () {
                                        $scope.sameObject = false;
                                        $scope.disableddPdf = false;
                                        $scope.INITOBJECTSELECTED = true;
                                    }).finally(function () {
                                        $scope.closeListObject();
                                    });
                                })
                            })

                        });


                    }

                    $scope.isLoadListObject = false;
                    $scope.listObject = [];
                    $scope.openListObject = function () {
                        if ($scope.isLoadListObject == false) {
                            $scope.isLoadListObject = true;
                            $scope.ThisApp.getList("sheet", function (reply) {
                                $scope.listObject = [];
                                angular.forEach(reply.qAppObjectList.qItems, function (value, key) {
                                    const textoMin = value.qMeta.title.toLowerCase()
                                    if (!badSheetTitles.some(r => textoMin.includes(r.toLowerCase()))) {
                                        compareobjectService.getAllObjectsInSheets(value, $scope.ThisApp).then(function (res) {
                                            var listObject = $scope.listObject.concat(res);
                                            $scope.listObject = _.uniq(listObject, false, (obj) => obj.id);
                                        });
                                    }
                                })
                                $scope.ThisApp.destroySessionObject(reply.qInfo.qId);
                            })

                        }
                        $('#fullsizeCompareContainer').addClass('active');

                    }
                    $scope.closeListObject = function () {
                        $('#fullsizeCompareContainer').removeClass('active');
                    }

                    $scope.visibleListStates = false;
                    $scope.showStateList = function ($event) {
                        $scope.visibleListStates = $scope.visibleListStates === false ? true : false;
                        $('[data-toggle="tooltip"]').bstooltip('hide');
                    }
                    $scope.closeStateList = function ($event) {
                        $scope.visibleListStates = false;
                    }



                    $scope.openDialogStateName = function () {
                        var _template = templateAddState;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                setTimeout(() => {
                                    $('#titleState').focus();
                                }, 600);

                                $scope.closeDialog = function () {
                                    dialog.close();
                                }
                                $scope.setStateName = function () {
                                    var titleState = $scope.titleState;

                                    if (typeof titleState === 'undefined' || titleState === "") {
                                        $rootScope.showAlertStates($translate.instant('views.modal.atencion'), $translate.instant('compare.acciones.KOState'), 'warning');
                                    } else {
                                        var rest = $rootScope.NAMESTATES.filter(function (item) {
                                            return item.stateNameTxt === titleState;
                                        }).length > 0;

                                        if (rest) {
                                            $rootScope.showAlertStates($translate.instant('views.modal.atencion'), $translate.instant('compare.acciones.Stateexiste'), 'error');
                                        } else {
                                            $rootScope.$broadcast('namestate', titleState);
                                            dialog.close();
                                        }
                                        return false;
                                    }
                                }
                            }]
                        });
                    }

                    var deregister = $scope.$on("namestate", function (evt, data) {
                        $scope.addNewState(data);
                    });
                    $scope.$on('$destroy', function destroyScope() {
                        deregister();
                        selState.OnData.unbind(listener);
                    });


                    $scope.addNewState = function (name) {
                        var estadoName = generateId(30)
                        $scope.ThisApp.model.enigmaModel.addSessionAlternateState(estadoName);
                        var option = {};
                        option.stateName = estadoName;
                        option.selecciones = $scope.ARRSELECCIONESCOMPARE;
                        option.active = false;
                        option.stateNameTxt = name;
                        $rootScope.NAMESTATES.push(option);
                        $rootScope.showAlertStates($translate.instant('views.modal.atencion'), $translate.instant('compare.acciones.CrearState'), 'success');
                    }

                    $scope.deleteState = function (name) {
                        $scope.ThisApp.model.enigmaModel.removeSessionAlternateState(name);
                        var indexThis = $rootScope.NAMESTATES.findIndex(state => state.stateName == name);
                        $rootScope.NAMESTATES.splice(indexThis, 1);
                        $rootScope.showAlertStates($translate.instant('views.modal.atencion'), $translate.instant('compare.acciones.DeleteState'), 'success');

                        if ($rootScope.NAMESTATES.length < 2) {
                            $scope.closeStateList();
                        }
                    }

                    $scope.toggleFilterSection = function () {
                        $scope.isShowFilter = $scope.isShowFilter == false ? true : false;
                        $('[data-action="filters"]').bstooltip('dispose')

                        setTimeout(() => {
                            $('[data-action="filters"]').bstooltip()
                            qlik.resize();
                        }, 300);
                    }

                    $scope.initExportPdf = function () {
                        var _template = templateExportPdf;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                setTimeout(() => {
                                    $('#title').focus();
                                }, 600);

                                $scope.closeDialog = function () {
                                    dialog.close();
                                }
                                $scope.caracteres = 80;
                                $scope.titulo = '';

                                $scope.sendTitle = function () {
                                    dialog.close();
                                    setTimeout(() => {
                                        $rootScope.$broadcast('broadcastExportPdf', $scope.titulo);
                                    }, 300);
                                }

                            }]
                        });
                    }

                    var deregisterExportPdf = $scope.$on("broadcastExportPdf", function (evt, data) {
                        $scope.exportPdf(data);
                    });
                    $scope.$on('$destroy', function destroyScope() {
                        deregisterExportPdf();
                    });

                    $scope.exportPdf = function (data) {
                        $scope.TITLEPDF = data;
                        $scope.mesajeCargaDatos = $translate.instant('compare.pdf.Objeto_1');
                        $scope.loadPDF = true;
                        $scope.progress = 0;
                        $('[data-toggle="tooltip"]').bstooltip('hide')
                        var _result = {
                            "img_logo": null,
                            "object_1": null,
                            "object_1_selections": null,
                            "object_2": null,
                            "object_2_selections": null,
                        };
                        compareobjectService.getImageObjectById($scope.IDOBJETOINICIAL, 777, 1898, $scope.ThisApp)
                            .then(function (url_imgObject_1) {
                                return compareobjectService.getConvertImageToBase64(url_imgObject_1);
                            })
                            .then(function (object_1) {
                                setTimeout(() => { $scope.$apply($scope.progress = 14.2) }, 0);
                                $scope.mesajeCargaDatos = $translate.instant('compare.pdf.Objeto_2');
                                _result.object_1 = object_1;
                                return compareobjectService.getImageObjectById($scope.IDOBJECTCOMPARE, 777, 1898, $scope.ThisApp)
                            })
                            .then(function (url_imgObject_1) {
                                return compareobjectService.getConvertImageToBase64(url_imgObject_1);
                            })
                            .then(function (object_2) {
                                setTimeout(() => { $scope.$apply($scope.progress = 28.4) }, 0);
                                $scope.mesajeCargaDatos = $translate.instant('compare.pdf.selecciones_1');
                                _result.object_2 = object_2;
                                return compareobjectService.getSelectionsCompare($scope.ARRSELECCIONES);
                            })
                            .then(function (object_1_selections) {
                                setTimeout(() => { $scope.$apply($scope.progress = 42.6) }, 0);
                                $scope.mesajeCargaDatos = $translate.instant('compare.pdf.selecciones_2');
                                _result.object_1_selections = object_1_selections;
                                return compareobjectService.getSelectionsCompare($scope.ARRSELECCIONESCOMPARE);
                            })
                            .then(function (object_2_selections) {
                                setTimeout(() => { $scope.$apply($scope.progress = 56.8) }, 0);
                                $scope.mesajeCargaDatos = $translate.instant('compare.pdf.imgCoorporativa');
                                _result.object_2_selections = object_2_selections;
                                return compareobjectService.getConvertImageToBase64('assets/img/logos/Logo-Cliente-001.png');
                            })
                            .then(function (img_logo) {
                                setTimeout(() => { $scope.$apply($scope.progress = 71) }, 0);
                                _result.img_logo = img_logo;
                            })
                            .then(function () {
                                var fechaDate = new Date();
                                var dia = fechaDate.getDate();
                                if (dia < 10) dia = '0' + dia;
                                var mes = fechaDate.getMonth() + 1;
                                if (mes < 10) mes = '0' + mes
                                var hora = new Date().getHours();
                                if (hora < 10) hora = '0' + hora
                                var minuto = new Date().getMinutes();
                                if (minuto < 10) minuto = '0' + minuto

                                var fecha = `${dia}/${mes}/${fechaDate.getFullYear()} ${hora}:${minuto}`;
                                var docDefinition = {
                                    pageSize: "A4",
                                    footer: function (currentPage, pageCount) {
                                        return { text: currentPage.toString() + ' of ' + pageCount, alignment: 'center' };
                                    },
                                    content: [
                                        {
                                            table: {
                                                border: [],
                                                valign: 'top',
                                                widths: ['50%', '50%'],
                                                margin: [0, 0, 0, 20],
                                                body: [
                                                    [
                                                        {
                                                            image: _result.img_logo,
                                                            x: 0,
                                                            fit: [250, 100],
                                                            border: [false, false, false, false],
                                                        },
                                                        {
                                                            x: 0,
                                                            border: [false, false, false, false],
                                                            stack: [
                                                                {
                                                                    text: $scope.TITLEPDF, 
                                                                    alignment: 'right',
                                                                    style: 'header'
                                                                },
                                                                {
                                                                    text: `${fecha}`,
                                                                    alignment: 'right',
                                                                    style: 'headerDate'
                                                                }
                                                            ]
                                                        },
                                                    ],
                                                ],
                                            },
                                        },


                                        {
                                            text: $translate.instant('compare.pdf.objetoPrincipal'),
                                            alignment: 'lef',
                                            style: 'titles'
                                        },
                                        {
                                            image: _result.object_1,
                                            x: 0,
                                            y: 25,
                                            width: 790,
                                        },
                                        {
                                            text: $translate.instant('compare.pdf.selecciones'),
                                            alignment: 'lef',
                                            style: 'titlesSelecciones'
                                        },
                                        {
                                            columns: _result.object_1_selections,
                                            columnGap: 10
                                        },
                                        { text: '', pageBreak: 'after' },
                                        {
                                            text: $translate.instant('compare.pdf.objetoSecundario'),
                                            alignment: 'lef',
                                            style: 'titles',
                                        },
                                        {
                                            image: _result.object_2,
                                            x: 0,
                                            y: 25,
                                            width: 790,
                                        },
                                        {
                                            text: $translate.instant('compare.pdf.selecciones'),
                                            alignment: 'lef',
                                            style: 'titlesSelecciones'
                                        },
                                        {
                                            columns: _result.object_2_selections,
                                            columnGap: 20
                                        },
                                    ],
                                    styles: {
                                        header: {
                                            fontSize: 18,
                                            bold: true,
                                            margin: [0, 0],
                                            color: '#10446e'
                                        },
                                        titles: {
                                            fontSize: 14,
                                            bold: true,
                                            margin: [0, 10],
                                            color: '#009845'
                                        },
                                        titlesSelecciones: {
                                            fontSize: 10,
                                            bold: true,
                                            margin: [0, 10],
                                            color: '#10446e'
                                        },
                                        valoresSelecciones: {
                                            fontSize: 10,
                                            bold: false,
                                            background: '#d7dce1',
                                            margin: [0, 10],
                                            lineHeight: 1.5,
                                            color: '#4444'
                                        },
                                        SeleccionesHeader: {
                                            fontSize: 10,
                                            bold: true,
                                            lineHeight: 1.5,
                                            color: '#444444'
                                        },
                                        SeleccionesValues: {
                                            fontSize: 8,
                                            bold: false,
                                            lineHeight: 1.5,
                                            color: '#444444'
                                        },
                                        headerDate: {
                                            fontSize: 10,
                                            bold: false,
                                            margin: [0, 10],
                                            lineHeight: 1.5,
                                            color: '#444444'
                                        }

                                    },
                                    defaultStyle: {
                                        font: 'Montserrat'
                                    },
                                    pageOrientation: 'landscape',
                                    pageMargins: [20, 20, 20, 30]
                                };                        
                                setTimeout(() => { $scope.$apply($scope.progress = 100) }, 0);
                                pdfmake.createPdf(docDefinition, null, pdfMake.fonts).download('Comparacion.pdf');
                                $scope.loadPDF = false;

                            })
                    }

                    $scope.fullSize = false;
                    $scope.getFullSixe = function () {
                        var _body = document.body;
                        document.body.classList.add('body-compare-full-size');
                        var _compare = document.querySelector('#fullsizeCompareContainer');
                        $scope.fullSize = $scope.fullSize === false ? true : false;
                        $(_body).fadeOut(100, "linear", function () {
                            $('.tooltip.bs-tooltip-bottom').remove();
                            $(this).prepend(_compare).fadeIn(100, "linear", function () {
                                setTimeout(() => {
                                    qlik.resize();
                                    setTimeout(() => {
                                        $('[data-toggle="tooltip"]').bstooltip({
                                            trigger: 'hover'
                                        });
                                    }, 300);
                                }, 100);
                            });
                        })
                    }
                    $scope.lostFullSixe = function () {
                        document.body.classList.remove('body-compare-full-size');
                        var _body = document.querySelector('#page-container');
                        var _compare = document.querySelector('#fullsizeCompareContainer');
                        $scope.fullSize = $scope.fullSize === false ? true : false;
                        $(_body).fadeOut(100, "linear", function () {
                            $('.tooltip.bs-tooltip-bottom').remove();
                            $(this).prepend(_compare).fadeIn(300, "linear", function () {
                                setTimeout(() => {
                                    qlik.resize();
                                    setTimeout(() => {
                                        $('[data-toggle="tooltip"]').bstooltip({
                                            trigger: 'hover'
                                        });
                                    }, 300);
                                }, 100);
                            });
                        })
                    }

                    $scope.toggleModeView = function () {
                        $('[data-toggle="tooltip"]').bstooltip('dispose');
                        $scope.columView = $scope.columView == true ? false : true;

                        $('#compare-body').fadeOut(100, "linear", function () {
                            if ($scope.columView == false) {
                                $(document.body).addClass('compare-row-view');
                            } else {
                                $(document.body).removeClass('compare-row-view');
                            }


                            $('#compare-body').fadeIn(100, "linear", function () {
                                setTimeout(() => {
                                    qlik.resize();
                                    $('[data-toggle="tooltip"]').bstooltip({
                                        trigger: 'hover'
                                    });
                                }, 300);
                            });


                        })

                    }





                    $scope.reinitObjectMain = function () {
                        $scope.VISUALOBJECTORIGINAL.model.clearSoftPatches().then(function () {
                            $scope.VISUALOBJECTORIGINAL.setOptions({
                                qStateName: $rootScope.NAMESTATES.find((state) => state.active == true).stateName
                            });
                        });
                    }

                    $scope.reinitObjectSelected = function () {
                        if ($scope.VISUALSAMEOBJECT) $scope.VISUALSAMEOBJECT.model.clearSoftPatches();
                        if ($scope.VISUALOBJECTSELECTED) $scope.VISUALOBJECTSELECTED.model.clearSoftPatches();
                    }

                    $scope.downloadDatos = function (type) {
                        var ID = type == 'main' ? $scope.IDOBJETOINICIAL : $scope.IDOBJECTCOMPARE;
                        compareobjectService.exportDatos(ID, $scope.ThisApp);
                    }


                    $scope.downloadImage = function (type) {
                        var VISUAL = type == 'main' ? $scope.VISUALOBJECTORIGINAL : $scope.VISUALOBJECTSELECTED;
                        $scope.isDownload = true;


                        qlik.theme.apply($rootScope.ThemesDownloadImage).then(function (result) {
                            let settings = { format: 'png', height: '600', width: '980' };

                            let isContainer = VISUAL.model.genericType == 'container' ? true : false;
                            if (isContainer) {
                                let activeObjectFromContainer = vis.model.items.activeId;
                                $scope.ThisApp.visualization.get(activeObjectFromContainer).then(function (viz) {
                                    VISUAL.exportImg(settings).then(function (res) {
                                        $scope.printUrl = res;
                                        window.location.href = res;
                                        qlik.theme.apply($rootScope.ThemesInit).then(function () {
                                            $scope.isDownload = false;
                                        });
                                    }).catch(function (error) {
                                        $scope.isDownload = false;
                                        setTimeout(() => { $scope.$apply($scope.isDownload) }, 0);
                                        $rootScope.showAlertStates($translate.instant('views.modal.atencion'), $translate.instant('compare.Failed.GenericMessage'), 'warning');
                                        console.log(error);
                                    });
                                })
                            } else {
                                VISUAL.exportImg(settings).then(function (res) {
                                    $scope.printUrl = res;
                                    window.location.href = res;
                                    qlik.theme.apply($rootScope.ThemesInit).then(function () {
                                        $scope.isDownload = false;
                                    });
                                }).catch(function (error) {
                                    $scope.isDownload = false;
                                    setTimeout(() => { $scope.$apply($scope.isDownload) }, 0);
                                    $rootScope.showAlertStates($translate.instant('views.modal.atencion'), $translate.instant('compare.Failed.GenericMessage'), 'warning');
                                    console.log(error);
                                });
                            }
                        }).catch(function () {
                            $scope.isDownload = false;
                        });
                    }

                    $scope.deleteFilterMain = function (campo) {
                        var stateName = $rootScope.NAMESTATES.find((state) => state.active == true).stateName;
                        $scope.ThisApp.field(campo, stateName).clear().then(function (res) {
                        });
                    }
                    $scope.deleteFilter = function (campo) {
                        $scope.ThisApp.field(campo).clear();
                    }
                }
            }]
        };
    }]);
    app.directive('fiellistbox', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            link: function (scope, element, attrs) {
                var _objectField = String(attrs.objectField).trim();
                var _element = element;
                scope.loadListField(_objectField, _element);
            },
            controller: ['$scope', '$rootScope', 'compareobjectService', '$element', function ($scope, $rootScope, compareobjectService, $element) {
                $scope.loadListField = function (_objectField, _element) {
                    compareobjectService.createListBoxesFilters(_objectField, $rootScope.ThisAppCompare).then(function (res) {
                        res.show(_element).then(function () {
                            $(_element).parent('.qv-gs-listbox').attr('data-id', res.id).promise().done(function () {
                                setTimeout(() => {
                                    $(this).removeClass('hide').addClass('animate__animated animate__fadeIn');
                                }, 100);
                            })
                            $rootScope.lstModelField.push(res)
                        });
                    })
                };
            }]
        };
    }]);

    app.directive('fiellistboxstate', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            link: function (scope, element, attrs) {
                var _objectField = String(attrs.objectField).trim();
                var _stateName = String(attrs.stateName).trim();
                var _element = element;
                scope.loadListField(_objectField, _stateName, _element);
            },
            controller: ['$scope', '$rootScope', 'compareobjectService', '$element', function ($scope, $rootScope, compareobjectService, $element) {
                $scope.loadListField = function (_objectField, _stateName, _element) {
                    compareobjectService.createListBoxesFiltersState(_objectField, _stateName, $rootScope.ThisAppCompare).then(function (res) {
                        res.show(_element).then(function () {
                            $(_element).parent('.qv-gs-listbox').attr('data-id', res.id).promise().done(function () {
                                setTimeout(() => {
                                    $(this).removeClass('hide').addClass('animate__animated animate__fadeIn');
                                }, 100);
                            })
                            $rootScope.lstModelFieldMain.push(res)
                        });
                    })
                };
            }]
        };
    }]);

});