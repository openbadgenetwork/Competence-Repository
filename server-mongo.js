
var express = require('express');
var bodyParser = require('body-parser');


//create app
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/compRepo');


//Scraper 1
var microdata = require('node-microdata-scraper');
var url1       = 'https://raw.github.com/mhausenblas/schema-org-rdf/master/examples/Thing/Product/Product.microdata';

//Scraper 2
var scraper2 = require('semantic-schema-parser');


var jsonTest = require('./resources/testJSON.json');

//mongoose model
var LOC = require('./models/loc');


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



app.post('/', function(req, res){
	var url = req.body.url;

	microdata.parseUrl(url, function(err, json){
		if(!err && json){
			//console.log(json);
			
			var html = "<p style='width: 500px;'>" + json + "</p>";

			res.contentType('text/html');

			res.send(200, html);
		}
	});

});


// Scraper1 Test
/*
app.post('/url', function(req, res){
	var url = req.body.url;
	var error = "Sorry, no Competence Data found.";
	console.log("Requested URL: " + url);

	microdata.parseUrl(url, function(err, json){
		if(!err){
			console.log("Microdata found and sent");
			res.send(200, json);
		} 

		if(err) {
			console.log("Error: No Microdata found");
			res.send(404, error);
		}
	});
});
*/

// Scraper2 Test
app.post('/url', function(req, res){
	var url = [];
	url.push(req.body.url);
	var error = "Sorry, no Competence Data found.";
	console.log("Requested URL: " + url);

	scraper2.parseURLs(url, function(msg){
		if(msg){
			console.log("Microdata found and sent");
			res.status(200).send(msg);
			console.log("Data: "+ JSON.stringify(msg));
		} else {
			console.log("Error: No Microdata found");
			res.send(404, error);
		}
	});
});




//COMPETENCES


//search 
app.post('/search', function(req, res){

	var query = req.body.query;

	var locsProjection = {
		__v: false,
		_id: false
	}
	
	LOC
	.find({'title': new RegExp(query, 'i')}, locsProjection,function(err, locs){
		if(err){
			console.log("Error accured");
			res.send(err);
		}
			
		console.log("Result found");
		res.json(locs);
	})
	.populate('children')
	.exec()
});



//test insert JSON file
app.get('/test', function(req, res){


	var locTemp = new LOC({
		"id" : jsonTest.id,
		"title" : jsonTest.title,
		"description" : jsonTest.description,
		"locType" : jsonTest.locType
		}
	);


	locTemp.save(function(err) {
		if(err) {
			res.status(500).send(err);
			console.log("Error");
		}
		else {
			res.status(200).send("Successfully saved");
			console.log("LOC saved");
		}
	});




	var children = jsonTest.children;
	var childIndizes = [];

	children.forEach(function(element){
		
		var child = new LOC({
			id : element.id,
			locType: element.locType,
			title: element.title,
			description: element.description,
			primaryStructure: locTemp._id
		});

		child.save(function(err) {
			if(err) {
				res.status(500).send(err);
				console.log("Error");
			}
		});

		//childIndizes.push(child._id);
		locTemp.children.push(child._id);

	});


	//locTemp.children.push(childIndizes);


	

});





//get alle competencies
app.get('/competences', function(req, res){

	/*
	var locsProjection = {
		__v: false,
		_id: false
	}
	*/

	var locsProjection = {
		__v: false
	}
	
	
	LOC
	.find({}, locsProjection,function(err, locs){
		if(err)
			res.send(err);

		res.json(locs);
	})
	.populate('children')
	.exec()
});




app.post('/competence', function(req, res){
	var child = new LOC({
				locType: req.body.children[0].locType,
				title: req.body.children[0].title,
				description: req.body.children[0].description
	});

	child.save(function(err) {
		if(err) {
			res.status(500).send(err);
			console.log("Error");
		}
	});

	var loc = new LOC({
		locType : req.body.locType,
		title : req.body.title,
		description : req.body.description,
		children: [child._id]
	});


	loc.save(function(err) {
		if(err) {
			res.status(500).send(err);
			console.log("Error");
		}
			
		else{
			res.status(200).send("success");
			console.log("LOC saved.");
		}			
	});

	
	
});



// app.post('/url', function(req, res){
// 	var url = req.body.url;
// 	console.log("Requested URL: " + url);

// 	if(url.length == 0)
// 		res.send(404, "error");
// 	else
// 		res.send(200, url);
// });


// app.post('/', function(req, res){
// 	var url = req.body.url;
// 	microdata.parseUrl(url, function(err, json){
// 		if(!err && json){
// 			//console.log(json);
// 			res.contentType('text/html');
// 			res.send(200, json);
// 		}
// 	});	
// });




//delete a competence
app.delete('/competence/:id', function(req, res){

	var id = req.params.id;

	LOC.findOneAndRemove({_id: req.params.id}, function(err, result) {
		if(err){
			res.status(500).send("LOC not found");
		} else {
			res.status(200).send("LOC removed");
		}
	});

});





app.listen(port, function(){
	console.log('Server started! At http://localhost:' + port);
});
