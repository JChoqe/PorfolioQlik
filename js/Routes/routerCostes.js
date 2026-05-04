
define([
    'app'

], function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('App.Costes.View', {
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
            .state('App.Costes.View.Dashboard', {
                url: '/Costes/Dashboard',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Costes/Dashboard.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Costes', 'Dashboard'],
                    URLMENU: '/_Costes/__menus/_CostesMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })


            .state('App.Costes.View.Analisis', {
                template: "<ui-view class='container-view row'></ui-view>",
                abstract: true
            })
            .state('App.Costes.View.Analisis.RentabilidadBruta', {
                url: '/Costes/Analisis/RentabilidadBruta',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Costes/_Analisis/RentabilidadBruta.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Costes', 'Análisis', 'Rentabilidad Bruta'],
                    URLMENU: '/_Costes/__menus/_CostesMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Costes.View.Analisis.Dispersion', {
                url: '/Costes/Analisis/Dispersion',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Costes/_Analisis/Dispersion.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Costes', 'Análisis', 'Dispersión'],
                    URLMENU: '/_Costes/__menus/_CostesMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Costes.View.Analisis.Detalle', {
                url: '/Costes/Analisis/Detalle',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Costes/_Analisis/Detalle.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Costes', 'Análisis', 'Detalle'],
                    URLMENU: '/_Costes/__menus/_CostesMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Costes.View.Analisis.Personal', {
                url: '/Costes/Analisis/Personal',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Costes/_Analisis/Personal.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Costes', 'Análisis', 'Personal'],
                    URLMENU: '/_Costes/__menus/_CostesMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Costes.View.Reporting', {
                url: '/Costes/Reporting',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Costes/Reporting.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Costes', 'Reporting'],
                    URLMENU: '/_Costes/__menus/_CostesMenu.html'
                }
            })
            .state('App.Costes.View.Mapa', {
                url: '/Costes/Mapa',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Costes/Mapa.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['Costes', 'Mapa'],
                    URLMENU: '/_Costes/__menus/_CostesMenu.html'
                }
            })
            .state('App.Costes.View.Sheets', {
                url: '/Costes/Sheets',
                template: "<customsheets></customsheets>",
                controller: 'StateChildrenCtrl',
                params: {
                    SHEETSENSE: true,
                    IDFILTRO: 'eanBw',
                    PATH: ['Costes', 'sheets.menu.sheet'],
                    URLMENU: '/_Costes/__menus/_CostesMenu.html'
                }
            })
    }]);
});



