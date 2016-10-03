angular.module('SearchCtrl', []).controller('SearchController', function($scope, $http, ApiService, ModalService){

    $scope.formData;
    $scope.query;
    $scope.frameworks;
    $scope.error = null;


    $scope.showModal = function(id) {
        console.log("ID: "+id);

        ModalService.showModal({
          templateUrl: "../../views/modal.html",
          controller: "ModalCtrl",
          inputs: {
            id: id
          }
        }).then(function(modal) {
          modal.element.modal();
          modal.close();
        });
    };



    $scope.getFrameworks = function(){
        ApiService.frameworks(function(results){
            $scope.frameworks = results;
        });
    };
    


    $scope.search = function(){
        ApiService.search($scope.query, function(err, results){
            if(err){
                console.log("error");
                $scope.error = err.error.message;
            }
            $scope.results = results;
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

	
});