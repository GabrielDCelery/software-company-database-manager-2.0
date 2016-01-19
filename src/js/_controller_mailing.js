var MailingCtrl = angular.module('MailingCtrl', []);

MailingCtrl.controller('MailingCtrl', ['$scope', 'subMenu', function ($scope, subMenu){

/****************************************************************************
VARIABLES
****************************************************************************/

	$scope.display = {
		form: {
			searchMails: false,
			forwardMails: false,
			editMails: false,
			addNewMails: false
		}
	}

	/* Master objects */

	var display = angular.copy($scope.display);

/****************************************************************************
FUNCTIONS
****************************************************************************/

	function menu(property){
		subMenu.displayContent($scope.display.form, property, function(data){
			$scope.display.form = data;
		})
	}

	function reset(){
		$scope.display = angular.copy(display);
	}

/****************************************************************************
BINDING FUNCTIONS
****************************************************************************/

	$scope.menu = menu;
	$scope.reset = reset;




}]);