var FormatDataFactory = angular.module('FormatDataFactory', []);

FormatDataFactory.factory('FormatData', [function (){

	function convertDate(stringDate){
		var outputDate = new Date(stringDate);
		return outputDate;
	}

	function DataObject(data){
		this.data = data;
	}

	DataObject.prototype.addColourCoding = function(){
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

	DataObject.prototype.formatDateCorrectly = function(){
		this.data.map(function(obj){
			if(obj.starting_date == "1970-01-01" || obj.starting_date == "0000-00-00" || obj.starting_date == null){
				obj.starting_date = null;
			} else {
				obj.starting_date = convertDate(obj.starting_date);
			}
			if(obj.ending_date == "1970-01-01" || obj.ending_date == "0000-00-00" || obj.ending_date == null){
				obj.ending_date = null;
			} else {
				obj.ending_date = convertDate(obj.ending_date);
			}
			if(obj.transfer_date == "1970-01-01" || obj.transfer_date == "0000-00-00" || obj.transfer_date == null){
				obj.transfer_date = null;
			} else {
				obj.transfer_date = convertDate(obj.transfer_date);
			}
			if(obj.invoice_date == "1970-01-01" || obj.invoice_date == "0000-00-00" || obj.invoice_date == null){
				obj.invoice_date = null;
			} else {
				obj.invoice_date = convertDate(obj.invoice_date);
			}
		})
		return this;
	}

	DataObject.prototype.formatPostalServiceToString = function(){
		this.data.map(function(obj){
			if(obj.postal_service == 1){
				obj.postal_service = 'igen';
			} else {
				obj.postal_service = 'nem';
			}
		})
		return this;
	}

	DataObject.prototype.formatPostalServiceToBoolean = function(){
		this.data.map(function(obj){
			if(obj.postal_service == 'igen'){
				obj.postal_service = 1;
			} else {
				obj.postal_service = 0;
			}
		})
		return this;
	}

	DataObject.prototype.addColourCodingToMail = function(){
		this.data.map(function(obj){
			obj.show_input = false;
			if (obj.forwarding_date == null){
				obj.css_color = "yellow";
			} else {
				obj.css_color = "green";
			}
		})
		return this;
	}

	DataObject.prototype.formatDateCorrectlyForMail = function(){
		this.data.map(function(obj){
			obj.receiving_date = convertDate(obj.receiving_date);
			if(obj.forwarding_date == "1970-01-01" || obj.forwarding_date == "0000-00-00" || obj.forwarding_date == null){
				obj.forwarding_date = null;
			} else {
				obj.forwarding_date = convertDate(obj.forwarding_date);
			}
		})
		return this;
	}

	return {
		DataObject: DataObject
	}


}]);