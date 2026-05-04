var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";
"use strict";

define([
    'js/qlik',
    'angular',
    dir + "include/mz-options/js/app.js", 
    dir + "include/mz-options/js/services/mzOptionsService.js",
    dir + "include/mz-options/js/controllers/mzOptionsCtrl.js",    
    dir + "include/mz-options/js/directives/mzoptionsbuttons/mzoptionsbuttons.js", 
    dir + "include/mz-options/js/directives/mzoptionspanel/mzoptionspanel.js", 
    dir + "include/mz-options/js/directives/mzoptionsalertas/mzoptionsalertas.js",
    dir + "include/mz-options/js/directives/mzoptionsmarcadores/mzoptionsmarcadores.js",
    dir + "include/mz-options/js/directives/mzoptionsfilters/mzoptionsfilters.js",
    dir + "include/mz-options/js/directives/mzoptionsglosario/mzoptionsglosario.js",
    dir + "include/mz-options/js/directives/mzoptionshelp/mzoptionshelp.js",
    dir + "include/mz-options/js/directives/mzoptionsmode/mzoptionsmode.js",
    dir + "include/mz-options/js/directives/mzpresentacion/mzpresentacion.js",
    
    
    
    
    
    
    
    
], function(qlik, angular, app) {

    return app;
});