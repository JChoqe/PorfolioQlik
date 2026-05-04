var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore',    
    'extJs/Equalizador/Directives/filtersEqualizador/filtersEqualizador',
    'extJs/Equalizador/Controllers/noItemCtrl',
    'extJs/Equalizador/Controllers/linechartCtrl',
    'extJs/Equalizador/Controllers/barchartCtrl',
    'extJs/Equalizador/Controllers/scatterplotCtrl',
    'extJs/Equalizador/Controllers/piechartCtrl',
    'extJs/Equalizador/Controllers/boxplotCtrl',
    'extJs/Equalizador/Controllers/distributionplotCtrl',
    'extJs/Equalizador/Controllers/combochartCtrl',
    'extJs/Equalizador/Controllers/mapCtrl',
    'extJs/Equalizador/Controllers/treemapCtrl',
    'extJs/Equalizador/Controllers/histogramCtrl',
    'extJs/Equalizador/Controllers/tableCtrl',
    'extJs/Equalizador/Controllers/pivotTableCtrl',
    'extJs/Equalizador/Controllers/bulletchart',

], function (qlik, app, us) {
    app.controller('equalizadorCtrl',['$scope', '$rootScope', '$compile', '$http','$timeout', '$injector', function ($scope, $rootScope, $compile, $http, $timeout, $injector) {
        $scope.labelRegExp = new RegExp("^'|^='|'$", "g");




        $rootScope.scrollTop = 0;
        $(window).scroll(function () {
            $rootScope.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        });
        $rootScope.OBJECTID = '';





                       $scope.openEqualizer = function (ID, APP, indeApp) {

            $scope.app = APP || $rootScope._thisCurrentApp;
            $rootScope.APPEQUALIZER = $scope.app;
            $('contextmenu').remove();
            let newScope = $scope.$parent.$new();                            
            let objectID = ID;
            if($rootScope.isFullSize == false){
                $injector.invoke(function () {                                                                        
                    let _el = $compile(`<div id="fullsizeContainer">                                
                    <objectsense class="object-full-size-copy" object-id="${objectID}" bar-selection="true" ` + (typeof indeApp != 'undefined' ? `app-id="${indeApp}"` : '' )+ `></objectsense></div>`)(newScope);
                    $(document.body).prepend(_el);
                    $('#main-content .qv-global-search-container').removeClass( "qv-global-search-container" ).addClass( "qv-global-search-container-01" );                                                              
                }); 
            }                                                        
            async function cleanObject(ID) {
                return new Promise(resolve => {
                    if ($rootScope.ISVISTAPERSONALIZADA == false) {
                    let result = $rootScope.lstModel.findLast(({ id }) => id == ID);
                    let indexThis = $rootScope.lstModel.map(el => el.id).lastIndexOf(ID);
                    try { result.close(); } catch (e) { console.log(e) }
                    $rootScope.lstModel.splice(indexThis, 1);  
                    resolve(true);
                    }else{
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
            $rootScope.clearObjectEqualizer = function(){
                if($rootScope.isFullSize == false){
                    let objectID = ID;
                    let isCopy = $('body#main').find('.object-full-size-copy');                           
                    if(isCopy.length > 0){
                        Promise.all([cleanObject(objectID),cleanItem(objectID)]).then((results) => {
                            $('body#main').find('#fullsizeContainer').remove();
                        })                    
                    }
                    $('#main-content .qv-global-search-container-01').removeClass( "qv-global-search-container-01" ).addClass( "qv-global-search-container" ); 
                }

                            }










            $scope.idobjetoEquializador = ID;
            $scope.getIdObject(ID);

            $rootScope.getNombreDimension = function (ID, index) {
                var dfd = jQuery.Deferred();
                $scope.app.getList('DimensionList', function (reply) {
                    var dimension = {};
                    var listaDimensiones = reply.qDimensionList.qItems;
                    listaDimensiones = listaDimensiones.filter(function (obj) {
                        var _needle = ID;

                        if (typeof _needle != "undefined" || _needle != "") {
                            if (obj.qInfo.qId == _needle) {
                                dimension = {};
                                dimension.id = ID;
                                dimension.active = false;
                                dimension.hasIcon = false;
                                dimension.name = obj.qMeta.title || '';
                                dimension.inArray = index || '';
                                dimension.orden = '';
                                dfd.resolve(dimension);
                            }
                        }
                    });
                });
                return dfd.promise();
            };

            $rootScope.getNombreDimensionById = function (ID) {
                var dfd = jQuery.Deferred();
                $scope.app.getList('DimensionList', function (reply) {
                    var dimension = {};
                    var listaDimensiones = reply.qDimensionList.qItems;
                    listaDimensiones = listaDimensiones.filter(function (obj) {
                        var _needle = ID;
                        if (typeof _needle != "undefined" ||  _needle != "") {
                            if (obj.qInfo.qId == _needle) {
                                dimension = {};
                                dimension.name = obj.qMeta.title || '';
                                dfd.resolve(dimension);
                            }
                        }
                    });
                });
                return dfd.promise();
            };


            $rootScope.getNombreDimensionEmpty = function (STR) {
                var item;
                var _needle = STR;
                var dfd = jQuery.Deferred();
                $scope.app.getList('DimensionList', function (reply) {
                    var _dimension = {};
                    var listaDimensiones = reply.qDimensionList.qItems;
                    item = listaDimensiones.filter(function (obj) {

                        if (obj.qData.title == _needle) {
                            return obj.qData.title == _needle;
                        } else {
                            $scope.app.getList('FieldList', function (reply) {
                                var listaDimensiones = reply.qFieldList.qItems;
                                item = listaDimensiones.filter(function (obj) {
                                    if (obj.qName == _needle) {
                                        return obj.qName == _needle;
                                    }
                                });
                            });
                        }

                        _dimension = {};
                        _dimension.id = '';

                        _dimension.active = false;
                        _dimension.hasIcon = false;
                        _dimension.name = STR || '';
                        _dimension.orden = '';
                        dfd.resolve(_dimension);

                    });
                });
                return dfd.promise();
            };


            $rootScope.getNombreMedidaById = function (ID, index) {
                var dfd = jQuery.Deferred();
                $scope.app.getList('MeasureList', function (reply) {
                    var medida = {};
                    var listaMedidas = reply.qMeasureList.qItems;
                    listaMedidas = listaMedidas.filter(function (obj) {
                        var _needle = ID;
                        if (typeof _needle != "undefined" || _needle != "") {
                            if (obj.qInfo.qId == _needle) {
                                medida = {};
                                medida.name = obj.qMeta.title || '';
                                dfd.resolve(medida);
                            }
                        }
                    });
                });
                return dfd.promise();
            };

            $rootScope.getNombreMedidaEmpty = function (STR, index) {
                var item;
                var _needle = STR;
                var dfd = jQuery.Deferred();
                $scope.app.getList('MeasureList', function (reply) {
                    var _measure = {};
                    var listaMeasures = reply.qMeasureList.qItems;
                    item = listaMeasures.filter(function (obj) {
                        if (obj.qData.title == _needle) {
                            return obj.qData.title == _needle;
                        } else {
                            $scope.app.getList('FieldList', function (reply) {
                                listaMeasures = reply.qFieldList.qItems;
                                item = listaMeasures.filter(function (obj) {
                                    if (obj.qName == _needle) {
                                        return obj.qName == _needle;
                                    }
                                });
                            });
                        }

                        _measure = {};
                        _measure.id = '';

                        _measure.active = false;
                        _measure.hasIcon = false;
                        _measure.name = STR || '';
                        _measure.inArray = index || '';
                        _measure.orden = '';
                        dfd.resolve(_measure);

                    });
                });
                return dfd.promise();
            };


            $rootScope.getNameByID = function (ID) {
                var _needle = ID;
                var dfd = jQuery.Deferred();
                $scope.app.getList('DimensionList', function (reply) {
                    var listaDimensiones = reply.qDimensionList.qItems;
                    listaDimensiones.filter(function (obj) {

                        if (obj.qInfo.qId == _needle) {
                            dfd.resolve(obj.qData.title);
                        }
                        else {
                            $scope.app.getList('FieldList', function (reply) {
                                listaDimensiones = reply.qFieldList.qItems;
                                var item = listaDimensiones.filter(function (obj) {
                                    if (obj.qName == _needle) {
                                        return obj.qName == _needle;
                                    }
                                });
                            });
                        }

                    });
                });
                return dfd.promise();
            };


            $rootScope.getNameDimension = function (item) {
                var nameDimension = '';
                var dfd = jQuery.Deferred();
                if (us.isUndefined(item.qLibraryId) || item.qLibraryId == '') {
                    if (item.qDef.qLabelExpression === undefined || item.qDef.qLabelExpression == '') {
                        if (item.qDef.qFieldDefs === undefined) {
                            if (item.qDef.qLabel != undefined && item.qDef.qLabel != '') {
                                nameDimension = item.qDef.qLabel;
                            } else {
                                nameDimension = item.qDef.qDef;
                            }
                        } else {
                            if (item.qDef.qFieldDefs[0] != '') {
                                nameDimension = item.qDef.qFieldDefs[0];
                            } else {
                                nameDimension = item.qDef.qFieldLabels[0];
                            }
                        }
                        dfd.resolve(nameDimension);
                    } else {
                        $scope.app.createGenericObject({
                            title: {
                                qStringExpression: item.qDef.qLabelExpression
                            }
                        }, function (reply) {
                                nameDimension = reply.title;
                                dfd.resolve(nameDimension);
                        });
                    }

                                    } else {
                    $scope.app.getList('DimensionList', function (reply) {
                        var dimension = {};
                        var listaDimensiones = reply.qDimensionList.qItems;
                        listaDimensiones = listaDimensiones.filter(function (obj) {
                            var _needle = item.qLibraryId;
                            if (typeof _needle != "undefined" || _needle != "") {
                                if (obj.qInfo.qId == _needle) {
                                    var name = obj.qData.hasOwnProperty('labelExpression') ? obj.qData.labelExpression : obj.qData.title;
                                    dfd.resolve(name.trim());
                                }
                            }
                        });
                    });
                }
                return dfd.promise();
            };



            $rootScope.getNombreDimensionAlternativa = function (item) {
                var nameDimensionAlt = '';
                var dfd = jQuery.Deferred();
                if (us.isUndefined(item.qLibraryId) || item.qLibraryId == '') {
                    if (item.qDef.qLabelExpression === undefined || item.qDef.qLabelExpression == '') {
                        if (item.qDef.qFieldDefs === undefined) {
                            if (item.qDef.qLabel != undefined && item.qDef.qLabel != '') {
                                nameDimensionAlt = item.qDef.qLabel;
                            } else {
                                nameDimensionAlt = item.qDef.qDef;
                            }
                        } else {
                            if (item.qDef.qFieldDefs[0] != '') {
                                nameDimensionAlt = item.qDef.qFieldDefs[0];
                            } else {
                                nameDimensionAlt = item.qDef.qFieldLabels[0];
                            }
                        }
                        dfd.resolve(nameDimensionAlt);
                    } else {
                        $scope.app.createGenericObject({
                            title: {
                                qStringExpression: item.qDef.qLabelExpression
                            }
                        }, function (reply) {
                                nameDimensionAlt = reply.title;
                                dfd.resolve(nameDimensionAlt);
                        });
                    }

                                    } else {
                    $scope.app.getList('DimensionList', function (reply) {
                        var dimension = {};
                        var listaDimensiones = reply.qDimensionList.qItems;
                        listaDimensiones = listaDimensiones.filter(function (obj) {
                            var _needle = item.qLibraryId;
                            if (typeof _needle != "undefined" || _needle != "") {
                                if (obj.qInfo.qId == _needle) {
                                    var name = obj.qData.hasOwnProperty('labelExpression') ? obj.qData.labelExpression : obj.qData.title;
                                    dfd.resolve(name.trim());
                                }
                            }
                        });
                    });
                }
                return dfd.promise();
            };

            $rootScope.getNombreMeasureAlternativa = function (item) {
                var nameMeasureAlt = '';
                var dfd = jQuery.Deferred();
                if (us.isUndefined(item.qLibraryId) || item.qLibraryId == '') {
                    if (item.qDef.qLabelExpression === undefined || item.qDef.qLabelExpression == '') {
                        if (item.qDef.qFieldDefs === undefined) {
                            if (item.qDef.qLabel != undefined && item.qDef.qLabel != '') {
                                nameMeasureAlt = item.qDef.qLabel;
                            } else {
                                nameMeasureAlt = item.qDef.qDef;
                            }
                        } else {
                            if (item.qDef.qFieldDefs[0] != '') {
                                nameMeasureAlt = item.qDef.qFieldDefs[0];
                            } else {
                                nameMeasureAlt = item.qDef.qFieldLabels[0];
                            }
                        }
                        dfd.resolve(nameMeasureAlt);
                    } else {
                        $scope.app.createGenericObject({
                            title: {
                                qStringExpression: item.qDef.qLabelExpression
                            }
                        }, function (reply) {
                                nameMeasureAlt = reply.title;
                                dfd.resolve(nameMeasureAlt);
                        });
                    }

                                    } else {
                    $scope.app.getList('MeasureList', function (reply) {
                        var listaMedidas = reply.qMeasureList.qItems;
                        listaMedidas = listaMedidas.filter(function (obj) {
                            var _needle = item.qLibraryId;
                            if (typeof _needle != "undefined" || _needle != "") {
                                if (obj.qInfo.qId == _needle) {
                                    var name = obj.qData.hasOwnProperty('labelExpression') ? obj.qData.labelExpression : obj.qData.title;
                                    dfd.resolve(name.trim());
                                }
                            }
                        });
                    });
                }
                return dfd.promise();
            };

            $rootScope.getNombreDimensionAlternativaCampo = function (item) {
                var nameMeasureFieldAlt = '';
                var dfd = jQuery.Deferred();
                if (us.isUndefined(item.qLibraryId) || item.qLibraryId == '') {
                    if (item.qDef.qLabelExpression === undefined || item.qDef.qLabelExpression == '') {
                        if (item.qDef.qFieldDefs === undefined) {
                            if (item.qDef.qLabel != undefined && item.qDef.qLabel != '') {
                                nameMeasureFieldAlt = item.qDef.qLabel;
                            } else {
                                nameMeasureFieldAlt = item.qDef.qDef;
                            }
                        } else {
                            if (item.qDef.qFieldDefs[0] != '') {
                                nameMeasureFieldAlt = item.qDef.qFieldDefs[0];
                            } else {
                                nameMeasureFieldAlt = item.qDef.qFieldLabels[0];
                            }                            
                        }
                        dfd.resolve(nameMeasureFieldAlt);
                    } else {
                        $scope.app.createGenericObject({
                            title: {
                                qStringExpression: item.qDef.qLabelExpression
                            }
                        }, function (reply) {
                                nameMeasureFieldAlt = reply.title;
                                dfd.resolve(nameMeasureFieldAlt);
                        });
                    }

                                    } else {
                    $scope.app.getList('DimensionList', function (reply) {
                        var dimension = {};
                        var listaDimensiones = reply.qDimensionList.qItems;
                        listaDimensiones = listaDimensiones.filter(function (obj) {
                            var _needle = item.qLibraryId;
                            if (typeof _needle != "undefined" || _needle != "") {
                                if (obj.qInfo.qId == _needle) {
                                    var name = obj.qData.hasOwnProperty('labelExpression') ? obj.qData.labelExpression : obj.qData.title;
                                    dfd.resolve(name.trim());
                                }
                            }
                        });
                    });
                }
                return dfd.promise();
            };


            $rootScope.getTituloExpresion = function (exp) {
                var dfd = jQuery.Deferred();
                $scope.app.createGenericObject({
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

        };


        var htmlcontent = $('#box_equalizador');

        $scope.getIdObject = function (ID) {
            $rootScope.toScroll = $rootScope.scrollTop;
            $('body').addClass('open-equalizador');
            $('#box_equalizador').addClass('active');
            $('#box_equalizador').attr('data-idObjetoEqualizador', ID);
            $('#box_contenido_equalizador .collapse').removeClass('show', function () {
                $('#box_contenido_equalizador .collapse').first().addClass('show');
            });

            $scope.getTipoObjeto(ID);
        };


        $scope.getTipoObjeto = function (IDOBJECT) {
            $scope.app.getObject(IDOBJECT).then(function (model) {
                $rootScope.OBJECTIDORIGIN = IDOBJECT
                if(model.layout.hasOwnProperty('qExtendsId')){
                    $rootScope.OBJECTID = model.layout.qExtendsId ;
                }else{
                    $rootScope.OBJECTID = IDOBJECT;
                }                
                $scope.typeObject =  model?.enigmaModel?.layout?.visualization || model.layout.qInfo.qType;
                var newScope = $scope.$new(true, $scope);
                console.log($scope.typeObject);
                switch ($scope.typeObject) {
                    case 'linechart':
                        $rootScope.typePresentacion = model.layout.lineType;
                        $scope.urlHtml = './js/Equalizador/partials/linechart.html';
                        break;
                    case 'barchart':
                        $rootScope.typeOrientacion = model.layout.orientation;
                        $scope.urlHtml = './js/Equalizador/partials/barchart.html';
                        break;
                    case 'scatterplot':
                        $scope.urlHtml = './js/Equalizador/partials/scatterplot.html';
                        break;
                    case 'piechart':
                        $scope.urlHtml = './js/Equalizador/partials/piechart.html';
                        break;
                    case 'boxplot':
                        $scope.urlHtml = './js/Equalizador/partials/boxplot.html';
                        break;
                    case 'distributionplot':
                        $scope.urlHtml = './js/Equalizador/partials/distributionplot.html';
                        break;
                    case 'combochart':
                        $scope.urlHtml = './js/Equalizador/partials/combochart.html';
                        break;
                    case 'map':
                        $scope.urlHtml = './js/Equalizador/partials/map.html';
                        break;
                    case 'treemap':
                        $scope.urlHtml = './js/Equalizador/partials/treemap.html';
                        break;
                    case 'histogram':
                        $scope.urlHtml = './js/Equalizador/partials/histogram.html';
                        break;
                    case 'table':
                        $scope.urlHtml = './js/Equalizador/partials/table.html';
                        break;
                    case 'pivot-table':
                        $scope.urlHtml = './js/Equalizador/partials/pivotTable.html';
                        break;
                    case 'bulletchart':
                        $scope.urlHtml = './js/Equalizador/partials/bulletchart.html';
                        break;
                    default:
                        $scope.urlHtml = './js/Equalizador/partials/noItem.html';
                }
                $http.get($scope.urlHtml).then(function (response) {
                    $timeout(function () {
                        qlik.resize();
                    }, 600);
                    $(htmlcontent).append($compile(response.data)(newScope));
                    newScope.$digest();

                });

                return false;
            });
        };




        $rootScope.randomString = function (len, charSet) {
            var charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var randomString = '';
            for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }

            var timestamp = +new Date();

            return randomString + timestamp.toString();
        };


        $rootScope.getAltoAcordeon = function () {
            setTimeout(function () {
                var altoHeaders = 0;
                $('#box_equalizador .em-section-header').each(function () {
                    altoHeaders = altoHeaders + $(this).outerHeight();
                });
                var altoSection = $('.box_section_equializador').outerHeight();
                var altoItems = altoSection - altoHeaders;
                $('#box_equalizador .collapse .innerCollapse').height(altoItems - 60);
            }, 200);
        };

    }])
    .filter('orderObjectBy', function () {
            return function (items, field, reverse) {
                var filtered = [];
                angular.forEach(items, function (item) {
                    filtered.push(item);
                });
                filtered.sort(function (a, b) {
                    return (a[field] > b[field] ? 1 : -1);
                });
                if (reverse) filtered.reverse();
                return filtered;
            };
        });
});






