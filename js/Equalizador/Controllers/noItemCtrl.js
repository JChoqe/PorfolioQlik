
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'underscore'
], function (qlik, app, us) {
        app.controller('noItemCtrl', function ($scope, $rootScope, $q, $translate) {

            $scope.blockEquializador = false;

            $scope.closeEqualizador = function () {
                $('.box_object').removeClass('object-full-size-equializador');
                $(".box_mix_object").removeClass("parent-object-full-size-equializador");
                $('#box_equalizador').removeClass('active');
                setTimeout(function () {
                    $('#box_equalizador').empty();
                    $('body').removeClass('open-equalizador');
                    qlik.resize();
                }, 300);
            }


    });
});





