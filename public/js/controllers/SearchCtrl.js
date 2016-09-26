angular.module('SearchCtrl', []).controller('SearchController', function($scope, $http, Api){

$scope.formData;
    
    $scope.query;

    $scope.titles = ['Computer Science','Cooking','Karate'];
    $scope.selected = undefined;





    


    $scope.search = function(){
        Api.search($scope.query, function(results){
            $scope.results = results;
        });
    };


    /*
    $scope.search = function(){

        $http({
            method: 'POST',
            url: '/search',
            data: {"query" : $scope.query}         
        })
        .success(function(data){
            console.log(data);
            $scope.results = data.data;
        })
        .error(function (error, status){
            $scope.errorURL = error;
            console.log("error");
        });
    };
    */



    $scope.getAllCompetences = function() {
        $http({
            method: 'GET',
            url: '/competences'         
        })
        .success(function(data){
            console.log(data);
            $scope.results = data;
        })
        .error(function (error, status){
            $scope.errorURL = error;
        });
    };


    $scope.deleteCompetence = function(index) {
        
        var id = $scope.results[index]._id;
        console.log("ID: "+id);

        $http({
            method: 'DELETE',
            url: '/competence/' + id        
        })
        .success(function(data){
            console.log(data);
            $scope.results.splice(index, 1);
            //delete $scope.results = data;
        })
        .error(function (error, status){
            $scope.error = error;
            console.log("LOC not found in DB");
        });
    };
	
});