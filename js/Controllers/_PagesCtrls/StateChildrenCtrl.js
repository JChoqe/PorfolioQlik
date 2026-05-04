var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore',
], function (qlik, app, us) {

    app.controller('StateChildrenCtrl', ['$scope', '$rootScope', '$stateParams', '$state', '$translate', 'InitConfig', '$q', '$compile', 'selectionAPI', function ($scope, $rootScope, $stateParams, $state, $translate, InitConfig, $q, $compile, selectionAPI) {
        if (!$rootScope._thisCurrentApp) {
            $state.go('Home.inicio');
            return;
        }
        $rootScope.hasBookmarkDefaultUser = $rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.hasBookmarkDefaultUser;
        $rootScope.bookmarkDefaultUserId = $rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.bookmarkDefaultUserId;

        $rootScope.ShowMenu = false;

        $rootScope.insightAdvisorVisible = false;
        $rootScope.showInsightAdvisor = function () {
            $rootScope.insightAdvisorVisible = $rootScope._thisCurrentApp !== undefined ? true : false;
            return $rootScope.insightAdvisorVisible;
        }
        $rootScope.showInsightAdvisor();
        $rootScope.OpenFiltros = false;
        $rootScope.OpenBookmark = false;
        $rootScope.OpenAlerting = false;
        $rootScope.$broadcast('closeAlerting');
        $rootScope.OpenFiltersSelected = false;
        if ($stateParams.IDFILTRO) {
            $rootScope.IdFiltros = $stateParams.IDFILTRO;
            switch (typeof ($stateParams.IDFILTRO)) {
                case 'string':
                    $rootScope.isArray = false;
                    break;
                default:
                    $rootScope.isArray = true;
            }
        }



        async function clearFilter() {
            var promesa = new Promise((resolve, reject) => {
                if ($stateParams.FIELDCLEAR) {
                    angular.forEach($stateParams.FIELDCLEAR, function (value, key) {
                        $rootScope._thisCurrentApp.field(value).unlock().then(function () {
                            $rootScope._thisCurrentApp.field(value).clear();
                        });
                    });
                }
                resolve(true);
            });
            return promesa;
        }

        clearFilter().then(async function () {
            try {
                $rootScope._thisCurrentApp.model.waitForOpen.promise.then(async function () {
                    if ($stateParams.FIELDADD) {
                        angular.forEach($stateParams.FIELDADD, async function (value, key) {
                            $rootScope._thisCurrentApp.field(value.name).selectValues(value.values, false, false).then(async function (replay) {
                                if (value.onlyOne) {
                                    var app = $rootScope._thisCurrentApp;
                                    return app.global.session.rpc({
                                        "jsonrpc": "2.0",
                                        "id": 4,
                                        "method": "GetField",
                                        "handle": app.model.handle,
                                        "params": [`${value.name}`]
                                    }).then(async function (response) {
                                        if (response.result && response.result.qReturn && response.result.qReturn.qType === "Field") {
                                            var qHandle = response.result.qReturn.qHandle;
                                            app.global.session.rpc({
                                                "handle": qHandle,
                                                "method": "SetNxProperties",
                                                "params": {
                                                    "qProperties": {
                                                        "qOneAndOnlyOne": true
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                if (value.lock) {
                                    $rootScope._thisCurrentApp.field(value.name).lock();
                                }
                            });

                        });
                    }
                });
            } catch (e) { }
        });

        if ($stateParams.URLMENU) {
            $rootScope.rutaMenuTop = $stateParams.URLMENU;
        } else {
            $rootScope.rutaMenuTop = '';
        }
        if ($stateParams.SHEETSENSE) {
            $rootScope.SHEETSENSE = true;
        } else {
            $rootScope.SHEETSENSE = false;
        }
        if ($stateParams.SHEETFAVORITES) {
            $rootScope.SHEETFAVORITES = true;
        } else {
            $rootScope.SHEETFAVORITES = false;
        }
        if ($stateParams.SHEETVISUALIZACIONES) {
            $rootScope.SHEETVISUALIZACIONES = true;
        } else {
            $rootScope.SHEETVISUALIZACIONES = false;
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

        $scope.$on('$viewContentLoaded', async function () {
            if ($stateParams.FILTROSSELECCIONES) {
                $rootScope.idFiltrosRequired = $stateParams.FILTROSSELECCIONES.idFiltros;
                $rootScope.txtAvisoRequired = $stateParams.FILTROSSELECCIONES.txtAviso;
                $rootScope.fieldsRequired = $stateParams.FILTROSSELECCIONES.fieldRequired;
                $rootScope.fieldsLengt = $stateParams.FILTROSSELECCIONES.lengthFilters;
                var newScope = $scope.$new(false, $scope);
                var htmlcontent = $('.row-page');
                var _htmlBlock = '<filtersblock object-lengt="' + $rootScope.fieldsLengt + '" object-id="' + $stateParams.FILTROSSELECCIONES.idFiltros + '" object-txt="' + $stateParams.FILTROSSELECCIONES.txtAviso + '" object-required="' + $stateParams.FILTROSSELECCIONES.fieldRequired + '"></filtersblock>';
                angular.element(htmlcontent).append($compile(_htmlBlock)(newScope));
            }
        });

        $rootScope.itemsObject = $('.row-page objectsense').length;
        $rootScope.round = 0;
        $rootScope.ITEMS = [];





        $scope.toggleObjectChange = async function ($event) {
            var _this = $event.currentTarget;
            var _other = $(_this).parents('.box_object_inner_kpi').next('.box_object_inner_grafico');

            var _id_top = $(_this).attr('data-top');
            var _id_bottom = $(_other).attr('data-bottom');

            $(_this).parents('.box_mix_object').find('speeldial').attr('object-id', _id_top);

            $(_this).attr({
                'id': _id_bottom,
                'data-qlik-objid': _id_bottom,
                'data-top': _id_bottom
            }).promise().done(async function () {
                var _oInteraction = false;
                var _interactionObject = $(this).children(".qlik-embed").attr("data-interaction");
                if (_interactionObject === 'none') {
                    _oInteraction = true;
                }

                $rootScope._thisCurrentApp.getObject(this, _id_bottom, { "noInteraction": _oInteraction }).then(async function (model) {
                    if (model) {
                        $rootScope.lstModel.push(model);
                    }
                });
            });


            $(_other).attr({
                'id': _id_top,
                'data-qlik-objid': _id_top,
                'data-bottom': _id_top
            }).promise().done(async function () {
                var _oInteraction = false;
                var _interactionObject = $(this).children(".qlik-embed").attr("data-interaction");
                if (_interactionObject === 'none') {
                    _oInteraction = true;
                }

                $rootScope._thisCurrentApp.getObject(this, _id_top, { "noInteraction": _oInteraction }).then(async function (model) {
                    if (model) {
                        $rootScope.lstModel.push(model);
                    }
                });
            });
        };


        $rootScope.goToPage = async function ($event) {
            var _url = $($event.currentTarget).attr('data-url-page');
            var hasUrl = us.isEmpty(_url);
            switch (hasUrl) {
                case false:
                    $state.go(_url);
                    break;
                case true:
                    return false;
                    break;
                default:
                    return false;
                    break;
            }
        };


        $rootScope.isVisible = async function (ruta) {
            var _state = $state.current.name;
            var _ruta = ruta;
            if (_ruta == _state) {
                return true;
            } else {
                return false;
            }
        };

        $rootScope.isMenuHide = async function () {
            var _width = $(window).outerWidth();
            if (_width <= '1024') {
                return true;
            } else {
                return false;
            }
        };





















        var proAnalysisBookmark, proAnalysisState;
        function getAnalysisBookmark(IDBOOKMARK) {
            proAnalysisBookmark = new Promise((resolve, reject) => {
                $rootScope._thisCurrentApp.model.engineApp.getSetAnalysis(
                    {
                        "qBookmarkId": IDBOOKMARK
                    }
                ).then(function (qBook) {
                    resolve(qBook.qSetExpression)
                })
            })
        }
        function getAnalysisState() {
            proAnalysisState = new Promise(resolve => {
                console.log($rootScope._thisCurrentApp.model.engineApp);
                $rootScope._thisCurrentApp.model.engineApp.getSetAnalysis().then(function (qBook) {
                    resolve(qBook.qSetExpression)
                })
            })
        }


        if ($stateParams.BOOKMARKTOAPPLY) {
            var _bookmark = $stateParams.BOOKMARKAUTOSERVICIO;


            getAnalysisBookmark(_bookmark);
            getAnalysisState();
            Promise.all([proAnalysisBookmark, proAnalysisState]).then(values => {
                const concatenatedArray = us.filter(values, function (value) {
                    return value !== null && value !== "" && value !== undefined;
                })
                console.log(concatenatedArray);
                var expression = concatenatedArray;
                var groupedValues = {};
                parseExpression(expression);
                function parseExpression(expression) {
                    expression.forEach(match => {
                        var partials = match.replace(/[<>]/g, '').split('},');
                        if (partials.length == 1) {
                            var [fieldName, value] = match.replace(/[<>]/g, '').split('=');
                            if (!groupedValues[fieldName]) {
                                groupedValues[fieldName] = [];
                            }
                            groupedValues[fieldName].push(value.replace(/[{}]/g, ''));
                        } else {
                            parseExpression(partials);

                        }
                    });
                    let result = Object.keys(groupedValues).map(fieldName => {
                        return {
                            fieldName,
                            values: groupedValues[fieldName].map(value => value.replace(/'/g, '')).join(',').split(',')
                        };
                    });
                    result.forEach(match => {
                        selectionAPI.applySelection($rootScope._thisCurrentApp, match.fieldName, match.values, true);
                    })


                }
            });
        }


    }]);

});



