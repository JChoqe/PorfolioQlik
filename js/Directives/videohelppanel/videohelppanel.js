var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    './itemvideo/itemvideo'
], function (qlik, app) {        
        app.directive('videohelppanel', [function () {
            return {
                restrict: 'E',
                scope: false,
                templateUrl: 'js/Directives/videohelppanel/videohelppanel.html',
                link: function (scope, element, attrs) {


                },
                controller: ['$compile', '$q', '$scope', '$rootScope', 'luiDialog', '$translate', 'InitConfig', function ($compile, $q, $scope, $rootScope, luiDialog, $translate, InitConfig) {
                    $scope.ShowHelp = false;
                    $scope.toggleHelp = function () {
                        $scope.ShowHelp = $scope.ShowHelp === false ? true : false;
                        if ($scope.ShowHelp == true) {
                            ShowPanelVideos();
                            if($rootScope.CARGAVIDEOSFULL == false){
                                asyncCallGetLisContent();
                            }
                        } else {
                            var video = document.getElementById('video');
                            if(video){
                                video.pause();
                                video.currentTime = 0;
                            }
                            HidePanelVideos();
                        }
                    };


                    async function getLisContent(){
                        return new Promise(resolve => {
                            var sessionApp = qlik.sessionApp();
                            var arrContent = [];
                            sessionApp.model.waitForOpen.promise.then(() => {
                                sessionApp.model.engineApp.getLibraryContent(
                                    {
                                        "qName": $rootScope.FolderContent
                                    }
                                ).then(function(qBook){
                                    $.each(qBook.qList, function (key, value) {
                                        arrContent.push(value.qUrl)
                                    })
                                    resolve(arrContent);
                                })
                                .catch(function(e){
                                    resolve(arrContent);
                                })
                            }).catch(function(e){
                                console.log(e)
                            })
                        })
                    }


                    async function asyncCallGetLisContent() {
                            const result = await getLisContent();
                            if(result.length > 0){
                                var extension = '.mp4';
                                var x = result.filter(function(file){
                                    return file.indexOf(extension) !== -1;
                                });
                                $rootScope.urlContentLibrary = x;                                
                                $rootScope.noVideos = false;
                                $rootScope.CARGAVIDEOSFULL = true;
                                $rootScope.loadVideos = true;
                                setTimeout(() => {                                     
                                    $scope.playVideo();
                                }, 200);
                            }else{
                                $rootScope.noVideos = true;                                
                                $rootScope.CARGAVIDEOSFULL = true;
                                $rootScope.loadVideos = true; 
                            }
                            setTimeout(() => {
                                $scope.$apply($rootScope.urlContentLibrary, $rootScope.noVideos, $rootScope.CARGAVIDEOSFULL, $rootScope.loadVideos);                                
                            }, 100);
                    }

                    $scope.playVideo = async ()=>{
                        let videoElem = document.getElementById("video");
                        try {
                            await videoElem.play();
                          } catch(err) {
                           console.log(err)
                          }
                    }

                    $scope.loadVideo = function(URL, $event){
                        var isActive = $($event.currentTarget).hasClass('active');
                        if(!isActive){
                            $('.cover-video').removeClass('active').promise().done(function(){
                                $($event.currentTarget).addClass('active');
                                var video = document.getElementById('video');
                                if(video){
                                    video.src = URL;
                                    video.play();
                                }
                            })

                        }
                    }



                    function ShowPanelVideos(){                       
                        var _menuHelp = document.querySelector("#contentHelp");
                        var _overHelp = document.querySelector("#helpOver");
                        $(_overHelp).animate({
                            opacity: 1,
                            right: 0
                        },400, 'swing', function(){
                            $(_menuHelp).animate({
                                opacity: 1,
                                right: 0
                            },300, 'swing')
                        });
                    }
                    function HidePanelVideos(){                       
                        var _menuHelp = document.querySelector("#contentHelp");
                        var _overHelp = document.querySelector("#helpOver");
                        $(_menuHelp).animate({
                            opacity: 0,
                            right: '-100%'
                        },400, 'swing', function(){
                            $(_overHelp).animate({
                                opacity: 0,
                                right: '-100%'
                            },300, 'swing')
                        });
                    } 
                }]
            };
        }]);

});