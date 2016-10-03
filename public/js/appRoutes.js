angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

	$routeProvider

		.when('/home', {
			templateUrl: 'views/home.html'
		})

	    .when('/search', {
	        templateUrl: 'views/search.html',
	        controller: 'SearchController'
	    })

		.when('/url', {
			templateUrl: 'views/url.html',
			controller: 'ScrapeController'
		})

		.when('/test', {
			templateUrl: 'views/test.html',
			controller: 'TestController'
		});

    $locationProvider.html5Mode(true);

}]);