"use strict";
var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'angular'
], function (qlik, app, angular) {
    app.provider('InitConfig', function () {
        var $this = this;
        this.demo = false;
        this.listLanguages = ['es', 'en'];
        this.language = 'es';
        this.multilanguage = true;
        this.varLanguage = 'vIdiomaSeleccionado';
        this.fieldLanguage = 'Idioma';
        this.darkView = false;
        this.modeView = true;
        this.mzAlerting = false;
        this.mzOptions = true;
        this.hasLogin = true;
        this.hasUserProfile = false;
        this.noGlosary = ['noglosary', 'noreporting'];
        this.hasVideos = true;
        this.hasGenaro = true;
        this.folderContent = 'default';
        this.ThemesDownloadImage = "-Pallete-Theme-Green";
        this.ThemesInit = "-Pallete-Theme-Green";
        this.ThemesChange = "-Pallete-Theme-Green-Dark";
        this.ThemesWellcome = "-Pallete-Theme-Green-Dark";
        this.mzFavoritos = true;
        this.ISSAAS = false;
        this.prefSheets = 'Personalizada.'
        this.optionColorObject = true;
        this.embedObject = true;
        this.SHOWCOMPAREOBJECT = true;
        this.HELPOBJECT = true;
        this.APICONFIG = {
            host: 'https://dev-sense.mercanza.net:4000',
            application_id: 2
        };
        this.arrApps = [
            {
                name: 'Quandox',
                idapp: 'Quandox',
                init: false,
                bookmarkApp: {
                    hasBookmarkDefaultUser: false,
                    bookmarkDefaultUserId: '',
                    bookmarkDefaultUser: ''
                }
            },
            {
                name: 'TIT_DASHBOARD',
                idapp: 'TIT_DASHBOARD',
                init: false,
                bookmarkApp: {
                    hasBookmarkDefaultUser: false,
                    bookmarkDefaultUserId: '',
                    bookmarkDefaultUser: ''
                }
            },
            {
                name: 'Hominem-RRHH-ControlPresencia',
                idapp: 'Hominem-RRHH-ControlPresencia',
                init: false,
                bookmarkApp: {
                    hasBookmarkDefaultUser: false,
                    bookmarkDefaultUserId: '',
                    bookmarkDefaultUser: ''
                }
            }
        ];

        this.$get = function () {
            return $this;
        };
    });
});