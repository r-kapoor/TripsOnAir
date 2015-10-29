/**
 * Created by rkapoor on 26/04/15.
 */

(function() {
    angular.module("ngScrollInView", []);

    angular.module("ngScrollInView").directive('scrollView', ['$parse', '$document', '$window', '$rootScope', function ($parse, $document, $window, $rootScope) {
        var _ = $window._;
        var verge = $window.verge;
        var visibleElements = [];
        var refresh = false;
        var lastName = null;
        return {
            restrict: 'A',
            scope: {
                scroll: '&',
                scrollItem: '='
            },
            link: function (scope, element, attrs) {
                var debounced = _.debounce(function() {
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
                $rootScope.$on('newPlace', function onNew(event, name){
                    if(lastName == null || lastName != name){
                        refresh = true;
                        lastName = name;
                    }
                });
                if(refresh){
                    angular.element($document).unbind('scroll');
                    refresh = false;
                    angular.element($document).on('scroll', debounced);
                }
                angular.element($document).on('scroll', debounced);
                if (verge.inViewport(element)) {
                    visibleElements.push(element);
                }

            }
        };
    }]);
}).call(this);

