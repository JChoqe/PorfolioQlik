(function () {
    'use strict';
    define([
        'js/qlik',
        'jquery',
        'app',
        'templateCache',
        'Modernizr',
        'extJs/Routes/routerConfig',
        'extJs/InitConfig',
        'extJs/Equalizador/equalizadorCtrl',

        'extDirectives/userprofile/userprofile',
        'extDirectives/bookmarks/bookmarks',
        'extDirectives/filters/filters',
        'extDirectives/glosario/glosario',
        'extDirectives/help/help',
        'extDirectives/contextmenu/contextmenu',
        'extDirectives/switchlang/switchlang',
        'extDirectives/switchlangwellcome/switchlangwellcome',
        'extDirectives/modeview/modeview',
        'extDirectives/mzlogout/mzlogout',
        'extDirectives/notificationspanel/notificationspanel',
        'extDirectives/videohelppanel/videohelppanel',
        'extDirectives/objectsense/objectsense',
        'extDirectives/objectsense/_templates/measuress/measuress',
        'extDirectives/objectstop/objectstop',
        'extDirectives/compareobject/compareobject',
        'extDirectives/compareobject/services/compareobjectService',

        'extDirectives/mztabs/mztabs',
        'extDirectives/favoritos/favoritos',
        'extDirectives/favoritesfullsize/favoritesfullsize',
        'extDirectives/customsheets/customsheets',
        'extDirectives/blockloading/blockloading',
        'extDirectives/vistaspersonalizadas/vistaspersonalizadas',
        'extDirectives/timeline/timeline',
        'extDirectives/mzprogress/mzprogress',
        'extDirectives/mzmultiplekpi/mzmultiplekpi',
        'extDirectives/fullobject/fullobject',


        'extServices/getAppService',
        'extServices/getDefaulltBookmarkService',



        'extServices/Permissions/apiService',
        'extServices/mzApiGlobalService',
        'extServices/selectionAPI',

        'extControllers/PageControllerCtrl',
        'extControllers/insightadvisorCtrl',
        'extControllers/mainMenuCtrl',
        'extControllers/Home/HomeCtrl',
        'extControllers/Home/WellcomeCtrl',
        'extControllers/_PagesCtrls/StateParentCtrl',
        'extControllers/_PagesCtrls/StateChildrenCtrl',
        'extControllers/_PagesCtrls/PropertiesObject',
        'extControllers/_PagesCtrls/FavoritosCtrl',


        'extComponent/mainmenu/mainmenu',
        'extComponent/headertop/headertop',
        'extComponent/wellcomepage/wellcomepage',


    ], function (qlik, $, app, Modernizr) {

    });
}());