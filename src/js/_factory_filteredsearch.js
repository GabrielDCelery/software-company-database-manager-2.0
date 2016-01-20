var FilteredSearchFactory = angular.module('FilteredSearchFactory', []);

FilteredSearchFactory.factory('filteredSearch', ['$http', function ($http){

	var cachedCompanies;
	var cachedManagers;

	function getCompanies(callback){
		if(cachedCompanies){
			callback(cachedCompanies);
		} else {
			$http.get('php/companies/fetch_company_names.php').success(function(data){
				cachedCompanies = data;
				callback(data);
			});
		}
	}

	function getManagers(callback){
		if(cachedManagers){
			callback(cachedManagers);
		} else {
			$http.get('php/companies/fetch_manager_names.php').success(function(data){
				cachedManagers = data;
				callback(data);
			});
		}
	}

	function filter(input, arrayOfNames){
		var listOfNames = arrayOfNames;
		var filteredListOfNames = [];
		if(input.length !==0){
			for(var i = 0; i < listOfNames.length; i++){
				if(listOfNames[i].substring(0, input.length).toLowerCase() === input.toLowerCase()){
					filteredListOfNames.push(listOfNames[i]);
				}
			}
		}
		return filteredListOfNames;
	}

	function filterCompanyNames(input, callback){
		getCompanies(function (data){
			callback(filter(input, data));
		});
	}

	function filterManagerNames(input, callback){
		getManagers(function (data){
			callback(filter(input, data));
		});
	}

	return {
		filterCompanyNames: filterCompanyNames,
		filterManagerNames: filterManagerNames
	}


}]);