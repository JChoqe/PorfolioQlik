
define([
    'js/qlik',
    'app',
    'moment',
], function (qlik, app, moment) {
    app.controller('StateParentCtrl',['$scope', '$rootScope','dataApp', 'InitConfig', '$translate', '$http', 'luiDialog', '$compile', '$state', function ($scope, $rootScope, dataApp, InitConfig, $translate,$http, luiDialog, $compile, $state) { 
            $rootScope.addElement();            
            $('body').attr('data-app', dataApp.id);
            $rootScope.appID = dataApp.id;
            $rootScope._thisCurrentApp = dataApp;
            if(!$rootScope.Apps[$rootScope.indexApp]){
                $rootScope.Apps[$rootScope.indexApp]= $rootScope._thisCurrentApp;
            }

            if($rootScope.LISTSESSIONPARENT && $rootScope.LISTSESSIONPARENT.length >=1){
                angular.forEach($rootScope.LISTSESSIONPARENT, function (value, key) {
                    try {
                        let thisApp = $rootScope.Apps.find((aplication) => aplication.id == value.appId);
                        let id = value.idSession;
                        thisApp.destroySessionObject(id).then((res)=>{
                        });
                    }
                    catch (error) {
                        console.log("error eliminando el objeto " + key + "\n" + error);
                    }

                });
                $rootScope.LISTSESSIONPARENT = [];
            }


            $rootScope._thisCurrentApp.variable.getContent(InitConfig.varLanguage).then(function (model) {
                $rootScope._thisCurrentApp.variable.setStringValue(InitConfig.varLanguage, $rootScope.language);
            }).catch(function (res) {
                var fieldLanguage = $rootScope._thisCurrentApp.field(InitConfig.fieldLanguage).getData();

                var cambioIdioma = function(){
                    switch (fieldLanguage.rows.length) {
                        case 0:
                            return false;
                        default:
                            $rootScope._thisCurrentApp.field(InitConfig.fieldLanguage).clear();
                            $rootScope._thisCurrentApp.field(InitConfig.fieldLanguage).selectValues([$rootScope.language.toUpperCase()], false, true);
                            break;
                    }

                    fieldLanguage.OnData.unbind(cambioIdioma);
                };

                fieldLanguage.OnData.bind(cambioIdioma);
            });


            $rootScope.CLEARBARSELECTIONS = ()=>{
                return new Promise(resolve => {
                    if ($rootScope.lstModelCurrentSelections && $rootScope.lstModelCurrentSelections.length >= 1) {
                        angular.forEach($rootScope.lstModelCurrentSelections, function (value, key) {
                            try {
                                value.close();
                            }
                            catch (error) {
                                console.log("error eliminando el objeto " + key + "\n" + error);
                            }

                                });
                        $rootScope.lstModelCurrentSelections = [];
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                })

            }
            $rootScope._thisCurrentApp.model.waitForOpen.promise.then(function () {
                $rootScope.CLEARBARSELECTIONS().then((res)=>{
                    var $CurrentSelections = $(".CurrentSelections");
                    $rootScope._thisCurrentApp.getObject($CurrentSelections, 'CurrentSelections').then(function(model){ 
                        $rootScope.lstModelCurrentSelections.push(model);
                        $('.qv-global-selections').parent('div').remove();
                    }) ;
                })

                            })


            $rootScope._thisCurrentApp.getAppLayout(function (layout) {     
                var _lang = $translate.use();           
                moment.locale(_lang);
                $rootScope.LastReloadTime = moment(layout.qLastReloadTime).format('LLLL');
                $rootScope.$on('$translateChangeSuccess', function ()
                {
                    _lang = $translate.use();
                    moment.locale(_lang);
                    $rootScope.LastReloadTime = moment(layout.qLastReloadTime).format('LLLL');

                    });
            });


            if($rootScope.OpenSidebarMenu == true){
                $rootScope.createCloneMenu();
            }
            $scope.noGlosary = InitConfig.noGlosary;
            var proDimensions, proMeasures;
            function getListDimensions(arr){
                proDimensions =  new Promise(resolve => {
                    var arrDimensions = [];
                    $.each(arr, function (key, value) {   
                        var TAGS = value.qMeta.tags;                              
                        if( !TAGS.some(r=> $scope.noGlosary.includes(r))){
                            var _item = {
                                type: $translate.instant('equalizer.label.dimensiones'),
                                descripcion: value?.qData?.descriptionExpression || value?.qData?.description,
                                name: value?.qData?.qLabelExpression || value?.qData?.title,
                                tags: TAGS
                            };
                             if(_item.name != '-' && _item.name != ''){
                                arrDimensions.push(_item);
                             }

                                                     }
                    })
                    resolve(arrDimensions);
                })
            }
            function getListMeasures(arr){
                proMeasures =  new Promise(resolve => {
                    var arrMeasures = [];
                    $.each(arr, function (key, value) {   
                        var TAGS = value.qMeta.tags;                              
                        if (!TAGS.some(r => $scope.noGlosary.includes(r))) {
                            var _item = {
                                type: $translate.instant('equalizer.label.medidas'),
                                descripcion: value?.qData?.descriptionExpression || value?.qData?.description,
                                name: value?.qData?.qLabelExpression || value?.qData?.title,
                                tags: TAGS
                            };
                            if (_item.name != '-' && _item.name != '') {
                                arrMeasures.push(_item);
                            }

                        }
                    })
                    resolve(arrMeasures);
                })
            }
            function getGlosario(){
                return new Promise(resolve => {
                    $rootScope._thisCurrentApp.model.waitForOpen.promise.then(() => {
                        $rootScope._thisCurrentApp.model.engineApp.createSessionObject(
                            {
                                qInfo: { qId: "LB01", qType: "MasterList" },
                                qDimensionListDef: {
                                    qType: "dimension",
                                    qData: {
                                        qDimension: "/qDimension",
                                        title: "/qMetaDef/title",
                                        description: "/qMetaDef/description",
                                        tags: "/qMetaDef/tags",
                                        grouping: "/qDim/qGrouping",
                                        info: "/qDimInfos",
                                        descriptionExpression:"/qData/descriptionExpression",
                                        qLabelExpression:"/qData/qLabelExpression",
                                        qDim :"/qDim"
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
                                        descriptionExpression:"/qData/descriptionExpression",
                                        qLabelExpression:"/qData/qLabelExpression",
                                        qDim :"/qDim"
                                    }
                                },
                            }
                        ).then(function(qBook){
                            qBook.getLayout().then(function(res){ 
                                var SESSIONLIS = {};
                                SESSIONLIS.idSession = 'LB01';
                                SESSIONLIS.appId = $rootScope._thisCurrentApp.id;
                                $rootScope.LISTSESSIONPARENT.push(SESSIONLIS);



                                                                getListDimensions(res.qDimensionList.qItems);
                                getListMeasures(res.qMeasureList.qItems);

                                Promise.all([proDimensions, proMeasures]).then(values => {
                                    var arr0 = [].concat.apply([], values[0])
                                    var arr1 = [].concat.apply([], values[1])
                                    var newArr = arr0.concat(arr1);
                                    resolve(newArr);
                                  });

                                    }).catch(function (error){
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
                $rootScope.allTags = [...new Set($rootScope.glossaryArr.flatMap(item => item.tags))];

            }
            asyncCallGetGlosario();

                        $rootScope.$on('$translateChangeSuccess', function(event, current, previous) {
                setTimeout(function(){
                    asyncCallGetGlosario();
                }, 600)                
            });

            function eliminarComentariosBloque(cadena) {
                return cadena.replace(/\/\*[\s\S]*?\*\//g, '');
            }
            $rootScope.BOOKMARKACTIVO = '';
            $rootScope.hasBookmarkActive = false;
            const getAnalysis = (IDBOOKMARK)=>{
                return new Promise(resolve => {
                    $rootScope._thisCurrentApp.model.engineApp.getSetAnalysis(
                        {
                            "qBookmarkId": IDBOOKMARK
                        }
                    ).then(function(qBook){
                        resolve(eliminarComentariosBloque(qBook.qSetExpression));
                    })
                })                   
            }
            function getselectionFields(datos){
                return new Promise(resolve => {
                    var _selectionFields = datos.map(match => match.qDef.qName).join(',');
                    resolve(_selectionFields);
                });
            }


                        function getListadoBookmark(){
                return new Promise(resolve => {
                    var APP = $rootScope._thisCurrentApp;            
                    APP.getList("BookmarkList", function (reply) {
                        var SESSIONLIS = {};
                        SESSIONLIS.idSession = reply.qInfo.qId;
                        SESSIONLIS.appId = $rootScope._thisCurrentApp.id;
                        $rootScope.LISTSESSIONPARENT.push(SESSIONLIS);
                        var listBookmark = [];
                        var listBookmarDefault = [];
                        reply.qBookmarkList.qItems.forEach(function (value) {
                            if(!value.qMeta.hasOwnProperty('extensionId')){
                                var itemBookmark = {};
                                getAnalysis(value.qInfo.qId).then(async (resSetAnalisis)=>{
                                    var setAnalysisBookmark = resSetAnalisis;
                                    itemBookmark.title = value.qData.title;
                                    itemBookmark.description = value.qData.description;
                                    itemBookmark.sheetId = value.qData.sheetId;
                                    itemBookmark.id = value.qInfo.qId;
                                    itemBookmark.selectionFields = value.qData.selectionFields || await getselectionFields(value.qData.qBookmark.qStateData[0].qFieldItems);
                                    itemBookmark.creationDate = moment(value.qData.creationDate).format('DD/MM/YYYY');
                                    itemBookmark.isDefaultBookmark = $rootScope.defaultBookmarkId == value.qInfo.qId ? true : false;
                                    itemBookmark.defaultBookmarkId = $rootScope.defaultBookmarkId == value.qInfo.qId ? $rootScope.defaultBookmarkId : '';
                                    itemBookmark.isDefaultBookmarkByUser = value.qMeta?.isUserPred || false;
                                    itemBookmark.setAnalysis = setAnalysisBookmark;


                                                                                                            if($rootScope.IsPersonalMode == false){
                                        itemBookmark.owner = value.qMeta?.owner?.userId || '';
                                        itemBookmark.ownername = value.qMeta?.owner?.name || '';
                                        itemBookmark.published = value.qMeta?.published == true;
                                        itemBookmark.canDelete = value.qMeta?.privileges ? value.qMeta.privileges.includes("delete") : false;
                                        itemBookmark.canPublish = value.qMeta?.privileges ? value.qMeta.privileges.includes("publish") : false;
                                        itemBookmark.canUpdate = value.qMeta?.privileges ? value.qMeta.privileges.includes("update") : false;
                                    }else {
                                        itemBookmark.owner = '';
                                        itemBookmark.ownername = '';
                                        itemBookmark.published = false;
                                        itemBookmark.canDelete = true;
                                        itemBookmark.canPublish = false;
                                        itemBookmark.canUpdate = true;
                                    } 
                                    if(!value.qMeta.hasOwnProperty('isDefaultBookmark')){
                                        itemBookmark.active = false;
                                        itemBookmark.isDefaultBookmark = false;
                                        listBookmark.push(itemBookmark);
                                    }else{                                   
                                        itemBookmark.active = true;
                                        itemBookmark.isDefaultBookmark = true;
                                        $rootScope.defaultBookmarkId = value.qMeta.defaultBookmarkId;                                                                        
                                        listBookmarDefault.push(itemBookmark);
                                    } 


                                })

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

                setTimeout(() => {$scope.$apply($rootScope.listBookmark)}, 0);
                $rootScope._thisCurrentApp.getList("SelectionObject", function (reply) {                    
                    getAnalysis().then((res)=>{
                        var setAnalysisScript = res; 
                        angular.forEach($rootScope.listBookmark, function (value, key) {
                            if(value.setAnalysis == setAnalysisScript){
                                value.active = true;
                            }else{
                                value.active = false;
                            }
                        });

                        $rootScope.currentBookmarkActive = $rootScope.listBookmark.filter((function (e) {
                            return e.active === true
                            }
                        ));
                        if($rootScope.currentBookmarkActive.length > 0){
                            $rootScope.BOOKMARKACTIVO = $rootScope.currentBookmarkActive;
                            $rootScope.hasBookmarkActive = true;
                        }else{
                            $rootScope.hasBookmarkActive = false;
                        }
                    })
                })
                $rootScope.listBookmarkDefault = result[1];
            }
            asyncCallGetListadoBookmark();


            $rootScope.NoFiltersSelected = true;
            $rootScope.totalFiltros = 0;
            function getListadoFiltros(){
                return new Promise(resolve => {
                    var APP = $rootScope._thisCurrentApp;                    
                    APP.getList("SelectionObject", function (reply) {
                        var SESSIONLIS = {};
                        SESSIONLIS.idSession = reply.qInfo.qId;
                        SESSIONLIS.appId = $rootScope._thisCurrentApp.id;
                        $rootScope.LISTSESSIONPARENT.push(SESSIONLIS);
                        var filterNoShow = 0;
                        (reply.qSelectionObject.qSelections.length > 0) ? $rootScope.NoFiltersSelected = false :  $rootScope.NoFiltersSelected = true;                        
                        var arrFiltros = [];
                        $.each(reply.qSelectionObject.qSelections, function (key, value) {                            
                            var starWith = value.qField.startsWith('_')
                            if(starWith){
                                filterNoShow = filterNoShow + 1;
                            }else{
                                var option = {};
                                option.index = key;
                                option.field = value.qField;
                                option.numSelected = value.qSelectedCount;
                                option.total = value.qTotal;
                                option.threshold = value.qSelectionThreshold;
                                option.selectedStr = value.qSelected;
                                option.qLocked =  value.qLocked || false;
                                option.qOneAndOnlyOne =  value.qOneAndOnlyOne || false;
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
                                if(option.isSelectAll){
                                    option.btnSelectAllDisable = true;
                                    option.btnSelectAlternativeDisable = true;
                                    option.btnSelectExcludedDisable = true;
                                    option.btnClearDisable = false;
                                }else if(option.qOneAndOnlyOne){
                                    option.btnSelectAllDisable = true;
                                    option.btnSelectAlternativeDisable = true;
                                    option.btnSelectExcludedDisable = true;
                                    option.btnClearDisable = true;
                                }else if(option.isNotSelectAll){
                                    option.btnSelectAllDisable = false;
                                    option.btnSelectAlternativeDisable = false;
                                    option.btnSelectExcludedDisable = false;
                                    option.btnClearDisable = false;
                                }else if(option.qLocked){
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
            asyncCallGetListadoFiltros();




            $scope.showInfoSheets = () =>{
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

            function getListModules(){
                return new Promise(resolve => {
                    var modulos = [];
                    var $STATES = $state.get();

                                        $STATES.filter(obj => {
                        if (obj.hasOwnProperty('params') && obj.params.isModule == true && obj.params.moduleName != '') {
                            let item = {};
                            item.module = obj.params.moduleName;
                            modulos.push(item); 
                        }
                    });
                    resolve(modulos)
                })
            }

            $rootScope.asyncCallGetListModules = async ()=> {
                const result = await getListModules();
                $rootScope.MODULOS = [];
                $rootScope.MODULOS = result;
                setTimeout(() => {                                                                
                    $scope.$apply(function () {
                        $rootScope.MODULOS;
                    })
                }, 0);               
            }
            $rootScope.asyncCallGetListModules();



    }]);
});