var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'jquery',
    'angular',
    dir + 'include/mz-alerting/js/app.js',
], function(qlik, $, angular, app) {

    app.directive('mzAlertingToolbar', ['$timeout', '$http', '$compile', '$rootScope', '$q', 'luiDialog', 'InitConfig', '$state',
        function($timeout, $http, $compile, $rootScope, $q, luiDialog, InitConfig, $state) {
            return {
                restrict: 'E',
                scope: {
                    objectId: "@",
                    appRef: "@"
                },
                templateUrl: dir + 'include/mz-alerting/js/directives/mzAlertingToolbar/mzAlertingToolbar.html',
                controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$attrs', 'mzAlertingService', '$element',
                    function($q, $scope, $rootScope, luiDialog, $translate, $attrs, mzAlertingService, $element) {
                        var appActual = $('body').attr('data-app');

                        mzAlertingService.getAllAlerts().then(function(alerts) {
                            alerts.forEach(alert => {
                                switch(alert.type) {
                                    case "danger": alert.icon = "icofont-error"
                                      break;
                                    case "warning": alert.icon = "icofont-warning"
                                      break;
                                    case "info": alert.icon = "icofont-info"
                                      break;
                                    case "success": alert.icon = "icofont-check"
                                      break;
                                    default: alert.icon = "icofont-info"
                                }
                            });
                            $scope.alerts = alerts.filter(function(alert) {
                                return  alert.read_at == null && alert.app_id == appActual;
                            });
                        });

                        $scope.read = function($event,alert) {
                            var _el = $($event.currentTarget).parents('.item-alert'); 
                            $(_el).animate({
                               opacity: 0,
                           },
                           600, 'swing').animate({
                               height: '0px',
                               width: '0px',
                               padding: 0,
                               display: 'none',
                               minHeight: 0
                           },
                           600, 'swing', function(){
                               $(_el).remove();
                               mzAlertingService.read(alert);
                           });                                                         
                        }
                        $scope.readAll = function() {
                            $scope.alerts.forEach(function(alert) {
                                mzAlertingService.read(alert);
                            });
                        }

                        $scope.viewAll = function() {
                            $http.get(dir + 'include/mz-alerting/js/partials/gridDialog.html').then(function(template) {
                                luiDialog.show({
                                    template: template.data,
                                    closeOnEscape: true,
                                    controller: 'mzGridAlertCtrl'
                                });
                            });
                        }

                        $scope.goState = function (state){
                            $state.go(state);
                        }

                        function update() {
                            mzAlertingService.getAllAlerts().then(function(alerts) {
                                $scope.alerts = alerts.filter(function(alert) {
                                    return alert.read_at == null && alert.app_id == appActual;
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
                
                        $scope.$on('mzAlertingUpdate', function() {
                            update();
                        }) 
                        $rootScope.OpenAlerting = false;
                        $scope.toggleAlerting = function ($event) {
                            $rootScope.OpenFiltros = false;
                            $rootScope.OpenBookmark = false; 
                            $event.stopPropagation();                    
                            $rootScope.OpenAlerting = $rootScope.OpenAlerting === false ? true : false;
                            $scope.OpenAlerting =  $rootScope.OpenAlerting;
                            // $('#selections').removeClass('show');
                            $rootScope.OpenOptionsPanel = false;
                        }; 
                        var deregister = $scope.$on("closeAlerting", function (evt, data) {
                            $scope.OpenAlerting = false;
                        });
                        $scope.$on('$destroy', function destroyScope() {
                            deregister();
                        });                       
                    }
                ]

            }
        }
    ]);

});