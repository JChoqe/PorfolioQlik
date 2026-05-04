var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app'
], function (qlik, app ) {
    app.directive('headertop', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'js/Component/headertop/headertop.html',
            link: function (scope, element, attrs) {


                                                                  },
            controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', function ($q, $scope, $rootScope, luiDialog, $translate) {



                                                                                 }]
        };
    }]);    

});