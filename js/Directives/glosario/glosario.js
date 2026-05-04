var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'angular'
], function (qlik, app, angular ) {
        app.directive('glosario', ['$rootScope',function ($rootScope) {
            return {
                restrict: 'E',
                scope: false,
                templateUrl: 'js/Directives/glosario/glosario.html',
                link: function (scope, element, attrs) {                                        
                    attrs.$observe('idapp', function () {
                        scope._thisapp = $rootScope._thisCurrentApp;
                    });                                       
                },
                controller: ['$q', '$scope', '$rootScope', '$translate', 'InitConfig', function ($q, $scope, $rootScope, $translate, InitConfig) { 
                    $rootScope.OpenGlosary = false;
                    $rootScope.openGlosary = function () {
                        $rootScope.OpenGlosary = $rootScope.OpenGlosary === false ? true : false;
                        $rootScope.OpenOptionsPanel = false;
                        $rootScope.OpenFiltros = false;
                    }; 
















                                                                          }]
            };
        }]);

});