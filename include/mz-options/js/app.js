var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";
"use strict";

define([
    'js/qlik',
    'jquery',
    'angular',

], function(qlik, $, angular) {
    var app = angular.module('mz-options',[]);
    return app;
});