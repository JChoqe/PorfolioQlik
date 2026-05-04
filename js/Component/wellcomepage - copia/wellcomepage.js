var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'angular'
], function (qlik, app, angular) {
        app.directive('wellcomepage', [function () {
            return {
                restrict: 'E',
                scope: false,
                replace:true,
                templateUrl: 'js/Component/wellcomepage/wellcomepage.html',
                link: function (scope, element, attrs) {                                        

                                                       },
                controller: ['$q', '$http', '$compile',  '$scope', '$rootScope','$state', 'luiDialog', 'luiTooltip', function ($q, $http, $compile, $scope, $rootScope,$state, luiDialog, luiTooltip) { 

                    $rootScope.addElement(); 
                    $rootScope.ITEMS = [];

                    var panelSelecciones = $('.qv-global-selections').parent('div');
                    if(panelSelecciones){
                        $(panelSelecciones).remove()
                    }

                    $scope.$watch('$viewContentLoaded', function () {
                        $rootScope.deleteElement();    
                        setTimeout(() => {
                            $('body').addClass('pace-done')
                        }, 800);                                                        
                    });




                                    $scope.enterDashboard = async function(URL) {
                        $rootScope.textoLoader = 'Abriendo la aplicación...';
                        var target = document.getElementById('main');
                        var _el = $rootScope.LOADERPAGE;
                        angular.element(target).append(_el).promise().done(function() {
                            $state.go(URL)
                        });
                    }

                                                                      }]
            };
        }]);

});