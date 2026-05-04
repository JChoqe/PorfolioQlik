var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {
        app.directive('favoritesfullsize', ['InitConfig', '$translate','$rootScope' , '$state'  , function (InitConfig, $translate, $rootScope, $state) {
            return {
                bindToController: true,
                restrict: 'E',
                replace: false,
                scope: true,
                templateUrl: 'js/Directives/favoritesfullsize/favoritesfullsize.html',
                link: function (scope, element, attrs) { 
                    scope.ObjectId = attrs.objectId;
                    scope.IdApp = attrs.idApp;
                    scope.Uisref = attrs.uisref;
                    scope.Created = attrs.created;
                    scope.IndexObject = attrs.indexObject;


                },
                controller: ['$q', '$scope', '$rootScope', '$attrs', 'luiDialog', '$translate', function ($q, $scope, $rootScope, $attrs, luiDialog, $translate) {
                    $scope.gotoPage = (url) =>{
                        $state.go(url)
                    }

                                    }]
            };
        }]);

});