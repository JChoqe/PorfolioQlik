var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";
"use strict";

define([
    'js/qlik',
    'jquery',
    'angular',

    // 'css!' + dir + 'include/mz-alerting/css/stepper.css',
    // 'css!' + dir + 'include/mz-alerting/css/dialog.css',
    // 'css!' + dir + 'include/mz-alerting/css/common.css',
    // 'css!' + dir + 'include/mz-alerting/css/animation.css',
    // 'css!' + dir + 'include/mz-alerting/css/dial.css',
    // 'css!' + dir + 'include/mz-alerting/css/toolbar.css',
    // 'css!' + dir + 'include/mz-alerting/css/attr.css',
    
    dir + 'include/angular-query-builder/angular-query-builder.js',
    //dir + 'include/angular-cron-gen/cron-gen.min.js',
    //dir + 'include/angular-cron-gen/templates.js',
    //'css!' + dir + 'include/angular-cron-gen/cron-gen.min.css',

    dir + 'include/angular-text-angular/textAngular.min.js',

], function(qlik, $, angular) {
    var app = angular.module('mz-alerting', ['ngQueryBuilder', 'textAngular']);
    return app;
});