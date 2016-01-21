var CompaniesCtrl = angular.module('CompaniesCtrl', []);

CompaniesCtrl.controller('CompaniesCtrl', [
	'$scope', 
	'$http',
	'SubMenu', 
	'FilteredSearch',
	'FormatData',
	'Alerts',
	'Database',
	function (
		$scope, 
		$http,
		SubMenu, 
		FilteredSearch,
		FormatData,
		Alerts,
		Database
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
		},

		data: {
			short: true,
			detailed: true
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

	$scope.companiesDetailedEdit = [];
	$scope.companiesDetailedExtend = [];

	/* Object holding the information of checkboxes */
	$scope.selectedCompanies = {
		id: [],
		allChecked: false
	}

	/* Master objects */

	var display = angular.copy($scope.display);

/****************************************************************************
ENCAPSULATED FUNCTIONS
****************************************************************************/

	function getDetailedFormattedCompaniesData(callback){
		Alerts.isAnythingSelected($scope.selectedCompanies.id, function(data){
			Database.getDetailedCompaniesData(data, function(response){
				var dataObject = new FormatData.DataObject(response);
				dataObject.addColourCoding().formatPostalServiceToString().formatDateCorrectly();
				callback(dataObject.data);
			})
		})	
	}

	function formatCompaniesDetailedDataForDatabase(data, callback){
		var array = [];
		array.push(data);
		var dataObject = new FormatData.DataObject(array);
		dataObject.formatPostalServiceToBoolean();
		callback(dataObject.data);
	}

/****************************************************************************
FORM / SEARCH / FILTER COMPANY/MANAGER NAMES
****************************************************************************/

	function filterCompanyNames(input){
		FilteredSearch.filterCompanyNames(input, function(data){
			$scope.filteredListOfCompanies = data;
		})
	};

	function insertCompanyNameToInputField(companyName){
		$scope.form.searchCompany.companyName = companyName;
		$scope.filteredListOfCompanies = [];
	};

	function filterManagerNames(input){
		FilteredSearch.filterManagerNames(input, function(data){
			$scope.filteredListOfManagers = data;
		})
	};

	function insertManagerNameToInputField(managerName){
		$scope.form.searchCompany.managerName = managerName;
		$scope.filteredListOfManagers = [];
	};


/****************************************************************************
FORM / SEARCH
****************************************************************************/

	function formSearchCompaniesShortList(searchParams){

		$scope.filteredListOfCompanies = [];
		$scope.filteredListOfManagers = [];
		
		Database.getShortCompaniesData(searchParams, function(response){
			var dataObject = new FormatData.DataObject(response);
			dataObject.addColourCoding();
			$scope.companiesShortList = dataObject.data;
		})

	}

/****************************************************************************
FORM / DETAILS
****************************************************************************/

	/* Get detailed companies data */

	function formGetDetailedCompaniesData(){

		getDetailedFormattedCompaniesData(function(data){
			$scope.companiesDetailedEdit = data;
		})

	}

	/* Overwrite detailed company information */

	function overwriteCompanyData(data){

		formatCompaniesDetailedDataForDatabase(data, function(data){

			Database.overWriteCompanyData(data, function(response){

				Alerts.checkSuccess(response);
				formGetDetailedCompaniesData();

			})
		})
	
	}


/****************************************************************************
FORM / EXTEND
****************************************************************************/

	function formChangeContractStatus(){
		Alerts.isAnythingSelected($scope.selectedCompanies.id, function(data){
			Alerts.confirmChange(data, function(data){
				Database.changeContractStatus(data, function(response){
					Alerts.checkSuccess(response);
					if(!($scope.form.searchCompany.validContract && $scope.form.searchCompany.expiredContract)){
						$scope.form.searchCompany.validContract = !$scope.form.searchCompany.validContract;
						$scope.form.searchCompany.expiredContract = !$scope.form.searchCompany.expiredContract;
					}
					formSearchCompaniesShortList($scope.form.searchCompany);
				})
			})
		})
	}

	function formExtendContract(){
		getDetailedFormattedCompaniesData(function(data){
			$scope.companiesDetailedExtend = data;
		})
	}


	function addExtendedContract(data){
		formatCompaniesDetailedDataForDatabase(data, function(data){
			Database.extendContract(data, function(response){
				Alerts.checkSuccess(response);
			})
		})
	}

/****************************************************************************
MENU / FUNCTIONS
****************************************************************************/

	function menu(property){
		SubMenu.displayContent($scope.display.form, property, function(data){
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
	$scope.formGetDetailedCompaniesData = formGetDetailedCompaniesData;
	$scope.overwriteCompanyData = overwriteCompanyData;
	$scope.formChangeContractStatus = formChangeContractStatus;
	$scope.formExtendContract = formExtendContract;
	$scope.addExtendedContract = addExtendedContract;

}]);