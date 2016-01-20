var CompaniesCtrl = angular.module('CompaniesCtrl', []);

CompaniesCtrl.controller('CompaniesCtrl', [
	'$scope', 
	'$http',
	'subMenu', 
	'filteredSearch', 
	function (
		$scope, 
		$http,
		subMenu, 
		filteredSearch
	){

/****************************************************************************
VARIABLES
****************************************************************************/

	/* Object to control what's displayed on the screen and what's not */

	$scope.display = {
		form: {
			searchCompany: false,
			sendEmail: false,
			showDetails: false,
			extendContract: false,
			addNewCompany: false
		}
	}

	/* FormData */

	$scope.form = {

		searchCompany: {
			companyName: "",
			managerName: "",
			validContract: true,
			expiredContract: false,
			startingDate: null,
			endingDate: null,
			lastContractOnly: true
		}

	}

	/* Filtered lists while searching forcompanies and managers */

	$scope.filteredListOfCompanies = [];
	$scope.filteredListOfManagers = [];

	/* Master objects */

	var display = angular.copy($scope.display);

/****************************************************************************
FILTER COMPANY/MANAGER NAMES
****************************************************************************/

	function filterCompanyNames(input){
		filteredSearch.filterCompanyNames(input, function(data){
			$scope.filteredListOfCompanies = data;
		})
	};

	function insertCompanyNameToInputField(companyName){
		$scope.form.searchCompany.companyName = companyName;
		$scope.filteredListOfCompanies = [];
	};

	function filterManagerNames(input){
		filteredSearch.filterManagerNames(input, function(data){
			$scope.filteredListOfManagers = data;
		})
	};

	function insertManagerNameToInputField(managerName){
		$scope.form.searchCompany.managerName = managerName;
		$scope.filteredListOfManagers = [];
	};

/****************************************************************************
MENU FUNCTIONS
****************************************************************************/

	function menu(property){
		subMenu.displayContent($scope.display.form, property, function(data){
			$scope.display.form = data;
		})
	};

	function reset(){
		$scope.display = angular.copy(display);
	};

/****************************************************************************
BINDING FUNCTIONS
****************************************************************************/

	$scope.menu = menu;
	$scope.reset = reset;
	$scope.filterListOfCompanyNames = filterCompanyNames;
	$scope.filterListOfManagerNames = filterManagerNames;
	$scope.insertCompanyNameToInputField = insertCompanyNameToInputField;
	$scope.insertManagerNameToInputField = insertManagerNameToInputField;

}]);