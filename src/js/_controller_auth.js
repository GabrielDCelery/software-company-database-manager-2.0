
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
