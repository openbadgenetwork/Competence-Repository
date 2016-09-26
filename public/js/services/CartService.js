angular.module('CartService', []).factory('CartService', ['$http', function() {

	var CartService = {};
	var list = [];
	CartService.getItem = function(index) { return list[index]; }
	CartService.addItem = function(item) { list.push(item); }
	CartService.removeItem = function(item) { list.splice(list.indexOf(item), 1) }
	CartService.size = function() { return list.length; }

	return CartService;
}]);

