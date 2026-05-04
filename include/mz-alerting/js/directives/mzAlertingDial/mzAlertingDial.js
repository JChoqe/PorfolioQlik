var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'jquery',
    'angular',
    dir + 'include/mz-alerting/js/app.js',
], function(qlik, $, angular, app) {

    app.directive('mzAlertingDial', ['$timeout', '$http', '$compile', '$rootScope', '$q', 'luiDialog',
        function($timeout, $http, $compile, $rootScope, $q, luiDialog) {
            return {
                restrict: 'E',
                scope: {
                    direction: '@',
                    objectId: "@",
                    appId: "@"
                },
                templateUrl: dir + 'include/mz-alerting/js/directives/mzAlertingDial/mzAlertingDial.html',
                controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$attrs', '$element', 'mzAlertingService',
                    function($q, $scope, $rootScope, luiDialog, $translate, $attrs, $element, mzAlertingService) {

                        $element.addClass($scope.direction == 'right' ? 'right' : 'left');

                        var appId = "";
                        if ($scope.appId) {
                            appId = $scope.appId;
                        } else if ($rootScope._thisCurrentApp && $rootScope._thisCurrentApp.id) {
                            appId = $rootScope._thisCurrentApp.id;
                        }
                        $scope.status = "";

                        function update() {
                            mzAlertingService.getAlertsByObject(appId, $scope.objectId).then(function(alerts) {
                                $scope.alerts = alerts.filter(function(alert) {
                                    return alert.read_at == null;
                                })
                                if ($scope.alerts.length > 0) {
                                    $scope.status = 'active';
                                    $element.addClass('active');
                                } else {
                                    $scope.status = '';
                                    $element.removeClass('active');
                                }
                            });
                        }
                        update();
                        $rootScope.$on('mzAlertingUpdate', function() {
                            update();
                        })
                        $scope.editar = function() {
                            $http.get(dir + 'include/mz-alerting/js/partials/editDialog_new.html').then(function(template) {
                                luiDialog.show({
                                    template: template.data,
                                    closeOnEscape: true,
                                    controller: 'mzEditAlertCtrl',
                                    input: {appId: appId, objectId: $scope.objectId }
                                });
                            });
                        }

                        $scope.readAll = function() {
                            $scope.alerts.forEach(function(alert) {
                                mzAlertingService.read(alert);
                            });
                        }

                        $scope.read = function(alert) {
                            mzAlertingService.read(alert);
                        }

                    }
                ]

            }
        }
    ]);

});