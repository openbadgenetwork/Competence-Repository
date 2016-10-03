/** This module is a JSON-LD parser, 
 *  to read in RDFa documents and parse it to JSON-LD
 *  The module uses an external JSON-LD Processer 
 *  and a RDFa parser 
 * 
 *  @author Christian Mehns
 *
 *  @module lib/parser
 */



// modules
var request = require('request'); 			//Request URLs
var jsonld = require('jsonld');					//json-ld processor
var rdfaParser = require('jsonld-rdfa-parser'); //RDFa parser

//register RDFa Parser
jsonld.registerRDFParser('text/html', rdfaParser); 

// JSON-LD context for the InLOC model
var context = require('./context/InLOC_context.json');




exports.parseUrl = function (url, callback) {
  callback = callback || function() {};

  request(url, function(err, res, body) {
    if (err) return callback(err);

    parse(body, callback);
  });
};


//extracts RDFa data, compacts JSON-LD and converts to JSON for DB
exports.parse = function (doc, callback){
  callback = callback || function() {};  
  
  //extract RDFa data
  jsonld.fromRDF(doc, {format: 'text/html'}, function(err, data) {
    if (err) return callback(err);

    //compact with JSON-LD context
    jsonld.compact(data, context, function(err, compacted) {
      if (err) return callback(err);

      //remove annotation for DB
      convertToJSON(compacted, function(err, obj){
        if (err) return callback(err);

        return callback(null, obj);
      });
    });
  });
};



exports.addContext = function (obj, callback) {
  callback = callback || function() {}; 

  obj = JSON.parse(obj);

  addAnnotations(obj);


  /*
  for (var i = 0; i < obj.length; i++) {
    var temp = obj[i];
    temp["@id"] = temp["id"];
    temp["@type"] = temp["type"];
    temp["@language"] = temp["language"];
    temp["@value"] = temp["value"];
    delete temp["id"];
    delete temp["_id"];
    delete temp["type"];
    delete temp["value"];
    delete temp["language"];
 }
 */

  var objLD = {
  	"@context": context,
  	"@graph": obj
  };
  return callback(null, objLD);
}


exports.addContext3 = function(data, callback){
	callback = callback || function() {};  


	convertToJSONLD(data, function(err, result){
		if (err) return callback(err);
		

		jsonld.compact(result, context, function(err, compacted) {
			if (err) return callback(err);

			return callback(null, compacted);
		});
	});

	
};



//remove context and annotation
function convertToJSON2(obj, callback) {
	callback = callback || function() {}; 

  //remove annotation
  var data = obj['@graph'];
  if(data === null){
    return callback("No Data found");
  }

  removeAnnotations(obj);

	return callback(null, obj);
}


//remove context and annotation
function convertToJSON(obj, callback) {
  callback = callback || function() {}; 

  //remove annotation
  var data = obj['@graph'];
  if(data === null){
    return callback("No Data found");
  }

  //remove annotation
  var str = JSON.stringify(data);
  str = str.replace(/@id/g, 'id');
  str = str.replace(/@type/g, 'type');
  str = str.replace(/@language/g, 'language');
  str = str.replace(/@value/g, 'value');

  return callback(null, JSON.parse(str));
}



var annotations = [
    ["@id", "id"],
    ["@type","type"],
    ["@language","language"],
    ["@value","value"]
  ];



function addAnnotations(obj){

  for (var i = 0; i < obj.length; i++) {

    var temp = obj[i];
    for(var j=0; j<annotations.length; j++){
      temp[annotations[j][0]] = temp[annotations[j][1]];
      delete temp[annotations[j][1]];
      delete temp["_id"];
    }
  }
}

function removeAnnotations(obj){

  for (var i = 0; i < obj.length; i++) {

    var temp = obj[i];
    for(var j=0; j<annotations.length; j++){
      temp[annotations[j][1]] = temp[annotations[j][0]];
      delete temp[annotations[j][0]];
    }
  }
}
