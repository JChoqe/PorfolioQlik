
define([
    'app'

], function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('App.Seguridad.View', {
                templateUrl: "views/View.html",
                controller: 'StateParentCtrl',
                resolve: {
                    dataApp: ['$rootScope', 'getAppService', 'getDefaulltBookmarkService', 'InitConfig', function ($rootScope, getAppService, getDefaulltBookmarkService, InitConfig) {
                        $rootScope.addElement();
                        var indexApp = 1;
                        $rootScope.indexApp = 1;
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
            .state('App.Seguridad.View.Dashboard', {
                url: '/Seguridad/Dashboard',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Seguridad/Dashboard.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'ba104633-13b8-41bd-9209-68263ba97042',
                    PATH: ['Seguridad', 'Dashboard'],
                    URLMENU: '/_Seguridad/__menus/_SeguridadMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Seguridad.View.Analisis', {
                template: "<ui-view class='container-view row'></ui-view>",
                abstract: true
            })
            .state('App.Seguridad.View.Analisis.Salud', {
                url: '/Seguridad/Analisis/Salud',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Seguridad/_Analisis/Salud.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'ba104633-13b8-41bd-9209-68263ba97042',
                    PATH: ['Seguridad', 'Análisis', 'Salud y Seguridad'],
                    URLMENU: '/_Seguridad/__menus/_SeguridadMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Seguridad.View.Analisis.Empleados', {
                url: '/Seguridad/Analisis/Empleados',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Seguridad/_Analisis/Empleados.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'ba104633-13b8-41bd-9209-68263ba97042',
                    PATH: ['Seguridad', 'Análisis', 'Empleados'],
                    URLMENU: '/_Seguridad/__menus/_SeguridadMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Seguridad.View.Analisis.Trabajo', {
                url: '/Seguridad/Analisis/Trabajo',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Seguridad/_Analisis/Trabajo.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'ba104633-13b8-41bd-9209-68263ba97042',
                    PATH: ['Seguridad', 'Análisis', 'Trabajo'],
                    URLMENU: '/_Seguridad/__menus/_SeguridadMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Seguridad.View.Analisis.Costes', {
                url: '/Seguridad/Analisis/Costes',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Seguridad/_Analisis/Costes.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'ba104633-13b8-41bd-9209-68263ba97042',
                    PATH: ['Seguridad', 'Análisis', 'Costes'],
                    URLMENU: '/_Seguridad/__menus/_SeguridadMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })
            .state('App.Seguridad.View.Reporting', {
                url: '/Seguridad/Reporting',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Seguridad/Reporting.html');
                }],
                toSheet: true,
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'ba104633-13b8-41bd-9209-68263ba97042',
                    PATH: ['Seguridad', 'Reporting'],
                    URLMENU: '/_Seguridad/__menus/_SeguridadMenu.html',
                }
            })











            .state('App.Seguridad.View.Sheets', {
                url: '/Seguridad/Sheets',
                template: "<customsheets></customsheets>",
                controller: 'StateChildrenCtrl',
                params: {
                    SHEETSENSE: true,
                    IDFILTRO: 'ba104633-13b8-41bd-9209-68263ba97042',
                    PATH: ['Seguridad', 'sheets.menu.sheet'],
                    URLMENU: '/_Seguridad/__menus/_SeguridadMenu.html'
                }
            })
    }]);
});



