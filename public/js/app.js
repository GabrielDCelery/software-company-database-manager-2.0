
var DatabaseApp = angular.module('DatabaseApp', [
	'ngRoute',
	'ngCookies',
	'AuthCtrl',
	'AuthFactory',
	'CompaniesCtrl',
	'CompaniesFactory',
	'MailingCtrl',
	'MailingFactory'
]);

DatabaseApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

	$routeProvider
	.when('/companies', {
		templateUrl: 'templates/_companies_main.html',
		controller: 'CompaniesCtrl'
	})
	.when('/mailing', {
		templateUrl: 'templates/_mailing_main.html',
		controller: 'MailingCtrl'
	})
	.otherwise({
		redirectTo: '/'
	})

	$locationProvider.html5Mode(true);

}]);

var AuthCtrl = angular.module('AuthCtrl', []);

AuthCtrl.controller('AuthCtrl', ['$scope', 'AuthFactory', function ($scope, AuthFactory){

/****************************************************************************
VARIABLES
****************************************************************************/

	$scope.loggedIn = false;

/****************************************************************************
FUNCTIONS
****************************************************************************/

	function loginUser(username, password){
		AuthFactory.login(username, password, function (response){

			if(response.data){

				$scope.loggedIn = true;
				AuthFactory.setLoginCookie(username, password);

			} else {

				$scope.loggedIn = false;

			}

		});
	}

	function logoutUser(){
		$scope.loggedIn = false;
		AuthFactory.clearLoginCookie();
	}

	function loginWithCookie(callback){

		AuthFactory.getLoginCookie(callback)

	}

/****************************************************************************
CONTROLLER RELATED FUNCTIONS
****************************************************************************/

	$scope.login = loginUser;
	$scope.logout = logoutUser;

/****************************************************************************
INVOKED FUNCTION UPON LOADING
****************************************************************************/

	loginWithCookie(loginUser)

}]);


var AuthFactory = angular.module('AuthFactory', []);

AuthFactory.factory('AuthFactory', ['$http', '$cookies', function ($http, $cookies){

	function login(username, password, callback){
		$http.post('php/login.php', {username: username, password: password}).success(callback);
	}

	function setLoginCookie(username, password){
		var authUsername = Base64.encode(username);
		var authPassword = Base64.encode(password);

		var user = {
			username: authUsername,
			password: authPassword
		}

		$cookies.putObject('userCookie', user);
	}

	function clearLoginCookie(){
		$cookies.remove('userCookie');
	}

	function getLoginCookie(callback){
		var authCookie = $cookies.getObject('userCookie');
		if(authCookie){
			var username = Base64.decode(authCookie.username);
			var password = Base64.decode(authCookie.password);

			callback(username, password);
		}
	}

	// Base64 encoding service used by AuthenticationService
	var Base64 = {

		keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

		encode: function (input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			do {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(chr2)) {
				    enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
				    enc4 = 64;
				}

				output = output +
					this.keyStr.charAt(enc1) +
					this.keyStr.charAt(enc2) +
					this.keyStr.charAt(enc3) +
					this.keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode: function (input) {
			var output = "";
			var chr1, chr2, chr3 = "";
			var enc1, enc2, enc3, enc4 = "";
			var i = 0;

			// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			var base64test = /[^A-Za-z0-9\+\/\=]/g;
			if (base64test.exec(input)) {
			    window.alert("There were invalid base64 characters in the input text.\n" +
			        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
			        "Expect errors in decoding.");
			}
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			do {
				enc1 = this.keyStr.indexOf(input.charAt(i++));
				enc2 = this.keyStr.indexOf(input.charAt(i++));
				enc3 = this.keyStr.indexOf(input.charAt(i++));
				enc4 = this.keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
				    output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
				    output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";

			} while (i < input.length);

			return output;
		}
	};


	return {
		login: login,
		setLoginCookie: setLoginCookie,
		clearLoginCookie: clearLoginCookie,
		getLoginCookie: getLoginCookie
	}


}]);


var CompaniesCtrl = angular.module('CompaniesCtrl', []);

CompaniesCtrl.controller('CompaniesCtrl', ['$scope', function ($scope){

}]);
var CompaniesFactory = angular.module('CompaniesFactory', []);

CompaniesFactory.factory('CompaniesFactory', ['$http', function ($http){

}]);
var MailingCtrl = angular.module('MailingCtrl', []);

MailingCtrl.controller('MailingCtrl', ['$scope', function ($scope){

}]);
var MailingFactory = angular.module('MailingFactory', []);

MailingFactory.factory('MailingFactory', ['$http', function ($http){

}]);