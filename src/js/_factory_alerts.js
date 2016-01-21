var AlertsFactory = angular.module('AlertsFactory', []);

AlertsFactory.factory('Alerts', [function (){

	function isArrayEmpty(array, data, callback){

		if(array.length == 0){
			alert('Nem választottál ki semmit!');
		} else {
			callback(data);
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
		isArrayEmpty: isArrayEmpty,
		checkSuccess: checkSuccess
	}


}]);