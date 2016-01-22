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

	function mailToSelectedCompanies(data, callback){
		$http.post('php/companies/form_companies_mail_to_companies.php', data).success(function(data){
			callback(data);
		});		
	}


	function getMailDataList(data, callback){
		$http.post('php/mailing/form_search_mails.php', data).success(function(data){
			callback(data);
		});
	}


	return {
		getShortCompaniesData: getShortCompaniesData,
		getDetailedCompaniesData: getDetailedCompaniesData,
		overWriteCompanyData: overWriteCompanyData,
		changeContractStatus: changeContractStatus,
		extendContract: extendContract,
		addNewCompany: addNewCompany,
		mailToSelectedCompanies: mailToSelectedCompanies,
		getMailDataList: getMailDataList
	}


}]);