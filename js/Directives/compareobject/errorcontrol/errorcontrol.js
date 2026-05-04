var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'angular',
], function (qlik, app, angular) {



    app.directive('errorcontrol', [function (luiDialog) {
        return {
            restrict: 'E',
            scope: false,
            link: function (scope, element, attrs) {

            },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', function ($q, $scope, $rootScope, luiDialog, $translate) {
                $scope.loop = false;

                qlik.on("error", function (error) {
                    if ($scope.loop == false) {
                        if (error.message == 'Invalid Params') {
                            if ($scope.loop == false && $rootScope.COMPAREMODULE == true) {
                                $scope.loop = true;
                                var _template = '<div class="lui-dialog lui-dialog-mz" style="width: 600px;"><div class="lui-dialog__header"><div class="lui-dialog__title">' + $translate.instant('views.modal.atencion') + '</div></div><div class="lui-dialog__body">' + $translate.instant('views.modal.invalidparams') + ' </div><div class="lui-dialog__footer"><button class="lui-button  lui-dialog__button" ng-click="closeDialog();">' + $translate.instant('views.modal.cerrar') + '</button></div></div>';
                                var dialog = luiDialog.show({
                                    template: _template,
                                    closeOnEscape: false,
                                    controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                                        $scope.closeDialog = function () {
                                            window.location.reload();
                                            dialog.close();
                                        }
                                    }]
                                });
                            }
                        }
                    }
                });
            }]
        };
    }]);

});