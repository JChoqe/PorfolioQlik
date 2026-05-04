var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";


function getURLParameter(a) {
    return (RegExp(a + "=(.+?)(&|$)").exec(location.search) || [null, null])[1];
}

define([
	'js/qlik',
	'angular',
    'uiRouter',
    dir + "include/angular-ui/angular-cookies.min.js",
    dir + "include/angular-ui/angular-resource.min.js",
    dir + "include/angular-ui/angular-sanitize.min.js",
    dir + "include/angular-ui/angular-touch.min.js",
    dir + "include/angular-translate/traducciones_es.js",
    dir + "include/angular-translate/traducciones_en.js",
    dir + "include/angular-translate/traducciones_fr.js",  
    dir + "include/angular-translate/angular-translate.min.js",
    dir + "include/mz-alerting/main.js",
    dir + "include/mz-options/main.js",



    ], function (qlik, angular) {
    qlik.on("error", function (error) {        
        console.log(error.message);
    },
    function (warning) {
        windows.console.log(warning);
    });        


       var app = angular.module('qlik-mashup', [
        'ui.router',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'pascalprecht.translate',
        'ui.sortable',
        'angularjsToast',
        'mz-alerting',
        'mz-options',
        'dx'
    ]);




    app.directive('ngRightClick',['$parse', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, { $event: event });
                });
            });
        };
    }]);
    app.directive("directiveWhenScrolled", function() {
        return function(scope, elm, attr) {
            var raw = elm[0];

                    elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.directiveWhenScrolled);
            }
            });
        };
    });
    app.filter('orderObjectBy', function () {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    });
    app.filter("unique", function () {
        return function (collection, keyname) {
            var output = [],
                keys = [];
            angular.forEach(collection, function (item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        };
    });
    app.filter("autoNumberFormat", function(){
        var qNumericalAbbreviation='3:k;6:M;9:G;12:T;15:P;18:E;21:Z;24:Y;-3:m;-6:µ;-9:n;-12:p;-15:f;-18:a;-21:z;-24:y';
        var mapNumerical = qNumericalAbbreviation.split(';').map(function(x){
            var split = x.split(":");
            return {p: parseInt(split[0]), l:split[1]};
        })
        mapNumerical.push({p:0, l:''})
        mapNumerical = mapNumerical.sort(function(a,b){ return b.p-a.p });
        return function (number, currency){
            if(isNaN(number) || typeof number !=='number') return number;
            var nd = (Math.log10(number)).toFixed();
            var map = mapNumerical.find(function(x){ return nd >= x.p; })
            if(!map) return number;
            var result = number / Math.pow(10, map.p);            
            result = (result == result.toFixed() ? result.toFixed() : result.toFixed(2)) + map.l;
            return result + (currency ? currency : '');
        }
    })
    app.factory('mzAPI', function () {
        return {
            changeLanguage: function (APPQLIK) {
                if(APPQLIK){
                    var $CurrentSelections = $(".CurrentSelections");
                    $CurrentSelections.empty();
                    setTimeout(function () {
                        APPQLIK.getObject($CurrentSelections, 'CurrentSelections');
                        $('.qv-global-selections').parent('div').remove();
                    }, 600);
                }                                
            }
        };
    });
    app.run(['$rootScope', '$templateCache', 'InitConfig', '$state',function ($rootScope, $templateCache,  InitConfig, $state) {
        qlik.setLanguage(InitConfig.language);



        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) { 
            var templateName = toState.name;
            if (templateName !== undefined) {
                try {
                    $templateCache.remove(templateName);
                } catch (error) {
                    console.log(error)
                }            
            }



            if ($rootScope.lstModel && $rootScope.lstModel.length >= 1) {
                angular.forEach($rootScope.lstModel, function (value, key) {
                    try {
                        value.close();
                    }
                    catch (error) {
                        console.log("error eliminando el objeto " + key + "\n" + error);
                    }

                });
                $rootScope.lstModel = [];
            }
            if($rootScope.LISTSESSION && $rootScope.LISTSESSION.length >=1){
                angular.forEach($rootScope.LISTSESSION, function (value, key) {
                    try {
                        let thisApp = $rootScope.Apps.find((aplication) => aplication.id == value.appId);
                        let id = value.idSession;
                        thisApp.destroySessionObject(id).then((res)=>{
                        });
                    }
                    catch (error) {
                        console.log("error eliminando el objeto " + key + "\n" + error);
                    }

                });
                $rootScope.LISTSESSION = [];
            }
        });

                }]);

    app.config(['$provide', function ($provide) {
        $provide.decorator('$state',['$delegate', '$stateParams', function($delegate, $stateParams) {
            $delegate.forceReload = function() {
                return $delegate.go($delegate.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };
            return $delegate;
        }]);
    }])
	return app;
});

