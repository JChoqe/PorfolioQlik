var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app'
], function (qlik, app) {

    app.controller('WellcomeCtrl',['InitConfig', '$scope', '$rootScope', '$q', '$state', 'luiDialog', '$timeout', '$compile', '$http', '$interval', function (InitConfig, $scope, $rootScope, $q, $state, luiDialog, $timeout, $compile, $http, $interval) {





            $scope.$on('$viewContentLoaded', function (event) {
                var global = qlik.getGlobal(config);
                var arrListApps;
                global.session.rpc({
                    method: "GetDocList",
                    handle: -1,
                    params: []
                }).then(function (e) {
                    arrListApps = e.result.qDocList;

                    if(!$rootScope.Apps){
                        var arrPromisesApps = [];
                        $rootScope.Apps = [];
                        angular.forEach(InitConfig.arrApps, function (value, i) {
                            arrPromisesApps.push(new Promise((resolve, reject) => {
                                if($rootScope.IsPersonalMode){
                                    var result = arrListApps.filter(obj => {
                                        return obj.qDocName.replace('.qvf', '') === value.idapp.replace('.qvf', '')
                                    })
                                    if(result){
                                        resolve(qlik.openApp(value.idapp, config));
                                    }else{
                                        resolve(null);
                                    }
                                }else{
                                    var result = arrListApps.filter(obj => {
                                        return obj.qDocId === value.idapp
                                    })
                                    if(result){
                                        resolve(qlik.openApp(value.idapp, config));
                                    }else{
                                        resolve(null);
                                    }
                                }                                
                            })
                            );
                        });
                        Promise.all(arrPromisesApps).then(results => {
                            $rootScope.Apps = results; 
                            $rootScope.itemsObject = $('#content-wellcome .qlik-embed').length;
                            $rootScope.round = 0;                                                                       
                        });
                    } 
                    console.log(arrListApps)
                })

                           });            
    }]);

});