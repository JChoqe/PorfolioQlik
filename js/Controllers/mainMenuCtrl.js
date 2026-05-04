define([
    'js/qlik',
    'app'
], function (qlik, app) {
    app.controller('mainMenuCtrl',['$scope', '$rootScope', '$q', '$compile', '$window', function ($scope, $rootScope, $q, $compile, $window) {
        $scope.isNavVisible = false;
        $scope.activePage = 0; 

                $scope.getWidthMenu = ()=>{
            return new Promise(resolve => {
                let _widthList = 0;
                let _page = 0;
                let _menuWrapper = document.getElementById('listaMenuContenidos');
                let _menuWrapperWidth = $(_menuWrapper).outerWidth();

                                $('#listaMenuContenidos > li').each(function(){
                    let el_W = $(this).outerWidth();
                    _widthList = (Number(_widthList)  + Number(el_W));
                    if((_menuWrapperWidth * (_page + 1)) < _widthList)
                        {
                            $(this).addClass('page-' + _page);
                            _page = _page + 1;
                            $scope.pages = _page;
                        }
                });
                resolve([_menuWrapperWidth, _widthList ])
            })
        }

                $rootScope.showArrowsMenu = () =>{
            $scope.isShowSubmenu = false;                                                
            $scope.pages = 0;
            $scope.activePage = 0;
            $scope.menuWrapper = document.getElementById('listaMenuContenidos');
            $($scope.menuWrapper).animate({
                scrollLeft: 0
            }, 800, "swing", function () {

                                $scope.getWidthMenu().then((res)=>{
                    $scope.isNavVisible = res[0] < res[1] ? true: false;
                    setTimeout(() => {
                        $scope.$apply($scope.isNavVisible);
                    }, 300);
                })
            })
        }
        $scope.prevPage = () =>{
            $scope.hideSubmenu();
            $($scope.menuWrapper).animate({
                scrollLeft: ($scope.activePage - 1) * $($scope.menuWrapper).outerWidth()
            }, 800, "swing", function () {
                $scope.activePage = $scope.activePage  - 1;
                $scope.$apply();
            })
        }
        $scope.NextPage = () =>{
            $scope.hideSubmenu();
            $($scope.menuWrapper).animate({
                scrollLeft: ($scope.activePage + 1) * $($scope.menuWrapper).outerWidth()
            }, 800, "swing", function () {
                $scope.activePage = $scope.activePage  + 1;
                $scope.$apply();
            })
        }

        $scope.disablePagination = (dir) => {
            switch(dir) {
                case 'prev':
                  return $scope.activePage == 0 ? true : false;
                  break;
                case 'next':
                    return $scope.activePage > 0 &&  $scope.activePage >= $scope.pages ? true : false;
                  break;
                default:
                  return true;
              }
        }

        $scope.showSubmenu = ($event)=>{
            $event.preventDefault();
            destroyCloneMenu().then(function(){
                let el = angular.element($event.currentTarget);
                let menuPosition = {};            
                let menuClone = el.find('.subMenuVistas').clone().html();
                if(menuClone){
                    menuPosition.position = el.offset();
                    menuPosition.html = menuClone;
                    let _html = '<ul  class="subMenuVistas submenuClone" ng-mouseleave="hideSubmenu()"  style="left:'+ (menuPosition.position.left - 1) +'px; top:'+ (menuPosition.position.top + 30) +'px">' + menuPosition.html +'</ul>';
                    $('body').append($compile(_html)($scope)).promise().done(function(){
                        $scope.isShowSubmenu = true;
                    });
                }else{
                    return false
                }

            })
        }
        $scope.hideSubmenu = ()=>{
            destroyCloneMenu();
        }
        function destroyCloneMenu (){
            var defer = $q.defer();
            var MENUSCLONE =  document.querySelector('.submenuClone');
            if(MENUSCLONE){
                $('.submenuClone').each(function(){
                    $(this).remove()
                }) 
                $scope.isShowSubmenu = false; 
                defer.resolve(true);
            }else{
                defer.resolve(true); 
            }
            return defer.promise;
        }
        $(document).on("mouseover", '#top-header, #main-menu, #box-current-selecctions, #page-container, .pager-menu-nav', function () {
            destroyCloneMenu();                                
        });
        $rootScope.$on("$stateChangeSuccess", function () {           
            destroyCloneMenu();
        });

        angular.element($window).on('resize', $rootScope.showArrowsMenu);


                var deregisterTimeline = $rootScope.$on("loadTimeline", function(evt,data){ 
            setTimeout(() => {
                $rootScope.showArrowsMenu();
            }, 300);             
        });

                var deregister = $scope.$on("loadMenu", function(evt,data){ 
            setTimeout(() => {
                $rootScope.showArrowsMenu();
            }, 300);             
        });
        $scope.$on('$destroy', function destroyScope() {
            deregister();
            deregisterTimeline();
        });
        $scope.$on('$includeContentLoaded', function () {
        });

            }]);

});