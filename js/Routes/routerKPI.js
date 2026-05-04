
define([
    'app'

], function (app) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('App.KPI.View', {
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
            .state('App.KPI.View.Dashboard', {
                url: '/KPI/Dashboard',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('/_KPI/Dashboard.html');
                }],
                controller: 'StateChildrenCtrl',
                params: {
                    idFav:null,
                    IDFILTRO: 'eanBw',
                    PATH: ['KPI', 'Dashboard'],
                    URLMENU: '/_KPI/__menus/_KPIMenu.html',
                    OBJECTSTOP: {
                        arrObject: null,
                        urlHtml: null,
                        templateHtml: '<timeline data-year="Año" data-month="Mes"></timeline>'
                    }
                }
            })

                }]);
});



