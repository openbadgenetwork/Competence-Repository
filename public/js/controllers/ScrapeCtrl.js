angular.module('ScrapeCtrl', []).controller('ScrapeController', function($scope, $http, ApiService){
	
	$scope.url = null;
    $scope.message = null;
    $scope.error = null;


    //Submit URL
    $scope.submitURL = function(){
        ApiService.submitURL($scope.url, function(err, result){
            if(err){
                $scope.error = err.error.message;
            }
            $scope.message = result.message;
        });
    };	
});