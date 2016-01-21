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

	return {
		isAnythingSelected: isAnythingSelected,
		checkSuccess: checkSuccess
	}


}]);