define([
    'js/qlik',
    'app'
], function (qlik, app) {
        app.service('getDefaulltBookmarkService',[ '$rootScope', function ($rootScope) { 

            function getBookmar(app) {
                return new Promise(async function (resolve, reject) {
                    var APP = app;
                    var listBookmark = [];

                                APP.getList("BookmarkList", function (reply) {
                        reply.qBookmarkList.qItems.forEach(function (value) {
                            listBookmark.push(value);
                        });
                        APP.destroySessionObject(reply.qInfo.qId)
                        resolve(listBookmark);
                    });
                });
            }


                        this.getBookmarkId = async function (arr) {                
                return new Promise(async function (resolve, reject) {
                    var _aplication = arr[0];
                    if($rootScope.AppsControl[$rootScope.indexApp].init == false){
                        $rootScope.AppsControl[$rootScope.indexApp].init = true;
                        var _listBookmark = await getBookmar(_aplication);
                        $rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.bookmarkDefaultUser = _listBookmark.find((state) => state.qMeta?.isUserPred == true);
                        if($rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.bookmarkDefaultUser){
                            $rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.bookmarkDefaultUserId = $rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.bookmarkDefaultUser.qInfo.qId;
                            $rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.hasBookmarkDefaultUser = true;
                            _aplication.bookmark.apply($rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.bookmarkDefaultUserId); 
                        }


                                                                        angular.forEach(arr, function(value, key) {
                            var _app = value;
                            _app.model.waitForOpen.promise.then(() => {

                                _app.model.engineApp.createSessionObject(
                                {
                                    qInfo: {
                                        qId: "AppPropsList",
                                        qType: "AppPropsList"
                                    },
                                    qAppObjectListDef: {
                                        qType: "appprops",
                                        qData: {
                                            defaultBookmarkId:"/defaultBookmarkId",
                                            sheetTitleBgColor: "/sheetTitleBgColor",
                                            sheetTitleGradientColor: "/sheetTitleGradientColor",
                                            sheetTitleColor: "/sheetTitleColor",
                                            sheetLogoThumbnail: "/sheetLogoThumbnail",
                                            sheetLogoPosition: "/sheetLogoPosition",
                                            rtl: "/rtl",
                                            theme: "/theme"
                                        }
                                    }
                                }
                            ).then(function(qBook){
                                qBook.getLayout().then(function(properties){ 
                                    _app.model.engineApp.createSessionObject(
                                        {
                                            "qInfo": {
                                                "qId": "BL01",
                                                "qType": "BookmarkList"
                                                },
                                                "qBookmarkListDef": {
                                                "qType": "bookmark"
                                                }
                                        }
                                    ).then(function(qBookBookmar){
                                        qBookBookmar.getLayout().then(function(res){                                           
                                            var arrBookmar = res.qBookmarkList.qItems;
                                            var $dim = arrBookmar.filter(obj => {
                                                if (obj.qMeta.hasOwnProperty('defaultBookmarkId')) {
                                                    return obj;
                                                }
                                            });
                                            if($dim.length > 0){
                                                $rootScope.defaultBookmarkId = $dim[0].qMeta.defaultBookmarkId;
                                            } else{
                                                $rootScope.AppdefaultBookmarkId = properties.qAppObjectList.qItems[0].qData.defaultBookmarkId
                                                $rootScope.defaultBookmarkId = properties.qAppObjectList.qItems[0].qData.defaultBookmarkId;
                                            }

                                                if(typeof $rootScope.defaultBookmarkId != "undefined" && $rootScope.defaultBookmarkId != null){
                                                if(!$rootScope.AppsControl[$rootScope.indexApp].bookmarkApp.bookmarkDefaultUser){
                                                    setTimeout(function(){
                                                        resolve(
                                                            _app.model.engineApp.applyBookmark(
                                                                {
                                                                    "qId": $rootScope.defaultBookmarkId
                                                                }
                                                            )                                                                                              
                                                        );
                                                    }, 600)
                                                }else{
                                                    resolve(false);
                                                }

                                                                                                                                            }else{
                                                resolve(false);
                                            }                                          
                                        })

                                                                            })







                                                                                                                                                            }).catch((function() {
                                    throw new Error("No se pudieron recuperar las propiedades de la aplicación")
                                }))                                    
                            })




                                                                                                            }).catch((function(e) {
                                throw new Error(e)
                            }))  
                        }); 

                    }else{
                        resolve(true)
                    }
                })               
            };                    
    }]);
});