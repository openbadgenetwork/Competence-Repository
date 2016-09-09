var express = require('express');
var bodyParser = require('body-parser');
var neo4j = require('node-neo4j');

//create app
var app = express();

// connect to neo4j database
var url = 'http://neo4j:neopass4J@localhost:7474';
var db = new neo4j(url);



var port = 3000;

//Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//expose public folder
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});


app.get('/url/:url', function(req, res){
	var url = req.body.url;
	res.send(200, url);
});


app.post('/test', function(req, res){
	var url = req.body.url;
	res.send(200, "test: " + url);
});



// neo4j routes ===============================================

app.get('/all', function(req, res){

	db.readNodesWithLabel("LOCdefinition", function(err, node) {
		if(err) {
			res.status(404).send("No entries");
		} else {
			res.status(200).json(node);
			console.log("Response sent");
		}		
	});


	// db.readNode(12, function(err, node) {
	// 	if(err) {
	// 		res.status(404).send("No entries");
	// 	} else {
	// 		res.status(200).json(node);
	// 		console.log("Response sent");
	// 	}		
	// });


});



app.post('/competence', function(req, res){

	var labelProp = req.body.locType;

	var nameProp = req.body.name;
	var descriptionProp = req.body.description;
	var languageProp = req.body.language;

	db.insertNode({
		name: nameProp,
		description: descriptionProp,
		language: languageProp
	}, labelProp, function(err, node) {
		if (err) {
			return console.log(err);
		}
		res.send(200, {message: "Entry saved!"});
		console.log(node);
	});


	// db.cypherQuery(
	// 	'CREATE (somebody:Person { name: {name}, from: {company}, age: {age} }) RETURN somebody',
	// 	{
	// 		name: 'Ghuffran',
	// 		company: 'Modulus',
	// 		age: 44
	// 	}, function(err, result) {
	// 		if(err){
	// 			return console.log(err);
	// 		}
	// 		console.log(result.data);
	// 		console.log(result.columns);
	// 	}
	// );


});











app.listen(port, function(){
	console.log('Server started! At http://localhost:' + port);
});
