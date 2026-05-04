var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app'
], function (qlik, app) {

    app.controller('WellcomeCtrl',['InitConfig', 'getDefaulltBookmarkService', '$scope', '$rootScope', '$q', '$state', 'luiDialog', '$timeout', '$compile', '$http', '$interval', function (InitConfig, getDefaulltBookmarkService, $scope, $rootScope, $q, $state, luiDialog, $timeout, $compile, $http, $interval) {


               $scope.$on('$viewContentLoaded', function (event) {            

                        var MENUSCLONE =  document.querySelector('.menuclone');
            if(MENUSCLONE){
                $('.menuclone').each(function(){
                    $(this).remove()
                })                     
            }              

            $rootScope.itemsObject = $('#content-wellcome .qlik-embed').length;
            $rootScope.round = 0;
            setTimeout(() => {
            }, 600);

                      });            
    }]);

});