
define([
    'app'

], function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('App.Formacion.View', {
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
            .state('App.Formacion.View.Dashboard', {
                url: '/Formacion/Dashboard',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Formacion/Dashboard.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Formacion', 'Dashboard'],
                    URLMENU: '/_Formacion/__menus/_FormacionMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Formacion.View.Analisis', {
                template: "<ui-view class='container-view row'></ui-view>",
                abstract: true
            })
            .state('App.Formacion.View.Analisis.Distribucion', {
                url: '/Formacion/Analisis/Distribucion',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Formacion/_Analisis/Distribucion.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Formación', 'Análisis', 'Distribución'],
                    URLMENU: '/_Formacion/__menus/_FormacionMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Formacion.View.Analisis.Detalle', {
                url: '/Formacion/Analisis/Detalle',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Formacion/_Analisis/Detalle.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Formación', 'Análisis', 'Detalle'],
                    URLMENU: '/_Formacion/__menus/_FormacionMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Formacion.View.Analisis.Personal', {
                url: '/Formacion/Analisis/Personal',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Formacion/_Analisis/Personal.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Formación', 'Análisis', 'Personal'],
                    URLMENU: '/_Formacion/__menus/_FormacionMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Formacion.View.Reporting', {
                url: '/Formacion/Reporting',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Formacion/Reporting.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Formación', 'Reporting'],
                    URLMENU: '/_Formacion/__menus/_FormacionMenu.html'
                }
            })
            .state('App.Formacion.View.Mapa', {
                url: '/Formacion/Mapa',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Formacion/Mapa.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Formación', 'Mapa'],
                    URLMENU: '/_Formacion/__menus/_FormacionMenu.html'
                }
            })
            .state('App.Formacion.View.Sheets', {
                url: '/Formacion/Sheets',
                template: "<customsheets></customsheets>",
                controller: 'StateChildrenCtrl',
                params: {
                    SHEETSENSE: true,
                    IDFILTRO: 'eanBw',
                    PATH: ['Formacion', 'sheets.menu.sheet'],
                    URLMENU: '/_Formacion/__menus/_FormacionMenu.html',
                }
            })

                }]);
});



