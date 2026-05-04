
define([
    'js/qlik',
    'app'
], function (qlik, app) {

    app.controller('insightadvisorCtrl',['InitConfig', '$q', '$translate', '$scope', '$rootScope' ,'$compile', '$stateParams', '$state', function (InitConfig, $q, $translate,  $scope, $rootScope ,$compile, $stateParams, $state) {  

                if(typeof $rootScope._thisCurrentApp != "undefined"){


                            $rootScope.OpenFiltros = false;
            function translateArr(arr) {
                var defer = $q.defer();
                var newArr = [];
                angular.forEach(arr, function (value, key) {
                    newArr.push($translate.instant(value));
                });

                defer.resolve(newArr);
                return defer.promise;
            }
            if ($stateParams.PATH) {
                if (InitConfig.multilanguage == true) {
                    translateArr($stateParams.PATH).then(function (res) {
                        $rootScope.tituloSeccion = res.reduce(function (total, element) {
                            var iNext = ' <i class="icofont icofont-rounded-right"></i> ';
                            return total + iNext + element;
                        });
                    });
                    $rootScope.$on('$translateChangeSuccess', function (event, current, previous) {
                        translateArr($stateParams.PATH).then(function (res) {
                            $rootScope.tituloSeccion = res.reduce(function (total, element) {
                                var iNext = ' <i class="icofont icofont-rounded-right"></i> ';
                                return total + iNext + element;
                            });
                        });
                    });
                } else {
                    $rootScope.tituloSeccion = $stateParams.PATH.reduce(function (total, element) {
                        var iNext = ' <i class="icofont icofont-rounded-right"></i> ';
                        return total + iNext + element;
                    });
                }

                }

                var $CurrentSelections = $(".CurrentSelections");
            $rootScope._thisCurrentApp.getObject($CurrentSelections, 'CurrentSelections');
            $('.qv-global-selections').parent('div').remove();

            function getQlikApp() {
                var htmlcontent = $('#content_iframe');
                var newScope = $scope.$new(false, $scope);                            
                var origin = window.location.origin;       

                                      $scope.urlIframe = origin + '/sense/app/' + $rootScope._thisCurrentApp.id + '/insightadvisor';
                var _htmlIframe = "<iframe src='" + $scope.urlIframe + "' class='mzh-100 p-0'></iframe>"
                angular.element(htmlcontent).empty().append($compile(_htmlIframe)(newScope)).promise().done(function() {
                    $rootScope.deleteElement();
                });
            }
            getQlikApp();
        }else{
            $state.go('Home.inicio')
        }


            }]);

});