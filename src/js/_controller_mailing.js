var MailingCtrl = angular.module('MailingCtrl', []);

MailingCtrl.controller('MailingCtrl', [
	'$scope', 
	'SubMenu', 
	'FilteredSearch',
	'Database',
	'FormatData',
	'Alerts',
	function (
		$scope, 
		subMenu,
		FilteredSearch,
		Database,
		FormatData,
		Alerts
	){

/****************************************************************************
VARIABLES
****************************************************************************/

	$scope.display = {
		form: {
			searchMails: false,
			forwardMails: false,
			editMails: false,
			addNewMails: false
		},
		data: {
			list: true
		}
	}

	$scope.form = {
		searchMail: {
			companyName: "",
			startingDate: null,
			endingDate: null,
			nonForwarded: true,
			forwarded: false,
			hasPostalService: true,
			doesntHavePoastalService: true
		}
	}

	/* Short list of companies */

	$scope.mailDataList = [];
	$scope.sortField = 'company_name';
	$scope.reverseSortField = false;

	/* Object holding the information of checkboxes */

	$scope.selectedMails = {
		id: [],
		allChecked: false
	}

	/* Master objects */

	$scope.filteredListOfCompanies = [];

	var display = angular.copy($scope.display);

/****************************************************************************
FORM / SEARCH / FILTER COMPANY/MANAGER NAMES
****************************************************************************/

	function filterCompanyNames(input){
		FilteredSearch.filterCompanyNames(input, function(data){
			$scope.filteredListOfCompanies = data;
		})
	};

	function insertCompanyNameToInputField(companyName){
		$scope.form.searchMail.companyName = companyName;
		$scope.filteredListOfCompanies = [];
	};


/****************************************************************************
FORM / SEARCH
****************************************************************************/

	function formGetMailDataList(searchParams){
		Database.getMailDataList(searchParams, function(response){
			var dataObject = new FormatData.DataObject(response);
			dataObject.addColourCodingToMail().formatDateCorrectlyForMail();
			$scope.mailDataList = dataObject.data;
		})
	}

/****************************************************************************
FORM / EDIT
****************************************************************************/

	function editMails(){
		Alerts.isAnythingSelected($scope.selectedMails.id, function(data){
			for(var i = 0; i < $scope.mailDataList.length; i++){
				$scope.mailDataList[i].show_input = false;
			}
			for(var i = 0; i < $scope.selectedMails.id.length; i++){
				for(var j = 0; j < $scope.mailDataList.length; j++){
					if($scope.selectedMails.id[i] == $scope.mailDataList[j].mail_id){
						$scope.mailDataList[j].show_input = true;
					}
				}
			}
		})
	}

/****************************************************************************
MENU FUNCTIONS
****************************************************************************/

	function menu(property){
		subMenu.displayContent($scope.display.form, property, function(data){
			$scope.display.form = data;
		})
	}

	function reset(){
		$scope.display = angular.copy(display);
	}


/***********************************************************************************
CHECKLIST FUNCTIONS
***********************************************************************************/

	function checkAll(){
		if ($scope.selectedMails.allChecked == false){
			angular.forEach($scope.mailDataList, function(item){
				$scope.selectedMails.id.push(item.mail_id)
			})
			$scope.selectedMails.allChecked = true;
		} else {
			$scope.selectedMails.id = [];
			$scope.selectedMails.allChecked = false;
		}
	}

/****************************************************************************
BINDING FUNCTIONS
****************************************************************************/

	$scope.menu = menu;
	$scope.reset = reset;


	$scope.filterCompanyNames = filterCompanyNames;
	$scope.insertCompanyNameToInputField = insertCompanyNameToInputField;

	$scope.formGetMailDataList = formGetMailDataList;
	$scope.checkAll = checkAll;
	$scope.checkAllMails = checkAll;

	$scope.editMails = editMails;

}]);