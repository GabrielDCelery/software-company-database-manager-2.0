var DocMakerFactory = angular.module('DocMakerFactory', []);

DocMakerFactory.factory('DocMaker', ['$http', function ($http){

	function createCover(input, callback){
		$http({
			method: 'POST',
			url: 'php/companies/document_create_cover.php',
			data: input
		}).success(function(){
			callback();
		})
	}

	function createContract(input, callback){
		$http({
			method: 'POST',
			url: 'php/companies/document_create_contract.php',
			data: input
		}).success(function(){
			callback();
		})
	}


	function createDataObjectForReceit(arrayId, arrayObjects){

		var filteredData = [];
		
		for(var i = 0; i < arrayId.length; i++){
			for(var j = 0; j < arrayObjects.length; j++){
				if(arrayId[i] == arrayObjects[j]["mail_id"]){
					filteredData.push(arrayObjects[j]);
				}
			}
		}

		return(filteredData);
	}

	function createReceit(input, callback){
		$http({
			method: 'POST',
			url: 'php/mailing/document_create_receit.php',
			data: input
		}).success(function(){
			callback();
		})
	}

	return {
		createContract: createContract,
		createCover: createCover,
		createReceit: createReceit,
		createDataObjectForReceit:createDataObjectForReceit
	}

}]);