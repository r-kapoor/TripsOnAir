routesModule.controller('sarthiController', function($scope, $rootScope, $http, $q) {
	console.log("in sarthiController");
	$scope.isRouteCollapsed=true;
	$scope.submitOrderCollapsed=false;
	$scope.showRoutes=function(){
		$scope.isRouteCollapsed=false;
		$scope.submitOrderCollapsed=true;
	};

});