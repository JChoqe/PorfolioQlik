var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app'
], function (qlik, app) {
        app.directive('measuress', ['InitConfig', '$translate','$rootScope', function (InitConfig, $translate, $rootScope) {
            return {
                restrict: 'E',
                bindToController: true,
                scope: true,
                replace: true,
                templateUrl: 'js/Directives/objectsense/_templates/measuress/measuress.html',
                link: function (scope, element, attrs) {                     
                    var ObjectId = attrs.objectId;
                    var AppId = attrs.appId;
                    scope.asyncCallGetObject(ObjectId, AppId);
                },
                controller: ['$http', '$q', '$scope', '$rootScope', '$compile','$attrs', 'luiDialog', 'luiPopover', '$translate', '$state', 'deiteoService', '$element', function ($http, $q, $scope, $rootScope, $compile, $attrs, luiDialog, luiPopover, $translate, $state, deiteoService,$element) {                    

                                        function getApp(appid){
                        return new Promise(resolve => {
                            var $app = $rootScope.Apps.filter(obj => {
                                if (obj.id == appid) {
                                    return obj;
                                }
                            });  
                            resolve($app)                          
                        })
                    }
                    $scope.asyncCallGetObject = async (qvid, appid) => {
                        result = await getApp(appid);
                        $scope.thisApp = result;
                    }                                        
                }]
            };
        }]);

});