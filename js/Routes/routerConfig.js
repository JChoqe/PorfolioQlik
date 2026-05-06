
define([
    'app',
    './routerPersonal',
    './routerAbsentismo',
    './routerKPI',
    './routerFormacion',
    './routerCostes',
    './routerSeguridad',
    './routerPresencia'

], function (app) {
    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$compileProvider', '$translateProvider', 'InitConfigProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider, $translateProvider, InitConfigProvider) {
        $translateProvider.translations('es', translationsES);
        $translateProvider.translations('en', translationsEN);
        $translateProvider.translations('fr', translationsFR);
        $translateProvider.preferredLanguage(InitConfigProvider.language);
        $translateProvider.useSanitizeValueStrategy('sceParameters');
        $locationProvider.hashPrefix('');
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:application\//);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|cust-scheme):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('Home', {
                template: "<ui-view></ui-view>",
                abstract: true,
            })
            .state('Home.inicio', {
                url: '/home',
                templateUrl: "views/Home/wellcome.html",
                controller: 'WellcomeCtrl',
                onEnter: ['$rootScope', function ($rootScope) {

                }],
                onExit: ['$rootScope', function ($rootScope) {
                    if (typeof $rootScope.closeTooltipWellcome === "function") {
                        $rootScope.closeTooltipWellcome();
                    }
                }]
            })

            .state('App', {
                templateUrl: "views/Home/inicio.html",
                controller: 'HomeCtrl',
                abstract: true
            })


            .state('App.Personal', {
                template: "<ui-view></ui-view>",
                abstract: true,
                params: {
                    isModule: true,
                    moduleName: 'Personal'
                }
            })
            .state('App.Absentismo', {
                template: "<ui-view></ui-view>",
                abstract: true,
                params: {
                    isModule: true,
                    moduleName: 'Absentismo'
                }
            })
            .state('App.KPI', {
                template: "<ui-view></ui-view>",
                abstract: true,
                params: {
                    isModule: true,
                    moduleName: 'KPI'
                }
            })
            .state('App.Formacion', {
                template: "<ui-view></ui-view>",
                abstract: true,
                params: {
                    isModule: true,
                    moduleName: 'Formacion'
                }
            })
            .state('App.Costes', {
                template: "<ui-view></ui-view>",
                abstract: true,
                params: {
                    isModule: true,
                    moduleName: 'Costes'
                }
            })
            .state('App.Seguridad', {
                template: "<ui-view></ui-view>",
                abstract: true,
                params: {
                    isModule: true,
                    moduleName: 'Seguridad'
                }
            })
            .state('App.Presencia', {
                template: "<ui-view></ui-view>",
                abstract: true,
                params: {
                    isModule: true,
                    moduleName: 'Presencia'
                }
            })

            .state('App.Favoritos', {
                template: "<ui-view></ui-view>",
                nodeParent: true,
                abstract: true,
            })
            .state('App.Favoritos.View', {
                templateUrl: "views/View.html",
                nodeParent: true,
                abstract: true
            })
            .state('App.Favoritos.View.Dashboard', {
                url: '/Favoritos',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_Favoritos/Dashboard.html');
                }],
                controller: 'FavoritosCtrl',
                params: {
                    SHEETFAVORITES: true,
                    IDFILTRO: 'PmmtmQ',
                    PATH: ['Favoritos'],
                    URLMENU: '/_Favoritos/__menus/_FavoritosMenu.html'
                },
                onEnter: function ($rootScope) {
                    $rootScope.ISVISTAFAVORITOS = true;
                },
                onExit: function ($rootScope) {
                    $rootScope.ISVISTAFAVORITOS = false;
                }
            })

            .state('App.Visualizaciones', {
                template: "<ui-view></ui-view>",
                nodeParent: true,
                abstract: true,
            })
            .state('App.Visualizaciones.View', {
                templateUrl: "views/View.html",
                abstract: true
            })
            .state('App.Visualizaciones.View.Visualizaciones', {
                url: '/Visualizaciones/Visualizaciones',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/__Visualizaciones/Visualizaciones.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    SHEETVISUALIZACIONES: true,
                    PATH: ['Visualizaciones'],
                    URLMENU: '/__Visualizaciones/__menus/__VisualizacionesMenu.html'
                },
                onEnter: function ($rootScope) {
                    $rootScope.ISVISTAPERSONALIZADA = true;
                },
                onExit: function ($rootScope) {
                    $rootScope.ISVISTAPERSONALIZADA = false;
                }
            })


            .state('App.insightadvisor', {
                template: "<ui-view></ui-view>",
                abstract: true,
                onEnter: ['$rootScope', function ($rootScope) {
                    $rootScope.addElement();
                }],
            })
            .state('App.insightadvisor.View', {
                templateUrl: "views/View.html",
                abstract: true
            })

            .state('App.insightadvisor.View.insightadvisor', {
                url: '/insightadvisor',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/insightadvisor/insightadvisor.html');
                }],
                controller: 'insightadvisorCtrl',
                params: {
                    PATH: ['Insight Advisor'],
                }
            })

    }]);
});



