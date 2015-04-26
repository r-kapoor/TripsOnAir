/**
 * Created by rkapoor on 26/04/15.
 */

(function() {
    angular.module("ngScrollInView", []);

    angular.module("ngScrollInView").directive('scrollView', function ($parse, $document, $window) {
        var _ = $window._;
        var verge = $window.verge;
        var visibleElements = [];
        return {
            restrict: 'A',
            scope: {
                scroll: '&',
                scrollItem: '='
            },
            link: function (scope, element, attrs) {
                var debounced = _.debounce(function() {
                    // You might need a different test,
                    // perhaps including the height of the element,
                    // or using verge "rectangle" function
                    var visible = verge.inViewport(element);
                    var index = visibleElements.indexOf(scope.scrollItem);
                    var previouslyVisible = (index != -1);
                    if (visible && !previouslyVisible) {
                        visibleElements.push(scope.scrollItem);
                        scope.$apply(function() {
                            scope.scroll({item:scope.scrollItem});
                        });
                    }
                    if (!visible && previouslyVisible) {
                        visibleElements.splice(index, 1);
                    }
                }, 10);
                angular.element($document).on('scroll', debounced);
                if (verge.inViewport(element)) {
                    visibleElements.push(element);
                }

            }
        };
    });
}).call(this);

