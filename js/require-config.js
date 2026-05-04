'use strict';

var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);
var root =              dir;
var extRoot = 			root + 'js';
var extIncludeRoot = root + 'include';

var config = { host: window.location.hostname, prefix: prefix, port: window.location.port, isSecure: window.location.protocol === "https:", webIntegrationId: ""}
require.config({

    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
    webIntegrationId: config.webIntegrationId,
    paths: {

        'extJs': extRoot,
        'extView': root + 'views',
        'extComponent': root + 'js/Component',
        'extControllers': root + 'js/Controllers',
        'extDirectives': root + 'js/Directives',
        'extServices': root + 'js/Services',
        'extIncludeRoot': extIncludeRoot,

        'app': extRoot + '/app',
        'templateCache': extRoot + '/templateCache',
        'devextreme': extIncludeRoot + '/devextreme/js/dx.all',
        'jquery': extIncludeRoot + '/jquery-3.7.0.min',
        'jqueryui': extIncludeRoot + '/jquery-ui-1.12.1/jquery-ui.min',
        'jquerytoast': extIncludeRoot + '/jquery-toast/jquery.toast.min', 
        'angularjsToast': extIncludeRoot + '/angularjs-toast/angularjs-toast.min',          
        'TouchPunch': extIncludeRoot + '/jquery.ui.touch-punch.min',
        'popper': extIncludeRoot + '/bootstrap/js/popper',
        'bootstrap': extIncludeRoot + '/bootstrap/js/bootstrap.bundle',
        'uiRouter': extIncludeRoot + '/angular-ui-router.min',
        'uiSortable': extIncludeRoot + '/ui-sortable/sortable',
        'Modernizr': extIncludeRoot + '/modernizr.min',                          
        'fullscreen':             extIncludeRoot + '/jquery.fullscreen',
        'codemirror':             extIncludeRoot + '/codemirror/codemirror.min',
        'css':                    'assets/external/requirejs/css',
    },
    waitSeconds: 15,
    shim: {
        'uiRouter': {
            'deps': ['angular']
        },
        'Modernizr': {
            'exports': 'Modernizr'
        },
        'jquery': {
            'exports': 'jQuery'
        },
        'jqueryui': {
            'deps': ['jquery']
        },
        'jquerytoast': {
            'deps': ['jquery']
        },
        'angularjsToast': {
            'deps': ['angular', 'jquery'],
            'exports': 'toaster'
        },
        "TouchPunch": {
            'deps': ["jquery", "jqueryui"]
        },
        'bootstrap': {
            'deps': ['jquery', 'popper']
        }
    },
    packages: [{
        name: 'moment',
        location: extIncludeRoot,
        main: 'moment-with-locales'
    }]

        });
require([
    'js/qlik',    
    'extJs/main',
    'jquery',
    'jqueryui',
    'devextreme',
    'jquerytoast',
    'angularjsToast',
    'TouchPunch',
    'bootstrap', 
    'fullscreen',
    'uiSortable',
    'codemirror'

], function (qlik) {				
		angular.element(document).ready(function() {
            angular.bootstrap(document, ['qlik-angular', 'qlik-mashup']);
        });        
	}
);
require(['popper'], function (popper) {
    window.Popper = popper;
    require(["bootstrap"]);
});








