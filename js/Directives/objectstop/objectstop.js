var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {
    app.directive('objectstop', [function () {
        return {
            restrict: 'E',
            scope: false,
            replace: true,
            templateUrl: 'js/Directives/objectstop/objectstop.html',
            link: function (scope, element, attrs) {
            },
            controller: ['$http', '$scope', '$rootScope', '$stateParams', '$translate', '$compile', '$element', function ($http, $scope, $rootScope, $stateParams, $translate, $compile, $element) {
                $rootScope.SHOWTOPITEMS = false;


                                const InitDirective = () => {
                    return new Promise(resolve => {
                        $rootScope.SHOWTOPITEMS = false;
                        if ($stateParams.OBJECTSTOP) {
                            let $OBJECT = $stateParams.OBJECTSTOP;
                            let _HTMLTOLOAD = '';

                            const p_arrObject = new Promise((resolve, reject) => {
                                if ($OBJECT.arrObject) {
                                    let arr = $OBJECT.arrObject;
                                    let html = '';
                                    arr.forEach(value => {
                                        let idObject = value.idObject;
                                        let idWidth = value.widthObjetx != null ? value.widthObjetx : 180;
                                        html += `<div class="filtersInMenu isFilter">
                                            <div class="coverFilter isFilter" style="width:${idWidth}px">
                                                <objectsense object-id="${idObject}" is-kpi="true"></objectsense>
                                            </div>
                                        </div>`;
                                    });
                                    resolve(html);
                                } else {
                                    resolve('');
                                }
                            });

                            const p_urlHtml = new Promise((resolve, reject) => {
                                if ($OBJECT.urlHtml) {
                                    $http.get($OBJECT.urlHtml).then(response => {
                                        resolve(response.data);
                                    }).catch(() => {
                                        resolve('');
                                    });
                                } else {
                                    resolve('');
                                }
                            });

                            const p_templateHtml = new Promise((resolve, reject) => {
                                if ($OBJECT.templateHtml) {
                                    resolve($OBJECT.templateHtml);
                                } else {
                                    resolve('');
                                }
                            });

                            Promise.all([p_arrObject, p_urlHtml, p_templateHtml]).then(results => {
                                results.forEach(value => {
                                    _HTMLTOLOAD += value;
                                });
                                resolve(_HTMLTOLOAD);
                            });
                        } else {
                            $element.find('.objectstop').empty();
                            $rootScope.SHOWTOPITEMS = true;
                            $rootScope.$broadcast("loadTimeline", true);
                            resolve(null);
                        }
                    });
                };

                const loadDirective = (html) => {
                    if (html) {
                        var el = $compile(html)($scope);
                        $element.find('.objectstop').empty().append(el);
                        $scope.$broadcast("loadMenu", true);
                        $rootScope.SHOWTOPITEMS = true;
                        $rootScope.$broadcast("loadTimeline", true);
                    } else {
                        $element.find('.objectstop').empty();
                        $scope.$broadcast("loadMenu", false);
                        $rootScope.SHOWTOPITEMS = true;
                        $rootScope.$broadcast("loadTimeline", true);
                    }
                };

                const onError = () => {
                    $element.find('.objectstop').empty();
                    $scope.$broadcast("loadMenu", true);
                    $rootScope.SHOWTOPITEMS = true;
                    $rootScope.$broadcast("loadTimeline", true);
                };

                const transitionSuccessCallback = () => {
                    InitDirective().then(loadDirective).catch(onError);
                };

                InitDirective().then(loadDirective).catch(onError);

                $rootScope.$on("$stateChangeSuccess", function () {transitionSuccessCallback()})
            }]
        };
    }]);
});
