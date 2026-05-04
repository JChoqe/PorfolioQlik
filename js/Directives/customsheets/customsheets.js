var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore',
    'moment',
], function (qlik, app,us, moment) {
        app.directive('customsheets', () => {
            var directiveDefinitionObject = {
                restrict: 'E',
                transclude: true,
                replace: true,
                scope: true,
                templateUrl: 'js/Directives/customsheets/customsheets.html',
                link: function ($scope, $rootScope, $attrs , element ) {


                                    },
                controller: ['$stateParams','$window', '$http','$q', '$scope', '$rootScope', '$compile', 'luiDialog', '$translate', '$attrs', '$element', '$state', 'orderByFilter', ($stateParams, $window, $http ,$q, $scope, $rootScope, $compile, luiDialog, $translate, $attrs, $element, $state, orderBy) => {
                    let PrefSheets = $rootScope.PrefSheets;
                    $scope.hasPersonalSheets = false;
                    $scope.SHEETS = [];

                                                                                                  function getParentName() {
                        return new Promise((resolve, reject) => {  
                            let parent = '';  
                            if ($stateParams.isModule) { 
                                parent = $stateParams.moduleName;
                                resolve(parent);
                            }else{
                                resolve(false); 
                            }                       


                                                                                })
                    }


                    function getSheetsByPrefix(list) {
                        return new Promise((resolve, reject) => {                            
                            let filtered = list.qAppObjectList.qItems.filter((item)=> { return item.qData.title.startsWith(PrefSheets + $scope.Parent);});
                            resolve(filtered);
                        })
                    }

                    function getListSheets() {
                        return new Promise((resolve, reject) => {

                            $rootScope._thisCurrentApp.model.waitForOpen.promise.then(() => {
                                $rootScope._thisCurrentApp.model.engineApp.createSessionObject(
                                    {
                                        qInfo: { qId: "", qType: "MasterList" },
                                        qAppObjectListDef: {
                                            qType: "sheet",
                                            qData: {
                                                title: "/qMetaDef/title",
                                                description: "/qMetaDef/description",
                                            }
                                        }
                                    }
                                ).then(function(qBook){
                                    qBook.getLayout().then(function(res){
                                        resolve(res);                                        
                                    })                                    
                                })
                            })
                        }).catch(function(e) {
                            console.log(e);
                        });
                    }

                    function removeActive(arr){
                        return new Promise((resolve, reject) => {
                            us.each(arr, function (item) {
                                item.active = false;
                            })
                            resolve(true);                            
                        }) 
                    }
                    $scope.InitSheets = ()=>{
                        getParentName().then(function (name) {
                            if(name == false){
                                $scope.hasPersonalSheets = false;
                                $rootScope.deleteElement();
                                setTimeout(() => {
                                    $('.loader-perso').remove();  
                                }, 1200);
                                $scope.$apply(function () {
                                    $rootScope.asyncCallGetListModules();
                                })
                            }else{
                                $scope.Parent = name;
                                getListSheets().then((res)=>{
                                    $rootScope._thisCurrentApp.destroySessionObject(res.qInfo.qId);
                                    let listSheets = res;
                                    $scope.SHEETS = [];
                                    let sheets = [];
                                    $scope.groupBy = [];
                                    $scope.id_app = $rootScope._thisCurrentApp.id;

                                                getSheetsByPrefix(listSheets).then((res)=>{
                                        if(res.length > 0){
                                            $scope.hasPersonalSheets = true;
                                            let filterSheet = res;
                                            let sortedData = us.sortBy(filterSheet, function (item) {  
                                                return item.qData.rank;                        
                                            });
                                            us.each(sortedData, function (item, i) {
                                                let filtro = item.qMeta.title.split('.');
                                                if(filtro[1].replace(PrefSheets, '') == $scope.Parent){
                                                    let option = {};
                                                    option.index = i;
                                                    option.orden = item.qData.rank;
                                                    option.approved = item.qMeta.hasOwnProperty('approved') ? item.qMeta.approved : '';
                                                    option.published = item.qMeta.hasOwnProperty('published') ? item.qMeta.published : '';
                                                    option.publishTime = item.qMeta.hasOwnProperty('publishTime') ? item.qMeta.publishTime : '';
                                                    option.createdDate = item.qMeta.hasOwnProperty('createdDate') ? item.qMeta.createdDate : '';
                                                    option.description = item.qMeta.hasOwnProperty('description') && item.qMeta.description != '' ? item.qMeta.description : '';
                                                    option.modifiedDate = item.qMeta.hasOwnProperty('modifiedDate') ? item.qMeta.modifiedDate : '';
                                                    option.owner = item.qMeta.hasOwnProperty('owner') ? item.qMeta.owner.name : '';                                            
                                                    option.id = item.qInfo.qId;
                                                    option.active = false; 
                                                    let titulo = item.qMeta.title.split('.');                           
                                                    option.groupBy = titulo[titulo.length - 2].replace(PrefSheets, '');
                                                    if (titulo.length > 2) {
                                                        option.isChildren = true;
                                                        option.parent = titulo[titulo.length - 2].replace(PrefSheets, ''); 
                                                    } else {
                                                        option.isChildren = true; 
                                                        option.parent = titulo[titulo.length - 2].replace(PrefSheets, '');
                                                    }
                                                    var str = item.qMeta.title,
                                                    delimiter = '.',
                                                    start = 2,
                                                    tokens = str.split(delimiter),
                                                    name = [tokens.slice(0, start), tokens.slice(start)].map(function(item) {
                                                        return item.join(delimiter);
                                                    });
                                                    option.name = name[1];
                                                    sheets.push(option)
                                                }
                                            })

                                                                $scope.SHEETS = orderBy(sheets, 'name', false);

                                                    setTimeout(function () {                                                                                                                                                
                                                if($scope.SHEETS.length > 0) $scope.initPage();
                                                $rootScope.deleteElement();                                                
                                            },600) 


                                                                $scope.urlIframe = '';                                    

                                                                $scope.initPage = function () {  
                                                var htmlcontent = $('#contentSheets');                              
                                                var newScope = $scope.$new(false, $scope);
                                                var origin = window.location.origin;
                                                $scope.SHEETS[0].active = true;
                                                var ID = $scope.SHEETS[0].id;                            
                                                $scope.urlIframe = origin + '/single/?appid=' + $scope.id_app + '&sheet=' + ID + '&lang=es&theme=' + $rootScope.ThemesInit + '&opt=ctxmenu';
                                                var _htmlIframe = "<iframe src='" + $scope.urlIframe + "' class='col-xl-12 mzh-100 m-0 p-0 iframeSense'></iframe>"
                                                angular.element(htmlcontent).empty().append($compile(_htmlIframe)(newScope)).promise().done(function() {
                                                    $rootScope.deleteElement();
                                                    setTimeout(() => {
                                                        $('.loader-perso').remove();  
                                                    }, 1200);                                                    
                                                });                                
                                            }



                                                                                                                                            $scope.showIframe = function (item, $event) { 
                                                var htmlcontent = $('#contentSheets');                                     
                                                let isActive = item.active;
                                                let ID = item.id;
                                                if(!isActive) {
                                                    removeActive($scope.SHEETS).then(function(){
                                                        item.active = true;
                                                        var newScope = $scope.$new(false, $scope);
                                                        var origin = window.location.origin;                            
                                                        $scope.urlIframe = origin + '/single/?appid=' + $scope.id_app + '&sheet=' + ID + '&lang=es&theme=' + $rootScope.ThemesInit + '&opt=ctxmenu';  
                                                        var _htmlIframe = "<iframe src='" + $scope.urlIframe + "' class='col-xl-12 mzh-100 m-0 p-0 iframeSense'></iframe>"
                                                        angular.element(htmlcontent).empty().append($compile(_htmlIframe)(newScope)).promise().done(function(){
                                                            setTimeout(() => {
                                                                $scope.$apply($scope.SHEETS);
                                                            }, 0);
                                                        });

                                                                                                            })                                                                                          
                                                }                                                                                           
                                            }
                                        }else{
                                            $scope.hasPersonalSheets = false;
                                            $rootScope.deleteElement();
                                            setTimeout(() => {
                                                $('.loader-perso').remove();  
                                            }, 1200);
                                            $scope.$apply(function () {
                                                $rootScope.asyncCallGetListModules();
                                            })
                                        }                                    
                                    })
                                }).catch((error)=>{
                                    console.log(error)
                                })
                            }                            
                        })
                    }
                    $rootScope._thisCurrentApp.model.waitForOpen.promise.then(() => {
                        $scope.InitSheets();
                    })


                                        $scope.showBar = false;
                    $scope.showSearch = function(){
                        $scope.showBar = $scope.showBar === false ? true : false;
                        if($scope.showBar == true){
                            setTimeout(() => {
                                var _imput = $window.document.getElementById('barsearch');
                                _imput.focus()   
                            }, 400);                           
                        }
                    }


                    $rootScope.getPersonalModeByName().then(function(res){
                        var isVisible = res[0] == true ? false : true;
                        $scope.itemsOrder = [
                            {
                                name: 'order.menu.nombreHoja',
                                option: 'name',
                                visible: true,
                                active:true
                            },
                            {
                                name: 'order.menu.publicado',
                                option: 'published',
                                visible: isVisible,
                                active:false
                            },
                            {
                                name: 'order.menu.aprovado',
                                option: 'approved',
                                visible: isVisible,
                                active:false
                            },
                            {
                                name: 'order.menu.fechacreacion',
                                option: 'createdDate',
                                visible: isVisible,
                                active:false
                            },
                            {
                                name: 'order.menu.fechapublicacion',
                                option: 'publishTime',
                                visible: isVisible,
                                active:false
                            },
                            {
                                name: 'order.menu.fechamodificacion',
                                option: 'modifiedDate',
                                visible: isVisible,
                                active:false
                            },
                            {
                                name: 'order.menu.propietario',
                                option: 'owner',
                                visible: isVisible,
                                active:false
                            }
                        ];
                    })



                                                            $scope.showOrder = false;
                    $scope.showOrderby = function(){
                        $scope.showOrder = $scope.showOrder === false ? true : false;
                    }


                                        $scope.propertyName = 'name';
                    $scope.reverse = false;
                    $scope.sortBy = function(item) { 
                        if(!item.active){
                            var propertyName = item.option;
                            removeActive($scope.itemsOrder).then(function(){                       
                                item.active = true;
                                $scope.propertyName = propertyName;
                            })
                        }

                    };

                    $scope.changeSortOrder = function(){
                        $scope.reverse = $scope.reverse === false ? true : false;
                    }

                    $scope.params = {};
                    $scope.clearSearchBar = function($event) {
                        setTimeout(function() {
                            $scope.params = {};
                            $scope.$apply();
                        }, 200);

                    }
                    $scope.resetSearch = function(){
                        $scope.searchText = null;
                    }

                    $scope.showInfoSheet = function(item){
                        $http.get('js/Directives/customsheets/_templates/infoSheet-template.html').then(function (response) {                            
                            var _template = response.data;
                            var dialog = luiDialog.show({
                                template: _template,
                                closeOnEscape: true,
                                controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                    var _lang = $translate.use();           
                                    moment.locale(_lang);
                                    $scope.closeDialog = function () {
                                        dialog.close();
                                    }
                                    $scope.InfoSheet = {
                                        name: item.name,
                                        description : item.description,
                                        approved: item.approved == true ? $translate.instant('sheets.modal.SI') : $translate.instant('sheets.modal.NO'),
                                        published: item.published == true ? $translate.instant('sheets.modal.SI') : $translate.instant('sheets.modal.NO'),
                                        publishTime : moment(item.publishTime).format('LLLL'),
                                        createdDate : moment(item.createdDate).format('LLLL'),
                                        modifiedDate : moment(item.modifiedDate).format('LLLL'),
                                        owner: item.owner
                                    };

                                }]
                            });
                        })
                    }


                    $rootScope.HideMenuSheets = false;
                    $rootScope.hideMenuSheets = function(){
                        $rootScope.HideMenuSheets = $rootScope.HideMenuSheets === false ? true : false;
                    }

                    $scope.openAppSense = () =>{
                        let appId = $rootScope._thisCurrentApp.id;
                        let origin = window.location.origin;
                        let urlIframe = origin + '/sense/app/' + appId + '/overview';
                        window.open(
                            urlIframe,
                            '_blank'
                          );
                    } 
                    $scope.reloadAppSense = () =>{
                        let target = $('#main');
                        $(target).append($compile('<blockloading></blockloading>')($scope)).promise().done(()=>{                                                        
                            $state.forceReload();                                                        
                        });
                    }                                                                                        
                }]
            };
        return directiveDefinitionObject;
    });

});