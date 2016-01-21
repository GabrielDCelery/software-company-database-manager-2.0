
var DatabaseApp = angular.module('DatabaseApp', [
	'ngRoute',
	'ngCookies',
	'checklist-model',
	'AuthCtrl',
	'AuthFactory',
	'CompaniesCtrl',
	'DatabaseFactory',
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
FORM / ADDNEW
****************************************************************************/	

	function addNewCompany(data){
		formatCompaniesDetailedDataForDatabase(data, function(data){
			Database.addNewCompany(data, function(response){
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
	$scope.addNewCompany = addNewCompany;

}]);
var DatabaseFactory = angular.module('DatabaseFactory', []);

DatabaseFactory.factory('Database', ['$http', function ($http){

	function getShortCompaniesData(data, callback){
		$http.post('php/companies/form_search_companies.php', data).success(function(data){
			callback(data);
		});
	}

	function getDetailedCompaniesData(data, callback){
		$http.post('php/companies/form_companies_detailed.php', data).success(function(data){
			callback(data);
		});
	}

	function overWriteCompanyData(data, callback){
		$http.post('php/companies/form_companies_overwrite_company_data.php', data).success(function(data){
			callback(data);
		});
	}

	function changeContractStatus(data, callback){
		$http.post('php/companies/form_companies_change_contract_status.php', data).success(function(data){
			callback(data);
		});
	}

	function extendContract(data, callback){
		$http.post('php/companies/form_companies_extend_contract.php', data).success(function(data){
			callback(data);
		});
	}

	function addNewCompany(data, callback){
		$http.post('php/companies/form_companies_add_new_company.php', data).success(function(data){
			callback(data);
		});	
	}

	return {
		getShortCompaniesData: getShortCompaniesData,
		getDetailedCompaniesData: getDetailedCompaniesData,
		overWriteCompanyData: overWriteCompanyData,
		changeContractStatus: changeContractStatus,
		extendContract: extendContract,
		addNewCompany: addNewCompany
	}


}]);
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
var MailingFactory = angular.module('MailingFactory', []);

MailingFactory.factory('MailingFactory', ['$http', function ($http){

}]);
var SubMenuFactory = angular.module('SubMenuFactory', []);

SubMenuFactory.factory('SubMenu', [function (){

	function displayContent(object, propertyName, callback){
		for(var key in object){
			if(key == propertyName){
				object[key] = true;
			} else {
				object[key] = false;
			}
		}
		callback(object)
	}

	return {
		displayContent: displayContent
	}


}]);
var FilteredSearchFactory = angular.module('FilteredSearchFactory', []);

FilteredSearchFactory.factory('FilteredSearch', ['$http', function ($http){

	var cachedCompanies;
	var cachedManagers;

	function getCompanies(callback){
		if(cachedCompanies){
			callback(cachedCompanies);
		} else {
			$http.get('php/companies/fetch_company_names.php').success(function(data){
				cachedCompanies = data;
				callback(data);
			});
		}
	}

	function getManagers(callback){
		if(cachedManagers){
			callback(cachedManagers);
		} else {
			$http.get('php/companies/fetch_manager_names.php').success(function(data){
				cachedManagers = data;
				callback(data);
			});
		}
	}

	function filter(input, arrayOfNames){
		var listOfNames = arrayOfNames;
		var filteredListOfNames = [];
		if(input.length !==0){
			for(var i = 0; i < listOfNames.length; i++){
				if(listOfNames[i].substring(0, input.length).toLowerCase() === input.toLowerCase()){
					filteredListOfNames.push(listOfNames[i]);
				}
			}
		}
		return filteredListOfNames;
	}

	function filterCompanyNames(input, callback){
		getCompanies(function (data){
			callback(filter(input, data));
		});
	}

	function filterManagerNames(input, callback){
		getManagers(function (data){
			callback(filter(input, data));
		});
	}

	return {
		filterCompanyNames: filterCompanyNames,
		filterManagerNames: filterManagerNames
	}


}]);
var FormatDataFactory = angular.module('FormatDataFactory', []);

FormatDataFactory.factory('FormatData', [function (){

	function convertDate(stringDate){
		var outputDate = new Date(stringDate);
		return outputDate;
	}

	function DataObject(data){
		this.data = data;
	}

	DataObject.prototype.addColourCoding = function(){
		this.data.map(function(obj){
			if (obj.contract_status == true && (obj.postal_number == "" || obj.postal_number == null)){
				obj.css_color = "yellow";
			} else if (obj.contract_status == true){
				obj.css_color = "green";
			} else {
				obj.css_color = "red";
			}
		})
		return this;
	}

	DataObject.prototype.formatDateCorrectly = function(){
		this.data.map(function(obj){
			if(obj.starting_date == "1970-01-01" || obj.starting_date == "0000-00-00" || obj.starting_date == null){
				obj.starting_date = null;
			} else {
				obj.starting_date = convertDate(obj.starting_date);
			}
			if(obj.ending_date == "1970-01-01" || obj.ending_date == "0000-00-00" || obj.ending_date == null){
				obj.ending_date = null;
			} else {
				obj.ending_date = convertDate(obj.ending_date);
			}
			if(obj.transfer_date == "1970-01-01" || obj.transfer_date == "0000-00-00" || obj.transfer_date == null){
				obj.transfer_date = null;
			} else {
				obj.transfer_date = convertDate(obj.transfer_date);
			}
			if(obj.invoice_date == "1970-01-01" || obj.invoice_date == "0000-00-00" || obj.invoice_date == null){
				obj.invoice_date = null;
			} else {
				obj.invoice_date = convertDate(obj.invoice_date);
			}
		})
		return this;
	}

	DataObject.prototype.formatPostalServiceToString = function(){
		this.data.map(function(obj){
			if(obj.postal_service == 1){
				obj.postal_service = 'igen';
			} else {
				obj.postal_service = 'nem';
			}
		})
		return this;
	}

	DataObject.prototype.formatPostalServiceToBoolean = function(){
		this.data.map(function(obj){
			if(obj.postal_service == 'igen'){
				obj.postal_service = 1;
			} else {
				obj.postal_service = 0;
			}
		})
		return this;
	}

	return {
		DataObject: DataObject
	}


}]);
var AlertsFactory = angular.module('AlertsFactory', []);

AlertsFactory.factory('Alerts', [function (){

	function isAnythingSelected(array, callback){

		if(array.length == 0){
			alert('Nem választottál ki semmit!');
		} else {
			callback(array);
		}

	}

	function checkSuccess(response){
		if(response == true){
			alert('Változások sikeresen végrehajtva!');
		} else {
			alert('Nem sikerült a kért változatásokat végrehajtani!');
		}
	}

	function confirmChange(data, callback){
		var confirmAlert = confirm('Végre akarod hajtani a kívánt változtatásokat?');
		if(confirmAlert){
			callback(data);
		}
	}

	return {
		isAnythingSelected: isAnythingSelected,
		checkSuccess: checkSuccess,
		confirmChange: confirmChange
	}


}]);