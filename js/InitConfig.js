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
            this.listLanguages = ['es','en'];
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
            this.noGlosary = ['noglosary','noreporting'];
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
    application_id : 2
};
this.arrApps = [
    {
        name: 'Hominem-RRHH',
        idapp: '1356a50a-65d1-46fa-ae67-b8092432f316',
        init: false,
        bookmarkApp:{
            hasBookmarkDefaultUser: false,
            bookmarkDefaultUserId: '',
            bookmarkDefaultUser: ''
        }
    },
    {
        name: 'Hominem-RRHH-Seguridad',
        idapp: '02a77986-f364-47dc-aa5f-5583e0488727',
        init: false,
        bookmarkApp:{
            hasBookmarkDefaultUser: false,
            bookmarkDefaultUserId: '',
            bookmarkDefaultUser: ''
        }
    },
    {
        name: 'Hominem-RRHH-ControlPresencia',
        idapp: '81b5011f-e3a7-4855-96e0-b00a4458132f',
        init: false,
        bookmarkApp:{
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