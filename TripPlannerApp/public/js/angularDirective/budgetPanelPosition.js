/**
 * Created by rajat on 4/26/2015.
 */

(function() {
    angular.module("ngBudgetPanelPosition", []);

    angular.module("ngBudgetPanelPosition").directive("budgetPanelPosition", [
        function() {
            return {
                restrict: 'A',
                link: function($scope, $elem) {
                    var btnTop = jQuery("#budgetHeadBtn").offset().top;
                    var btnWidth = jQuery("#budgetHeadBtn").width();
                    var btnHeight = jQuery("#budgetHeadBtn").height();
                    var btnLeft = jQuery("#budgetHeadBtn").offset().left;
                    console.log("btnLeft:"+btnLeft);
                    console.log("width:"+btnWidth);
                    console.log("height:"+btnHeight);
                    console.log("elemTop:"+$elem.offset().top);
                    var elemWidth = $elem.outerWidth();
                    //console.log("elemWidth:"+elemWidth);
                    $elem.css({ top: btnTop + btnHeight+'px',right:'0'});
                    //$elem.offset().top = btnTop + btnHeight;
                    jQuery(window).scroll(function() {
                        var currentScroll = jQuery(window).scrollTop();
                        //console.log("currentScroll:"+currentScroll);
                        if (currentScroll > btnHeight) {
                            $elem.css({
                                position: 'fixed',
                                top: '0',
                                right:'0',
                                zIndex:'200',
                                width:elemWidth
                                //left: '0'
                            });
                        } else {
                            $elem.css({ top: btnTop + btnHeight+'px',right:'0'});
                        }
                    });
                }
            };
        }
    ]);

}).call(this);
