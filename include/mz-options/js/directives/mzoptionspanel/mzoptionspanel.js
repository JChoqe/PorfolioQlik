/****************************************************************************************************************************************
Obtener el host de la extensión, por ejemplo, en localhost:4848/extensions/NombreExtension/Pagina.html
se obtiene /extensions/NombreExtension/
/************************************************************************************************************************************** */
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
  'js/qlik',
  'angular',
  'underscore',
  dir + 'include/mz-options/js/app.js',
], function (qlik, angular, us, app) {
  app.directive('mzoptionspanel', [function () {

    var directiveDefinitionObject = {
      restrict: 'E',
      scope: false,
      templateUrl: 'include/mz-options/js/directives/mzoptionspanel/mzoptionspanel.html',
      link: function (scope, element, attrs) {

      },
      controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', '$state','$http','$compile', function ($q, $scope, $rootScope, luiDialog, $translate, $state,$http,$compile) {
        $translate('message.anclarElemento').then(function (translation) {
          $scope.anclarItem = translation;
        });
        $translate('message.desanclarElemento').then(function (translation) {
            $scope.desanclarItem = translation;
        });        
      }]
    };
    return directiveDefinitionObject;
  }]);


});