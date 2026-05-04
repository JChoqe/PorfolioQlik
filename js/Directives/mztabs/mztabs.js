var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'angular',
], function (qlik, app, angular) {
    app.directive('mztabs', [function () {
        return {
            restrict: 'E',
            scope: true,                    
            templateUrl: 'js/Directives/mztabs/mztabs.html',
            link: function (scope, element, attrs) {
            },
            controller: ['$scope', '$rootScope', '$element', '$attrs', '$compile', function ($scope, $rootScope, $element, $attrs, $compile) {
                $scope.idContenedor = $attrs.id;
                $scope.hideSpeeldial = $attrs.hideSpeeldial == "" ? true : false;
                $scope.minWidthTab = $attrs.minWidthTabs ? parseInt($attrs.minWidthTabs.trim()) : 125;   
                $scope.hasCondition = false;

                function getDataFromContainer(id) {
                    var data = [];

                    return new Promise((resolve, reject) => {
                        $rootScope._thisCurrentApp.visualization.get(id).then(function (vis) {



                            var titulo = "";
                            if (vis.model.layout.title && vis.model.layout.title) {
                                titulo = vis.model.layout.title;
                            }

                            var isTituloVisible = undefined;
                            if (vis.model.layout && vis.model.layout.showTitles) {
                                isTituloVisible = vis.model.layout.showTitles;
                            }

                            if (isTituloVisible && titulo != "") {
                                $scope.hasTitle = true;
                                $scope.title = titulo;
                            }

                            var infoPestanas = vis.model.layout.children.map((item) => {
                                var obj = {};
                                obj["tituloPestana"] = item.label;
                                obj["idReferencia"] = item.refId;
                                obj["condicion"] = item.condition ? item.condition : "-1";  

                                if (item.condition != undefined) {
                                    $scope.hasCondition = true;
                                }

                                return obj;
                            });

                            var objetos = vis.model.layout.qChildList.qItems;

                            for (const pestana of infoPestanas) {

                                var objQlikDePestana = objetos.find((object) => object.qData.qExtendsId == pestana.idReferencia);
                                if (!objQlikDePestana) objQlikDePestana = objetos.find((object) => object.qData.containerChildId == pestana.idReferencia);

                                if (objQlikDePestana) {
                                    var tituPestana = pestana.tituloPestana.trim();
                                    var idReferencia = pestana.idReferencia;
                                    var tituObjetoQlik = objQlikDePestana.qData.title.trim();
                                    var idObjetoQlikPestana = objQlikDePestana.qInfo.qId;
                                    var _condicion = pestana.condicion.trim();

                                    if (_condicion == -1) {
                                        data.push({
                                            "tituloTab": tituPestana,
                                            "idReferencia": idReferencia,
                                            "tituloObjeto": tituObjetoQlik,
                                            "idObj": idObjetoQlikPestana,
                                            "condicion": _condicion

                                        });
                                    }
                                }
                            }
                            resolve(data);

                        }).catch((error) => reject(error));
                    })
                };

                function generarHTML() {
                    return new Promise((resolve, reject) => {
                        var html = `<div class="mz-tabs-titulo" ng-bind="title" ng-show="hasTitle" title="{{hasTitle}}"></div>                    
                                <lui-tab-view class="lui-tabview">
                                    <lui-tabset>
                                        <div class="tabs-page-prev" ng-show="paginacionON == true" ng-click="pagePrev()"><i class="icofont-curved-left"></i></div>
                                        <div class="tabs-page-next" ng-show="paginacionON == true" ng-click="pageNext()"><i class="icofont-curved-right"></i></div>
                            
                                        <div class="tabs-container" ng-class="{ 'paginacion-ON': paginacionON == true }">`;

                        var tabs = "";
                        $scope.data.forEach(function (item, index) {
                            tabs += `<lui-tab qva-activate="pintaObjeto(${index});" ref="tab${index + 1}" style="min-width: {{minWidthTab}}px">
                                    <!-- <lui-tab qva-activate="resizeObj('${item.idObj}')" ref="tab${index + 1}" style="min-width: {{minWidthTab}}px">  -->
                                        <span class="tab-item" title="${item.tituloTab}"> ${item.tituloTab} </span>
                                    </lui-tab>`
                        });

                        html += tabs;
                        html += `</div>
                            </lui-tabset>`;

                        var contenidos = "";
                        $scope.data.forEach(function (item, index) {
                            contenidos += `<lui-tab-content class="tabs-content" ref="tab${index + 1}">
                                                <div class="col-12 mzh-100 m-0 p-0 box_object ${item.viewTitle == false ? 'no-title' : ''} ">
                                                    <!-- <objectsense object-id="${item.idObj}"></objectsense> -->

                                                    <!-- Pintamos el primer objeto. -->
                                                    ${index == 0 ? `<objectsense object-id="${item.idObj}"></objectsense>` : ''}
                                                </div>
                                            </lui-tab-content>`
                        });

                        html += contenidos;
                        html += '</lui-tab-view>';

                        resolve(html);
                    })
                }

                function compilarHTML(html) {
                    return new Promise((resolve, reject) => {
                        $scope.$evalAsync(
                            function ($scope) {
                                var compilado = $compile(html)($scope);
                                resolve(compilado);
                            }
                        );
                    })
                }

                function agregarHTML(compilado) {
                    $($element).find('.tab-view-wrapper').empty().promise().then(() => {
                        $($element).find('.tab-view-wrapper').append(compilado).promise().then(() => {
                            qlik.resize();
                            setPaginacion();
                        });
                    });
                }

                function limpiarAntesDePintar() {
                    $scope.data.forEach(function (dataItem, index) {
                        var _indices = [];
                        $rootScope.lstModel.forEach((element, index) => element.id === dataItem.idObj ? _indices.push(index) : null);
                        for (let i = _indices.length - 1; i >= 0; i--) {
                            try { $rootScope.lstModel[_indices[i]].close(); } catch (e) { }
                            $rootScope.lstModel.splice(_indices[i], 1);  
                        }

                        let __indices = [];
                        $rootScope.ITEMS.forEach((element, index) => element.id === dataItem.idObj ? __indices.push(index) : null);
                        for (let i = __indices.length - 1; i >= 0; i--) {
                            try { $rootScope.ITEMS[__indices[i]].close(); } catch (e) { }
                            $rootScope.ITEMS.splice(__indices[i], 1);  
                        }
                    })
                }



                function objectsEqual(o1, o2) {
                    return typeof o1 === 'object' && Object.keys(o1).length > 0 ? Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p])) : o1 === o2;
                }

                function arraysEqual(a1, a2) {
                    if (a1 && a2) {
                        return a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
                    }
                }

                function proceso() {
                    return new Promise(async (resolve, reject) => {


                        var anteriorData = $scope.data;
                        $scope.data = await getDataFromContainer($scope.idContenedor);
                        setTimeout(() => $scope.$apply(), 0);

                        var sonIguales = arraysEqual(anteriorData, $scope.data);
                        if (!sonIguales) {
                            limpiarAntesDePintar();    

                            var htmlCompleto = await generarHTML();
                            var compilado = await compilarHTML(htmlCompleto);
                            agregarHTML(compilado);
                        }

                        resolve();
                    });
                }

                proceso().then(function () {
                    var selState = $rootScope._thisCurrentApp.selectionState();

                    if ($scope.hasCondition) {
                        $scope.$on('$destroy', function destroyScope() {
                            selState.OnData.unbind(proceso);
                        });
                        selState.OnData.bind(proceso);
                    }
                });

                $scope.resizeObj = (id) => qlik.resize(id);

                $scope.pintaObjeto = function (_index) {
                    limpiarAntesDePintar();

                    $($element).find(`.tabs-content[ref="tab${_index + 1}"] > .box_object`).empty().promise().then(() => {
                        var objTab = $compile(`<objectsense object-id="${$scope.data[_index].idObj}"></objectsense>`)($scope);
                        $($element).find(`.tabs-content[ref="tab${_index + 1}"] > .box_object`).append(objTab).promise().done(function () { });
                    });
                }

                function updateTagsText(id) {
                    $rootScope._thisCurrentApp.visualization.get(id).then(function (vis) {
                        var infoPestanas = vis.model.layout.children.map((item) => {
                            return {
                                "tituloPestana": item.label,
                                "idReferencia": item.refId
                            }
                        });

                        infoPestanas.forEach(function (item1, index) {
                            var tagIndex = $scope.data.findIndex((item2) => item1.idReferencia == item2.idReferencia);
                            if (tagIndex != -1) $scope.data[tagIndex].tituloTab = item1.tituloPestana;
                            setTimeout(() => $scope.$apply(), 0);
                        });

                    })
                }

                $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                    updateTagsText($scope.idContenedor);
                    console.log('current:', current);
                });


                $(window).resize(() => $(window).trigger('window:resize'));
                $scope.paginacionON = false;

                function setPaginacion() {
                    var numBotones = $scope.data.length;
                    var minWidthBoton = $scope.minWidthTab;
                    var margin = 3;                         
                    $scope.largoBotones = (numBotones * (minWidthBoton + margin)) - margin;

                    $scope.contenedorTabs = $($element).find('.tabs-container');
                    var contenedorTabsWidth = $($scope.contenedorTabs).outerWidth();

                    if (contenedorTabsWidth <= $scope.largoBotones) {
                        $scope.paginacionON = true;
                    } else {
                        $scope.paginacionON = false;
                    }
                    setTimeout(() => $scope.$apply(), 0);


                    $(window).on('window:resize', function (e) {
                        contenedorTabsWidth = $($scope.contenedorTabs).outerWidth();

                        if (contenedorTabsWidth <= $scope.largoBotones) {
                            $scope.paginacionON = true;
                        } else {
                            $scope.paginacionON = false;
                        }
                        setTimeout(() => $scope.$apply(), 0);
                    })
                }


                $scope.pagePrev = () => {
                    $($scope.contenedorTabs).animate({
                        scrollLeft: "-=" + ($scope.largoBotones / 3) 
                    }, 800, "linear", function () {
                    })

                }
                $scope.pageNext = () => {
                    $($scope.contenedorTabs).animate({
                        scrollLeft: "+=" + ($scope.largoBotones / 3) 
                    }, 800, "linear", function () {
                    })
                }

            }]
        };
    }]);
});