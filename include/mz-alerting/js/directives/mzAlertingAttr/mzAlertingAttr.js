var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'jquery',
    'angular',
    dir + 'include/mz-alerting/js/app.js',
], function (qlik, $, angular, app) {

    app.directive('mzAlertingAttr', ['$timeout', '$http', '$compile', '$rootScope', '$q', 'luiDialog',
        function ($timeout, $http, $compile, $rootScope, $q, luiDialog) {
            return {
                restrict: 'A',                
                //templateUrl: dir + 'include/mz-alerting/js/directives/mzAlertingDial/mzAlertingDial.html',
                controller: ['$q', '$element', '$scope', '$rootScope', 'luiDialog', '$translate', '$attrs', 'mzAlertingService',
                    function ($q, $element, $scope, $rootScope, luiDialog, $translate, $attrs, mzAlertingService) {

                        mzAlertingService.comprobarDefiniciones();

                        $scope.esNuevaVersion = false;
                        $scope.esDirectiva = false;
                        let objectId = '';
                        let appId = '';
                        let objectSense = '';
                        let mzDirective = '';
                        objectSense = $element.find('.cover-object-sense');
                        mzDirective = $element.find('.multiplekpi')
                                                                                                                                                
                        function getAlerts(){
                            return new Promise(resolve => {
                                appId = $element.data("qlik-appid");
                                if (!appId && $rootScope._thisCurrentApp && $rootScope._thisCurrentApp.id) appId = $rootScope._thisCurrentApp.id;
                                if (objectSense && objectSense.length > 0){
                                    $scope.esNuevaVersion = true;
                                }else if(mzDirective && mzDirective.length > 0){
                                    $scope.esDirectiva = true;
                                }else{
                                    $scope.esNuevaVersion = false; 
                                }
                                if ($scope.esNuevaVersion){
                                    objectId = $(objectSense).parents('objectsense').attr("object-id");
                                }else if($scope.esDirectiva){
                                    objectId = $element.attr("id");
                                }else{
                                    objectId = $(event.currentTarget).parent().find('.qlik-embed').data("qlik-objid");
                                }
                                resolve(objectId, appId);
                            })
                        }

                        async function asyncCallGetAlerts() {
                            const result = await getAlerts();  
                            // DIV por encima
                            $http.get(dir + 'include/mz-alerting/js/directives/mzAlertingAttr/mzAlertingAttr.html').then(function(response){

                                if($scope.esNuevaVersion){
                                    $element.append($compile(response.data)($scope));
                                }else if($scope.esDirectiva){
                                    $element.append($compile(response.data)($scope));
                                }else{
                                    $element.parent().append($compile(response.data)($scope));
                                }
                                
                                
                            });                          
                        }
                        asyncCallGetAlerts();
                        $scope.openForm = async function(event){                                                  
                            mzAlertingService.getDefinitionByObject(appId, objectId).then(function(definition){
                                $http.get(dir + 'include/mz-alerting/js/partials/editDialog_new.html').then(function(template) {
                                    var dialog = luiDialog.show({
                                        template: template.data,
                                        closeOnEscape: true,
                                        controller: 'mzEditAlertCtrl',
                                        input: { definition: definition }
                                    });

                                    $rootScope.cerrarDialog = function (){
                                        dialog.close();
                                    }
                                });
                            })
                        }
                    }
                ]
            };
        }]);
});
