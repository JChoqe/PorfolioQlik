var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {
        app.directive('blockloading', [function () {
            return {
                restrict: 'E',
                scope: false,
                replace:true,
                templateUrl: 'js/Directives/blockloading/blockloading.html',
                link: function (scope, element, attrs) {                    
                },
                controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', function ($q, $scope, $rootScope, luiDialog, $translate) {
                    $scope.textoLoader = $translate.instant("blockloading.openapp");
                    $scope.objetosLoader = $translate.instant("blockloading.cargandoobjetos"); 
                    $scope.of = $translate.instant("blockloading.de"); 
                    var itemsObject = 0, objectLoad = 0;


                                        setTimeout(() => { 
                        $scope.$apply(function () {
                            $scope.textoLoader;
                            $scope.objetosLoader; 
                            $scope.of;                                                                         
                        });
                    }, 0);

                                                $scope.$watchCollection('lstModel', function(newVal, oldVal) {                            
                                itemsObject = $('.qlik-embed').length;
                                objectLoad = $rootScope.lstModel.length;
                                if($rootScope.lstModel.length > 0){
                                    if($rootScope.lstModel.length >= itemsObject ) {
                                        objectLoad = itemsObject;
                                    }
                                    $scope.textoLoader = $scope.objetosLoader + objectLoad + $scope.of + itemsObject;
                                }
                        });                                                  
                }]
            };
        }]);

});