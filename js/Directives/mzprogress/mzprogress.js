var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik,app) {
    app.directive('mzprogress', () => {
        var directiveDefinitionObject = {
            bindToController: true,
            restrict: 'E',
            replace: false,
            scope: true,
            templateUrl: 'js/Directives/mzprogress/mzprogress.html',
            link: function (scope, element, attrs) {
                let qvid = attrs.id;
                let $THIS = element.find('.qlik-embed-invisible');
                scope.InitDirective($THIS,qvid);
            },
            controller: ['$stateParams', '$window', '$http', '$q', '$scope', '$rootScope', '$compile', 'luiDialog', '$translate', '$attrs', '$element', '$state', 'orderByFilter', ($stateParams, $window, $http, $q, $scope, $rootScope, $compile, luiDialog, $translate, $attrs, $element, $state, orderBy) => {
                let ThisApp = $rootScope._thisCurrentApp;
                $scope.ISLOADING = true;                
                const formatNumero = (val) => {
                    return val.replace('%', '').replace(',', '.').trim();
                }
                function isNegative(num) {
                    if (Math.sign(num) === -1) {
                      return true;
                    }                  
                    return false;
                  }
                function getTabla(ID) {
                    var defer = $q.defer();
                    ThisApp.getObject(ID).then(function (model) {
                        defer.resolve(model);
                    })
                    return defer.promise;
                }
                $scope.InitDirective = async ($THIS,qvid)=>{
                    ThisApp.visualization.get(qvid, { noInteraction: true })
                    .then(function (vis) {
                        vis.show($THIS, {
                            onRendered: function () {
                                $rootScope.lstModel.push(vis);
                                asyncCallGetProgess(qvid);
                            }
                        })
                    }).catch(function (error) {
                        console.log(error)
                    });
                }

                async function ObtenerTableProgess(ID) {
                    return new Promise(resolve => {
                        getTabla(ID).then(function (res) {
                            var model = res;
                            var table = qlik.table(model);
                            var _headers = table.headers;
                            model.getHyperCubeData('/qHyperCubeDef', [{
                                qTop: 0,
                                qLeft: 0,
                                qWidth: table.colCount,
                                qHeight: table.rowCount
                            }]).then(function (data) {
                                let PROGRESS = [];
                                var response = data[0].qMatrix[0];
                                const root = document.documentElement;
                                angular.forEach(response, function (value, i) {
                                    let option = {};
                                    option.HEADER = _headers[i].qFallbackTitle;
                                    option.VALUE = value.qText;
                                    option.ISNEGATIVE = isNegative(formatNumero(option.VALUE));
                                    root.style.setProperty('--width-' + i, formatNumero(option.VALUE.replace('-', '')) + '%');
                                    PROGRESS.push(option);

                                })
                                resolve(PROGRESS)

                                                            });



                        });
                    })

                }

                async function asyncCallGetProgess(qvid) {
                    const result = await ObtenerTableProgess(qvid);
                    $scope.PROGRESS = result;   
                    setTimeout(() => { $scope.$apply($scope.PROGRESS); $scope.ISLOADING = false }, 0);                           
                }













                            }]
        };
        return directiveDefinitionObject;
    });

});