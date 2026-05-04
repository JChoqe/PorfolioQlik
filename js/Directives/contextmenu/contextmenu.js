var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'codemirror',
    '../text!./_templates/EmbedObject-template.html',
    '../text!./_templates/ExportImage-template.html',
    '../text!./_templates/ExportPdf-template.html',
    '../text!./_templates/DeleteFavorite-template.html',
    '../text!./_templates/help-template.html',
    '../text!./_templates/htmlEditor-template.html',
    '../text!./_templates/chooseLanguage-template.html',
], function (qlik, app, codemirror, EmbedObjectTemplate, ExportImageTemplate, ExportPdfTemplate, DeleteFavoriteTemplate, HelpTemplate, HtmlEditorTemplate, ChooseLanguageTemplate) {
    app.directive('contextmenu', function () {
        let directiveDefinitionObject = {
            restrict: 'E',
            transclude: true,
            multiElement: true,
            bindToController: true,
            priority: 0,
            controllerAs: 'stringIdentifier',
            scope: true,
            templateUrl: 'js/Directives/contextmenu/contextmenu.html',
            link: function (scope, element, $attrs) {
                scope.ObjectId = $attrs.objectId;
                scope.TOP = $attrs.top;
                scope.LEFT = $attrs.left;
                scope.positionContextMenu = {
                    position: 'absolute',
                    top: scope.TOP + 'px',
                    left: scope.LEFT + 'px'
                };
                scope.VALORCELDA = $attrs.valorCelda;

            },
            controller: ['$injector', '$window', '$q', '$scope', '$rootScope', '$compile', '$http', '$timeout', 'luiDialog', '$translate', '$attrs', '$element', '$state', '$stateParams', 'InitConfig', 'mzApiGlobalService', async function ($injector, $window, $q, $scope, $rootScope, $compile, $http, $timeout, luiDialog, $translate, $attrs, $element, $state, $stateParams, InitConfig, mzApiGlobalService) {


                                $rootScope.languageList = [{
                    short: "es",
                    long: "es-ES",
                    label: "Spanish",
                    translatedLabel: "Common.Spanish"
                }, {
                    short: "sv",
                    long: "sv-SE",
                    label: "Swedish",
                    translatedLabel: "Common.Swedish"
                }, {
                    short: "ja",
                    long: "ja-JP",
                    label: "Japanese",
                    translatedLabel: "Common.Japanese"
                }, {
                    short: "en",
                    long: "en-US",
                    label: "English",
                    translatedLabel: "Common.English"
                }, {
                    short: "de",
                    long: "de-DE",
                    label: "German",
                    translatedLabel: "Common.German"
                }, {
                    short: "fr",
                    long: "fr-FR",
                    label: "French",
                    translatedLabel: "Common.French"
                }, {
                    short: "it",
                    long: "it-IT",
                    label: "Italian",
                    translatedLabel: "Common.Italian"
                }, {
                    short: "nl",
                    long: "nl-NL",
                    label: "Dutch",
                    translatedLabel: "Common.Dutch"
                }, {
                    short: "pt",
                    long: "pt-BR",
                    label: "Brazilian Portuguese",
                    translatedLabel: "Common.BrazilianPortuguese"
                }, {
                    short: "ru",
                    long: "ru-RU",
                    label: "Russian",
                    translatedLabel: "Common.Russian"
                }, {
                    short: "zh",
                    long: "zh-CN",
                    label: "Simplified Chinese",
                    translatedLabel: "Common.SimplifiedChinese"
                }, {
                    short: "zh",
                    long: "zh-TW",
                    label: "Traditional Chinese",
                    translatedLabel: "Common.TraditionalChinese"
                }, {
                    short: "pl",
                    long: "pl-PL",
                    label: "Polish",
                    translatedLabel: "Common.Polish"
                }, {
                    short: "tr",
                    long: "tr-TR",
                    label: "Turkish",
                    translatedLabel: "Common.Turkish"
                }, {
                    short: "ko",
                    long: "ko-KR",
                    label: "Korean",
                    translatedLabel: "Common.Korean"
                }];
                var indeApp = undefined;

                ('appId' in $attrs) ? ($rootScope.APP = $rootScope.Apps[$attrs.appId], indeApp = $attrs.appId, $scope.indeApp = $attrs.appId) : ($rootScope.APP = $rootScope._thisCurrentApp, indeApp = undefined, $scope.indeApp = undefined);

                $scope.ObjectId = $attrs.objectId;
                $scope.THISAPP = $rootScope.APP;



                $scope.subMenuShow = false;
                $scope.showItemDownload = false;
                $scope.showItemExpand = false;
                $scope.SHOWCOMPAREOBJECT = $rootScope.SHOWCOMPAREOBJECT;
                $scope.volverInit = () => {
                    $scope.subMenuShow = false;
                    $scope.showItemDownload = false;
                    $scope.showItemExpand = false;
                }


                $scope.showItemsDownload = () => {
                    $scope.subMenuShow = true;
                    $scope.showItemDownload = true;
                }
                $scope.showItemsExpand = () => {
                    $scope.subMenuShow = true;
                    $scope.showItemExpand = true;
                }

                $scope.IsVisibleContexMenu = false;
                let _loading = '<div id="loading-export"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
                $scope.MODEL = '';
                let vis;
                $scope.mzFavoritos = $rootScope.mzFavoritos;
                $scope.close = function () {
                    $('contextmenu').remove();
                };

                $translate('views.modal.pdf').then(function (translation) {
                    $scope.tituloHeaderPdf = translation;
                });
                $translate('views.modal.tamaniopapel').then(function (translation) {
                    $scope.papel = translation;
                });
                $translate('views.modal.carta').then(function (translation) {
                    $scope.carta = translation;
                });
                $translate('views.modal.orientacion').then(function (translation) {
                    $scope.orientacion = translation;
                });
                $translate('views.modal.vertical').then(function (translation) {
                    $scope.vertical = translation;
                });
                $translate('views.modal.apaisado').then(function (translation) {
                    $scope.apaisado = translation;
                });
                $translate('views.modal.cerrar').then(function (translation) {
                    $scope.cerrar = translation;
                });
                $translate('views.modal.exportar').then(function (translation) {
                    $scope.exportar = translation;
                });
                $translate('views.modal.opcionesaspecto').then(function (translation) {
                    $scope.opcionesaspecto = translation;
                });
                $translate('views.modal.actual').then(function (translation) {
                    $scope.actual = translation;
                });
                $translate('views.modal.ajustar').then(function (translation) {
                    $scope.ajustar = translation;
                });


                if ($rootScope.mzFavoritos) {
                    $scope.THISOBJECTISFAVORITE = false;
                    $scope.isFavorite = function (id) {
                        let IDOBJECT = id;
                        mzApiGlobalService.getFav(IDOBJECT, $state.current.name).then(function (res) {
                            if (res) {
                                $scope.THISOBJECTISFAVORITE = true;
                                let hasIcon = $('#' + IDOBJECT).find('.ISFavorite');
                                let _el = $compile(`<div class="ISFavorite" ng-click="toggleFavorites('` + IDOBJECT + `')"></div>`)($scope);
                                if (hasIcon.length == 0) {
                                    $('#' + IDOBJECT).find('.qv-object-title').append(_el);
                                }
                            } else {
                                $scope.THISOBJECTISFAVORITE = false;
                                $('#' + IDOBJECT).find('.qv-object-title .ISFavorite').remove()
                            }
                        })
                    }

                    function getIcon(tipo) {
                        switch ($scope.typeObject) {
                            case 'linechart':
                                return 'lui-icon lui-icon--line-chart lui-list__aside';
                                break;
                            case 'barchart':
                                return 'lui-icon lui-icon--bar-chart lui-list__aside';
                                break;
                            case 'bulletchart':
                                return 'lui-icon lui-icon--bar-chart lui-list__aside';
                                break;
                            case 'scatterplot':
                                return 'lui-icon lui-icon--scatter-chart lui-list__aside';
                                break;
                            case 'piechart':
                                return 'lui-icon lui-icon--pie-chart lui-list__aside';
                                break;
                            case 'boxplot':
                                return 'lui-icon lui-icon--boxplot lui-list__aside';
                                break;
                            case 'distributionplot':
                                return 'lui-icon lui-icon--distributionplot lui-list__aside';
                                break;
                            case 'combochart':
                                return 'lui-icon lui-icon--combo-chart lui-list__aside';
                                break;
                            case 'map':
                                return 'class="lui-icon lui-icon--map lui-list__aside"';
                                break;
                            case 'treemap':
                                return 'lui-icon lui-icon--treemap lui-list__aside';
                                break;
                            case 'histogram':
                                return 'lui-icon lui-icon--histogram lui-list__aside';
                                break;
                            case 'table':
                                return 'lui-icon lui-icon--table lui-list__aside';
                                break;
                            case 'pivot-table':
                                return 'lui-icon lui-icon--pivot-table lui-list__aside';
                                break;
                            case 'MzGenaro':
                                return 'lui-icon lui-icon--print lui-list__aside';
                                break;
                            default:
                                return 'lui-icon lui-icon--field lui-list__aside';
                        }
                    }

                    $scope.getTituloExpresion = function (exp) {
                        let dfd = jQuery.Deferred();
                        $rootScope.APP.createGenericObject({
                            user: {
                                qStringExpression: "=QVUser ()"
                            },
                            version: {
                                qStringExpression: "=QlikViewVersion ()"
                            },
                            fields: {
                                qStringExpression: exp
                            }
                        }, function (reply) {
                            dfd.resolve(reply.fields)
                        });
                        return dfd.promise();
                    };
                    function getTitle(title) {
                        let dfd = jQuery.Deferred();
                        if (title.hasOwnProperty('qStringExpression')) {
                            $scope.getTituloExpresion(title.qStringExpression.qExpr).then(function (res) {
                                dfd.resolve(res)
                            })
                        } else {
                            dfd.resolve(title)
                        }
                        return dfd.promise();
                    }

                    $scope.toggleFavorites = function (id) {
                        $scope.close();
                        var IDOBJECT = id;
                        mzApiGlobalService.getFav(IDOBJECT, $state.current.name).then(function (res) {
                            if (res) {
                                let dialogLogoutTemplate = DeleteFavoriteTemplate;
                                let _template = dialogLogoutTemplate;
                                let dialog = luiDialog.show({
                                    template: _template,
                                    closeOnEscape: true,
                                    controller: ['$scope', '$rootScope', 'mzApiGlobalService', function ($scope, $rootScope, mzApiGlobalService) {
                                        $scope.closeDialog = function () {
                                            dialog.close();
                                        };
                                        $scope.deleteFavorite = function () {
                                            mzApiGlobalService.deleteFav(IDOBJECT, $state.current.name).then(function (res) {
                                                $scope.closeDialog();
                                                $scope.THISOBJECTISFAVORITE = true;
                                                $('.speeldial-center').removeClass('activo');
                                                $('#' + IDOBJECT).find('.qv-object-title .ISFavorite').remove();
                                                $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('Favorites.alert.deleteToFavorites'), 'success');
                                            })
                                        }
                                    }]
                                });
                            } else {

                                $rootScope.APP.model.engineApp.getObject(
                                    {
                                        "qId": IDOBJECT
                                    }
                                ).then(function (qBook) {
                                    qBook.getEffectiveProperties().then(function (res) {
                                        getTitle(res.title).then(function (resTitle) {
                                            let titleObject = resTitle;
                                            let data = {};
                                            data.object_id = IDOBJECT;
                                            data.app_id = InitConfig.arrApps.map(function (e) { return e.idapp; }).indexOf($rootScope.APP.id);
                                            var app_name = InitConfig.arrApps.find(function (app) {
                                                return app.idapp === $rootScope.APP.id;
                                            });
                                            data.app_name = app_name.name;
                                            data.location = $state.current.name;
                                            data.title_object = titleObject;
                                            data.icon = getIcon(res.visualization);
                                            data.visualization = res.visualization;
                                            mzApiGlobalService.newFav(data).then(function (res) {
                                                $scope.isFavorite($scope.ObjectId);
                                                $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('Favorites.alert.addToFavorites'), 'success');
                                                let _el = $compile(`<div class="ISFavorite" ng-click="toggleFavorites('` + IDOBJECT + `')"></div>`)($scope)
                                                $('#' + IDOBJECT).find('.qv-object-title').append(_el);
                                            })
                                        })

                                    })
                                })


                            }

                        }).catch(function (e) {
                            console.log(e);
                            $rootScope.showAlert($translate.instant('views.modal.atencion'), $translate.instant('Favorites.alert.errorToFavorites'), 'info');
                        })
                    }

                    $scope.isFavorite($scope.ObjectId);
                }


                function getObjectModel() {
                    return new Promise(resolve => {
                        let isCopy = $('body#main').find('.object-full-size-copy');
                        if (isCopy.length > 0) {
                            let result = $rootScope.lstModel.findLast(({ id }) => id == $scope.ObjectId);
                            resolve(result.model);
                        } else {
                            $rootScope.lstModel.filter(obj => {
                                if (obj.id == $scope.ObjectId) {
                                    resolve(obj.model);
                                }
                            });
                        }

                    })
                }
                getObjectModel().then(function (model) {
                    $scope.MODEL = model;
                    $rootScope.MODELOBJECT = model;
                    $scope.typeObject = model?.enigmaModel?.layout?.visualization || model.layout.qInfo.qType;
                    $scope.isCopyCell = false;
                    $scope.isPivotTable = false;
                    $scope.haveExportarDatos = true;
                    $scope.isMzGenaro = false;
                    $scope.haveTableView = true;
                    $scope.isModeFullSize = '';
                    $scope.isComparable = model.layout?.qHyperCube?.qDimensionInfo.length > 0 ? true : false;
                    $scope.haveEqualizador = true;
                    $scope.ObjectContainer = false;
                    $scope.objectHasSoftPatches = $scope.MODEL?.enigmaModel?.layout?.qHasSoftPatches;
                    if ($scope.typeObject == 'map' || $scope.typeObject == 'container') {
                        $scope.objectHasSoftPatches = false;
                    }

                    $rootScope.APP.visualization.get($scope.ObjectId).then(function (viz) {
                        vis = viz;

                        $scope.getVisualObject = () => {
                            let defer = $q.defer();
                            switch ($scope.typeObject) {
                                case 'container':
                                    vis.model.getProperties().then(function () {
                                        let activeObjectFromContainer = vis.model.items.activeId;
                                        defer.resolve(activeObjectFromContainer);
                                    })
                                    break;
                                default:
                                    defer.resolve($scope.ObjectId);
                                    break;
                            }
                            return defer.promise;
                        }


                        if ($scope.VALORCELDA) {
                            switch ($scope.typeObject) {
                                case 'table':
                                case 'pivot-table':
                                    $scope.isCopyCell = true;
                                    break;
                                case 'container':
                                    vis.model.getProperties().then(function () {
                                        let activeObjectFromContainer = vis.model.items.activeId;
                                        $rootScope.APP.getObjectProperties(activeObjectFromContainer).then(function (model) {
                                            let typeObject = model?.enigmaModel?.layout?.visualization || model.layout.qInfo.qType;
                                            switch (typeObject) {
                                                case 'table':
                                                case 'pivot-table':
                                                    $scope.isCopyCell = true;
                                                    break;
                                                default:
                                                    $scope.isCopyCell = false;
                                                    break;
                                            }
                                        })
                                    })
                                    break;
                                default:
                                    $scope.isCopyCell = false;
                                    break;
                            }
                        }
                        $scope.copyToClipboard = function () {
                            $scope.close();
                            navigator.clipboard.writeText($scope.VALORCELDA)
                        }
                        switch ($scope.typeObject) {
                            case 'pivot-table':
                                $scope.isPivotTable = true;
                                break;
                            case 'container':
                                vis.model.getProperties().then(function () {
                                    let activeObjectFromContainer = vis.model.items.activeId;
                                    $rootScope.APP.getObjectProperties(activeObjectFromContainer).then(function (model) {
                                        let typeObject = model?.enigmaModel?.layout?.visualization || model.layout.qInfo.qType;
                                        switch (typeObject) {
                                            case 'pivot-table':
                                                $scope.isPivotTable = true;
                                                break;
                                            default:
                                                $scope.isPivotTable = false;
                                                break;
                                        }
                                    })
                                })
                                break;
                            default:
                                $scope.isPivotTable = false;
                                break;
                        }

                        switch ($scope.typeObject) {
                            case 'linechart':
                            case 'barchart':
                            case 'bulletchart':
                            case 'scatterplot':
                            case 'piechart':
                            case 'boxplot':
                            case 'distributionplot':
                            case 'combochart':
                            case 'map':
                            case 'treemap':
                            case 'histogram':
                            case 'table':
                            case 'pivot-table':
                                $scope.haveEqualizador = true;
                                break;
                            case 'MzGenaro':
                            case 'container':
                                $scope.haveEqualizador = false;
                                break;
                            default:
                                $scope.haveEqualizador = false;
                                break;
                        }


                        switch ($scope.typeObject) {
                            case 'map':
                            case 'table':
                            case 'kpi':
                            case 'MzGenaro':
                            case 'qlik-trellis-container':
                                $scope.haveTableView = false;
                                break;
                            case 'container':
                                $scope.ObjectContainer = true;
                                vis.model.getProperties().then(function () {
                                    let activeObjectFromContainer = vis.model.items.activeId;
                                    $rootScope.APP.getObjectProperties(activeObjectFromContainer).then(function (model) {
                                        let typeObject = model?.enigmaModel?.layout?.visualization || model.layout.qInfo.qType;
                                        switch (typeObject) {
                                            case 'map':
                                            case 'table':
                                            case 'kpi':
                                            case 'MzGenaro':
                                                $scope.haveTableView = false;
                                                break;
                                            default:
                                                $scope.haveTableView = true;
                                                break;
                                        }
                                    })
                                })
                                break;
                            default:
                                $scope.haveTableView = true;
                        }


                        switch ($scope.typeObject) {
                            case 'map':
                            case 'MzGenaro':
                            case 'qlik-trellis-container':
                                $scope.haveExportarDatos = false;
                                break;
                            default:
                                $scope.haveExportarDatos = true;
                        }

                        switch ($scope.typeObject) {
                            case 'MzGenaro':
                            case 'qlik-trellis-container':
                                $scope.isMzGenaro = true;
                                break;
                            default:
                                $scope.isMzGenaro = false;
                        }

                        $scope.getVisualObject().then(function (visualObjectID) {
                            let isCopy = $('body#main').find('.object-full-size-copy');
                            if (isCopy.length > 0) {
                                let result = $rootScope.ITEMS.findLast(({ id }) => id == visualObjectID);
                                let visual = result.vis;
                                $scope.tableView = visual._isToggled;
                            } else {
                                let result = $rootScope.ITEMS.filter(obj => {
                                    return obj.id === visualObjectID;
                                });
                                let visual = result[0].vis;
                                $scope.tableView = visual._isToggled;
                            }

                        })
                        $scope.toggleDataViewTable = async function ($event, ID) {

                            let isContainer = vis.model.genericType == 'container' ? true : false;
                            if (isContainer) {
                                vis.model.items.currentObject.toggleDataView().then(function () {

                                });
                            } else {
                                let isCopy = $('body#main').find('.object-full-size-copy');
                                if (isCopy.length > 0) {
                                    let result = $rootScope.ITEMS.findLast(({ id }) => id == ID);
                                    let visual = result.vis;
                                    visual.toggleDataView().then(function (toggled) {
                                        $scope.tableView = visual._isToggled;
                                        $rootScope.$broadcast('dataviewtable', [!$scope.tableView, $scope.ObjectId]);
                                        console.log($scope.tableView);

                                    });
                                } else {
                                    $scope.getVisualObject().then(function (visualObjectID) {
                                        let result = $rootScope.ITEMS.filter(obj => {
                                            return obj.id === visualObjectID;
                                        });
                                        let visual = result[0].vis;
                                        visual.toggleDataView().then(function (toggled) {
                                            $scope.tableView = visual._isToggled;
                                            $rootScope.$broadcast('dataviewtable', [!$scope.tableView, $scope.ObjectId]);
                                        });
                                    })
                                }

                            }


                            $scope.close();

                        };







                        $scope.getIdObject = (ID) => {
                            return new Promise(resolve => {
                                let idobjeto = ID;
                                $rootScope.APP.visualization.get(idobjeto).then(function (visual) {
                                    let isContainer = visual.model.genericType == 'container' ? true : false
                                    if (isContainer) {
                                        vis.model.getProperties().then(function () {
                                            resolve(vis.model.items.activeId);
                                        })
                                    } else {
                                        resolve(idobjeto);
                                    }
                                })
                            })
                        }
                        $scope.isModeFullSize = $('body').hasClass('body-full-size');

                        $scope.FULLSIZE = $('body').hasClass('body-full-size')

                        $scope.getFullSize = function (event, id) {

                            let _htmlPartial = '';
                            let _object = $("#page-container").find(`[object-id='${id}']`).parents('.box_object');


                            let _filter = $(_object).attr('data-filter');
                            $rootScope.isFullSize = true;
                            $('body').addClass("body-full-size");
                            let newScope = $scope.$parent.$new();
                            $scope.getIdObject(id).then(function (res) {
                                let objectID = res;
                                $injector.invoke(function () {
                                    if (_filter) {
                                        let arrFilters = _filter.split(',');
                                        _htmlPartial = '<div class="fullsize-filters">'
                                        arrFilters.forEach(function (value) {
                                            _htmlPartial = _htmlPartial + `<div class="filterInObject"><objectsense class="qlik-embed" object-id="${value}" is-kpi="true"></objectsense></div>`;
                                        });
                                        _htmlPartial = _htmlPartial + '</div>';
                                    }
                                    $('contextmenu').remove();
                                    let _el = $compile(`<div id="fullsizeContainer">${_htmlPartial}                                
                                    <objectsense class="object-full-size-copy" object-id="${objectID}" bar-selection="true" ` + (typeof indeApp != 'undefined' ? `app-id="${indeApp}"` : '') + `></objectsense></div>`)(newScope);
                                    $(document.body).prepend(_el);
                                    $('#main-content .qv-global-search-container').removeClass("qv-global-search-container").addClass("qv-global-search-container-01");
                                });
                            })
                        };


                        async function cleanObject(ID) {
                            return new Promise(resolve => {
                                if ($rootScope.ISVISTAPERSONALIZADA == false) {
                                    let result = $rootScope.lstModel.findLast(({ id }) => id == ID);
                                    let indexThis = $rootScope.lstModel.map(el => el.id).lastIndexOf(ID);
                                    try { result.close(); } catch (e) { console.log(e) }
                                    $rootScope.lstModel.splice(indexThis, 1);  
                                    resolve(true);
                                } else {
                                    resolve(true);
                                }
                            })
                        }
                        async function cleanItem(ID) {
                            return new Promise(resolve => {
                                let indexThis = $rootScope.ITEMS.map(el => el.id).lastIndexOf(ID);
                                $rootScope.ITEMS.splice(indexThis, 1);  
                                resolve(true);
                            })
                        }
                        $scope.lostFullSize = function (event, id) {
                            event.stopPropagation();
                            let objectID = id;
                            let isCopy = $('body#main').find('.object-full-size-copy');
                            $rootScope.isFullSize = false;
                            $('contextmenu').remove();
                            if (isCopy.length > 0) {
                                Promise.all([cleanObject(id), cleanItem(id)]).then((results) => {
                                    $('body#main').find('#fullsizeContainer').remove();
                                    $('body').removeClass("body-full-size");
                                })


                            } else {
                                $('#' + id).parents(".box_object").removeClass("object-full-size");
                                $('body').removeClass("body-full-size");
                                $timeout(function () {
                                    qlik.resize(objectID);
                                }, 300);
                            }
                            $('#main-content .qv-global-search-container-01').removeClass("qv-global-search-container-01").addClass("qv-global-search-container");

                        };

                        $scope.embedObject = (ID) => {
                            $scope.close();
                            let _template = EmbedObjectTemplate;

                            let dialog = luiDialog.show({
                                template: _template,
                                closeOnEscape: false,
                                controller: ['$scope', '$rootScope', '$translate', function ($scope, $rootScope, $translate) {

                                    let origin = window.location.origin;
                                    $scope.urlIframe = origin + '/single/?appid=' + $rootScope.APP.id + '&obj=' + ID + '&opt=nointeraction,ctxmenu,currsel/select/clearall';
















                                    $scope._htmlIframeValue = `<iframe  src='${$scope.urlIframe}' style="border:none;width:100%;height:100%;"></iframe>`;
                                    $scope._htmlIframe = "<iframe class='qs-embed-dialog__preview' src='" + $scope.urlIframe + "' ></iframe>";

                                    $scope.copyValIframe = () => {
                                        let copyText = document.getElementById("iframeUrl");
                                        copyText.select();
                                        copyText.setSelectionRange(0, 99999); 
                                        navigator.clipboard.writeText(copyText.value);
                                    }





                                    $scope.populateQlikTheme = async () => {
                                        qlik.getThemeList().then(function (list) {
                                            let $dropdown = $("#theme");
                                            $dropdown.empty();
                                            $dropdown.append($("<option/>").val('').text('Default'));
                                            list.forEach(function (value) {
                                                $dropdown.append($("<option/>").val(value.id).text(value.name));
                                            });
                                        });
                                    }

                                    $scope.populateQlikTheme();

                                }]
                            });
                            setTimeout(function () {
                                $('.lui-modal-background').addClass('mz-embed-dialog');
                            }, 100);
                        }



                        $scope.openPopupPDF = function (ID) {
                            $scope.close();
                            let dataIDPDF = ID;
                            let _template = ExportPdfTemplate;

                            let dialog = luiDialog.show({
                                template: _template,
                                closeOnEscape: false,
                                controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                    $scope.printUrl = '';
                                    $scope.states = {
                                        NODATA: -4,
                                        CANCELED: -3,
                                        TIMEOUT: -2,
                                        FAILED: -1,
                                        IDLE: 0,
                                        PENDING: 1,
                                        COMPLETED: 2
                                    };
                                    $scope.state = 0;
                                    $scope.print = {
                                        dpi: '',
                                        width: '',
                                        height: '',
                                        aspectRatio: ''

                                    }
                                    $scope.print.dpi = 200;
                                    $scope.print.aspectRatio = 0;
                                    $scope.layout = [
                                        {
                                            label: 'Vertical',
                                            orientation: 'portrait',
                                            translationKey: "Print.Portrait"
                                        },
                                        {
                                            label: 'Apaisado',
                                            orientation: 'landscape',
                                            translationKey: 'Print.Landscape'

                                        }
                                    ]
                                    $scope.selectedLayout = $scope.layout[1];

                                    $scope.getPaperFormats = function (val) {
                                        let defer = $q.defer();
                                        switch (val) {
                                            case 'a3':
                                                if ($rootScope.language == 'en') {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A3 (16.55" x 11.7")';
                                                    } else {
                                                        return 'A3 (11.7" x 16.55")';
                                                    }
                                                } else {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A3 (297mm x 420 mm)';
                                                    } else {
                                                        return 'A3 (420 mm x 297mm)';
                                                    }
                                                }
                                                break;
                                            case 'a4':
                                                if ($rootScope.language == 'en') {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A4 (8.275" x 11.7")';
                                                    } else {
                                                        return 'A4 (11.7" x 8.275")';
                                                    }
                                                } else {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A4 (210 mm x 297 mm)';
                                                    } else {
                                                        return 'A4 (297 mm x 210mm)';
                                                    }
                                                }
                                                break;
                                            case 'a5':
                                                if ($rootScope.language == 'en') {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A5 (5.85" x 8.275")';
                                                    } else {
                                                        return 'A5 (8.275" x 5.85")';
                                                    }
                                                } else {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A5 (148 mm x 210 mm)';
                                                    } else {
                                                        return 'A5 (210 mm x 148mm)';
                                                    }
                                                }
                                                break;
                                            case 'a6':
                                                if ($rootScope.language == 'en') {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A6 (4.1375" x 5.85")';
                                                    } else {
                                                        return 'A6 (5.85" x 4.1375")';
                                                    }
                                                } else {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A6 (105 mm x 148 mm)';
                                                    } else {
                                                        return 'A6 (148 mm x 105 mm)';
                                                    }
                                                }
                                                break;
                                            case 'a7':
                                                if ($rootScope.language == 'en') {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A7 (2.925" x 4.1375")';
                                                    } else {
                                                        return 'A7 (4.1375" x 2.925")';
                                                    }
                                                } else {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'A7 (74 mm x 105 mm)';
                                                    } else {
                                                        return 'A7 (105 mm x 74 mm)';
                                                    }
                                                }
                                                break;
                                            case 'letter':
                                                if ($rootScope.language == 'en') {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'Letter (8.5" x 11")';
                                                    } else {
                                                        return 'Letter (11" x 8.5")';
                                                    }
                                                } else {
                                                    if ('portrait' === $scope.selectedLayout.orientation) {
                                                        return 'Carta (215mm x 279 mm)';
                                                    } else {
                                                        return 'Carta (279 mm x 215mm)';
                                                    }
                                                }
                                                break;
                                        }
                                        return defer.promise;
                                    }
                                    $scope.paperSizes = {
                                        a3: {
                                            label: $scope.getPaperFormats('a3'),
                                            tamanio: 'a3',
                                            height: 420,
                                            width: 297
                                        },
                                        a4: {
                                            label: $scope.getPaperFormats('a4'),
                                            tamanio: 'a4',
                                            height: 297,
                                            width: 210
                                        },
                                        a5: {
                                            label: $scope.getPaperFormats('a5'),
                                            tamanio: 'a5',
                                            height: 210,
                                            width: 148
                                        },
                                        a6: {
                                            label: $scope.getPaperFormats('a6'),
                                            tamanio: 'a6',
                                            height: 148,
                                            width: 105
                                        },
                                        a7: {
                                            label: $scope.getPaperFormats('a7'),
                                            tamanio: 'a7',
                                            height: 105,
                                            width: 74
                                        },
                                        letter: {
                                            label: $scope.getPaperFormats('letter'),
                                            tamanio: 'letter',
                                            height: 279.4,
                                            width: 215.9
                                        }
                                    };
                                    $scope.setLabelPaperSize = function () {
                                        $scope.paperSizes.a3.label = $scope.getPaperFormats('a3');
                                        $scope.paperSizes.a4.label = $scope.getPaperFormats('a4');
                                        $scope.paperSizes.a5.label = $scope.getPaperFormats('a5')
                                        $scope.paperSizes.a6.label = $scope.getPaperFormats('a6')
                                        $scope.paperSizes.a7.label = $scope.getPaperFormats('a7')
                                        $scope.paperSizes.letter.label = $scope.getPaperFormats('letter')
                                    }


                                    $scope.selectedSize = $scope.paperSizes['a4'];

                                    $scope.closeDialog = function () {
                                        dialog.close();
                                    };

                                    $scope.onSizeChange = function (val) {
                                        $scope.selectedSize = val;
                                    };

                                    $scope.changeAspectRatio = function (val) {
                                        $scope.print.aspectRatio = val;

                                    };
                                    $scope.onPrintLayout = function (val) {
                                        $scope.selectedLayout = val;
                                        $scope.setLabelPaperSize();
                                    };

                                    $scope.pdfExport = function () {
                                        qlik.theme.apply($rootScope.ThemesDownloadImage).then(function (result) {
                                            $scope.state = $scope.states.PENDING;
                                            let _width, _height, _objectWidth, _objectHeigth, _dpi, _settings;
                                            _width = ("portrait" === $scope.selectedLayout.orientation ? $scope.selectedSize.width : $scope.selectedSize.height);
                                            _height = ("portrait" === $scope.selectedLayout.orientation ? $scope.selectedSize.height : $scope.selectedSize.width);
                                            _objectWidth = $('#' + dataIDPDF).width();
                                            _objectHeigth = $('#' + dataIDPDF).height();
                                            _dpi = $scope.print.dpi

                                            if ($scope.print.aspectRatio == 0) {
                                                _settings = {
                                                    print: _dpi,
                                                    documentSize: $scope.selectedSize.tamanio,
                                                    orientation: $scope.selectedLayout.orientation,
                                                    objectSize: { width: (_objectWidth * 10), height: (_objectHeigth * 10) }
                                                }
                                            } else {
                                                _settings = {
                                                    print: _dpi,
                                                    documentSize: $scope.selectedSize.tamanio,
                                                    orientation: $scope.selectedLayout.orientation,
                                                    aspectRatio: parseInt($scope.print.aspectRatio),
                                                    objectSize: { width: (_objectWidth * 10), height: (_objectHeigth * 10) }
                                                }
                                            }




                                            let isContainer = vis.model.genericType == 'container' ? true : false;
                                            if (isContainer) {
                                                vis.model.getProperties().then(function () {
                                                    let activeObjectFromContainer = vis.model.items.activeId;
                                                    let result = $rootScope.ITEMS.filter(obj => {
                                                        return obj.id === activeObjectFromContainer;
                                                    });
                                                    let visual = result[0].vis;
                                                    if (visual) {
                                                        visual.exportPdf(_settings).then(function (result) {
                                                            $scope.printUrl = result;
                                                            $scope.state = $scope.states.COMPLETED;
                                                            qlik.theme.apply($rootScope.ThemesInit);
                                                        }).catch(function (error) {
                                                            console.log(error);
                                                            $scope.state = $scope.states.FAILED;
                                                        });
                                                    } else {
                                                        console.log(error);
                                                        $scope.state = $scope.states.FAILED;
                                                    }
                                                })
                                            } else {
                                                let result = $rootScope.ITEMS.filter(obj => {
                                                    return obj.id === dataIDPDF;
                                                });
                                                let visual = result[0].vis;
                                                if (visual) {
                                                    visual.exportPdf(_settings).then(function (result) {
                                                        $scope.printUrl = result;
                                                        $scope.state = $scope.states.COMPLETED;
                                                        qlik.theme.apply($rootScope.ThemesInit);
                                                    }).catch(function (error) {
                                                        console.log(error);
                                                        $scope.state = $scope.states.FAILED;
                                                    });
                                                } else {
                                                    $scope.state = $scope.states.FAILED;
                                                }


                                            }




                                        });
                                    };
                                }]
                            });
                            setTimeout(function () {
                                $('.lui-modal-background').addClass('mz-print-dialog');
                            }, 100);
                        };


                        $scope.exportDatos = function (ID) {
                            $('body').prepend(_loading);
                            $scope.close();
                            $rootScope.APP.visualization.get(ID).then(function (visual) {
                                let isContainer = visual.model.genericType == 'container' ? true : false
                                if (isContainer) {
                                    vis.model.getProperties().then(function () {
                                        let activeObjectFromContainer = vis.model.items.activeId;
                                        $rootScope.APP.visualization.get(activeObjectFromContainer).then(function (visual) {
                                            visual.exportData({ state: 'A', format: 'OOXML' }).then(function (result) {
                                                showExportDatos(result);
                                                $('#loading-export').remove();
                                            }).catch(function (error) {
                                                console.log(error);
                                            });
                                        })
                                    })
                                } else {
                                    visual.exportData({ state: 'A', format: 'OOXML' }).then(function (result) {
                                        showExportDatos(result);
                                        $('#loading-export').remove();
                                    }).catch(function (error) {
                                        console.log(error);
                                    });
                                }
                            });
                        };

                        function showExportDatos(url) {
                            $http.get('js/Directives/contextmenu/_templates/ExportDatos-template.html').then(function (response) {
                                var plantillaHTML = response.data;

                                var dialog = luiDialog.show({
                                    template: plantillaHTML,
                                    closeOnEscape: true,
                                    controller: ['$scope', function ($scope) {
                                        $scope.closeDialog = function () {
                                            dialog.close();
                                        }
                                        $scope.URLDOWNLOAD = url;
                                    }]
                                })
                            })
                        }




                                                $scope.ExportImage = function (ID) {
                            $scope.close();
                            $('body').prepend(_loading);
                            let _ID = ID;
                            let _element = document.getElementById(_ID);


                            let _template = ExportImageTemplate;
                            let dialog = luiDialog.show({
                                template: _template,
                                closeOnEscape: false,
                                controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                    $scope.printUrl = '';
                                    $scope.states = {
                                        NODATA: -4,
                                        CANCELED: -3,
                                        TIMEOUT: -2,
                                        FAILED: -1,
                                        IDLE: 0,
                                        PENDING: 1,
                                        COMPLETED: 2
                                    };
                                    $scope.state = 0;
                                    let r = "png";
                                    $scope.imageSetting = {
                                        imageType: r,
                                        captureSize: {
                                            dpi: 96,
                                            height: _element.offsetHeight,
                                            width: _element.offsetWidth
                                        }
                                    };
                                    $scope.availableFormats = ["Jpeg", "Png"];
                                    $scope.format = "Png";

                                    $scope.onImageCustomSize = function (val) {
                                        let _val = val;
                                        $scope.imageCustomSize = _val;
                                    };

                                    $scope.onChangeHeight = function (n, $event) {
                                        let t = $($event.currentTarget).parents('.print-image');
                                        let i = parseInt(n, 10) || 0;
                                        let quiMin = parseInt($(t).attr('data-quiMin'));
                                        let quiMax = parseInt($(t).attr('data-quiMax'));
                                        $scope.imageSetting.captureSize.height = $scope.getNumerical(parseInt(t.find(".lui-input").val(), 10) + i, quiMin, quiMax);
                                    };

                                    $scope.onChangeImputHeight = function (n, ID) {
                                        let t = $('#' + ID).parents('.print-image');
                                        let i = parseInt(n, 10) || 0;
                                        let quiMin = parseInt($(t).attr('data-quiMin'));
                                        let quiMax = parseInt($(t).attr('data-quiMax'));
                                        $scope.imageSetting.captureSize.height = $scope.getNumerical(parseInt(t.find(".lui-input").val(), 10) + i, quiMin, quiMax);
                                    }

                                    $scope.onChangeWidth = function (n, $event) {
                                        let t = $($event.currentTarget).parents('.print-image');
                                        let i = parseInt(n, 10) || 0;
                                        let quiMin = parseInt($(t).attr('data-quiMin'));
                                        let quiMax = parseInt($(t).attr('data-quiMax'));
                                        $scope.imageSetting.captureSize.width = $scope.getNumerical(parseInt(t.find(".lui-input").val(), 10) + i, quiMin, quiMax);
                                    };

                                    $scope.onChangeImputWidth = function (n, ID) {
                                        let t = $('#' + ID).parents('.print-image');
                                        let i = parseInt(n, 10) || 0;
                                        let quiMin = parseInt($(t).attr('data-quiMin'));
                                        let quiMax = parseInt($(t).attr('data-quiMax'));
                                        $scope.imageSetting.captureSize.width = $scope.getNumerical(parseInt(t.find(".lui-input").val(), 10) + i, quiMin, quiMax);
                                    }

                                    $scope.onChangeDpi = function (n, $event) {
                                        let t = $($event.currentTarget).parents('.print-image');
                                        let i = parseInt(n, 10) || 0;
                                        let quiMin = parseInt($(t).attr('data-quiMin'));
                                        let quiMax = parseInt($(t).attr('data-quiMax'));
                                        $scope.imageSetting.captureSize.dpi = $scope.getNumerical(parseInt(t.find(".lui-input").val(), 10) + i, quiMin, quiMax);
                                    };

                                    $scope.onChangeImputDpi = function (n, ID) {
                                        let t = $('#' + ID).parents('.print-image');
                                        let i = parseInt(n, 10) || 0;
                                        let quiMin = parseInt($(t).attr('data-quiMin'));
                                        let quiMax = parseInt($(t).attr('data-quiMax'));
                                        $scope.imageSetting.captureSize.dpi = $scope.getNumerical(parseInt(t.find(".lui-input").val(), 10) + i, quiMin, quiMax);
                                    }

                                    $scope.getNumerical = function e(t, n, r) {
                                        t = i(t);
                                        n = Number(n);
                                        r = Number(r);
                                        if (t < n)
                                            return n;
                                        if (0 !== r && t > r)
                                            return r;
                                        return t;
                                    };
                                    function i(e) {
                                        return Number(String(e).replace(/[^-\d]/g, ""))
                                    }

                                    $scope.dowloadImage = function () {
                                        qlik.theme.apply($rootScope.ThemesDownloadImage).then(function (result) {
                                            $scope.state = $scope.states.PENDING;
                                            let settings = { format: $scope.format.toLowerCase().toString(), height: $scope.imageSetting.captureSize.height, width: $scope.imageSetting.captureSize.width };

                                            let isContainer = vis.model.genericType == 'container' ? true : false;
                                            if (isContainer) {
                                                let activeObjectFromContainer = vis.model.items.activeId;
                                                $rootScope.APP.visualization.get(activeObjectFromContainer).then(function (viz) {
                                                    viz.exportImg(settings).then(function (res) {
                                                        $scope.state = $scope.states.COMPLETED;
                                                        $scope.printUrl = res;
                                                        qlik.theme.apply($rootScope.ThemesInit);
                                                        $('#loading-export').remove();
                                                    }).catch(function (error) {
                                                        $scope.state = $scope.states.FAILED;
                                                        console.log(error);
                                                        $('#loading-export').remove();
                                                    });
                                                })
                                            } else {
                                                vis.exportImg(settings).then(function (res) {
                                                    $scope.state = $scope.states.COMPLETED;
                                                    $scope.printUrl = res;
                                                    qlik.theme.apply($rootScope.ThemesInit);
                                                    $('#loading-export').remove();
                                                }).catch(function (error) {
                                                    $scope.state = $scope.states.FAILED;
                                                    console.log(error);
                                                    $('#loading-export').remove();
                                                });
                                            }


                                        });
                                    };
                                }]
                            });
                            setTimeout(function () {
                                $('.lui-modal-background').addClass('mz-print-dialog');
                            }, 300);
                        };


                        $scope.showEqualizador = function (valor) {
                            return valor;
                        };

                        function getVis() {
                            let defer = $q.defer();
                            switch ($scope.typeObject) {
                                case 'pivot-table':
                                    defer.resolve(vis);
                                    break;
                                case 'container':
                                    vis.model.getProperties().then(function () {
                                        let activeObjectFromContainer = vis.model.items.activeId;
                                        $rootScope.APP.visualization.get(activeObjectFromContainer).then(function (viz) {
                                            defer.resolve(viz);
                                        })
                                    })
                                    break;
                                default:
                                    $scope.isPivotTable = false;
                                    break;
                            }
                            return defer.promise;
                        }

                        $scope.expandirTodo = function () {
                            let _patches = [{
                                "qPath": "/qHyperCubeDef/qAlwaysFullyExpanded",
                                "qOp": "replace",
                                "qValue": "false"
                            }];

                            getVis().then(function (rest) {
                                rest.model.applyPatches(_patches, true).then(function () {
                                    rest.model.expandTop({
                                        "qPath": "/qHyperCubeDef",
                                        "qRow": 0,
                                        "qCol": 0,
                                        "qAll": true
                                    }).then(function () {
                                        rest.model.expandLeft({
                                            "qPath": "/qHyperCubeDef",
                                            "qRow": 0,
                                            "qCol": 0,
                                            "qAll": true
                                        })
                                        $scope.close();
                                    })
                                });
                            })


                        };

                        $scope.contraerTodo = function () {
                            let _patches = [{
                                "qPath": "/qHyperCubeDef/qAlwaysFullyExpanded",
                                "qOp": "replace",
                                "qValue": "false"
                            }];


                            getVis().then(function (rest) {
                                rest.model.applyPatches(_patches, true).then(function () {
                                    rest.model.collapseTop({
                                        "qPath": "/qHyperCubeDef",
                                        "qRow": 0,
                                        "qCol": 0,
                                        "qAll": true
                                    }).then(function () {
                                        rest.model.collapseLeft({
                                            "qPath": "/qHyperCubeDef",
                                            "qRow": 0,
                                            "qCol": 0,
                                            "qAll": true
                                        })
                                        $scope.close();
                                    })
                                });
                            })
                        };

                    }).finally(function () {
                        $scope.IsVisibleContexMenu = true;

                    }).catch(function (e) {
                        console.log(e)
                    });

                    $scope.limpiarSoftPatches = function () {
                        $scope.MODEL.clearSoftPatches();
                        if (sessionStorage["Object" + $scope.MODEL.id]) {
                            sessionStorage.removeItem("Object" + $scope.MODEL.id);
                        }
                        $scope.close();
                    }




                    if ($rootScope.HELPOBJECT) {
                        function getLayoutDimension(arr) {
                            return Promise.all(arr.map(async value => {
                                try {
                                    if(value.qLibraryId){
                                        const qBook = await $rootScope.APP.model.engineApp.getDimension({ "qId": value.qLibraryId });
                                        const res = await qBook.getLayout();

                                            return {
                                            title: res.qDim.title || res.qDim.qLabelExpression,
                                            description: res.qDim.descriptionExpression || res.qMeta.description,
                                            tags: res.qMeta.tags
                                        };
                                    }else{
                                        return{
                                            title: value.qFallbackTitle || '',
                                            description: '',
                                            tags: ''
                                        }
                                    }

                                } catch (error) {
                                    console.error("Error fetching dimension layout:", error);
                                    return null;
                                }
                            }));
                        }


                        function getLayoutMeasure(arr) {
                            return Promise.all(arr.map(async value => {
                                try {
                                    if(value.qLibraryId){
                                        const qBook = await $rootScope.APP.model.engineApp.getMeasure({ "qId": value.qLibraryId });
                                        const res = await qBook.getLayout();

                                            return {
                                            title: res.qMeasure.qLabel || res.qMeasure.qLabelExpression,
                                            description: res.qMeasure.descriptionExpression || res.qMeta.description,
                                            tags: res.qMeta.tags
                                        };
                                    }else{
                                        return{
                                            title: value.qFallbackTitle || '',
                                            description: '',
                                            tags: ''
                                        }
                                    }

                                } catch (error) {
                                    console.error("Error fetching measure layout:", error);
                                    return null;
                                }
                            }));
                        }


                        var deregister = $scope.$on("openhelp", function (evt, data) {
                            $scope.showHelpObject(data);
                        });
                        $scope.$on('$destroy', function destroyScope() {
                            deregister();
                        });

                        $rootScope.ID_IDIOMA_ACTIVE = '';








                        $scope.showHelpObject = function (idObject) {
                            $scope.close();
                            let _template = HelpTemplate;
                            let dialog = luiDialog.show({
                                template: _template,
                                closeOnEscape: true,
                                input: { IDOBJECT: idObject, MODELOBJECT: $scope.MODEL, ISADMIN: $rootScope.ISADMIN },
                                controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                    $scope.objectLayoutLoaded = false;
                                    $scope.objectLayout = '';
                                    $scope.DESCRIPCION = '';
                                    $rootScope.APP.model.engineApp.getObject(
                                        {
                                            "qId": idObject
                                        }
                                    ).then(async function (qBook) {
                                        $scope.txtDetalleTab = $translate.instant("help.txt.detalleTab");
                                        $scope.TITULO = qBook.layout.title;

                                        var id_idioma = $rootScope.IDIOMASAPI.find((idioma) => idioma.codigo.toUpperCase() == $rootScope.language.toUpperCase()).id;
                                        $rootScope.ID_IDIOMA_ACTIVE = id_idioma;
                                        await mzApiGlobalService.obtenerAyudaObjeto(idObject, id_idioma).then(function (descripcion) {
                                            $scope.DESCRIPCION = descripcion.data?.descripcion;
                                        })



                                        async function fetchDataAndSetQDIMENSIONLIST(QDIMENSION) {
                                            try {
                                                const dimensionLayout = await getLayoutDimension(QDIMENSION);
                                                $scope.QDIMENSIONLIST = dimensionLayout.filter(item => item !== null);
                                            } catch (error) {
                                                console.error("Error fetching dimension data:", error);
                                            }
                                        }
                                        var QDIMENSION = qBook.layout?.qHyperCube?.qDimensionInfo;
                                        if (QDIMENSION) {
                                            fetchDataAndSetQDIMENSIONLIST(QDIMENSION);
                                        } else {
                                            $scope.QDIMENSIONLIST = false;
                                        }


                                        async function fetchDataAndSetQMEASURELIST() {
                                            try {
                                                const measureLayout = await getLayoutMeasure(QMEASURE);
                                                $scope.QMEASURELIST = measureLayout.filter(item => item !== null);

                                            } catch (error) {
                                                console.error("Error fetching measure data:", error);
                                            }
                                        }

                                        var QMEASURE = qBook.layout?.qHyperCube?.qMeasureInfo;
                                        if (QMEASURE) {
                                            fetchDataAndSetQMEASURELIST(QMEASURE);
                                        } else {
                                            $scope.QMEASURELIST = false;
                                        }



                                        qBook.getLayout().then(function (res) {
                                            $scope.objectLayout = res;
                                        }).catch(function (e) {
                                            $scope.objectLayout = false
                                        })
                                    })
                                    $scope.showLayout = function () {
                                        if ($scope.objectLayoutLoaded == false) {
                                            setTimeout(() => {
                                                $scope.objectLayoutLoaded = true;
                                                $('#load-codemirror').remove().promise().done(function () {
                                                    codemirror(document.getElementById('editor-container'), {
                                                        value: JSON.stringify($scope.objectLayout, null, "\t"),
                                                        mode: "javascript", 
                                                        lineNumbers: true,
                                                        readOnly: true
                                                    });
                                                })
                                            }, 600);

                                        }

                                    }





                                    var excludeObjectSnapshot = ['pivot-table', 'table', 'map'];
                                    setTimeout(() => {
                                        const HTML = document.getElementById("SNAPSHOT");

                                        if (!excludeObjectSnapshot.includes($scope.MODELOBJECT.layout.visualization)) {
                                            $rootScope.APP.getSnapshot(HTML, idObject)
                                                .then((res) => {
                                                })
                                                .catch((error) => {
                                                    console.error(error);
                                                });
                                        }
                                    }, 300);


                                    $scope.editDescriptions = () => {
                                        dialog.close();
                                        let dialogEditor = luiDialog.show({
                                            template: HtmlEditorTemplate,
                                            closeOnEscape: false,
                                            input: { DESCRIPCION: $scope.DESCRIPCION, IDOBJECT: idObject },
                                            controller: ['$scope', '$rootScope', 'InitConfig', function ($scope, $rootScope, InitConfig) {
                                                $scope.multilanguage = $rootScope.multilanguage;
                                                $scope.IDIOMASAPI = $rootScope.IDIOMASAPI;
                                                $scope.language = $rootScope.language;
                                                $scope.closeDialog = function () {
                                                    deregisterDescription();
                                                    dialogEditor.close();
                                                    $rootScope.$broadcast('openhelp', idObject);
                                                };


                                                const saveDescriptionEvent = "saveDescription";

                                                const deregisterDescription = $scope.$on(saveDescriptionEvent, async function (evt, data) {
                                                    console.log(data)
                                                    const selectedIdioma = data;
                                                    const id_idioma = selectedIdioma ? selectedIdioma : null;

                                                    if (!id_idioma) {
                                                        console.error("No se encontró el idioma correspondiente.");
                                                        return;
                                                    }

                                                    const id_objeto = idObject;
                                                    const app_id = $rootScope.APP.id;
                                                    const app_name = InitConfig.arrApps.find(app => app.idapp === app_id).name;
                                                    const descripcion = $scope.DESCRIPCION;

                                                    const datos = {
                                                        object_id: id_objeto,
                                                        idioma_id: id_idioma,
                                                        app_id: app_id,
                                                        app_name: app_name,
                                                        descripcion: descripcion
                                                    };

                                                    try {
                                                        const isExist = await mzApiGlobalService.existeAyudaObjeto(id_objeto, id_idioma);

                                                        const promise = isExist ?
                                                            mzApiGlobalService.actualizarAyudaObjeto(datos) :
                                                            mzApiGlobalService.crearAyudaObjeto(datos);

                                                        await promise;
                                                        dialogEditor.close();
                                                        $rootScope.$broadcast('openhelp', idObject);
                                                    } catch (error) {
                                                        console.error("Error:", error);
                                                    }
                                                });

                                                $scope.$on('$destroy', function destroyScope() {
                                                    deregisterDescription();
                                                });






                                                $scope.save = ()=>{


                                                    $rootScope.$broadcast('saveDescription', $rootScope.ID_IDIOMA_ACTIVE);




                                                }



                                                $scope.isDisabledSave = true;
                                                $scope.htmlEditorOptions = {
                                                    value: $scope.DESCRIPCION,
                                                    bindingOptions: {
                                                        value: 'DESCRIPCION'
                                                    },
                                                    toolbar: {
                                                        items: [
                                                            'undo', 'redo', 'separator',
                                                            {
                                                                name: 'size',
                                                                acceptedValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
                                                            },
                                                            'separator', 'bold', 'italic', 'strike', 'underline', 'separator',
                                                            'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
                                                            'orderedList', 'bulletList', 'separator',
                                                            {
                                                                name: 'header',
                                                                acceptedValues: [false, 1, 2, 3, 4, 5],
                                                            }, 'separator',
                                                            'color', 'separator',
                                                            'link', 'image', 'separator',
                                                        ],
                                                    },
                                                    mediaResizing: {
                                                        enabled: true,
                                                    },
                                                    imageUpload: {
                                                        fileUploadMode: 'base64',
                                                    },
                                                    onValueChanged: function (e) {
                                                        if (e.value === "") {
                                                            $scope.isDisabledSave = true;
                                                        } else {
                                                            $scope.isDisabledSave = e.model.htmlEditorOptions.value === e.value;
                                                        }
                                                    }
                                                };

                                                $scope.changeTextEditor = async (item, event) => {
                                                    var _el = event.currentTarget;
                                                    var isActive = _el.classList.contains('active');

                                                                                                    if (!isActive) {
                                                        var listLanguages = document.querySelectorAll('#list-languages .item-list');
                                                        listLanguages.forEach(function(el) {
                                                            el.classList.remove('active');
                                                        });

                                                                                                        _el.classList.add('active');

                                                                                                        let id_idioma = item.id;
                                                        let id_object = idObject;
                                                        $rootScope.ID_IDIOMA_ACTIVE = id_idioma;

                                                                                                        try {
                                                            const descripcion = await mzApiGlobalService.obtenerAyudaObjeto(id_object, id_idioma);                                                            
                                                            $scope.DESCRIPCION = descripcion.data?.descripcion;
                                                            setTimeout(() => { $scope.$apply();}, 0);
                                                            setTimeout(() => { $scope.$apply($scope.isDisabledSave = true) ; }, 100);
                                                        } catch (error) {
                                                            console.error("Error:", error);
                                                        }
                                                    }
                                                }


                                                                                            }]
                                        })
                                    }


                                    $scope.closeDialog = function () {
                                        deregister();
                                        dialog.close();
                                    };
                                }]
                            });
                        }
                    }


                });
                $scope.comparaObjeto = function (id) {
                    $('#page-container').scrollTop(0)
                    var idObject = id;
                    let newScope = $scope.$parent.$new();
                    $scope.getIdObject(idObject).then(function (res) {
                        let objectID = res;
                        $injector.invoke(function () {
                            $('contextmenu').remove();
                            let _html = `<div id="fullsizeCompareContainer"><compareobject class="object-full-size-compare" object-id="${objectID}" ` + (typeof indeApp != 'undefined' ? `app-id="${indeApp}"` : '') + `></compareobject></div>`;
                            let _el = $compile(_html)(newScope);
                            $('#page-container').prepend(_el).promise().done(function () {
                                $(document.body).addClass('body-compare');
                            });

                        });
                    })
                }
            }]
        };
        return directiveDefinitionObject;
    });
});