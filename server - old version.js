/** Main app for server to start the competency repository
 *  STATUS: finished
 *
 * @author Christian Mehns
 * @licence CC BY-SA 4.0
 *
 */
 "use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var debug = require('debug')('compRepo:server');
//neo4j driver
var neo4j = require('node-neo4j');

// own modules
var restAPIchecks = require('./restapi/request-checks.js');
var errorResponseWare = require('./restapi/error-response');
//var routes = require('./routes');
var locs = require('./routes/locs');



//create app
var app = express();

// connect to neo4j database
var url = 'http://neo4j:neopass4J@localhost:7474';
var db = new neo4j(url);

var r = require("request");
var neo4jUrl = ("http://neo4j:neopass4J@localhost:7474") + "/db/data/transaction/commit";
//var neo4jUrl = ("http://localhost:7474") + "/db/data/transaction/commit";

//DBTools
//var dbTools = require('./modules/dbTools');

var port = 3000;

//Scraper
var microdata = require('node-microdata-scraper');

//Scraper2
var scraper2 = require('semantic-schema-parser');

// Middleware *************************************************
//app.use(bodyParser.urlencoded({ extended: false}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(morgan('tiny'));

//expose public folder
//app.use(express.static(__dirname + '/public'));

// API request checks for API-version and JSON etc.
app.use(restAPIchecks);

// Routes ******************************************************

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

app.use('/competencies', locs);



// scraper
app.post('/url', function(req, res){
	var url = req.body.url;
	var error = "Sorry, no Competence Data found.";
	console.log("Requested URL: " + url);


	microdata.parseUrl(url, function(err, json){
		if(!err){
			res.send(200, json);
			saveToDB(json);
			console.log("Microdata found and sent");
			
		} 

		if(err) {
			console.log("Error: No Microdata found");
			res.send(404, error);
		}
	});


	/*
	var url = [url];
	scraper2.parseURLs(url, 
	  // set a callback
	  function(msg){


	   // returns a JSON;
	   msg = JSON.stringify(msg);
	   res.status(200).send(msg);
	   // do something
	});
	*/


});


function cypher(query, params, cb) {
	r.post({uri:neo4jUrl,
          json:{statements:[{statement:query,parameters:params}]}},
         function(err,res) { cb(err,res.body)})
}




function saveToDB(json){
	json = JSON.parse(json);

	var query = 'WITH {json} AS document ' +
				'UNWIND document.LOCstructure AS structure ' +
				'MERGE (str:LOCstructure {id: structure.id}) ' + 
				'ON CREATE SET str = structure, str :LOC ' +
				'WITH {json} AS document '+
				'UNWIND document.LOCdefinition AS definition ' + 
				'MERGE (def:LOCdefinition {id: definition.id}) ' + 
				'ON CREATE SET def = definition, def :LOC ' +
				'WITH {json} AS document '+
				'UNWIND document.LOCassociation AS association '+
				'MERGE (a {id: association.hasSubject}) ' +
				'MERGE (b {id: association.hasObject}) ' +
				'MERGE (a)-[asso:LOCassociation]->(b) ' +
				'ON CREATE SET asso = association';





	cypher(query, {json: json}, function(err, result){
	    console.log(err, JSON.stringify(result))		
	});

}


function saveToDB2(json){

	json = JSON.parse(json);

	var locstructure = "http://schema.org/LOCstructure";
	var locdefinition = "http://schema.org/LOCdefinition";
	var locassociation = "http://schema.org/LOCassociation";

	var associationList = [];

	console.log(json);
	console.log("first element: "+ json[0].id);
	console.log("id :"+json.id);

	for(var i=0; i<json.length; i++){

		var element = json[i];

		console.log("Element name: "+element.name);
		console.log("Element property: "+element.properties);

		switch(element.name){
			case locstructure:{
				createNode("locstructure", element.properties);
				console.log("create structure");
				break;
			}
			case locdefinition: {
				createNode("locdefinition", element.properties);
				console.log("create definition");
				break;
			}
			case locassociation: {
				associationList.push(element);				
				break;
			}
			default:
			console.log("Element failure");
		}

	};


	//create Associations after Nodes were created
	associationList.forEach(function(element){
		console.log("create association");
		createRelation(
		element.properties.hasSubject,
		element.properties.hasObject,
		element.properties.type,
		element.properties.hasScheme
		);
	});

	console.log("Successfully saved");
}


/*
function saveToDB(json){

	json = JSON.parse(json);

	var locstructure = "http://schema.org/LOCstructure";
	var locdefinition = "http://schema.org/LOCdefinition";
	var locassociation = "http://schema.org/LOCassociation";

	var associationList = [];

	console.log(json);
	console.log("first element: "+ json[0].id);
	console.log("id :"+json.id);

	for(var i=0; i<json.length; i++){

		var element = json[i];

		console.log("Element name: "+element.name);
		console.log("Element property: "+element.properties);

		switch(element.name){
			case locstructure:{
				createNode("locstructure", element.properties);
				console.log("create structure");
				break;
			}
			case locdefinition: {
				createNode("locdefinition", element.properties);
				console.log("create definition");
				break;
			}
			case locassociation: {
				associationList.push(element);				
				break;
			}
			default:
			console.log("Element failure");
		}

	};


	//create Associations after Nodes were created
	associationList.forEach(function(element){
		console.log("create association");
		createRelation(
		element.properties.hasSubject,
		element.properties.hasObject,
		element.properties.type,
		element.properties.hasScheme
		);
	});

	console.log("Successfully saved");
}
*/

/*
function createNode(type, data){
	console.log("NodeData: "+data);
	var id = data.id;
	var label = type;
	//data = JSON.stringify(data);

	var query = "MERGE (node:"+label+" { id:{id} }) ON CREATE SET node = {props}";

	var props = {
		"id": id,
		"type": type,
		"props": data
		
	};

	db.cypherQuery(query, props, function(err, result){
	    if(err){
				console.log("Node Error accured: "+err);
		} else {
			console.log("Node saved "+result);
		}		
	});

}




function createRelation(startID, endID, RelationType, infos){
	var type = getTypeOfURL(RelationType);

	var query = "MATCH (a),(b) WHERE a.id = '"+startID+"' AND b.id = '"+endID+"'CREATE (a)-[r:"+type+"]->(b)";
	//var query = "MATCH (a),(b) WHERE a.id = {start} AND b.id = {end} CREATE (a)-[r:{type}]->(b)";

	var params = {
		"params" : {
			"start": startID,
		"end": endID,
		"type": type
		}		
	}

	console.log("Relationship Data: %s, %s, %s",startID,endID,type);


	db.cypherQuery(query, function(err, result){
    if(err){
			console.log("Relationship Error accured: "+err);
	} else {
		console.log("Relationship created");
	}		
	});

*/



	/*
	db.insertRelationship(startID, endID, RelationType, infos,
	 function(err, relationship){
        if(err) {
        	console.log("Error with saving Relationship");
        } else {
        	console.log("Relationship saved");
        	console.log("Data: "+relationship.data);
        	console.log(relationship._id);
        	console.log(relationship._start);
        	console.log(relationship._end);
        }

        //console.log(relationship.data);
        //console.log(relationship._id);
        //console.log(relationship._start);
        //console.log(relationship._end);
	});
	

}
*/


function getTypeOfURL(url){
	return url.substr(url.lastIndexOf('/') + 1);
}




// neo4j routes ===============================================

//Get Node by ID
app.get('/competence/:id', function(req, res){

	var id = req.params.id;

	//var query = "MATCH (n) WHERE id("+id+")-[r]-() RETURN r";
	var query = "MATCH (n) WHERE id(n)= "+id+" RETURN n";


	db.cypherQuery(query, function(err, result){
    if(err){
			console.log("Error accured");
			res.send(err);
	} else {
		console.log("Result found");
		res.json(result);
	}
			
		
	});



	/*db.readNode(id, function(err, node){

		if(err) {
			res.status(404).send("No entries");
			console.log("Node with that id doesn't exist");
		} else {
			res.status(200).json(node);
			console.log("Response sent");
		}	

	});
	*/
});




app.get('/competenceName/:name', function(req, res){

	var label = "LOC";
	var name = req.params.name;

	var query = "MATCH (node{id: {id}})-[relation]->() RETURN node,relation";

	db.cypherQuery(query,{"id":name}, function(err, node){

		if(err) {
			res.status(404).send("No entries");
			console.log("Node with that name doesn't exist");
		} else {
			res.status(200).json(node);
			console.log("Response sent");
		}	

	});
});





app.get('/competences', function(req, res){

	var label = "LOCstructure";
	var label2 = "LOCdefinition";

	db.readNodesWithLabel("LOC", function(err, nodes) {
		if(err) {
			res.status(404).send("No entries");
		} else {
			res.status(200).json(nodes);
			console.log("Response sent: " + JSON.stringify(nodes));
		}		
	});

});











app.post('/competence', function(req, res){


	var labelProp = req.body.locType;
	var titleProp = req.body.title;
	var descriptionProp = req.body.description;
	var languageProp = req.body.language;

	db.insertNode({
		title: titleProp,
		description: descriptionProp,
		language: languageProp
	}, labelProp, function(err, node) {
		if (err) {
			return console.log(err);
		}
		res.send(200, {message: "Entry saved!"});
		console.log(node);
	});

});


app.post('/locstructure', function(req, res){

	var label = "locstructure";

	db.insertNode(req.body, label, function(err, node) {
		if (err) {
			return console.log(err);
		}
		res.send(200, {message: "LOCstructure saved!"});
		console.log(node);
	});

});

//DELETE
app.delete('/competence/:id', function(req, res){

	var id = req.params.id;

	db.deleteNode(id, function(err, node){
    if(err) throw err;

    if(node === true){
        res.status(200).send("Node deleted");
    } else {
    	res.status(404).send("Node couldn't be found");
        // node not deleted because not found or because of existing relationships
    }
});

});







//search 
app.post('/search', function(req, res){

	var term = req.body.query;
	console.log("term: "+term);

	var query = "MATCH (n) WHERE n.description =~ '(?i).*"+term+".*'  RETURN n";
	//var query = "MATCH (n) WHERE n.description CONTAINS '"+term+"' RETURN n";
	//var query = "MATCH (n) WHERE n.description =~ '.*\\"+term+"\\b.*' RETURN n";
	//var query = "START user = node(123) MATCH user-[:RELATED_TO]->friends RETURN friends";

	db.cypherQuery(query, function(err, result){
    if(err){
			console.log("Error accured");
			res.send(err);
	} else {
		console.log("Result found");
		res.json(result);
	}
			
		
	});
   

});


// Errorhandling and requests without proper URLs ************************
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    debug('Catching unmatched request to answer with 404');
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// register error handlers
errorResponseWare(app);







// Start server ****************************
/*
app.listen(port, function(err) {
    debug('Listening on port ',port);
    console.log('Listening on port ',port);
});
*/


app.listen(port, function(err) {
    if (err !== undefined) {
        debug('Error on startup, ',err);
    }
    else {
        debug('Listening on port ',port);
    }
});
