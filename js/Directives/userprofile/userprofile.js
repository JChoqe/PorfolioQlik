var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    '../text!./dialog-template.ng.html',
], function (qlik, app, dialogTemplate) {
        app.directive('userprofile', [function () {
            return {
                restrict: 'E',
                scope: false,
                templateUrl: 'js/Directives/userprofile/userprofile.html',
                link: function (scope, element, attrs) {                    
                },
                controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', function ($q, $scope, $rootScope, luiDialog, $translate) {

                                        $scope.showProfile = function () {
                        var _template = dialogTemplate;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.closeDialog = function () {
                                    dialog.close();
                                };
                                var global = qlik.getGlobal(config);

                                global.getAuthenticatedUser(function(reply) {
                                    var str = reply.qReturn;
                                    var isServer = str.includes(';');

                                                            if (isServer == true) {
                                        str.split(";");
                                        var usuario = str.split('=');
                                        $scope.User = usuario[2];
                                    } else {
                                        $scope.User = reply.qReturn;
                                    }
                                });

                            }]
                        });
                    };




                                                                           }]
            };
        }]);

});