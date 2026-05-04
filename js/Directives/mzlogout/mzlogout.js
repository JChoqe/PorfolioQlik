var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    '../text!./dialog-logout.html',
], function (qlik, app, dialogTemplate) {
        app.directive('mzlogout', [function () {
            return {
                restrict: 'E',
                scope: false,
                templateUrl: 'js/Directives/mzlogout/mzlogout.html',
                link: function (scope, element, attrs) {                    
                },
                controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$window', '$http', '$state', function ($q, $scope, $rootScope, luiDialog, $translate, $window, $http, $state) {

                                        $scope.showLogoutConfirm = function () {
                        var _template = dialogTemplate;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.closeDialog = function () {
                                    dialog.close();
                                };

                                $scope.logout = function(){
                                    var prefix = $window.location.pathname.substr(0, $window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);
                                    if (!prefix || prefix == '') prefix = "/";

                                    return qlik.getGlobal(config).isPersonalMode(function(reply){
                                        if(reply.qReturn){
                                            $scope.closeDialog();
                                            $window.close();
                                        }else { 

                                                                                        $http.get(`${$window.location.protocol}//${$window.location.hostname}:${$window.location.port}${prefix}qps/user`).then(function (res) {                                                                                              
                                                let $LOCATION = `${$window.location.protocol}//${$window.location.hostname}:${$window.location.port}${prefix}qps/`;                                               
                                                let $LOGOUTURI = `${$window.location.protocol}//${$window.location.hostname}/hub/`;                                                
                                                return $http.delete(`${$window.location.protocol}//${$window.location.hostname}:${$window.location.port}${prefix}qps/user`).then(function (res) {                                                                                                
                                                    location.replace(`${$LOCATION}logout?targetUri=${$LOGOUTURI}`);
                                                }).catch(function(err){
                                                    $scope.closeDialog();                                                   
                                                    console.error(err);                                                                                               
                                                });

                                            }).catch(function(err){
                                                $scope.closeDialog();
                                                console.error(err);                                                                                               
                                            });
                                        }
                                    });                                    
                                }
                            }]
                        });
                    };


                                                        }]
            };
        }]);

});