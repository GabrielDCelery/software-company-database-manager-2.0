
var DatabaseApp = angular.module('DatabaseApp', [
	'ngRoute',
	'ngCookies',
	'checklist-model',
	'AuthCtrl',
	'AuthFactory',
	'CompaniesCtrl',
	'CompaniesFactory',
	'MailingCtrl',
	'MailingFactory',
	'SubMenuFactory',
	'FilteredSearchFactory',
	'FormatDataFactory',
	'AlertsFactory'
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


}]);