var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'angular',
    'underscore',
], function (qlik, app, angular, us) {        
        app.directive('mztimeout', ['$translate','$rootScope', function ( $translate, $rootScope) {
            return {
                bindToController: true,
                restrict: 'E',
                replace: false,
                transclude: true,
                scope: {
                    timeOut: "@timeOut",
                },
                link: function (scope, element, attrs) {                   
                    scope.initTime(attrs.timeOut)
                },
                controller: ['$q', '$scope', '$rootScope', '$attrs', 'InitConfig', function ($q, $scope, $rootScope, $attrs, InitConfig) { 

                    $scope.varKeepAliveName = "CurrentTimeKeepAlive";

                    $scope.AddVariable = function(app, name){
                        var $app = app;
                        var d = new Date();
                        var $time = d.getTime();
                        if(typeof $rootScope._thisCurrentApp === "undefined"){                                                     
                            $app.variable.setNumValue(name, $time);
                        }else if($app.id != $rootScope._thisCurrentApp.id){                               
                            $app.variable.setNumValue(name, $time);                            
                        }
                    }



                    function keepAlive() {                        
                        var _apps = $rootScope.Apps;
                        angular.forEach(_apps, function (value, key) {
                            var $app = value;   
                            var d = new Date();
                            var $time = d.getTime();
                            var $varName = $scope.varKeepAliveName + key + $time;
                            $app.variable.createSessionVariable({qName : $varName.toString()});
                            $scope.AddVariable($app, $varName);                                                                                 
                        });

                                            }

                    $scope.initTime = function (_time) {           
                        setInterval(keepAlive, _time);
                    }

                                    }]
            };
        }]);

});