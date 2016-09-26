
var data = require('./vocabular.json');


//returns array with valid schema.org vocabulary
exports.getVocabular = function (){
	var domain = data.provider_url;
	var endpoints = data.endpoints;
	var vocabular = [];

	endpoints.forEach(function(element){
		vocabular.push(domain+element);
	});

	return vocabular;
}

exports.getLOCstructure = function (){
	return data.provider_url + "LOCstructure";
}

exports.getLOCdefintion = function (){
	return data.provider_url + "LOCdefinition";
}

exports.getLOCassociation = function (){
	return data.provider_url + "LOCassociation";
}