
var DatabaseApp = angular.module('DatabaseApp', [
	'ngRoute',
	'ngCookies',
	'AuthCtrl',
	'AuthFactory',
	'CompaniesCtrl',
	'CompaniesFactory',
	'MailingCtrl',
	'MailingFactory',
	'SubMenuFactory',
	'FilteredSearchFactory'
]);

DatabaseApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

	$routeProvider
	.when('/companies', {
		templateUrl: 'templates/companies/_companies_main.html',
		controller: 'CompaniesCtrl'
	})
	.when('/mailing', {
		templateUrl: 'templates/mailing/_mailing_main.html',
		controller: 'MailingCtrl'
	})
	.otherwise({
		redirectTo: '/'
	})

	$locationProvider.html5Mode(true);

}]);