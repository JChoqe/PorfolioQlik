var href = window.location.pathname;
var dir = href.substring(0, href.lastIndexOf('/')) + "/";

define([
    'js/qlik',
    'app',
    'angular',
], function (qlik, app, angular ) {
        app.directive('filtersequalizador', [function () {
            return {
                restrict: 'E',
                scope: false,
                templateUrl: 'js/Equalizador/Directives/filtersEqualizador/filtersEqualizador.html',
                link: function (scope, element, attrs) { 

                                                                          },
                controller: ['$q', '$scope', '$rootScope', 'luiDialog', '$translate', function ($q, $scope, $rootScope, luiDialog, $translate) { 
                    $scope._thisapp = $rootScope.APPEQUALIZER || $rootScope._thisCurrentApp;
                    $scope._thisapp.getList("SelectionObject", function (reply) {
                        (reply.qSelectionObject.qSelections.length > 0) ? $scope.NoFiltersSelected = false :  $scope.NoFiltersSelected = true;
                        $scope.notificationfilters = false;

                        $selections = $("#contentFilters");  
                        $selections.html("");  
                        var fields = [];  
                        var fieldssel = 0; 

                        $.each(reply.qSelectionObject.qSelections, function (key, value) {
                            var isOnlyOne = value.qOneAndOnlyOne;

                            if (isOnlyOne !== true) {
                                $scope.notificationfilters = true;
                                var field = value.qField;  
                                var numSelected = value.qSelectedCount;  
                                var total = value.qTotal;  
                                var threshold = value.qSelectionThreshold;  
                                var selectedStr = value.qSelected;  

                                fields.push(field);
                                var fieldssel = fields.length;
                                $(".notificationfilters").html(fieldssel);
                                var html = "";
                                if (numSelected <= threshold) {                                    
                                    html += "<li class='selected-field-container clearfix' id='" + field + "'>";
                                    html += "<span> <div class='row m-0 wrapper'><div class='col-sm-11 col-xs-11 p-0'>";
                                    html += "<span class='label label-info selected-field'>" + field + "</span><p class='selectedelements m-0'>";
                                    html += selectedStr;
                                    html += "</p></div> ";
                                    if (!value.qLocked && !value.qOneAndOnlyOne) {
                                        html += "<div class='col-sm-1 col-xs-1 item-remove p-0'><span class='lui-icon lui-icon--bin clear-field'></span></div>";
                                    }else if(value.qLocked){
                                        html += "<div class='col-sm-1 col-xs-1 item-remove p-0'><span class='lui-icon lui-icon--lock unlock-field'></span></div>";
                                    }

                                    html += "</div></span></li>";
                                    $selections.append(html);
                                }

                                else {
                                    html += "<li class='selected-field-container clearfix' id='" + field + "'>";
                                    html += "<span> <div class='row m-0 wrapper'><div class='col-sm-11 col-xs-11 p-0'>";
                                    html += "<span class='label label-info selected-field'>" + field + "</span><p class='selectedelements m-0'>";
                                    html += numSelected + " de " + total;
                                    html += "</p></div> ";
                                    if (!value.qLocked && !value.qOneAndOnlyOne) {
                                        html += "<div class='col-sm-1 col-xs-1 item-remove p-0'><span class='lui-icon lui-icon--bin clear-field'></span></div>";
                                    }else if(value.qLocked){
                                        html += "<div class='col-sm-1 col-xs-1 item-remove p-0'><span class='lui-icon lui-icon--lock unlock-field'></span></div>";
                                    }

                                    html += "</div></span></li>";
                                    $selections.append(html);
                                }
                            }

                        });

                        $('.clear-field').on('click', function (e) {
                            e.preventDefault();
                            var field = $(this).parents('li').attr("id");
                            $scope.app.field(field).clear();
                        });
                        $('.unlock-field').on('click', function (e) {
                            e.preventDefault();
                            var field = $(this).parents('li').attr("id");
                            $scope.app.field(field).unlock();
                        });


                                            });
                }]
            };
        }]);

});