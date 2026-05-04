var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app'
], function (qlik, app ) {
    app.directive('mainmenu', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: 'js/Component/mainmenu/mainmenu.html',
            link: function (scope, element, attrs) {


                                                                  },
            controller: ['$q', '$scope', '$rootScope', 'luiTooltip', '$translate', function ($q, $scope, $rootScope, luiTooltip, $translate) {
                $scope.openTooltip = function (e) {                    
                    var element = e.currentTarget;
                    var tooltip = luiTooltip.show({
                        template: `<span class="mz-tooltip mz-tooltip-right">`
                         + element.getAttribute('data-title') +
                         `</span>`,
                        alignTo: element,
                        dock: 'right',
                        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

                        }]
                    });
                    $scope.closeTooltip = function () { 
                        tooltip.close();
                    }
                }


                                                                  }]
        };
    }]);    

});