var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";
"use strict";

define([
    'js/qlik',
    'angular',
    dir + "include/mz-alerting/js/app.js",

    dir + "include/mz-alerting/js/services/mzAlertingService.js",
    dir + "include/mz-alerting/js/directives/mzAlertingDial/mzAlertingDial.js",
    dir + "include/mz-alerting/js/directives/mzAlertingAttr/mzAlertingAttr.js",
    dir + "include/mz-alerting/js/directives/mzAlertingToolbar/mzAlertingToolbar.js",
    dir + "include/mz-alerting/js/directives/percentField/percentField.js",
    dir + "include/mz-alerting/js/controllers/mzEditAlertCtrl.js",
    dir + "include/mz-alerting/js/controllers/mzGridAlertCtrl.js",
    
], function(qlik, angular, app) {
    return app;
});