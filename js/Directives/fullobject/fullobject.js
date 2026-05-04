var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {
    app.directive('fullobject', [function () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'js/Directives/fullobject/fullobject.html',
            link: function (scope, element, attrs) {
                scope.ObjectId = String(attrs.idfullobject).trim();               
            },
            controller: ['$injector', '$scope', '$rootScope', '$attrs', '$compile', function ($injector, $scope, $rootScope, $attrs, $compile) { 

                                $scope.ShowFullobject = async (qvid) => {
                    let objectID = String($attrs.idfullobject).trim();
                    $rootScope.isFullSize = true;                            
                    $('body').addClass("body-full-size");
                    let newScope = $scope.$parent.$new();                            
                    $injector.invoke(function () {
                        let _el = $compile(`<objectsense class="object-full-size-copy" object-id="${objectID}"></objectsense>`)(newScope);
                        $(document.body).prepend(_el);                                                              
                    });

                                    }

            }]
        };
    }]);

});