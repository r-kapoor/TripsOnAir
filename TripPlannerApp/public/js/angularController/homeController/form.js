angular.module('scrollLoad', []).directive('whenScrolled', function($document,$window,$rootScope) {
    return function(scope, elm, attr) {
        var raw = elm[0];
        $document.bind('scroll', function() {
            //console.log(raw.scrollTop+":"+$document[0].body.scrollTop +"+"+ $window.innerHeight +">="+ 0.9 * $document[0].body.offsetHeight);
            if(raw.scrollTop + $window.innerHeight >= 0.9 * $document[0].body.offsetHeight ||
                $document[0].body.scrollTop + $window.innerHeight >= 0.9 * $document[0].body.offsetHeight) {
                $rootScope.$emit('scrolled');
            }
        });
    };
});

var inputModule = angular.module('tripdetails.input.app', ['ui.bootstrap','ngSlider','scrollLoad','ngJScrollPane','ngRestrictInput','duScroll']);

inputModule.controller('form1Controller',  function($scope, $rootScope) {
    $scope.title='Plan your Trip';
    $scope.todos = [
      {text:'learn angular', done:true},
      {text:'build an angular app', done:false}];

    $scope.addTodo = function() {
      $scope.todos.push({text:$scope.todoText, done:false});
      $scope.todoText = '';
    };

    $scope.isFormPanelCollapsed = false;

    $scope.remaining = function() {
      var count = 0;
      angular.forEach($scope.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };

    $scope.archive = function() {
      var oldTodos = $scope.todos;
      $scope.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) $scope.todos.push(todo);
      });
    };

    $rootScope.$on('suggest', function collapseEvents(event, data) {
        $scope.isFormPanelCollapsed = true;
    })
  });

function Main($scope) {
    $scope.items = [];

    var counter = 0;
    $scope.loadMore = function() {console.log('load more!!');
    };

    $scope.loadMore();
}
