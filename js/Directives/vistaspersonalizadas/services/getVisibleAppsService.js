define([
    'js/qlik',
    'app',
    'moment',
    'underscore'
], function (qlik, app, moment, us) {

    app.service('getVisibleAppsService', ['$rootScope', 'InitConfig', 'getAppService', function ($rootScope, InitConfig, getAppService) {
        function getIcon(visualization) {
            switch (visualization) {
                case 'linechart':
                    return 'lui-icon lui-icon--line-chart lui-list__aside';
                    break;
                case 'barchart':
                    return 'lui-icon lui-icon--bar-chart lui-list__aside';
                    break;
                case 'bulletchart':
                    return 'lui-icon lui-icon--bar-chart lui-list__aside';
                    break;
                case 'scatterplot':
                    return 'lui-icon lui-icon--scatter-chart lui-list__aside';
                    break;
                case 'piechart':
                    return 'lui-icon lui-icon--pie-chart lui-list__aside';
                    break;
                case 'boxplot':
                    return 'lui-icon lui-icon--boxplot lui-list__aside';
                    break;
                case 'distributionplot':
                    return 'lui-icon lui-icon--distributionplot lui-list__aside';
                    break;
                case 'combochart':
                    return 'lui-icon lui-icon--combo-chart lui-list__aside';
                    break;
                case 'map':
                    return 'class="lui-icon lui-icon--map lui-list__aside"';
                    break;
                case 'treemap':
                    return 'lui-icon lui-icon--treemap lui-list__aside';
                    break;
                case 'histogram':
                    return 'lui-icon lui-icon--histogram lui-list__aside';
                    break;
                case 'table':
                    return 'lui-icon lui-icon--table lui-list__aside';
                    break;
                case 'pivot-table':
                    return 'lui-icon lui-icon--pivot-table lui-list__aside';
                    break;
                case 'MzGenaro':
                    return 'lui-icon lui-icon--print lui-list__aside';
                    break;
                default:
                    return 'lui-icon lui-icon--field lui-list__aside';
            }
        }

        function getUserMode() {
            return new Promise((resolve, reject) => {
                var global = qlik.getGlobal(config);
                global.isPersonalMode((reply) => {
                    $rootScope.IsPersonalMode = reply.qReturn;
                    resolve();
                });
            })
        };


        function getUserAppList() {
            return new Promise((resolve, reject) => {
                var global = qlik.getGlobal(config);
                global.session.rpc({
                    method: "GetDocList", handle: -1, params: []

                }).then(function (res) {
                    var conPermisoLectura;
                    conPermisoLectura = res.result.qDocList;

                    let listApps = [];
                    if (conPermisoLectura && conPermisoLectura.length > 0) {
                        conPermisoLectura.forEach(function (item, index) {
                            var option = {};
                            option.idApp = item.qDocId;
                            option.nameApp = item.qDocName.trim();
                            listApps.push(option);
                        })
                    }
                    resolve(listApps);

                }).catch(function (e) {
                    reject(e);
                })
            });
        };

        function getInitConfigApps(appsServer) {
            var visibles = [];
            InitConfig.arrApps.forEach(function (initApp, i) {
                appsServer.find(function (serverApp) {

                    if ($rootScope.IsPersonalMode == true) {
                        if (initApp.idapp.trim().replace(".qvf", "") == serverApp.nameApp.trim().replace(".qvf", "")) {
                            visibles.push(initApp);
                        }

                    } else {
                        if (initApp.idapp.trim().replace(".qvf", "") == serverApp.idApp.trim().replace(".qvf", "")) {
                            visibles.push(initApp);
                        }
                    }

                })
            })
            return visibles;
        }



        this.getVisibleApps = function () {
            return new Promise(async function (resolveGeneral, rejectGeneral) {
                await getUserMode();

                if (InitConfig.hasSecurity == false || $rootScope.IsPersonalMode) {
                    const appUniq = _.uniq(InitConfig.arrApps, false, (obj) => obj.idapp);
                    resolveGeneral(appUniq);

                } else {
                    (async function () {
                        try {
                            var appsServer = await getUserAppList();
                            var appsVisibles = getInitConfigApps(appsServer);
                            resolveGeneral(appsVisibles);

                        } catch (e) {
                            console.error(e);
                            resolveGeneral(InitConfig.arrApps);
                        }
                    })();
                }
            });

        };

        function getAppOpen(_appId, i) {
            return new Promise(resolve => {
                if ($rootScope.Apps[i]) {
                    resolve($rootScope.Apps[i]);
                } else {
                    var app = qlik.openApp(_appId, config);
                    app.model.waitForOpen.promise.then(() => {
                        if (!$rootScope.Apps[i]) {
                            $rootScope.Apps[i] = app;
                        }    
                        resolve(app);
                    }).catch(function(){
                        resolve(false);
                    })
                }
            }) 
        }

        function getUser(value){
            var str = value.qMeta.hasOwnProperty('owner').owner ? value.qMeta.owner.name : value.qMeta.user;
            var isServer = str.includes(';');

            if (isServer == true) {
                str.split(";");
                var usuario = str.split('=');
                return usuario[2];
            } else {
                return str;
            }
        }
        function getListadoBookmark(aplicacion, i) {
            return new Promise(resolve => {
                var APP = aplicacion;
                APP.getList("BookmarkList", function (reply) {
                    var listBookmark = [];
                    reply.qBookmarkList.qItems.forEach(function (value) {
                        if (value.qMeta.hasOwnProperty('extensionId')) {
                            var itemBookmark = {};
                            itemBookmark.APP = aplicacion;
                            itemBookmark.APPNAME = $rootScope.AppsControl.find((app) => app.idapp == aplicacion.id).name;
                            itemBookmark.indexApp = i;
                            itemBookmark.Object = value.qMeta.object;
                            itemBookmark.title = value.qData.title;
                            itemBookmark.id = value.qInfo.qId;
                            itemBookmark.selectionFields = value.qData.selectionFields;
                            itemBookmark.creationDate = moment(value.qData.creationDate).format('DD/MM/YYYY');
                            itemBookmark.modificationDate = moment(value.qMeta.modifiedDate).format('DD/MM/YYYY');
                            itemBookmark.type = getIcon(value.qMeta.object.visualization);
                            itemBookmark.typeObject = value.qMeta.object.visualization;
                            itemBookmark.qStateData = value.qData.qBookmark.qStateData;
                            itemBookmark.user =getUser(value);

                            if ($rootScope.IsPersonalMode == false) {
                                itemBookmark.published = value.qMeta.published == true;
                                itemBookmark.canDelete = value.qMeta.privileges ? value.qMeta.privileges.includes("delete") : false;
                                itemBookmark.canPublish = value.qMeta.privileges ? value.qMeta.privileges.includes("publish") : false;
                            } else {
                                itemBookmark.published = false;
                                itemBookmark.canDelete = true;
                                itemBookmark.canPublish = false;
                            }
                            listBookmark.push(itemBookmark);
                        }
                    });
                    APP.destroySessionObject(reply.qInfo.qId)
                    resolve(listBookmark);
                });
            })
        }

        this.asyncCallGetListadoBookmark = async function (_appId) {
            try {
                let index = $rootScope.AppsControl.findIndex((app) => app.idapp === _appId);
                const app = await getAppOpen(_appId, index);
                if (app !== false) {
                    const result = await getListadoBookmark(app, index);
                    return [result];
                }
            } catch (error) {
                console.error(error);
            }

                    return null;
        };

    }]);
});