
var App = angular.module('repoApp', ['ngRoute','ui.tree']);


App.config(function($routeProvider, $locationProvider){
	$routeProvider

	.when('/home', {
		templateUrl: 'pages/home.html',
		controller: 'mainController'
	})

    .when('/search', {
        templateUrl: 'pages/search.html',
        controller: 'searchController'
    })

	.when('/about', {
		templateUrl: 'pages/about.html',
		controller: 'aboutController'
	})

	.when('/url', {
		templateUrl: 'pages/url.html',
		controller: 'urlController'
	})

    .when('/form', {
        templateUrl: 'pages/form.html',
        controller: 'formController'
    });

})


App.controller('mainController', function($scope){
	$scope.message = 'Main Page';
});





App.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

App.controller('contactController', function($scope) {
    //$scope.message = 'Contact us! JK. This is just a demo.';
});


App.controller('searchController', function($scope, $http){
    $scope.formData;
    $scope.results;
    $scope.query;

    $scope.titles = ['Computer Science','Cooking','Karate'];
    $scope.selected = undefined;


    $scope.search = function(){

        $http({
            method: 'POST',
            url: '/search',
            data: {"query" : $scope.query}         
        })
        .success(function(data){
            console.log(data);
            $scope.results = data;
        })
        .error(function (error, status){
            $scope.errorURL = error;
            console.log("error");
        });
    };



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


    $scope.deleteCompetence = function(id) {
        console.log(id);

        $http({
            method: 'DELETE',
            url: '/competence/' + id        
        })
        .success(function(data){
            console.log(data);
            //delete $scope.results = data;
        })
        .error(function (error, status){
            $scope.error = error;
            console.log("LOC not found in DB");
        });
    };

    
});


App.controller('formController', function($scope, $http) {
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


App.controller('urlController', function($scope, $http) {
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



App.controller('formController2', function($scope){
    $scope.formData = {};

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

            
        })

        .error(function (error, status){
            $scope.error = error;
        });
    };

});




App.controller('MicrodataCtrl', function($scope, $http){
	$http.get('microdata.json')
		.then(function(res){
			$scope.microdataFields = res.data;
		});
});

