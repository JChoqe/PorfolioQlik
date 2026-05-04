var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore',
    'moment',
], function (qlik, app, us, moment) {

    app.controller('FavoritosCtrl', ['$scope', '$rootScope', '$stateParams', '$state', '$translate', 'InitConfig', '$q', '$timeout', '$compile', '$http', function ($scope, $rootScope, $stateParams, $state, $translate, InitConfig, $q, $timeout, $compile, $http) {
        if(!$rootScope._thisCurrentApp){
            $state.go('Home.inicio');
            return;
        }
        $rootScope.ShowMenu = false;
        $rootScope.OpenFiltros = false;

        if ($stateParams.URLMENU) {
            $rootScope.rutaMenuTop = $stateParams.URLMENU;
        } else {
            $rootScope.rutaMenuTop = '';
        }
        function translateArr(arr) {
            var defer = $q.defer();
            var newArr = [];
            angular.forEach(arr, function (value, key) {
                newArr.push($translate.instant(value));
            });

            defer.resolve(newArr);
            return defer.promise;
        }
        if ($stateParams.PATH) {
            if (InitConfig.multilanguage == true) {
                translateArr($stateParams.PATH).then(function (res) {
                    $rootScope.tituloSeccion = res.reduce(function (total, element) {
                        var iNext = ' <i class="icofont icofont-rounded-right"></i> ';
                        return total + iNext + element;
                    });
                });
                $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                    translateArr($stateParams.PATH).then(function (res) {
                        $rootScope.tituloSeccion = res.reduce(function (total, element) {
                            var iNext = ' <i class="icofont icofont-rounded-right"></i> ';
                            return total + iNext + element;
                        });
                    });
                });
            } else {
                $rootScope.tituloSeccion = $stateParams.PATH.reduce(function (total, element) {
                    var iNext = ' <i class="icofont icofont-rounded-right"></i> ';
                    return total + iNext + element;
                });
            }

        }



        $rootScope.itemsObject = $('.row-page objectsense').length;
        $rootScope.round = 1;
        $rootScope.ITEMS = [];
        if($stateParams.SHEETFAVORITES){
            $rootScope.SHEETFAVORITES = true;
        }else{
            $rootScope.SHEETFAVORITES = false;
        }



        $rootScope.isVisible = function (ruta) {
            var _state = $state.current.name;
            var _ruta = ruta;
            if (_ruta == _state) {
                return true;
            } else {
                return false;
            }
        };

        $rootScope.isMenuHide = function () {
            var _width = $(window).outerWidth();
            if (_width <= '1024') {
                return true;
            } else {
                return false;
            }
        };

        $rootScope.glossaryArr = [];
        $rootScope.listBookmark = [];
        $rootScope.listBookmarkDefault = [];
        $rootScope.listFiltros = [];
        $scope.noGlosary = InitConfig.noGlosary;
        var proDimensions, proMeasures;
        function getListDimensions(arr) {
            proDimensions = new Promise(resolve => {
                var arrDimensions = [];
                $.each(arr, function (key, value) {
                    var TAGS = value.qMeta.tags;
                    if (!TAGS.some(r => $scope.noGlosary.includes(r))) {
                        if (value.qData.hasOwnProperty('descriptionExpression')) {
                            var _item = {};
                            _item.descripcion = value.qData.descriptionExpression;
                            _item.type = $translate.instant('equalizer.label.dimensiones');
                            if (value.qData.hasOwnProperty('qLabelExpression')) {
                                _item.name = value.qData.qLabelExpression;
                                _item.tags = TAGS;
                            } else {
                                _item.name = value.qData.title;
                                _item.tags = TAGS;
                            }

                        } else {
                            var _item = {};
                            if (value.qData.hasOwnProperty('qLabelExpression')) {
                                _item.name = value.qData.qLabelExpression;
                                _item.descripcion = value.qData.description;
                                _item.type = $translate.instant('equalizer.label.dimensiones');
                                _item.tags = TAGS;

                            } else {
                                _item.name = value.qData.title;
                                _item.descripcion = value.qMeta.description;
                                _item.type = $translate.instant('equalizer.label.dimensiones');
                                _item.tags = TAGS;
                            }
                        }
                        if (_item.name != '-' && _item.name != '') {
                            arrDimensions.push(_item);
                        }

                    }
                })
                resolve(arrDimensions);
            })
        }
        function getListMeasures(arr) {
            proMeasures = new Promise(resolve => {
                var arrMeasures = [];
                $.each(arr, function (key, value) {
                    var TAGS = value.qMeta.tags;
                    if (!TAGS.some(r => $scope.noGlosary.includes(r))) {
                        if (value.qData.hasOwnProperty('descriptionExpression')) {
                            var _item = {};
                            _item.descripcion = value.qData.descriptionExpression;
                            _item.type = $translate.instant('equalizer.label.medidas');
                            if (value.qData.hasOwnProperty('qLabelExpression')) {
                                _item.name = value.qData.qLabelExpression;
                                _item.tags = TAGS;
                            } else {
                                _item.name = value.qData.title;
                                _item.tags = TAGS;
                            }

                        } else {
                            var _item = {};
                            if (value.qData.hasOwnProperty('qLabelExpression')) {
                                _item.name = value.qData.qLabelExpression;
                                _item.descripcion = value.qData.description;
                                _item.type = $translate.instant('equalizer.label.medidas');
                                _item.tags = TAGS;

                            } else {
                                _item.name = value.qData.title;
                                _item.descripcion = value.qMeta.description;
                                _item.type = $translate.instant('equalizer.label.medidas');
                                _item.tags = TAGS;
                            }
                        }
                        if (_item.name != '-' && _item.name != '') {
                            arrMeasures.push(_item);
                        }

                    }
                })
                resolve(arrMeasures);
            })
        }
        function getGlosario() {
            return new Promise(resolve => {
                $rootScope._thisCurrentApp.model.waitForOpen.promise.then(() => {
                    $rootScope._thisCurrentApp.model.engineApp.createSessionObject(
                        {
                            qInfo: { qId: "LB02", qType: "MasterList" },
                            qDimensionListDef: {
                                qType: "dimension",
                                qData: {
                                    qDimension: "/qDimension",
                                    title: "/qMetaDef/title",
                                    description: "/qMetaDef/description",
                                    tags: "/qMetaDef/tags",
                                    grouping: "/qDim/qGrouping",
                                    info: "/qDimInfos",
                                    descriptionExpression: "/qData/descriptionExpression",
                                    qLabelExpression: "/qData/qLabelExpression",
                                    qDim: "/qDim"
                                }
                            },
                            qMeasureListDef: {
                                qType: "measure",
                                qData: {
                                    qMeasure: "/qMeasure",
                                    title: "/qMetaDef/title",
                                    description: "/qMetaDef/description",
                                    tags: "/qMetaDef/tags",
                                    grouping: "/qDim/qGrouping",
                                    info: "/qDimInfos",
                                    descriptionExpression: "/qData/descriptionExpression",
                                    qLabelExpression: "/qData/qLabelExpression",
                                    qDim: "/qDim"
                                }
                            },
                        }
                    ).then(function (qBook) {
                        qBook.getLayout().then(function (res) {
                            var SESSIONLIS = {};
                            SESSIONLIS.idSession = 'LB02';
                            SESSIONLIS.appId = $rootScope._thisCurrentApp.id;
                            $rootScope.LISTSESSION.push(SESSIONLIS);
                            getListDimensions(res.qDimensionList.qItems);
                            getListMeasures(res.qMeasureList.qItems);

                            Promise.all([proDimensions, proMeasures]).then(values => {
                                var arr0 = [].concat.apply([], values[0])
                                var arr1 = [].concat.apply([], values[1])
                                var newArr = arr0.concat(arr1);
                                resolve(newArr);
                            });

                        }).catch(function (error) {
                            console.log(error)
                        })
                    })




                })
            });
        }
        async function asyncCallGetGlosario() {
            const result = await getGlosario();
            $rootScope.glossaryArr = [];
            $rootScope.glossaryArr = result;
        }

        $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
            setTimeout(function () {
                asyncCallGetGlosario();
            }, 600)
        });


        function getListadoBookmark() {
            return new Promise(resolve => {
                var APP = $rootScope._thisCurrentApp;


                APP.getList("BookmarkList", function (reply) {
                    var listBookmark = [];
                    var listBookmarDefault = [];
                    moment.locale($translate.use());
                    reply.qBookmarkList.qItems.forEach(function (value) {
                        if (!value.qMeta.hasOwnProperty('extensionId')) {
                            var itemBookmark = {};

                            itemBookmark.title = value.qData.title;
                            itemBookmark.description = value.qData.description;
                            itemBookmark.sheetId = value.qData.sheetId;
                            itemBookmark.id = value.qInfo.qId;
                            itemBookmark.selectionFields = value.qData.selectionFields;
                            itemBookmark.creationDate = moment(value.qData.creationDate).format('DD/MM/YYYY');
                            itemBookmark.defaultBookmarkId = value.qMeta.hasOwnProperty('defaultBookmarkId') ? value.qMeta.defaultBookmarkId : '';

                            if ($rootScope.IsPersonalMode == false) {
                                itemBookmark.owner = value.qMeta.owner.userId || '';
                                itemBookmark.published = value.qMeta.published == true;
                                itemBookmark.canDelete = value.qMeta.privileges ? value.qMeta.privileges.includes("delete") : false;
                                itemBookmark.canPublish = value.qMeta.privileges ? value.qMeta.privileges.includes("publish") : false;
                            } else {
                                itemBookmark.owner = '';
                                itemBookmark.published = false;
                                itemBookmark.canDelete = true;
                                itemBookmark.canPublish = false;
                            }
                            if (!value.qMeta.hasOwnProperty('isDefaultBookmark')) {
                                itemBookmark.isDefaultBookmark = false;
                                listBookmark.push(itemBookmark);
                            } else {
                                $rootScope.defaultBookmarkId = value.qMeta.defaultBookmarkId;
                                itemBookmark.isDefaultBookmark = true;
                                listBookmarDefault.push(itemBookmark);
                            }
                        }



                    });
                    $rootScope.listBookmark = listBookmark;
                    $rootScope.listBookmarkDefault = listBookmarDefault;
                    resolve([listBookmark, listBookmarDefault]);
                });
            })
        }

        async function asyncCallGetListadoBookmark() {
            const result = await getListadoBookmark();
            $rootScope.listBookmark = [];
            $rootScope.listBookmark = result[0];
            $rootScope.listBookmarkDefault = result[1];
        }


        $rootScope.NoFiltersSelected = true;
        $rootScope.totalFiltros = 0;
        function getListadoFiltros() {
            return new Promise(resolve => {
                var APP = $rootScope._thisCurrentApp;
                APP.getList("SelectionObject", function (reply) {
                    var filterNoShow = 0;
                    (reply.qSelectionObject.qSelections.length > 0) ? $rootScope.NoFiltersSelected = false : $rootScope.NoFiltersSelected = true;
                    var arrFiltros = [];
                    $.each(reply.qSelectionObject.qSelections, function (key, value) {
                        var starWith = value.qField.startsWith('_')
                        if (starWith) {
                            filterNoShow = filterNoShow + 1;
                        } else {
                            var option = {};
                            option.index = key;
                            option.field = value.qField;
                            option.numSelected = value.qSelectedCount;
                            option.total = value.qTotal;
                            option.threshold = value.qSelectionThreshold;
                            option.selectedStr = value.qSelected;
                            option.qLocked = value.qLocked || false;
                            option.qOneAndOnlyOne = value.qOneAndOnlyOne || false;
                            var selectedStr = value.qSelected;
                            if (selectedStr.includes('ALL')) {
                                option.isClear = false;
                                option.isSelectAll = true;
                                option.isNotSelectAll = false;
                                option.isSelectAny = false;
                            } else if (selectedStr.includes('NOT')) {
                                option.isClear = false;
                                option.isNotSelectAll = true;
                                option.isSelectAll = false;
                                option.isSelectAny = false;
                            } else {
                                option.isClear = false;
                                option.isSelectAny = true;
                                option.isSelectAll = false;
                                option.isNotSelectAll = false;
                            }
                            if (option.isSelectAll) {
                                option.btnSelectAllDisable = true;
                                option.btnSelectAlternativeDisable = true;
                                option.btnSelectExcludedDisable = true;
                                option.btnClearDisable = false;
                            } else if (option.qOneAndOnlyOne) {
                                option.btnSelectAllDisable = true;
                                option.btnSelectAlternativeDisable = true;
                                option.btnSelectExcludedDisable = true;
                                option.btnClearDisable = true;
                            } else if (option.isNotSelectAll) {
                                option.btnSelectAllDisable = false;
                                option.btnSelectAlternativeDisable = false;
                                option.btnSelectExcludedDisable = false;
                                option.btnClearDisable = false;
                            } else if (option.qLocked) {
                                option.btnSelectAllDisable = true;
                                option.btnSelectAlternativeDisable = true;
                                option.btnSelectExcludedDisable = true;
                                option.btnClearDisable = true;
                            }

                            arrFiltros.push(option);
                        }

                    })
                    $rootScope.listFiltros = arrFiltros;
                    $rootScope.totalFiltros = reply.qSelectionObject.qSelections.length - filterNoShow;
                    resolve(arrFiltros);
                });
            })
        }

        async function asyncCallGetListadoFiltros() {
            const result = await getListadoFiltros();
            $rootScope.listFiltros = [];
            $rootScope.listFiltros = result;
        }

        function getLisContent() {
            return new Promise(resolve => {
                var APP = $rootScope._thisCurrentApp;
                var arrContent = [];
                APP.model.waitForOpen.promise.then(() => {
                    APP.model.engineApp.getLibraryContent(
                        {
                            "qName": $rootScope.FolderContent
                        }
                    ).then(function (qBook) {
                        $.each(qBook.qList, function (key, value) {
                            arrContent.push(value.qUrl)
                        })
                        resolve(arrContent);
                    })
                })
            })
        }

        async function asyncCallGetLisContent() {
            if ($rootScope.HasVideos == true) {
                const result = await getLisContent();
                $rootScope.urlContent = [];
                var extension = '.mp4';
                var x = result.filter(function (file) {
                    return file.indexOf(extension) !== -1;
                });
                $rootScope.urlContent = x;
                setTimeout(() => { $scope.$apply($rootScope.urlContent) }, 0);
            }
        }
        $scope.showInfoSheets = () => {
            $http.get('views/partial/info-sheets.html').then(function (response) {
                var _template = $compile(response.data)($scope);
                var dialog = luiDialog.show({
                    template: _template,
                    closeOnEscape: true,
                    controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                        setTimeout(() => {
                            $scope.$apply(function () {
                                $rootScope.asyncCallGetListModules();
                            })
                        }, 0);
                        $scope.closeDialog = function () {
                            dialog.close();
                        }
                    }]
                });
            })
        }

        $rootScope.MANUALLOADCONTENTAPP = () => {
            asyncCallGetListadoFiltros();
            asyncCallGetListadoBookmark();
            asyncCallGetGlosario();
        }





    }]);

});



