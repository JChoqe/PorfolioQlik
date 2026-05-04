
define([
    'app'

], function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('App.Absentismo.View', {
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
            .state('App.Absentismo.View.Dashboard', {
                url: '/Absentismo/Dashboard',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Absentismo/Dashboard.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Absentismo', 'Dashboard'],
                    URLMENU: '/_Absentismo/__menus/_AbsentismoMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Absentismo.View.Analisis', {
                template: "<ui-view class='container-view row'></ui-view>",
                abstract: true
            })
            .state('App.Absentismo.View.Analisis.Distribucion', {
                url: '/Absentismo/Analisis/Distribucion',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Absentismo/_Analisis/Distribucion.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Absentismo', 'Análisis', 'Distribución'],
                    URLMENU: '/_Absentismo/__menus/_AbsentismoMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Absentismo.View.Analisis.Dispersion', {
                url: '/Absentismo/Analisis/Dispersion',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Absentismo/_Analisis/Dispersion.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Absentismo', 'Análisis', 'Dispersión'],
                    URLMENU: '/_Absentismo/__menus/_AbsentismoMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Absentismo.View.Analisis.Personal', {
                url: '/Absentismo/Analisis/Personal',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Absentismo/_Analisis/Personal.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Absentismo', 'Análisis', 'Personal'],
                    URLMENU: '/_Absentismo/__menus/_AbsentismoMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Absentismo.View.Analisis.Detalle', {
                url: '/Absentismo/Analisis/Detalle',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Absentismo/_Analisis/Detalle.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Absentismo', 'Análisis', 'Detalle'],
                    URLMENU: '/_Absentismo/__menus/_AbsentismoMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Absentismo.View.Reporting', {
                url: '/Absentismo/Reporting',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Absentismo/Reporting.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Absentismo', 'Reporting'],
                    URLMENU: '/_Absentismo/__menus/_AbsentismoMenu.html'
                }
            })
            .state('App.Absentismo.View.Mapa', {
                url: '/Absentismo/Mapa',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Absentismo/Mapa.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Absentismo', 'Mapa'],
                    URLMENU: '/_Absentismo/__menus/_AbsentismoMenu.html'
                }
            })
            .state('App.Absentismo.View.Sheets', {
                url: '/Absentismo/Sheets',
                template: "<customsheets></customsheets>",
                controller: 'StateChildrenCtrl',
                params: {
                    SHEETSENSE: true,
                    IDFILTRO: 'eanBw',
                    PATH: ['Absentismo', 'sheets.menu.sheet'],
                    URLMENU: '/_Absentismo/__menus/_AbsentismoMenu.html'
                }
            })
    }]);
});



