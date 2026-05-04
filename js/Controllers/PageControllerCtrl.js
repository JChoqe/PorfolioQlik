var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
], function (qlik, app) {
        app.controller('PageControllerCtrl',['$injector','InitConfig', '$scope', '$rootScope', '$compile', '$timeout', '$state', '$http', '$q', function ($injector,InitConfig, $scope, $rootScope, $compile, $timeout, $state, $http, $q) {   
            var arr = new Array(InitConfig.arrApps.length)
            $rootScope.Apps = arr;
            $rootScope.AppsControl = InitConfig.arrApps;


            $rootScope.APICONFIG = InitConfig.APICONFIG;
            let mzApiGlobalService = $injector.get('mzApiGlobalService');

            mzApiGlobalService.obtenerIdiomas().then(async function (idiomas) {
                $rootScope.IDIOMASAPI = idiomas.data;
            })
            $rootScope.ISADMIN = mzApiGlobalService.getRolesUsuario();



            $rootScope.mzAlerting = InitConfig.mzAlerting;
            $rootScope.mzOptions = InitConfig.mzOptions;
            $rootScope.mzFavoritos = InitConfig.mzFavoritos;
            $rootScope.modoWhite = !InitConfig.darkView;
            $rootScope.multilanguage = InitConfig.multilanguage;
            $rootScope.ModeView = InitConfig.modeView;
            $rootScope.HasLogin = InitConfig.hasLogin;
            $rootScope.HasUserProfile = InitConfig.hasUserProfile
            $rootScope.HasVideos = InitConfig.hasVideos;
            $rootScope.FolderContent = InitConfig.folderContent;

            $rootScope.hasGenaro = InitConfig.hasGenaro;

                        $rootScope.demo = InitConfig.demo;
            $rootScope.darkView = InitConfig.darkView;
            $rootScope.language = InitConfig.language;
            $rootScope.optionColorObject = InitConfig.optionColorObject;
            $rootScope.embedObject = InitConfig.embedObject;
            $rootScope.SHOWCOMPAREOBJECT = InitConfig.SHOWCOMPAREOBJECT;
            $rootScope.HELPOBJECT = InitConfig.HELPOBJECT;
            $rootScope.ISVISTAPERSONALIZADA = false; 
            $rootScope.ISVISTAFAVORITOS = false; 
            $rootScope.ISFAVORITOFULLSIZE = false; 
            $rootScope.isFullSize = false; 

            $rootScope.InitMashup = false;
            $rootScope.ITEMSOPCIONES = [];

            $rootScope.CARGAVIDEOSFULL = false; 
            $rootScope.loadVideos = false;
            $rootScope.noVideos = false;
            $rootScope.urlContentLibrary = []; 
            $rootScope.PrefSheets = InitConfig.prefSheets; 

            $rootScope.setQlikTheme = function (qlik, name) {
                qlik.theme.apply(name);              
            };
            $rootScope.changeThemes = function (qlik, name) {
                qlik.theme.apply(name);
            };
            $rootScope.resetQlikTheme = function (qlik) {
                qlik.theme.apply('_Theme-Default');
            };

            $rootScope.LastReloadTime = '';




            $rootScope.ThemesDownloadImage = InitConfig.ThemesDownloadImage;
            if (InitConfig.darkView == true) {
                $rootScope.ThemesInit = InitConfig.ThemesChange;
                $rootScope.ThemesChange = InitConfig.ThemesInit;
            } else {
                $rootScope.ThemesInit = InitConfig.ThemesInit;
                $rootScope.ThemesChange = InitConfig.ThemesChange;
            }


                                             $rootScope.addThemeWellcome = async function () {
                qlik.theme.apply(InitConfig.ThemesWellcome);
            };

            $rootScope.addThemePages = async function () {
                qlik.theme.apply($rootScope.ThemesInit);
            };
            $rootScope.lstModel = []; 
            $rootScope.lstModelPartial = []; 
            $rootScope.lstModelCurrentSelections = []; 
            $rootScope.listPropertieObjectModel = []; 
            $rootScope.lstModelFilters = []; 
            $rootScope.lstModelFiltersOptions = []; 
            $rootScope.LISTSESSION = []; 
            $rootScope.LISTSESSIONPARENT = []; 
            $rootScope.isVisibleLinkAlertas = '';
            $rootScope.isVisibleLinkGlosario = '';
            $rootScope.isVisibleLinkMarcadores = '';
            $rootScope.isVisibleLinkFilters = '';
            $rootScope.isVisibleLinkHelp = '';
            $rootScope.isVisibleLinkMode = '';

            $.get('include/devextreme/js/localization/dx.messages.'+ $rootScope.language  +'.json').done(function (dictionary) {  
                DevExpress.localization.loadMessages(dictionary);  
                var locale = $rootScope.language;  
                DevExpress.localization.locale(locale); 

                        });
            $rootScope.$on('$translateChangeSuccess', function () {
                $.get('include/devextreme/js/localization/dx.messages.'+ $rootScope.language  +'.json').done(function (dictionary) {  
                    DevExpress.localization.loadMessages(dictionary);  
                    var locale = $rootScope.language;  
                    DevExpress.localization.locale(locale); 

                                });
            });


            function getObjectModel(id) {
                return new Promise(resolve => {
                    var ID = id;
                    let isCopy = $('body#main').find('.object-full-size-copy');
                    if(isCopy.length > 0){
                        let result = $rootScope.lstModel.findLast(({ id }) => id == ID);
                        resolve(result.model);
                    }else{
                        $rootScope.lstModel.filter(obj => {
                            if (obj.id == ID) {
                                resolve(obj.model);
                            }
                        });
                    }

                })
            }
            $scope.ShowContextMenu = async function (e, id, typeObject, APPID) {
                var objectHasSoftPatches = false;
                var objectHasSoftPatchesHeight = 0;
                getObjectModel(id).then(function (model) {
                    objectHasSoftPatches = model?.enigmaModel?.layout?.qHasSoftPatches;
                    switch (objectHasSoftPatches) {
                        case true:
                            objectHasSoftPatchesHeight = 40;
                            break;

                                            default:
                            objectHasSoftPatchesHeight = 0;
                            break;
                    }


                    let ID = id ,valorCelda = '', typeEvent = '', appId = APPID ;
                    typeEvent = e.type;
                    if (e.target) {
                        var n = (e.target).innerText;
                        if (n) {
                            valorCelda = n;
                        }else{
                            valorCelda = '';
                        }
                    }


                            let $typeObject = typeObject;
                    if ($typeObject != 'filterpane') {
                        let mousePosition = {};
                        let menuPostion = {};
                        let menuDimension = {};

                            switch ($typeObject) {
                            case 'kpi':
                                menuDimension.x = 250;
                                menuDimension.y = 152;
                                break;
                            case 'gauge':
                                menuDimension.x = 250;
                                menuDimension.y = 276;
                                break;
                            case 'barchart':
                                menuDimension.x = 250;
                                menuDimension.y = 296 + objectHasSoftPatchesHeight;
                                break;
                            case 'pivot-table':
                                menuDimension.x = 250;
                                menuDimension.y = 346 + objectHasSoftPatchesHeight;
                                break;
                            default:
                                menuDimension.x = 250;
                                menuDimension.y = 296 + objectHasSoftPatchesHeight;
                        }

                            if(typeEvent == "click"){
                            var offset = $(e.currentTarget).offset();
                            mousePosition.x = offset.left + 30;
                            mousePosition.y = offset.top + 30;
                        }else{
                            mousePosition.x = e.pageX;
                            mousePosition.y = e.pageY;
                        }



                                                        if (mousePosition.x + menuDimension.x > $(window).width() + $(window).scrollLeft()) {
                            menuPostion.x = mousePosition.x - menuDimension.x - 40;
                        } else {
                            menuPostion.x = mousePosition.x;
                        }

                            if (mousePosition.y + menuDimension.y > $(window).height() + $(window).scrollTop()) {
                            menuPostion.y = mousePosition.y - menuDimension.y - 20;
                        } else {
                            menuPostion.y = mousePosition.y;
                        }


                                $('contextmenu').remove().promise().done(function () {

                                let _html = `<contextmenu valor-celda="${valorCelda}" object-id="${ID}" top="${menuPostion.y}" left="${menuPostion.x}" ` + (typeof appId != 'undefined' ? `app-id="${appId}"` : '' )+ ` ></contextmenu>`;
                            let el = $compile(_html)($scope);
                            $('body').append(el);
                        });
                    }
                })




            };
            $scope.close = async function () {
                $('contextmenu').remove();
            };


                        $rootScope.IsPersonalMode = '';




            $rootScope.ISSAAS = config.hasOwnProperty('isSaas') ? config.isSaas : false;

            if($rootScope.ISSAAS){
                $rootScope.IsPersonalMode = false;
            }else{
                var global = qlik.getGlobal(config);
                global.isPersonalMode(function (reply) {
                    $rootScope.IsPersonalMode =  reply.qReturn;
                });

                $rootScope.getPersonalMode = function() {
                    var defer = jQuery.Deferred();
                    var global = qlik.getGlobal(config);
                    global.isPersonalMode(function (reply) {
                        defer.resolve([reply.qReturn]);
                    });
                    return defer.promise();
                };


                global.getAuthenticatedUser(function(reply) {                    
                    var str = reply.qReturn;
                    var isServer = str.includes(';');

                            if (isServer == true) {
                        str.split(";");
                        var usuario = str.split('=');
                        $rootScope.Usuario = usuario[2];
                    } else {
                        $rootScope.Usuario = reply.qReturn;
                    }
                });  
            }


                        $rootScope.getPersonalModeByName = async function(){
                var defer = jQuery.Deferred();
                var hostname = window.location.hostname;    
                if(hostname.includes("http://localhost:4848/")){
                    $rootScope.IsPersonalMode = true;
                    defer.resolve([$rootScope.IsPersonalMode]);
                }else{
                    $rootScope.IsPersonalMode = false;
                    defer.resolve([$rootScope.IsPersonalMode]);                     
                }
                return defer.promise();
            }

            $rootScope.addElement = async function () {
                var _el = $('.mz-block');
                if(_el.length < 1){                                              
                    var target = document.getElementById('main');
                    angular.element(target).append($compile('<blockloading></blockloading> ')($scope));
                }
            };
            $rootScope.deleteElement = async function () {
                setTimeout(function () {
                    var currentState = $state.current.name; 
                    if(currentState == 'Home.inicio'){
                        var target = document.getElementsByClassName('mz-block');
                        $(target).addClass('active').promise().done(function () {
                            $timeout(function () {
                                $(target).remove();                                
                            }, 900)

                                                    });
                    }else{
                        var target = document.getElementsByClassName('mz-block');
                        $(target).fadeOut(600, function () {
                            $(target).remove();
                        });
                    }
                }, 800);
            };

            $rootScope.resizeObject = async function(){
                qlik.resize();
            }


            $rootScope.OpenSidebarMenu = false;
            $scope.toogleSidebar = async function () {
                $rootScope.OpenSidebarMenu = $rootScope.OpenSidebarMenu === false ? true : false;
                if($rootScope.OpenSidebarMenu == false){
                    destroyCloneMenu();
                }
                $timeout(function () {
                    qlik.resize();
                    if($rootScope.OpenSidebarMenu == true){
                        $rootScope.createCloneMenu();
                    }
                }, 300);
            };            
            $rootScope.createCloneMenu = async function () {
                setTimeout(function () {
                    destroyCloneMenu().then(function(){
                        $('#main-menu .list-nav > li').each(function () {
                            var _parent = $(this);
                            if($(this).find('.collapse').children('ul.nav').length > 0){
                                var _item = $(this);
                                var _idCollapse ='_colapse_' + _item.find('.collapse').attr('id');
                                _item.attr('data-idcollapse', _idCollapse).promise().done(function () {
                                    var _offset = _item.offset();
                                    var _offsetLeft = _offset.left;
                                    var _offsetTop = _offset.top;
                                    var _texto =   $(_item).find('a > p').text();                      
                                    var _cloneMenuItem = $(this).find('.collapse').children('ul.nav').clone().html();
                                    var _html = '<div id="' + _idCollapse + '" class="menuclone" data-top="'+ _offsetTop +'" data-left="' + _offsetLeft + '"><ul><li class="listCloneHeader">'+ _texto +'</li>'+ _cloneMenuItem +'</ul></div>'
                                    $(_parent).append($compile(_html)($scope));
                                })

                                    }
                        })
                    })
                },600)

            }
            async function destroyCloneMenu (){
                var defer = $q.defer();
                var MENUSCLONE =  document.querySelector('.menuclone');
                if(MENUSCLONE){
                    $('.menuclone').each(function(){
                        $(this).remove()
                    })  
                    defer.resolve(true);
                }else{
                    defer.resolve(true); 
                }
                return defer.promise;
            }

            $(document).on("mouseover", '.sidebar-collapsed #main-menu .list-nav > li[data-idcollapse]', async function () {
                var _item = $(this);
                var _fincdId = $(this).attr('data-idcollapse');
                if(_fincdId){
                    $('.menuclone').removeClass('active').promise().done(function () {
                        var _altoScreen = $(window).height();
                        var _altoMenu = $('#' + _fincdId).height();
                        var _offset = _item.offset();
                        var _offsetTop = _offset.top;
                        if(_offsetTop < (_altoScreen / 2)){
                            _offsetTop = _offsetTop
                        }else{
                            _offsetTop = _offsetTop - (_altoMenu - 30);
                        }
                        $('#' + _fincdId).addClass('active').css('top' , _offsetTop);
                    })
                }                                
            });
            $(document).on("mouseleave", '.menuclone', function () {
                $('.collapse.menu-float').removeClass('active')
            });
            $(document).on("mouseleave", '#main-menu .list-nav > li', function () {
                $(this).children('.menuclone').removeClass('active')
            });
            $(document).on("mouseover", '.row-page,#top-header', function () {
                $('.menuclone').removeClass('active')
            });





            $rootScope.ShowMenu = false;
            $scope.toogleMenu = async function () {
                $rootScope.ShowMenu = $rootScope.ShowMenu === false ? true : false;
            };

            $rootScope.showAlert = async function(header, mensaje, tipo) {                
                var _header = header || 'Atención';
                var _mensaje = mensaje || 'Mensaje';
                var _icon = tipo || 'info';
                $.toast({
                    position: 'mid-center',
                    heading: _header,
                    text: _mensaje,
                    showHideTransition: 'fade',
                    icon: _icon,
                    stack: false
                });
            }
            $rootScope.showAlertStates = async function(header, mensaje, tipo) {                
                var _header = header || 'Atención';
                var _mensaje = mensaje || 'Mensaje';
                var _icon = tipo || 'info';
                $.toast({
                    position: 'bottom-right',
                    heading: _header,
                    text: _mensaje,
                    showHideTransition: 'fade',
                    icon: _icon,
                    stack: false
                });
            }

            $rootScope.clearObjectMenu = async function () {
                if ($rootScope.lstModelPartial && $rootScope.lstModelPartial.length >= 1) {
                    angular.forEach($rootScope.lstModelPartial, function (value, key) {
                        try {
                            value.close();
                        }
                        catch (error) {
                            console.log("error eliminando el objeto " + key + "\n" + error);
                        }

                    });
                    $rootScope.lstModelPartial = [];
                }
            }

            let currentDevice = device.noConflict();
            $rootScope.OrientationDevice = currentDevice.landscape() == true ? 'landscape' : 'portrait'
            currentDevice.onChangeOrientation(async function (newOrientation) {
                $rootScope.OrientationDevice = newOrientation;
            });

            }]);
        app.controller('loaderPageCtrl',['$scope', '$rootScope', '$translate',function($scope, $rootScope, $translate){
            $scope.textoLoader = $translate.instant('views.label.openapp');            
            $scope.$watchCollection('lstModel', function(newVal, oldVal) {
                var itemsObject = $('objectsense').length;
                if($rootScope.lstModel.length > 0){
                    var txt = $translate.instant('views.label.loadobject') + $rootScope.lstModel.length + $translate.instant('views.label.of') + itemsObject;
                    setTimeout(() => {
                        $scope.$apply(function(){
                            $scope.textoLoader = txt;
                        }); 
                    }, 0);                                       
                }
            });

                    }])
        app.controller('BookmarkActiveCtrl', ['$scope','luiTooltip', '$rootScope', '$translate', function ($scope,luiTooltip, $rootScope, $translate) {
            $scope.openTooltip = function (e) { 
                let TEMPLATE = '';
                if($rootScope.hasBookmarkActive){
                    TEMPLATE = `<span class="mz-tooltip mz-tooltip-right"><div class="cover_bk_active_tooltip">
                        <label class="titleLabelBookmark">`+ $translate.instant('label.Bookmarks.BookmarkActive')+ `</label>
                        <label class="bookmarkActiveInfo" title="`+ $rootScope.BOOKMARKACTIVO[0].title + `">` + $rootScope.BOOKMARKACTIVO[0].title + `</label>
                    </div> </span>`
                } else{
                    TEMPLATE = `<span class="mz-tooltip mz-tooltip-right"><label id="hideBookmark">`+ $translate.instant('label.Bookmarks.NoBookmarkActive') + `</label></span>`;
                }                  
                var element = e.currentTarget;
                var tooltip = luiTooltip.show({
                    template: TEMPLATE,
                    alignTo: element,
                    dock: 'right',
                    controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

                    }]
                });
                $scope.closeTooltip = function () { 
                    tooltip.close();
                }
            }


                                                      }])
 });







