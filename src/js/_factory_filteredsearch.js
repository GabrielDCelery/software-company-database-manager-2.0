var FilteredSearchFactory = angular.module('FilteredSearchFactory', []);

FilteredSearchFactory.factory('FilteredSearch', ['$http', function ($http){

	var cachedCompanies;
	var cachedManagers;
	var cachedMailingAddresses;

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

	function getMailingAddresses(callback){
		if(cachedMailingAddresses){
			callback(cachedMailingAddresses);
		} else {
			$http.get('php/mailing/fetch_mailing_addresses.php').success(function(data){
				cachedMailingAddresses = data;
				callback(data);
			});
		}
	}

	function filterNames(input, arrayOfNames){
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
			callback(filterNames(input, data));
		});
	}

	function filterManagerNames(input, callback){
		getManagers(function (data){
			callback(filterNames(input, data));
		});
	}

	function filterMailingAddresses(inputSenderName, inputSenderAddress, callback){
		var listOfMailingAddresses = [];
		var filteredListOfMailingAddresses = [];
		getMailingAddresses(function(data){
			listOfMailingAddresses = data;
			if(inputSenderName.length !==0 || inputSenderAddress.length !==0){
				for(var i=0; i < listOfMailingAddresses.length; i++){
					if(listOfMailingAddresses[i].sender_name.substring(0,inputSenderName.length).toLowerCase() === inputSenderName.toLowerCase() && listOfMailingAddresses[i].sender_address.substring(0,inputSenderAddress.length).toLowerCase() === inputSenderAddress.toLowerCase()){
						filteredListOfMailingAddresses.push(listOfMailingAddresses[i]);
					}
				}
			}
			callback(filteredListOfMailingAddresses);	
		});
	}

	return {
		filterCompanyNames: filterCompanyNames,
		filterManagerNames: filterManagerNames,
		filterMailingAddresses: filterMailingAddresses
	}


}]);