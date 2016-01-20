var CompaniesCtrl = angular.module('CompaniesCtrl', []);

CompaniesCtrl.controller('CompaniesCtrl', [
	'$scope', 
	'$http',
	'subMenu', 
	'filteredSearch',
	'CompaniesFunctions',
	function (
		$scope, 
		$http,
		subMenu, 
		filteredSearch,
		CompaniesFunctions
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

	/* Short list of companies */

	$scope.companiesShortList = [];
	$scope.sortField = 'company_name';
	$scope.reverseSortField = false;

	/* Detailed companies info */

	$scope.companiesDetailed = [];

	/* Object holding the information of checkboxes */
	$scope.selectedCompanies = {
		id: [],
		allChecked: false
	}

	/* Master objects */

	var display = angular.copy($scope.display);

/****************************************************************************
FORM / SEARCH / FILTER COMPANY/MANAGER NAMES
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
FORM / SEARCH / SEARCH COMPANIES SHORT LIST
****************************************************************************/

	function formSearchCompaniesShortList(){

		$scope.filteredListOfCompanies = [];
		$scope.filteredListOfManagers = [];
		
		var data = $scope.form.searchCompany;

		CompaniesFunctions.getCompanies(data, function(response){
			var dataObject = new CompaniesFunctions.DataFormatter(response);
			dataObject.addColourCoding();
			$scope.companiesShortList = dataObject.data;
		})

	}

/****************************************************************************
MENU / FUNCTIONS
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
	$scope.formSearchCompaniesShortList = formSearchCompaniesShortList;

}]);