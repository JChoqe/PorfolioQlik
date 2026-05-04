
define([
    'app'

], function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('App.Presencia.View', {
                templateUrl: "views/View.html",
                controller: 'StateParentCtrl',
                resolve: {
                    dataApp: ['$rootScope', 'getAppService', 'getDefaulltBookmarkService', 'InitConfig', function ($rootScope, getAppService, getDefaulltBookmarkService, InitConfig) {
                        $rootScope.addElement();
                        var indexApp = 2;
                        $rootScope.indexApp = 2;
                        if ($rootScope.Apps[indexApp]) {
                            return $rootScope.Apps[indexApp];
                        } else {
                            return getAppService.getDataApp(InitConfig.arrApps[$rootScope.indexApp].idapp).then((res) => res); 
                        }
                    }],
                    defaulltBookmark: ['dataApp', 'getDefaulltBookmarkService', '$rootScope', function (dataApp, getDefaulltBookmarkService, $rootScope) {
                        return getDefaulltBookmarkService.getBookmarkId([dataApp]).then((res) => res);
                    }]
                },
                onExit: ["$rootScope", function ($rootScope) {
                    $rootScope.clearObjectMenu();
                }
                ],
                abstract: true
            })
            .state('App.Presencia.View.Dashboard', {
                url: '/Presencia/Dashboard',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Presencia/Dashboard.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'bacc1453-e588-438b-bb06-7313b01cb086',
                    PATH: ['Control de Presencia', 'Dashboard'],
                    URLMENU: '/_Presencia/__menus/_PresenciaMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Presencia.View.Analisis', {
                template: "<ui-view class='container-view row'></ui-view>",
                abstract: true
            })
            .state('App.Presencia.View.Analisis.Detalle', {
                url: '/Presencia/Analisis/Detalle',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Presencia/_Analisis/Detalle.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'bacc1453-e588-438b-bb06-7313b01cb086',
                    PATH: ['Control de Presencia', 'Análisis', 'Detalle'],
                    URLMENU: '/_Presencia/__menus/_PresenciaMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Presencia.View.Analisis.Resumen', {
                url: '/Presencia/Analisis/Resumen',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Presencia/_Analisis/Resumen.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'bacc1453-e588-438b-bb06-7313b01cb086',
                    PATH: ['Control de Presencia', 'Análisis', 'Resumen'],
                    URLMENU: '/_Presencia/__menus/_PresenciaMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Presencia.View.Reporting', {
                url: '/Presencia/Reporting',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Presencia/Reporting.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'bacc1453-e588-438b-bb06-7313b01cb086',
                    PATH: ['Control de Presencia', 'Reporting'],
                    URLMENU: '/_Presencia/__menus/_PresenciaMenu.html'
                }
            })

            .state('App.Presencia.View.Sheets', {
                url: '/Presencia/Sheets',
                template: "<customsheets></customsheets>",
                controller: 'StateChildrenCtrl',
                params: {
                    SHEETSENSE: true,
                    IDFILTRO: 'bacc1453-e588-438b-bb06-7313b01cb086',
                    PATH: ['Control de Presencia', 'sheets.menu.sheet'],
                    URLMENU: '/_Presencia/__menus/_PresenciaMenu.html'
                }
            })
    }]);
});



