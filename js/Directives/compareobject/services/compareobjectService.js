define([
    'js/qlik',
    'app',
    'extIncludeRoot/html2canvas.min',
], function (qlik, app, html2canvas) {
    app.factory('compareobjectService', ['$q', '$window', '$http', '$state', '$rootScope', function ($q, $window, $http, $state, $rootScope) {
        var typesObject =
            [
                "barchart",
                "boxplot",
                "bulletchart",
                "combochart",
                "distributionplot",
                "gauge",
                "histogram",
                "linechart",
                "map",
                "mekko",
                "piechart",
                "pivot-table",
                "scatterplot",
                "table",
                "treemap",
                "waterfallchart",
                "kpi"
            ];



        function getConvertImageToBase64(url) {
            return new Promise(resolve => {
                try {
                    fetch(url)
                    .then(response => response.blob())
                    .then(blob => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64String = reader.result;
                            resolve(base64String)
                        };
                        reader.readAsDataURL(blob);
                    })
                    .catch(error => {
                        console.error('Error al cargar la imagen:', error);
                    }); 
                } catch (error) {
                    console.error('Error al cargar la imagen:', error);
                    resolve(null)
                }


            })
        }

        function getSelectionsCompare(filters) {
            return new Promise(resolve => {
                var FILTERS = [];

                angular.forEach(filters, function (value, key) {
                    var option = {};
                    option.width = 'auto';
                    option.stack = [
                        { text: value.fieldName, style: 'SeleccionesHeader' },
                        { text: value.selectedStr, style: 'SeleccionesValues' }

                    ]
                    FILTERS.push(option);

                });

                resolve(FILTERS)
            })
        }

        function getImageObjectById(id, _height,_width, App ){
            return new Promise(resolve => {
                var settings = { format: 'png', height: _height, width: _width };
                App.visualization.get(id).then(function (visual) {
                    visual.exportImg(settings).then(function (result) {
                        resolve(result)
                    }).catch(function (error) {
                        console.log(error);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }) 
        }


        function setStateActive(state) {
            return new Promise(resolve => {
                angular.forEach($rootScope.NAMESTATES, function (value, key) {
                    value.active = false;
                })
                state.active = true;
                resolve(true)
            })
        }
        function setSpeelDial(id, type) {
            return new Promise(resolve => {
                var speeldial = `<div class="speeldial-center" ng-click="ShowContextMenu($event, '${id}', '${type}')"><i class="ri-more-2-line"></i></div>`;
                resolve(speeldial)
            })
        }

        function createListBoxesFilters(field, App) {
            return new Promise(resolve => {
                var _campo = field;
                App.visualization.create(
                    'listbox',
                    [
                        _campo
                    ],
                    {
                        "showTitles": true,
                        "title": _campo
                    }
                ).then(function (vis) {
                    resolve(vis);
                });
            })
        }

        function createListBoxesFiltersState(field, state, App) {
            return new Promise(resolve => {
                var _campo = field;
                App.visualization.create(
                    'listbox',
                    [
                        _campo
                    ],
                    {
                        "showTitles": true,
                        "title": _campo,
                        "qStateName": state
                    },
                    {
                        'qListObjectDef': {
                            "qStateName": state
                        }
                    }

                                    ).then(function (vis) {
                    resolve(vis);
                }).catch(function(e){
                    console.log(e);
                    resolve(false);
                });
            })

        }

        var proDimensions, proFields;
        function getListDimensions(aplicacion){
            proDimensions =  new Promise(resolve => {
                var arrDimensiones = [];
                var App = aplicacion;
                var idList = '';
                App.getList("DimensionList", function (reply) {
                    idList = reply.qInfo.qId;
                    arrDimensiones = [];
                    angular.forEach(reply.qDimensionList.qItems, function (value, key) {
                        var option = {};
                        option.qName = value.qData.title;
                        option.qNameVal = value.qData.info[0].qName;
                        option.type = 'dimension';
                        option.active = false;
                        arrDimensiones.push(option)

                    });
                    resolve(arrDimensiones);
                }).finally(function () {
                    App.destroySessionObject(idList);
                })
            })
        }

                function getListFields(aplicacion){
            proFields =  new Promise(resolve => {
                var arrFields = [];
                var App = aplicacion;
                var idList = '';
                App.getList("FieldList", function (reply) {
                    idList = reply.qInfo.qId;
                    arrFields = [];
                    angular.forEach(reply.qFieldList.qItems, function (value, key) {
                        var option = {};
                        option.qName = value.qName;
                        option.qNameVal = value.qName;
                        option.type = 'field';
                        option.active = false;
                        arrFields.push(option)                    
                    });
                    resolve(arrFields);
                }).finally(function () {
                    App.destroySessionObject(idList);
                })
            })




        }

                function createFieldList(App) {
            return new Promise(resolve => {
                $rootScope.idList = '';
                getListDimensions(App);
                getListFields(App)
                Promise.all([proDimensions, proFields]).then(values => {
                    var arr0 = [].concat.apply([], values[0])
                    var arr1 = [].concat.apply([], values[1])
                    var newArr = arr0.concat(arr1);
                    newArr = _.uniq(newArr, false, (obj) => obj.qName);
                    resolve(newArr);
                });            
            })
        }

        function deleteStates(thisApp, states) {
            return new Promise(resolve => {
                thisApp.model.waitForOpen.promise.then(() => {
                    angular.forEach(states, function (value, key) {
                        try {
                            thisApp.model.engineApp.removeSessionAlternateState(value.stateName).then(function (replay) {
                                if (states.length >= (key + 1)) {
                                    resolve(true);
                                }
                            })   
                        } catch (error) {
                            resolve(false);
                        }
                    });
                })
            })
        }

        function deleteVisual(visual) {
            return new Promise(resolve => {
                angular.forEach(visual, function (value, key) {
                    value.close();
                });
                resolve(true);
            })
        }
        function deleteVisualSeledted(visual) {            
            return new Promise(resolve => {
                if(visual){
                    visual.close(); 
                }
                resolve(true);
            })
        }


        function clearState(){
            return new Promise(resolve => {
                var stateActive = $rootScope.NAMESTATES.find((state) => state.active == true).stateName;
                $rootScope._thisCurrentApp.clearAll(true, stateActive);
                resolve(true);
            })
        }
        function clearFiltersMain(){
            return new Promise(resolve => {
                if ($rootScope.lstModelFieldMain && $rootScope.lstModelFieldMain.length >= 1) {
                    angular.forEach($rootScope.lstModelFieldMain, function (value, key) {
                        try {
                            value.close();
                        }
                        catch (error) {
                            console.log("error eliminando el objeto " + key + "\n" + error);
                        }

                    });
                    document.getElementById('compare-filters-scroll-main').innerHTML = ""
                    $rootScope.lstModelFieldMain = [];
                }
                resolve(true);
            })
        }

        function addFiltersMainOpened(arrFiltersMain){
            return new Promise(resolve => {
                var arrFiltersActives = arrFiltersMain.filter(elemento => elemento.active);
                arrFiltersActives.forEach(elemento => {
                    elemento.active = false;
                });

                  resolve(arrFiltersActives);
            })

                    }




        function getAllObjectsInSheets(Sheet,App) {
            return new Promise(resolve => {
                getObjectInSheet(Sheet)
                    .then(objects => {
                        return Promise.all([getTitleByObject(objects, App)]);
                    })
                    .then(([objectsAll]) => {
                        resolve(objectsAll);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });
            })
        }



        function getObjectInSheet(sheet) {
            return new Promise(resolve => {
                var arrObjects = [];
                var str = sheet.qMeta.title;
                delimiter = '.',
                    start = 1,
                    tokens = str.split(delimiter);
                angular.forEach(sheet.qData.cells, function (val, key) {
                    var tipoObject = val.type;
                    if (typesObject.some(r => tipoObject.includes(r))) {
                        var option = {};
                        option.id = val.name;
                        option.type = val.type;
                        var section = [tokens.slice(0, start), tokens.slice(start)].map(function (item) {
                            return item.join(delimiter);
                        });
                        option.active = false;
                        option.section = section[1] || str;
                        arrObjects.push(option)
                    }
                })
                resolve(arrObjects);

            })

        }

        function getTitleByObject(objects, App) {
            return new Promise(resolve => {
                var index = 0;
                var sizeArr = objects.length;
                var arrObjectsAll = [];
                angular.forEach(objects, function (value, key) {

                    App.getObject(value.id).then(function (model) {
                        index = index + 1;
                        value.title = model.pureLayout.title || 'Gráfico sin título';
                        arrObjectsAll.push(value);
                        if (index >= sizeArr) {
                            resolve(arrObjectsAll);
                        }

                    })
                })

            })

        }

        function exportDatos(ID, App){
            $('.options-list').removeClass( "active" );
            App.visualization.get(ID).then(function (visual) {
                let isContainer = visual.model.genericType == 'container' ? true : false
                if (isContainer) {
                    vis.model.getProperties().then(function () {
                        let activeObjectFromContainer = vis.model.items.activeId;
                        App.visualization.get(activeObjectFromContainer).then(function (visual) {
                            visual.exportData({ state: 'A', format: 'OOXML' }).then(function (result) {
                                window.location.href = result;
                                $('#loading-export').remove();
                            }).catch(function (error) {
                                console.log(error);
                            });
                        })
                    })
                } else {
                    visual.exportData({ state: 'A', format: 'OOXML' }).then(function (result) {
                        window.location.href = result;
                        $('#loading-export').remove();
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            });
        }


        function updateValues(state){
            $rootScope.ThisAppCompare.model.engineApp.getSetAnalysis(
                {
                    "qStateName": state
                }
            ).then(function(st){
                console.log(st)
            })
        }

        function createObjectSession(IDOBJECT,APP){
            return new Promise(resolve => {
                APP.getObject(IDOBJECT).then(function (model) {                    
                    model.getProperties().then(function (prp) {
                        APP.model.enigmaModel.createSessionObject(prp).then(function (sessionObject) {
                            sessionObject.getProperties().then(function (prpSession) {
                                APP.visualization.create(model.layout.visualization, [], prpSession).then(function (vis) {
                                    resolve(vis);
                                }).catch(function(e){
                                    console.log(e)
                                })
                            }).catch(function(e){
                                console.log(e)
                            })
                        }).catch(function(e){
                            console.log(e)
                        })
                    }).catch(function(e){
                        console.log(e)
                    })
                }).catch(function(e){
                    console.log(e)
                });            
            })
        }


        return {
            getConvertImageToBase64: getConvertImageToBase64,
            getSelectionsCompare: getSelectionsCompare,
            getAllObjectsInSheets: getAllObjectsInSheets,
            getImageObjectById: getImageObjectById,
            setStateActive: setStateActive,
            setSpeelDial: setSpeelDial,
            createListBoxesFilters: createListBoxesFilters,
            createListBoxesFiltersState:createListBoxesFiltersState,
            createFieldList: createFieldList,
            deleteStates: deleteStates,
            deleteVisual: deleteVisual,
            deleteVisualSeledted:deleteVisualSeledted,
            clearState:clearState,
            clearFiltersMain:clearFiltersMain,
            addFiltersMainOpened:addFiltersMainOpened,
            exportDatos:exportDatos,
            updateValues:updateValues ,
            createObjectSession:createObjectSession          
        };

    }]);
});