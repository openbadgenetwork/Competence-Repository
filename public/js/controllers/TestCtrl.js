angular.module('TestCtrl', []).controller('TestController', function($scope, $http, ApiService){
	
	$scope.url = null;
    $scope.message = null;
    $scope.error = null;

    //Clear Database
    $scope.clearDB = function(){
        ApiService.clearDB(function(err, result){
            if(err){
                $scope.error = err.error.message;
            }
            $scope.message = data.message;
        });
    };


    //Clear Database
    $scope.fillDB = function(){
        ApiService.fillDB(function(err, result){
            if(err){
                $scope.error = err.error.message;
            }
            $scope.message = data.message;
        });
    };	
});