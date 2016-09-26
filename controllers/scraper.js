/** This module defines the routes for competencies using neo4j
 *
 * @author Christian Mehns
 * @licence CC BY-SA 4.0
 *
 * @module routes/competencies
 * @type {Router}
 */


// modules
var URL = require('url');
var fs = require('fs');

//test MicroData
var testDataSrc = './resources/MicroData_Websites/microTest3.html';
var testJSONLDSrc = './resources/JSON-LD/example.jsonld';

//json-ld Data paths
var doc = './resources/JSON-LD/doc.json';
var context = './resources/JSON-LD/context.json';
var compact = './resources/JSON-LD/doc_complete.json';

//var doc = require('./resources/JSON-LD/doc.json');
//var context = require('./resources/JSON-LD/context.json');


//scraper
//var scraper = require('scrappy');
var scraper = require('node-microdata-parser');
var vocab = require('../vocab/vocabProvider'); //schema.org vocabular

//json-ld parser
var jsonld = require('jsonld');

var errors = require('../models/errors');

//var LOC = require('../models/loc');
var Definition = require('../models/definition');
var Structure = require('../models/structure');
var Association = require('../models/association');

var LOC = require('../models/loc');

var debug = require('debug')('compRepo:competencies');



var url2 = 'https://medium.com/slack-developer-blog/everything-you-ever-wanted-to-know-about-unfurling-but-were-afraid-to-ask-or-how-to-make-your-e64b4bb9254#.a0wjf4ltt';
var url1 = 'https://raw.githubusercontent.com/Mehns/Competence-Repository/master/resources/microTest.html';
var url = 'https://raw.githubusercontent.com/Mehns/Competence-Repository/master/resources/microTest2.html';




//
function convertJSONLD(compacted) {
	var data = compacted['@graph'];

	var str = JSON.stringify(data);
	str = str.replace(/@id/g, 'id');
	str = str.replace(/@type/g, 'type');

	return JSON.parse(str);
}

function saveAll(obj, callback) {

	var error = [];

	obj.forEach(function(element){
		LOC(element).save(function(err) {
			if(err) error.push(err);
		});
	});


	if(error.length == 0){
		return callback(null, "Sucessfully saved");
	} else {
		return callback(error, "Error acured");
	}


}




//test Local MicroData file
exports.testJSONLD = function (req, res, next) {


	/*
	jsonld.compact(doc2, context2, function(err, compacted) {
		if(err) return next(err);
	  	console.log(JSON.stringify(compacted, null, 2));
	  	res.status(200).send(compacted);
	} );
	*/



	//works as validation of context
	fs.readFile(testJSONLDSrc, function (err, doc) {
		if(err) return next(err);

		jsonld.expand(JSON.parse(doc), function(err, expanded) {
		  	if(err) return next(err);

		  	jsonld.compact(expanded, context2, function(err, compacted) {
		  		if(err) return next(err);
		  		//console.log(JSON.stringify(compacted, null, 2));

		  		var obj = convertJSONLD(compacted);

		  		console.log("obj: "+ JSON.stringify(obj));

		  		
		  		saveAll(obj, function(err, result){
			        if(err) return next(err);
			        res.status(200).send(result);
			    });	
				


			  	//res.status(200).send(compacted);
		  	});

			  	
		});

	});



/*
	fs.readFile(compact, function (err, doc) {
		if(err) return next(err);

		jsonld.expand(JSON.parse(doc), function(err, compacted) {
			  	if(err) return next(err);
			  	console.log(JSON.stringify(compacted, null, 2));
			  	res.status(200).send(compacted);	
			} );

	})
*/

/*
	fs.readFile(doc, function (err, doc) {
		if(err) return next(err);
		console.log("doc read: ");

		fs.readFile(context, function (err, context) {
		if(err) return next(err);
		console.log("context read: ");

			jsonld.compact(JSON.parse(doc), JSON.parse(context), function(err, compacted) {
			  	if(err) return next(err);
			  	console.log(JSON.stringify(compacted, null, 2));
			  	res.status(200).send(compacted);	
			} );
		})	
	})	
*/

	
	/*
	fs.readFile(testJSONLDSrc, function (err, doc) {
		if(err) return next(err);

		jsonld.toRDF(doc, {format: 'application/nquads'}, function (err, nquads){
			if(err) return next(err);
			res.status(200).send(nquads);	
		});
	})	
	*/

};





//test Local MicroData file
exports.extractLocal = function (req, res, next) {

	fs.readFile(testDataSrc, function (err, html) {
		if(err) return next(err);

		scraper.parse(html, function (err, result){
			if(err) return next(err);
			res.status(200).send(result);	
		});
	})	
};


//test Local MicroData file
exports.extractLocalSave = function (req, res, next) {
	fs.readFile(testDataSrc, function (err, html) {
		if(err) return next(err);
		debug("File read");

		scraper.parse(html, function (err, result){
			//console.log(JSON.stringify(result));
			if(err) return next(err);
			saveToDB(result, function(err, result){
		        if(err) return next(err);
		        res.status(200).send(result);
		    });		
		});
	})	
};




//send extracted Data without saving to DB
exports.extract = function (req, res, next) {

	scraper.parseUrl(url, function (err, result){
		if(err) return next(err);
		res.status(200).send(result);	
	});
};

//extract Data and save to DB
exports.extractAndSave = function (req, res, next) {

	scraper.parseUrl(url, function (err, result){
		//console.log(JSON.stringify(result));
		if(err) return next(err);

		saveToDB(result, function(err, result){
	        if(err) return next(err);
	        res.status(200).send(result);
	    });		
	});
};





function saveToDB(json, callback){
	var LOCstructure = vocab.getLOCstructure;
	var LOCdefinition = vocab.getLOCdefinition;
	var LOCassociation = vocab.getLOCassociation;
	var error = [];

	console.log(json);
	
	json.forEach(function(element){
		switch(getTypeOfURL(element.type)){
			case "LOCstructure": {
				console.log("structure");
				Structure(element).save(function(err) {
					if(err) error.push(err);
				});
				}
				break;
			case "LOCdefinition": {
				Definition(element).save(function(err) {
					if(err) error.push(err);
				});
				}
				break;
			case "LOCassociation": {
				console.log("association");
				Association(element).save(function(err) {
					if(err) error.push(err);
				});
				}
				break;
		}
	});


	if(error.length == 0){
		return callback(null, "Sucessfully saved");
	} else {
		return callback(error, "Error acured");
	}

	

}

function getTypeOfURL(url){
  return url.substr(url.lastIndexOf('/') + 1);
}







var context2 = 
  {
    "abbr": 
    {
      "@id": "http://purl.org/net/inloc/abbr",
      "@container": "@language"
    },
    "combinationRules": 
    {
      "@id": "http://purl.org/net/inloc/combinationRules",
      "@container": "@language"
    },
    "created": 
    {
      "@id": "http://purl.org/net/inloc/created",
      "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
    },
    "description": 
    {
      "@id": "http://purl.org/net/inloc/description",
      "@container": "@language"
    },
    "issued": 
    {
      "@id": "http://purl.org/net/inloc/issued",
      "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
    },
    "label": 
    {
      "@id": "http://purl.org/net/inloc/label",
      "@container": "@language"
    },
    "modified": 
    {
      "@id": "http://purl.org/net/inloc/modified",
      "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
    },
    "number":
    {
      "@id": "http://purl.org/net/inloc/number",
      "@type": "http://www.w3.org/2001/XMLSchema#decimal" 
    },
    "rights": 
    {
      "@id": "http://purl.org/net/inloc/rights",
      "@container": "@language"
    },
    "title": 
    {
      "@id": "http://purl.org/net/inloc/title",
      "@container": "@language"
    },
    "validityEnd": 
    {
      "@id": "http://purl.org/net/inloc/validityEnd",
      "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
    },
    "validityStart": 
    {
      "@id": "http://purl.org/net/inloc/validityStart",
      "@type": "http://www.w3.org/2001/XMLSchema#dateTime"
    },
    "hasLOCpart":
    {
      "@id": "http://purl.org/net/inloc/hasLOCpart",
      "@type": "@id"
    },
    "@vocab": "http://purl.org/net/inloc/",
    "subPropertyOf":
    {
      "@id": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf",
      "@type": "@id"
    },
    "comment": null
  }  ;


var doc2 = {
      "@type": "LOCstructure",
      "@id": "http://www.example.com/abilities/winegrower/1",
      "@language": "en",
      "title":
      {
        "en": "Wine grower (m/f)",
        "de": "Winzer/Winzerin"
      },
      "description":
      {
        "en": "Structure of the skills and competences required for the Final examination in the state-recognized training occupation: Wine grower (m/f)"
      },
      "comment": 
      [
        "note: This is presented as if it were a structure owned by this German agency.",
        "While the content is taken from the document referenced,",
        "it has been created as part of the InLOC project:",
        "see http://wiki.teria.no/display/inloc/Home",
        "and is based on work done for the eCOTOOL project:",
        "see http://www.competencetools.eu/"
      ],
      "furtherInformation": "http://www.bibb.de/redaktion/ze/en/winzer_e.pdf",
      "rights":
      {
        "de": "© Bundesagentur für Arbeit",
        "en": "© Federal Employment Agency"
      },
      "created": "2010-08-17T00:00:00",
      "version": "2.0",
      "publisher": 
      {
        "@id": "http://www.arbeitsagentur.de/"
      },
      "contributor":
      [
        {
    	"label": {"it":"Chiara Carlino"}
        },
        {
    	"label": {"en":"Simon Grant"}
        }
      ],
      "level":
      {
        "hasScheme": {
          "@id": "http://www.uis.unesco.org/Education/Pages/international-standard-classification-of-education.aspx",
          "label": {"en":"ISCED 2011"}
        },
        "hasObject": {
          "@id": "http://www.uis.unesco.org/Education/ISCED/2011#35",
          "comment": "this identifier is invented here",
          "label": {"en":"ISCED level 3, Vocational (35)"}
        },
        "number": "3"
      },
      "hasLOCpart":
      [
        "http://www.example.com/abilities/winegrower/109",
        "http://www.example.com/abilities/winegrower/111",
        "http://www.example.com/abilities/winegrower/113",
        "http://www.example.com/abilities/winegrower/115",
        "http://www.example.com/abilities/winegrower/117",
        "http://www.example.com/abilities/winegrower/119",
        "http://www.example.com/abilities/winegrower/121",
        "http://www.example.com/abilities/winegrower/123",
        "http://www.example.com/abilities/winegrower/125",
        "http://www.example.com/abilities/winegrower/127",
        "http://www.example.com/abilities/winegrower/129",
        "http://www.example.com/abilities/winegrower/131",
        "http://www.example.com/abilities/winegrower/133"
      ]
    };