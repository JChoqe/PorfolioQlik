var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {

        app.directive('itemvideo', [function () {
            return {
                restrict: 'E',
                scope: true,
                link: function (scope, element, attrs) {
                    var urlvideo = attrs.id;
                    scope.loadVideo(urlvideo);
                },
                controller: ['$scope','$element','$compile','$attrs', function ($scope,$element,$compile,$attrs) {
                    $scope.loadVideo = (url)=>{
                        $element.html($compile(`<video class="video-element" preload="metadata"><source ng-src="${url}" type="video/mp4"></video>`)($scope));
                    }                    
                }]
            };
        }]);

});