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

	return {
		isAnythingSelected: isAnythingSelected,
		checkSuccess: checkSuccess,
		confirmChange: confirmChange
	}


}]);