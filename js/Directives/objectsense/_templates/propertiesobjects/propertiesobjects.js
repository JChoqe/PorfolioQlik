var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {
        app.directive('propertiesobjects', ['InitConfig', '$translate','$rootScope', function (InitConfig, $translate, $rootScope) {
            return {
                bindToController: true,
                restrict: 'E',
                replace: false,
                scope: true,
                templateUrl: 'js/Directives/objectsense/_templates/propertiesobjects/propertiesobjects.html',
                link: function (scope, element, attrs) {                     
                    let qvid = attrs.objectId;
                    let $this = element;
                    scope.asyncCallGetObjectProperties(qvid, $this);
                },
                controller: ['$http', '$q', '$scope', '$rootScope', '$compile','$attrs', 'luiDialog', 'luiPopover', '$translate', '$state', function ($http, $q, $scope, $rootScope, $compile, $attrs, luiDialog, luiPopover, $translate, $state) {                    
                    $scope.app = $rootScope._thisCurrentApp;
                    $rootScope.OBJECTIDORIGINPROPERTIES = '';
                    function getObjectLayout(id) {
                        return new Promise(resolve => {
                            $scope.app.getObject(id).then(function (model) {
                                let OBJECTID = '';
                                if (model.layout.hasOwnProperty('qExtendsId')) {
                                    OBJECTID = model.layout.qExtendsId;
                                } else {
                                    OBJECTID = id;
                                }
                                let typeObject =  model?.enigmaModel?.layout?.visualization || model.layout.qInfo.qType;

                                switch (typeObject) {
                                    case 'linechart':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/linechart.html'
                                        break;
                                    case 'barchart':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/barchart.html';
                                        break;
                                    case 'combochart':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/combochart.html';
                                        break;
                                    case 'distributionplot':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/distributionplot.html';
                                        break;
                                    case 'scatterplot':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/scatterplot.html';
                                        break;
                                    case 'piechart':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/piechart.html';
                                        break;
                                    case 'boxplot':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/boxplot.html';
                                        break;
                                    case 'treemap':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/treemap.html';
                                        break;
                                    case 'bulletchart':
                                        $scope.urlHtml = 'js/Directives/objectsense/_templates/propertiesobjects/_templates/bulletchart.html';
                                        break;
                                    default:
                                        $scope.urlHtml = '';
                                }

                                resolve([OBJECTID, $scope.urlHtml])

                            });

                        });
                    }
                    $scope.asyncCallGetObjectProperties = async (qvid, $this) => {
                        const result = await getObjectLayout(qvid);
                        let HTMLCONTENT = $($this).find('.cover-object-properties');
                        $rootScope.OBJECTIDORIGINPROPERTIES = qvid;
                        $rootScope.OBJECTID = result[0]; 
                        $http.get(result[1]).then(function (response) {
                            var newEle = response.data;
                            $(HTMLCONTENT).append($compile(newEle)($scope));
                        })                        

                                            }
                }]
            };
        }]);


});