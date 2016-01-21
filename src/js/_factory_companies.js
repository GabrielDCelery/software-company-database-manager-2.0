var CompaniesFactory = angular.module('CompaniesFactory', []);

CompaniesFactory.factory('CompaniesFunctions', ['$http', function ($http){

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

	return {
		getShortCompaniesData: getShortCompaniesData,
		getDetailedCompaniesData: getDetailedCompaniesData,
		overWriteCompanyData: overWriteCompanyData,
		changeContractStatus: changeContractStatus,
		extendContract: extendContract
	}


}]);