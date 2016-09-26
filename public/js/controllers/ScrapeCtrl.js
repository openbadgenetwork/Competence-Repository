angular.module('ScrapeCtrl', []).controller('ScrapeController', function($scope, $http){
	
	$scope.url = "";
    $scope.microdataFields;

    //process Form
    $scope.processForm = function(){
    	$http({
    		method: 'POST',
    		url: '/url',
    		data: {"url" : $scope.url}   		
    	})
    	.success(function(data){
    		console.log(data);
    		$scope.microdataFields = data;
    		$scope.message = data.message;

            //scraper 2 test
            $scope.response = data;
    	})

    	.error(function (error, status){
    		$scope.error = error;
    	});
    };
	
});