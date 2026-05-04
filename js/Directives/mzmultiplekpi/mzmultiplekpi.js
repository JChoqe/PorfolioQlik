var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app, cssContent) {
    app.directive('mzmultiplekpi', [function () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'js/Directives/mzmultiplekpi/mzmultiplekpi.html',
            link: function (scope, element, attrs) {
                scope.ObjectId = String(attrs.id);
                var qvid = scope.ObjectId.trim();
                var $this = element.find(".qlik-embed-invisible");
                scope.asyncCallGetObject(qvid, $this)
            },
            controller: ['$q', '$scope', '$rootScope', '$attrs', '$element', function ($q, $scope, $rootScope, $attrs, $element) {
                $scope.model = '';
                $scope.isInit = false;
                $scope.hasSecondVal = false;
                $scope.loaded = false;                

                $scope.asyncCallGetObject = async (qvid, $this) => {
                    $scope.KPIID = qvid;
                    $rootScope._thisCurrentApp.visualization.get(qvid).then(function (vis) {
                        vis.show($this, {
                            onRendered: function () {
                                if ($scope.isInit == false) {
                                    $scope.isInit = true;
                                    $rootScope.round = $rootScope.round + 1;
                                    $rootScope.lstModel.push(vis);

                                    if ($rootScope.round >= $rootScope.itemsObject) {
                                        $rootScope.deleteElement();
                                    }
                                    var item = {};
                                    item.id = qvid;
                                    item.vis = vis;
                                    $rootScope.ITEMS.push(item);
                                }
                                var model = vis._scopes[0].model;
                                $scope.titKpi = model.pureLayout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
                                if(model.pureLayout.qHyperCube.qMeasureInfo[1]){
                                    $scope.titSecondKpi = model.pureLayout.qHyperCube.qMeasureInfo[1].qFallbackTitle;
                                }

                                                                var table = qlik.table(model);

                                model.getHyperCubeData('/qHyperCubeDef', [{
                                    qTop: 0,
                                    qLeft: 0,
                                    qWidth: table.colCount,
                                    qHeight: table.rowCount
                                }]).then(function (data) {

                                    var response = data[0].qMatrix;
                                    $scope.valKpi = response[0][0].qText;
                                    if(response[0][1]){
                                        $scope.hasSecondVal = true
                                        $scope.valSecondKpi = response[0][1].qText;
                                    }
                                    setTimeout(() => {$scope.loaded = true;}, 0);


                                });
                            }
                        });
                    }).catch(function (error) {
                        $rootScope.round = $rootScope.round + 1;
                        if ($rootScope.round >= $rootScope.itemsObject) {
                            $rootScope.deleteElement();
                        }
                        $scope.loaded = true;
                        $scope.ObjectNotFound = true;
                        $element.empty().append('<div class="object-not-found">No se ha podido cargar el objeto.</br>Consulte con el proveedor</div>');
                    });
                }

            }]
        };
    }]);

});