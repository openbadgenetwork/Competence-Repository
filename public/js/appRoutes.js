angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

	$routeProvider

		.when('/home', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

	    .when('/search', {
	        templateUrl: 'views/search.html',
	        controller: 'SearchController'
	    })

		.when('/about', {
			templateUrl: 'views/about.html'
		})

		.when('/url', {
			templateUrl: 'views/url.html',
			controller: 'ScrapeController'
		})

	    .when('/form', {
	        templateUrl: 'views/form.html',
	        controller: 'FormController'
	    });

    $locationProvider.html5Mode(true);

}]);