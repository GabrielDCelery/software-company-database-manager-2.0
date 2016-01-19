var SubMenuFactory = angular.module('SubMenuFactory', []);

SubMenuFactory.factory('subMenu', [function (){

	function displayContent(object, propertyName, callback){
		for(var key in object){
			if(key == propertyName){
				object[key] = true;
			} else {
				object[key] = false;
			}
		}
		callback(object)
	}

	return {
		displayContent: displayContent
	}


}]);