var CompaniesFactory = angular.module('CompaniesFactory', []);

CompaniesFactory.factory('CompaniesFunctions', ['$http', function ($http){

	function getCompanies(data, callback){
		$http.post('php/companies/form_search_companies.php', data).success(function(data){
			callback(data);
		});
	}

	return {
		getCompanies: getCompanies
	}


}]);