/**
 * Created by rajat on 4/28/2015.
 */

(function() {
    angular.module("ngRestrictInput", []);

    angular.module("ngRestrictInput").directive('restrict',
        function($parse) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, iElement, iAttrs, controller) {
                    scope.$watch(iAttrs.ngModel, function(value) {
                        if (!value) {
                            return;
                        }
                        if(parseInt(value)>15)
                        {
                            $parse(iAttrs.ngModel).assign(scope,value.substring(0,value.length-1));
                            return;
                        }
                        if(parseInt(value)==0)
                        {
                            $parse(iAttrs.ngModel).assign(scope,"");
                            return;
                        }
                        $parse(iAttrs.ngModel).assign(scope, value.toLowerCase().replace(new RegExp(iAttrs.restrict, 'g'), ''));
                    });
                }
            };
        }
    );

}).call(this);
