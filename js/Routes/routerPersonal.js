
define([
    'app'

], function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('App.Personal.View', {
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
            .state('App.Personal.View.Dashboard', {
                url: '/Personal/Dashboard',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/Dashboard.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Dashboard'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Personal.View.Analisis', {
                template: "<ui-view class='container-view row'></ui-view>",
                abstract: true
            })
            .state('App.Personal.View.Analisis.Distribucion', {
                url: '/Personal/Analisis/Distribucion',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/_Analisis/Distribucion.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Análisis', 'Distribución'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Personal.View.Analisis.Evolutivo', {
                url: '/Personal/Analisis/Evolutivo',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/_Analisis/Evolutivo.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Análisis', 'Evolutivo'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Personal.View.Analisis.Acumulado', {
                url: '/Personal/Analisis/Acumulado',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/_Analisis/Acumulado.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Análisis', 'Acumulado'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Personal.View.Analisis.Personal', {
                url: '/Personal/Analisis/Personal',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/_Analisis/Personal.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Análisis', 'Personal'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Personal.View.Analisis.Comparativa', {
                url: '/Personal/Analisis/Comparativa',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/_Analisis/Comparativa.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Análisis', 'Comparativa'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })

            .state('App.Personal.View.Reporting', {
                url: '/Personal/Reporting',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/Reporting.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Reporting'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html'
                }
            })
            .state('App.Personal.View.Piramide', {
                url: '/Personal/Piramide',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/Piramide.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Pirámide de Edad'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })

            .state('App.Personal.View.Mapa', {
                url: '/Personal/Mapa',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Personal/Mapa.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav: null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'Mapa'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html'
                }
            })
            .state('App.Personal.View.Sheets', {
                url: '/Personal/Sheets',
                template: "<customsheets></customsheets>",
                controller: 'StateChildrenCtrl',
                params: {
                    SHEETSENSE: true,
                    IDFILTRO: 'eanBw',
                    PATH: ['Personal', 'sheets.menu.sheet'],
                    URLMENU: '/_Personal/__menus/_PersonalMenu.html'
                }
            })
    }]);
});



