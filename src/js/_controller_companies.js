var CompaniesCtrl = angular.module('CompaniesCtrl', []);

CompaniesCtrl.controller('CompaniesCtrl', [
	'$scope', 
	'$http',
	'$window',
	'SubMenu', 
	'FilteredSearch',
	'FormatData',
	'Alerts',
	'Database',
	'DocMaker',
	function (
		$scope, 
		$http,
		$window,
		SubMenu, 
		FilteredSearch,
		FormatData,
		Alerts,
		Database,
		DocMaker
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
			list: false,
			edit: false,
			extend: false
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
		},

		addNewCompany: {
			company_name: "",
			starting_date: new Date(),
			ending_date: new Date(),
			company_phone: "",
			company_email: "",
			invoice_number: "",
			service_provider: "Zeller és Zeller Kft.",
			transfer_date: new Date(),
			invoice_date: new Date(),
			payment_method: "",
			account_number: "",
			price_of_serv_num: 0,
			price_of_serv_let: "",
			company_address: "",
			company_register_id: "",
			company_tax_id: "",
			postal_number: "",
			postal_service: "nem",
			postal_name: "",
			postal_address: "",
			manager_name: "",
			manager_status: "ügyvezető",
			manager_id: "",
			manager_mother_name: "",
			manager_address: "",
			document_holder: "",
			document_holder_address: "",
		}

	}

	/* Filtered lists while searching forcompanies and managers */

	$scope.filteredListOfCompanies = [];
	$scope.filteredListOfManagers = [];

	/* Short list of companies */

	$scope.companyDataList = [];
	$scope.sortField = 'company_name';
	$scope.reverseSortField = false;

	/* Detailed companies info */

	$scope.companyDataEdit = [];
	$scope.companyDataExtend = [];

	/* Object holding the information of checkboxes */
	$scope.selectedCompanies = {
		id: [],
		allChecked: false
	}

	/* Master objects */

	var display = angular.copy($scope.display);
	$scope.companyDataEditMaster = [];
	$scope.companyDataExtendMaster = [];

/****************************************************************************
ENCAPSULATED FUNCTIONS
****************************************************************************/

	function displayCompanyDataList(){
		$scope.filteredListOfCompanies = [];
		$scope.filteredListOfManagers = [];
		$scope.selectedCompanies.id = [];
		$scope.selectedCompanies.allChecked = false;
		$scope.display.form.searchCompany = false;
		$scope.display.form.sendEmail = false;
		$scope.display.form.showDetails = false;
		$scope.display.form.extendContract = false;
		$scope.display.form.addNewCompany = false;
		$scope.display.data.list = true;
		$scope.display.data.edit = false;
		$scope.display.data.extend = false;
	}

	function displayCompanyDataEdit(){
		$scope.display.form.searchCompany = false;
		$scope.display.form.sendEmail = false;
		$scope.display.form.showDetails = false;
		$scope.display.form.extendContract = false;
		$scope.display.form.addNewCompany = false;
		$scope.display.data.list = false;
		$scope.display.data.edit = true;
		$scope.display.data.extend = false;
	}

	function displayCompanyDataExtend(){
		$scope.display.form.searchCompany = false;
		$scope.display.form.sendEmail = false;
		$scope.display.form.showDetails = false;
		$scope.display.form.extendContract = false;
		$scope.display.form.addNewCompany = false;
		$scope.display.data.list = false;
		$scope.display.data.edit = false;
		$scope.display.data.extend = true;
	}

	function getDetailedFormattedCompanyData(callback){
		Alerts.isAnythingSelected($scope.selectedCompanies.id, function(data){
			Database.getDetailedCompaniesData(data, function(response){
				var dataObject = new FormatData.DataObject(response);
				dataObject.addColourCoding().formatPostalServiceToString().formatDateCorrectly();
				callback(dataObject.data);
			})
		})	
	}

	function formatCompanyDetailedDataForDatabase(data, callback){
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

	function formGetCompanyDataList(searchParams){
		Database.getShortCompaniesData(searchParams, function(response){
			var dataObject = new FormatData.DataObject(response);
			dataObject.addColourCoding();
			$scope.companyDataList = dataObject.data;
			displayCompanyDataList();
		})
	}

/****************************************************************************
FORM / EDIT
****************************************************************************/

	/* Get detailed companies data */

	function formGetCompanyDataEdit(){
		getDetailedFormattedCompanyData(function(data){
			$scope.companyDataEdit = data;
			$scope.companyDataEditMaster = angular.copy($scope.companyDataEdit);
			displayCompanyDataEdit();
		})
	}

	/* Overwrite detailed company information */

	function overwriteCompanyData(data){
		formatCompanyDetailedDataForDatabase(data, function(data){
			Database.overWriteCompanyData(data, function(response){
				Alerts.checkSuccess(response);
				formGetCompanyDataEdit();
			})
		})	
	}

	function resetFormCompanyDataEdit(){
		$scope.companyDataEdit = angular.copy($scope.companyDataEditMaster);
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
					formGetCompanyDataList($scope.form.searchCompany);
				})
			})
		})
	}

	function formGetCompanyDataExtend(){
		getDetailedFormattedCompanyData(function(data){
			$scope.companyDataExtend = data;
			$scope.companyDataExtendMaster = angular.copy($scope.companyDataExtend);
			displayCompanyDataExtend();
		})
	}

	function addExtendedContract(data){
		formatCompanyDetailedDataForDatabase(data, function(data){
			Database.extendContract(data, function(response){
				Alerts.checkSuccess(response);
				formGetCompanyDataList($scope.form.searchCompany);
			})
		})
	}

	function resetFormCompanyDataExtend(){
		$scope.companyDataExtend = angular.copy($scope.companyDataExtendMaster);
	}

/****************************************************************************
FORM / ADDNEW
****************************************************************************/	

	function addNewCompany(data){
		formatCompanyDetailedDataForDatabase(data, function(data){
			Database.addNewCompany(data, function(response){
				Alerts.checkSuccess(response);
			})
		})
	}

/****************************************************************************
DOCUMENT FUNCTIONS
****************************************************************************/

	function docCreateCover(input){
		DocMaker.createCover(input, function(){
			window.location.replace('cover.docx');
		})
	}

	function docCreateContract(input){
		DocMaker.createContract(input, function(){
			window.location.replace('contract.docx');
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
	$scope.formGetCompanyDataList = formGetCompanyDataList;
	$scope.formGetCompanyDataEdit = formGetCompanyDataEdit;
	$scope.overwriteCompanyData = overwriteCompanyData;
	$scope.formChangeContractStatus = formChangeContractStatus;
	$scope.formGetCompanyDataExtend = formGetCompanyDataExtend;
	$scope.addExtendedContract = addExtendedContract;
	$scope.addNewCompany = addNewCompany;
	$scope.displayCompanyDataList = displayCompanyDataList;
	$scope.resetFormCompanyDataEdit = resetFormCompanyDataEdit;
	$scope.resetFormCompanyDataExtend = resetFormCompanyDataExtend;
	$scope.docCreateCover = docCreateCover;
	$scope.docCreateContract = docCreateContract;

}]);