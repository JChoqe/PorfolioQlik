/****************************************************************************************************************************************
Obtener el host de la extensión, por ejemplo, en localhost:4848/extensions/NombreExtension/Pagina.html
se obtiene /extensions/NombreExtension/
/************************************************************************************************************************************** */
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'jquery',
    'angular',
    dir + 'include/mz-alerting/js/app.js',
], function(qlik, $, angular, app) {

    app.controller('mzGridAlertCtrl', ['$rootScope', '$scope', 'mzAlertingService', function($rootScope, $scope, mzAlertingService) {
        $scope.darkView = $rootScope.darkView;
        var appActual = $('body').attr('data-app');

        mzAlertingService.getAllAlerts().then(function(alerts) {
            $scope.alerts = alerts.filter(function(alert) {
                return  alert.app_id == appActual;
            });
        });
    }]);
});