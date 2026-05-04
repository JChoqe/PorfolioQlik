
define([
    'app'

], function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('App.Quandox.View', {
                templateUrl: "views/View.html",
                controller: 'StateParentCtrl',
                resolve: {
                    dataApp: ['$rootScope', 'getAppService', 'getDefaulltBookmarkService', 'InitConfig', function ($rootScope, getAppService, getDefaulltBookmarkService, InitConfig) {
                        $rootScope.addElement();
                        var indexApp = 0;
                        $rootScope.indexApp = 0;
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
            .state('App.Quandox.View.Dashboard', {
                url: '/Quandox/Dashboard',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/Dashboard.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Dashboard'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Quandox.View.Analisis', {
                template: "<ui-view class='container-view row'></ui-view>",
                abstract: true
            })
            .state('App.Quandox.View.Analisis.Distribucion', {
                url: '/Quandox/Analisis/Distribucion',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/_Analisis/Distribucion.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Análisis', 'Distribución'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Quandox.View.Analisis.Evolutivo', {
                url: '/Quandox/Analisis/Evolutivo',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/_Analisis/Evolutivo.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Análisis', 'Evolutivo'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Quandox.View.Analisis.Acumulado', {
                url: '/Quandox/Analisis/Acumulado',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/_Analisis/Acumulado.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Análisis', 'Acumulado'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Quandox.View.Analisis.Quandox', {
                url: '/Quandox/Analisis/Quandox',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/_Analisis/Quandox.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Análisis', 'Quandox'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Quandox.View.Analisis.Comparativa', {
                url: '/Quandox/Analisis/Comparativa',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/_Analisis/Comparativa.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Análisis', 'Comparativa'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })

            .state('App.Quandox.View.Reporting', {
                url: '/Quandox/Reporting',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/Reporting.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Reporting'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html'
                }
            })
            .state('App.Quandox.View.Piramide', {
                url: '/Quandox/Piramide',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/Piramide.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Pirámide de Edad'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })

            .state('App.Quandox.View.Mapa', {
                url: '/Quandox/Mapa',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Quandox/Mapa.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'Mapa'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html'
                }
            })
            .state('App.Quandox.View.Sheets', {
                url: '/Quandox/Sheets',
                template: "<customsheets></customsheets>",
                controller: 'StateChildrenCtrl',
                params: {
                    SHEETSENSE: true,
                    IDFILTRO: 'eanBw',
                    PATH: ['Quandox', 'sheets.menu.sheet'],
                    URLMENU: '/_Quandox/__menus/_QuandoxMenu.html'
                }
            })
    }]);
});



