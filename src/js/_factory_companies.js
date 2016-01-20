var CompaniesFactory = angular.module('CompaniesFactory', []);

CompaniesFactory.factory('CompaniesFunctions', ['$http', function ($http){

	function getCompanies(data, callback){
		$http.post('php/companies/form_search_companies.php', data).success(function(data){
			callback(data);
		});
	}

	function DataFormatter(data){
		this.data = data;
	}

	DataFormatter.prototype.addColourCoding = function(){
		this.data.map(function(obj){
			if (obj.contract_status == true && (obj.postal_number == "" || obj.postal_number == null)){
				obj.css_color = "yellow";
			} else if (obj.contract_status == true){
				obj.css_color = "green";
			} else {
				obj.css_color = "red";
			}
		})
		return this;
	}

	DataFormatter.prototype.formatPostalServiceToString = function(){
		this.data.map(function(obj){
			if(obj.postal_service == 1){
				obj.postal_service = 'igen';
			} else {
				obj.postal_service = 'nem';
			}
		})
		return this;
	}


	return {
		DataFormatter: DataFormatter,
		getCompanies: getCompanies
	}


}]);