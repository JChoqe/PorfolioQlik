var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {
        app.directive('switchlangwellcome', [function () {
            return {
                restrict: 'E',
                scope: false,
                replace: true,
                templateUrl: 'js/Directives/switchlangwellcome/switchlangwellcome.html',
                link: function (scope, element, attrs) {                                     
                    attrs.$observe('idapp', function () {
                        scope._thisapp = $rootScope._thisCurrentApp;
                    });


                                                       },
                controller: ['$q', '$scope', '$rootScope', 'InitConfig', 'luiDialog', '$translate', 'mzAPI', function ($q, $scope, $rootScope, InitConfig, luiDialog, $translate, mzAPI) { 
                    $scope.api = mzAPI; 
                    $scope.multilanguage = InitConfig.multilanguage;

                    $scope.listIdiomas = InitConfig.listLanguages;
                    $scope.langs = [];
                    angular.forEach($scope.listIdiomas, function (value, i) {
                        var option = {}
                        option.lang = $translate.instant('views.idioma.'+ value);
                        option.langKey = value;
                        option.active =  $rootScope.language == value ? true : false ,
                        $scope.langs.push(option);
                    })

                    $scope.result = $scope.langs.filter(obj => {
                        return obj.active === true;
                    });                    
                    $scope.activeLang = function (item) {
                        if (!item.active) {
                            qlik.setLanguage(item.langKey);
                            $translate.use(item.langKey);
                            $rootScope.language = item.langKey;

                            angular.forEach($rootScope.Apps, function (value, i) {
                                $scope._thisapp = value;
                                $scope._thisapp.variable.getContent(InitConfig.varLanguage).then(function (model) {
                                    $scope._thisapp.variable.setStringValue(InitConfig.varLanguage, item.langKey);
                                }).catch(function (res) {
                                    var fieldLanguage = $scope._thisapp.field(InitConfig.fieldLanguage).getData();

                                    var cambioIdioma = function (){
                                        switch (fieldLanguage.rows.length) {
                                            case 0:
                                                return false;
                                            default:
                                                $scope._thisapp.field(InitConfig.fieldLanguage).clear();
                                                $scope._thisapp.field(InitConfig.fieldLanguage).selectValues([item.langKey.toUpperCase()], false, true);
                                                break;
                                        }
                                        fieldLanguage.OnData.unbind(cambioIdioma);
                                    };

                                                                        fieldLanguage.OnData.bind(cambioIdioma);
                                });
                            });


                                                        angular.forEach($scope.langs, function (value, key) {
                                if ($scope.langs[key].active === false && $scope.langs[key].langKey === item.langKey) {
                                    $scope.langs[key].active = true;
                                    $scope.langs[key].lang = $translate.instant('views.idioma.' + $scope.langs[key].langKey + '');
                                } else {
                                    $scope.langs[key].active = false;
                                    $scope.langs[key].lang = $translate.instant('views.idioma.' + $scope.langs[key].langKey + '');
                                }
                            });
                            $scope.result = $scope.langs.filter(obj => {
                                return obj.active === true;
                            });
                        }
                    };                                        
                }]
            };
        }]);

});