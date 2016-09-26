angular.module('FormCtrl', []).controller('FormController', function($scope, $http){
	$scope.formData = {
        locType: "locstructure"
    };
    $scope.locs = [{
        locType: "locdefinition",
        title: "Title 1",
        description: "Description 1"
    }];
    $scope.locs2 = [{id: 'loc 1'}];


    //process Form
    $scope.processForm = function(){
        $http({
            method: 'POST',
            url: '/competence',
            data: {"locType" : $scope.formData.locType,
                   "title" : $scope.formData.title,
                   "description" : $scope.formData.description,
                   "children" : $scope.locs                    
            }          
        })
        .success(function(data){
            console.log(data);
            $scope.formData = {
                locType: "locstructure"
            };

            $scope.message = data.message;
        })

        .error(function (error, status){
            $scope.errorURL = error;
        });
    };


    $scope.addLOC = function(){
        var newItemNo = $scope.locs.length+1;
        $scope.locs.push({'id':'loc '+newItemNo});
    };

    $scope.removeChoice = function(index){
        var lastItem = $scope.locs.length-1;
        $scope.locs.splice(index, 1);
    };
});