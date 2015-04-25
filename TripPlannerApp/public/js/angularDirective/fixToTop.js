/**
 * Created by rajat on 4/26/2015.
 */

(function() {
    angular.module("ngFixToTop", []);

    angular.module("ngFixToTop").directive("fixTop", [
         function() {
            return {
                restrict: 'A',
                link: function($scope, $elem) {
                    var fixmeTop = $elem.offset().top;
                    var width = $elem.width();
                    jQuery(window).scroll(function() {
                        var currentScroll = jQuery(window).scrollTop();
                        if (currentScroll >= fixmeTop) {
                            $elem.css({
                                position: 'fixed',
                                top: '0',
                                zIndex:'200',
                                width:width
                            //left: '0'
                            });
                        } else {
                            $elem.css({
                                position: 'static'
                            });
                        }
                    });
                }
            };
         }
    ]);

}).call(this);
