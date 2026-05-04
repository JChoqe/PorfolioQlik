var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app'
], function (qlik, app) {
        app.directive('modeview', [function () {
            return {
                restrict: 'E',
                scope: false,
                replace:true,
                templateUrl: 'js/Directives/modeview/modeview.html',
                link: function (scope, element, attrs) {                    
                },
                controller: ['$scope', '$rootScope', '$state', 'InitConfig', function ($scope, $rootScope, $state, InitConfig) {                    

                                        $rootScope.toggleModeColor = function () {
                        var newEle = angular.element('<div class="mz-block"><div id="logo-block"></div><div class="flex-loader-cover"><div class="loaderEquializador">Loading...</div></div></div>');
                        var target = document.getElementById('main');
                        angular.element(target).append(newEle);
                        $rootScope.modoWhite = $rootScope.modoWhite === false ? true : false;

                        switch ($rootScope.modoWhite) {
                            case true:
                                $('body').removeClass('mz-dark').addClass('mz-white');
                                $rootScope.ThemesInit = InitConfig.ThemesInit;
                                $rootScope.ThemesChange = InitConfig.ThemesChange;
                                $rootScope.setQlikTheme(qlik, $rootScope.ThemesInit);
                                $rootScope.darkView = false;
                                break;
                            case false:
                                $('body').removeClass('mz-white').addClass('mz-dark');
                                $rootScope.ThemesInit = InitConfig.ThemesChange;
                                $rootScope.ThemesChange = InitConfig.ThemesInit;
                                $rootScope.setQlikTheme(qlik, $rootScope.ThemesInit);
                                $rootScope.darkView = true;
                                break;
                            default:
                                $('body').removeClass('mz-white');
                                break;
                        }
                        $state.reload();
                    };


                                                        }]
            };
        }]);

});