angular.module('ScrapeCtrl', []).controller('ScrapeController', function($scope, $http){
	
	$scope.url = null;
    $scope.message = null;
    $scope.error = null;

    //process Form
    $scope.submitURL = function(){
        console.log("url" + $scope.url);
    	$http({
    		method: 'POST',
    		url: '/submit',
    		data: {"url" : $scope.url}   		
    	})
    	.success(function(data){
    		console.log(data);
    		$scope.microdataFields = data;
    		$scope.message = data.message;

    	})
    	.error(function (error, status){
    		$scope.error = error.error.message;
    	});
    };
	
});