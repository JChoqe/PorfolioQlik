var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    '../text!./dialog-template.ng.html',
], function (qlik, app, dialogTemplate) {
        app.directive('help', [function () {
            return {
                restrict: 'E',
                scope: false,
                templateUrl: 'js/Directives/help/help.html',
                link: function (scope, element, attrs) { 

                                                     },
                controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', function ($q, $scope, $rootScope, luiDialog, $translate) {

                                                          $scope.showHelp = function () {
                        var _template = dialogTemplate;
                        var dialog = luiDialog.show({
                            template: _template,
                            closeOnEscape: true,
                            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                $scope.closeDialog = function () {
                                    dialog.close();
                                };
                                $scope.HasVideosHelp = $rootScope.HasVideos; 
                                $scope.urlContent = $rootScope.urlContent;
                                $scope.modoWhite = $rootScope.modoWhite;

                                                                                             }]
                        });
                    };


                                                        }]
            };
        }]);

});