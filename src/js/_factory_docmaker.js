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

	return {
		createContract: createContract,
		createCover: createCover
	}

}]);