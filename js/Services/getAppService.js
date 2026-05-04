define([
    'js/qlik',
    'app'
], function (qlik, app) {
        app.service('getAppService', ['getDefaulltBookmarkService',function (getDefaulltBookmarkService) {            
            this.getDataApp = function (appID) {
                return new Promise(resolve => {
                    var _app = qlik.openApp(appID, config); 
                    resolve(_app)
                })                               
            };                    
    }]);
});