var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {
        app.directive('notificationspanel', [function () {
            return {
                restrict: 'E',
                scope: false,
                templateUrl: 'js/Directives/notificationspanel/notificationspanel.html',
                link: function (scope, element, attrs) {


                },
                controller: ['$compile', '$q', '$scope', '$rootScope', 'luiDialog', '$translate', 'InitConfig', 'mzAlertingService', function ($compile, $q, $scope, $rootScope, luiDialog, $translate, InitConfig, mzAlertingService) {
                    $scope.ShowNotificaciones = false;

                    function getArrayNotifications(arr){
                        const appIds = InitConfig.arrApps.map(app => app.idapp);

                        const alertasFiltradas = arr.filter(alerta => appIds.includes(alerta.app_id));

                        var defer = $q.defer();
                        angular.forEach(alertasFiltradas, function (value, key) {
                            if(value.read_at == null){
                                $scope.bubble = $scope.bubble + 1;
                                var item = {};
                                item.id = value.id;
                                item.name = value.name;
                                item.message = value.message;
                                item.type = value.type;
                                item.model = value;                                
                                $scope.arrAlertas.push(item);
                            }
                        })
                        defer.resolve($scope.arrAlertas);
                        return defer.promise;
                    }

                    function ShowPanelAlerts(){
                        var _overNotifications = document.querySelector("#notificationsOver");
                        var _menuNotificaciones = document.querySelector("#contentNotifications");
                        $(_overNotifications).animate({
                            opacity: 1,
                            right: 0
                        },400, 'swing', function(){
                            $(_menuNotificaciones).animate({
                                opacity: 1,
                                right: 0
                            },300, 'swing')
                        });
                    }
                    function HidePanelAlerts(){
                        var _overNotifications = document.querySelector("#notificationsOver");
                        var _menuNotificaciones = document.querySelector("#contentNotifications");
                        $(_menuNotificaciones).animate({
                            opacity: 0,
                            right: '-100%'
                        },400, 'swing', function(){
                            $(_overNotifications).animate({
                                opacity: 0,
                                right: '-100%'
                            },300, 'swing')
                        });
                    } 



                    mzAlertingService.getAllAlerts().then(function(items){
                        var arrItems = items;
                        $scope.arrAlertas = [];
                        $scope.numAlertas = arrItems.length;
                        $scope.bubble = 0;
                        $scope.alerts = 0;
                        if($scope.numAlertas > 0){
                            getArrayNotifications(arrItems);
                        }











                                                                                                                           $rootScope.toggleNotifications = function () {
                            $scope.ShowNotificaciones = $scope.ShowNotificaciones === false ? true : false;
                            if ($scope.ShowNotificaciones == true) {
                                ShowPanelAlerts();
                            } else {
                                HidePanelAlerts();
                            }
                        };



                        $scope.hideOptions = function ($event, model) {
                            var _el = $($event.currentTarget).parents('.item-notifications'); 
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
                               mzAlertingService.read(model);
                           });                           
                        };


                    })




                                                        }]
            };
        }]);

});