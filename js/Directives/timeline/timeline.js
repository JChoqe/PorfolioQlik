var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    "underscore",
], function (qlik, app, us) {
    app.directive('timeline', ['InitConfig', '$translate', '$rootScope', function (InitConfig, $translate, $rootScope) {
        return {
            restrict: 'E',
            bindToController: true,
            scope: true,
            templateUrl: 'js/Directives/timeline/timeline.html',
            replace: true,
            link: function (scope, element, attrs) {

            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$attrs', function ($q, $scope, $rootScope, luiDialog, $translate, $attrs) {
                let _yearDirective = $attrs.year || 'Año';
                let _monthDirective = $attrs.month || 'Mes';
                $scope.limitYear = 5;
                $scope.ShowAnios = true;
                $scope.ShowMeses = true;
                $scope.TimelineMediaQuery = false;
                $rootScope.SHOWTOPITEMS = false;
                $scope.setListSession = false;
                let _app = '';

                setTimeout(() => {
                    _app = $rootScope._thisCurrentApp;
                    _app.getList("SelectionObject", function (reply) {
                        initTimeLine();
                        if ($scope.setListSession == false) {
                            $scope.setListSession = true;
                            let SESSIONLIS = {};
                            SESSIONLIS.idSession = reply.qInfo.qId;
                            SESSIONLIS.appId = _app.id;
                            $rootScope.LISTSESSIONPARENT.push(SESSIONLIS);
                        }

                    })
                }, 1200);



                function getAllFieldValues(listQVObjects) {
                    return us.map(listQVObjects.qDataPages, function (p) {
                        return us.map(p.qMatrix, function (x) {
                            return x[0];
                        });
                    })[0];
                }
                function getFieldDef(fieldName, noRows) {
                    return {
                        qDef: { qFieldDefs: [fieldName] },
                        qInitialDataFetch: [{ qTop: 0, qLeft: 0, qHeight: noRows, qWidth: 1 }]
                    };
                }
                let getAnios = async () => {
                    return new Promise((resolve, reject) => {
                        _app.createList(getFieldDef(_yearDirective, 100), (r) => {
                            var elems = getAllFieldValues(r.qListObject);
                            resolve([elems, r.qInfo.qId]);
                        });
                    });
                }

                let getMeses = async () => {
                    return new Promise((resolve, reject) => {
                        _app.createList(getFieldDef(_monthDirective, 100), (r) => {
                            var elems = getAllFieldValues(r.qListObject);
                            resolve([elems, r.qInfo.qId]);
                        });
                    });
                }


                let getSize = () => {
                    return new Promise(function (resolve, reject) {
                        var TimelineMediaQuery;
                        let _menuWrapper = document.getElementById('page-nav');
                        let _menu = document.getElementById('box_ListaMenu');
                        let _Object = document.getElementById('wrapperObjectsTop');
                        let _menuWrapperWidth = $(_menuWrapper).outerWidth();
                        let _menuWidth = $(_menu).outerWidth();
                        let __ObjectWidth = $(_Object).outerWidth();
                        let _widthTogether = _menuWidth + __ObjectWidth;
                        if (_widthTogether > _menuWrapperWidth) {
                            TimelineMediaQuery = true;
                        } else {
                            TimelineMediaQuery = false;
                        }
                        resolve(TimelineMediaQuery);
                    });
                }








                let initTimeLine = async () => {
                    try {
                        const [resAnios, resMeses] = await Promise.all([
                            getAnios(),
                            getMeses()
                        ]);

                        if (resAnios) {
                            _app.destroySessionObject(resAnios[1]);
                            $scope.ShowAnios = true;
                            $scope.anios = resAnios[0].map(value => ({
                                text: value.qText,
                                val: value.qNum,
                                active: value.qState
                            }));
                        } else {
                            $scope.ShowAnios = false;
                        }

                        if (resMeses) {
                            _app.destroySessionObject(resMeses[1]);
                            $scope.ShowMeses = true;
                            $scope.meses = resMeses[0].map(value => ({
                                text: value.qText,
                                val: value.qNum,
                                active: value.qState
                            }));
                        } else {
                            $scope.ShowMeses = false;
                        }

                        $rootScope.SHOWTOPITEMS = true;
                        $rootScope.$broadcast("loadTimeline", true);
                    } catch (error) {
                        console.error('Error in initTimeLine:', error);
                    }
                };




                $scope.isMoreYearsShow = false;
                $scope.showMoreYears = () => {
                    $scope.isMoreYearsShow = $scope.isMoreYearsShow == false ? true : false;
                }
                $scope.close = () => {
                    $scope.isMoreYearsShow = false;
                    $scope.ShowTimeLine = false;
                }
                $scope.toogleYear = (val, $event) => {
                    let element = $event.currentTarget;
                    let isActive = $(element).hasClass('active');
                    let YEAR = val;
                    if ($event.ctrlKey) {
                        _app.field(_yearDirective).clear().then(function () {
                            $('.itemYear').not('#moreyears').removeClass('active').promise().done(function () {
                                _app.field(_yearDirective).selectValues([YEAR], true, false).then(function () {
                                    $(element).addClass('active')
                                });
                            })
                        })
                    } else {
                        isActive == false ? $(element).addClass('active') : $(element).removeClass('active');
                        _app.field(_yearDirective).selectValues([YEAR], true, false);
                    }
                }
                $scope.toogleMonth = (val, $event) => {
                    let element = $event.currentTarget;
                    let isActive = $(element).hasClass('active');
                    let MONTH = val;
                    if ($event.ctrlKey) {
                        _app.field(_monthDirective).clear().then(function () {
                            $('.itemMonth').removeClass('active').promise().done(function () {
                                _app.field(_monthDirective).selectValues([MONTH], true, false).then(function () {
                                    $(element).addClass('active')
                                });
                            })

                        })
                    } else {
                        isActive == false ? $(element).addClass('active') : $(element).removeClass('active');
                        _app.field(_monthDirective).selectValues([MONTH], true, false);
                    }

                }

                $scope.ShowTimeLine = false;
                $scope.toogleTimeLine = () => {
                    $scope.ShowTimeLine = $scope.ShowTimeLine === false ? true : false;
                }


                const timeline = '.timeline';
                const activeClass = 'active';
                const dragClass = 'drag';

                function addSeleccionesEvent(selector, directive, callback) {
                    $(timeline).on('mousedown', selector, function (e) {
                        let elementoshover = [];
                        let posRatonMousedown = [e.pageX, e.pageY];
                        let arrastrando = false;

                        $(timeline)
                            .on('mousemove', function (e) {
                                if (e.which === 1) {
                                    let movHorizontalArrastre = e.pageX - posRatonMousedown[0];

                                    if (movHorizontalArrastre >= 5 || movHorizontalArrastre <= 5) {
                                        arrastrando = true;
                                        let elementoHover = document.elementFromPoint(e.pageX, e.pageY);
                                        if (!elementoshover.includes(elementoHover)) {
                                            elementoshover.push(elementoHover);
                                            $(elementoHover).addClass(dragClass);
                                        }
                                    }
                                }
                            })
                            .on('mouseup', function () {
                                if (arrastrando) {
                                    for (let i = 0; i < elementoshover.length; i++) {
                                        $(timeline + ' ' + selector).removeClass(dragClass);
                                        callback($(elementoshover[i]), directive);
                                    }
                                }
                                $(timeline).off('mousemove mouseup');
                            });
                    });
                }

                function activeElement(item, directive) {
                    let valor = $(item).data('valor');
                    if (valor && !$(item).hasClass(activeClass)) {
                        $(item).addClass(activeClass);
                        _app.field(directive).selectValues([valor], true, false).then(() => {
                            $(timeline + ' ' + item).removeClass(dragClass);
                        });
                    }
                }

                $scope.addSeleccionesMesesEvent = () => {
                    addSeleccionesEvent('.itemMonth', _monthDirective, activeElement);
                }

                $scope.addSeleccionesAniosEvent = () => {
                    addSeleccionesEvent('.itemYearVal', _yearDirective, activeElement);
                }

            }]
        };
    }]);

});