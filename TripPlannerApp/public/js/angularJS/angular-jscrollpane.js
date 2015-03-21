(function() {
    angular.module("ngJScrollPane", []);

    angular.module("ngJScrollPane").directive("scrollPane", [
        '$timeout', function($timeout) {
            return {
                restrict: 'A',
                transclude: true,
                template: '<div class="scroll-pane"><div id="transclude" ng-transclude></div></div>',
                link: function($scope, $elem, $attrs) {
                    var config, fn;
                    config = {};
                    if ($attrs.scrollConfig) {
                        config = $scope.$eval($attrs.scrollConfig);
                    }
                    $scope.$on("initialize-pane",function(event,id){
                        console.log("initialize-pane:"+id);
                        jQuery("#" + id).jScrollPane(config);
                        return $scope.pane = jQuery("#" + id).data("jsp");
                    });
                    // fn = function() {
                    //    jQuery("#" + $attrs.id).jScrollPane(config);
                    //    return $scope.pane = jQuery("#" + $attrs.id).data("jsp");
                    // };
                    // if ($attrs.scrollTimeout) {
                    //   $timeout(fn, $scope.$eval($attrs.scrollTimeout));
                    // } else {
                    //   fn();
                    // }
                    return $scope.$on("reinit-pane", function(event, id) {
                        if (id === $attrs.id && $scope.pane) {
                            console.log("Reinit pane " + id);
                            settings ={
                                verticalDragMinHeight: 10
                            };
                            $scope.pane.reinitialise(settings);
                            $scope.pane.scrollToBottom(true);
                        }
                    });
                },
                replace: true
            };
        }
    ]);

}).call(this);
