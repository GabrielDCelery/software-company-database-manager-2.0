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
			alert('A feladat sikeresen végrehajtva!');
		} else {
			alert('Nem sikerült a kért műveletet elvégezni!');
		}
	}

	function confirmChange(data, callback){
		var confirmAlert = confirm('Végre akarod hajtani a kívánt változtatásokat?');
		if(confirmAlert){
			callback(data);
		}
	}

	function fillAddNewMailsForm(companyName, receivingDate, mailsArray, callback){

		var alertToFillData = false;

		if(companyName == null || companyName == ''){alertToFillData = true;}
		if(receivingDate == null){alertToFillData = true;}
		for(var i = 0; i < mailsArray.length; i++){
			if(mailsArray[i].senderName.length == 0 || mailsArray[i].senderAddress.length == 0){
				alertToFillData = true;
			}
		}
		if(alertToFillData == true){
			alert('Minden mezőt kötelező kitölteni!');
		} else {
			callback();
		}

	}

	return {
		isAnythingSelected: isAnythingSelected,
		checkSuccess: checkSuccess,
		confirmChange: confirmChange,
		fillAddNewMailsForm: fillAddNewMailsForm
	}


}]);