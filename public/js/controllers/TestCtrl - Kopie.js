angular.module('TestCtrl', []).controller('TestController', function($scope, $http){
	
	$scope.url = null;
    $scope.message = null;
    $scope.error = null;

    //Clear Database
    $scope.clearDB = function(){
    	$http({
    		method: 'DELETE',
    		url: '/competencies'		
    	})
    	.success(function(data){
    		console.log(data);
    		$scope.message = data.message;

    	})
    	.error(function (error, status){
    		$scope.error = error.error.message;
    	});
    };



    //Clear Database
    $scope.fillDB = function(){
        $http({
            method: 'GET',
            url: '/submit/test'        
        })
        .success(function(data){
            console.log(data);
            $scope.message = data.message;

        })
        .error(function (error, status){
            $scope.error = error.error.message;
        });
    };
	
});