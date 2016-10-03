angular.module('ModalCtrl', []).controller('ModalCtrl', function($scope, $http, ApiService, ModalService, id, close){

	$scope.close = function(result) {
	    close(result, 500); // close, but give 500ms for bootstrap to animate
	  };

	$scope.model = {};
	$scope.id = id;
	$scope.title = null;
	$scope.description = null;
	$scope.parts = null;
	$scope.examples = null;
	$scope.levels = null;


	(function init(){
		$scope.loadData
	})();


	$scope.loadData = function() {
		ApiService.competence($scope.id, function(err, result){
            $scope.model = result[0];        

	        $scope.id = $scope.model.id;   
	        $scope.title = $scope.model.title.en;   
	        $scope.description = $scope.model.description.en;  
	        $scope.parts = $scope.model.hasLOCpart;
	        $scope.examples = $scope.model.hasExample;
	        $scope.levels = $scope.model.hasDefinedLevel;


	        //hasExample
			ApiService.competence($scope.examples, function(result2){	            
	            $scope.examples = result2;
	        });

	        //hasLOCpart
			ApiService.competence($scope.parts, function(result){	            
	            $scope.parts = result;
	        });


	        //hasDefinedLevel
			ApiService.competence($scope.levels, function(result3){	            
	            $scope.levels = result3;
	        });


        });      
    }();


    function loadAttributes() {
    	getAttributeData($scope.parts);
    	getAttributeData($scope.examples);
    	getAttributeData($scope.levels);		
    };


    function getAttributeData(attribute) {
		ApiService.competence(attribute, function(result){
            attribute = result;
        });
    };


	$scope.getAllCompetences = function() {
        $http({
            method: 'GET',
            url: '/competencies'         
        })
        .success(function(data){
            console.log(data);
            $scope.results = data["@graph"];
        })
        .error(function (error, status){
            $scope.errorURL = error;
        });
    };


    $scope.getLOCParts = function() {
        $http({
            method: 'GET',
            url: '/competencies'         
        })
        .success(function(data){
            console.log(data);
            $scope.results = data["@graph"];
        })
        .error(function (error, status){
            $scope.errorURL = error;
        });
    };
});