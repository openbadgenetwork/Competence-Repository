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

var locs = require('./routes/locs');
var scraper = require('./routes/scraper');
var search = require('./routes/search');



//create app
var app = express();

// connect to neo4j database
var url = 'http://neo4j:neopass4J@localhost:7474';
var db = new neo4j(url);

var r = require("request");
//var neo4jUrl = ("http://neo4j:neopass4J@localhost:7474") + "/db/data/transaction/commit";
//var neo4jUrl = ("http://localhost:7474") + "/db/data/transaction/commit";


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/compRepo2');

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

// API request checks for API-version and JSON etc.
app.use(restAPIchecks);

// Routes ******************************************************

app.get('/', function(req, res){res.sendFile(__dirname + '/public/index.html');});

app.use('/competencies', locs);
app.use('/submit', scraper);
app.use('/search', search);

//app.get('/submit', scraper.submit);

//app.get('/test', scraper.create);

//app.post('/submit', scraper.submit);

/*


app.post('/competencies', locs.create);
app.get('/competencies/:id', locs.show);
app.post('/competencies/:id', locs.edit);
app.del('/competencies/:id', locs.del);
*/



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

app.listen(port, function(err) {
    if (err !== undefined) {
        debug('Error on startup, ',err);
    }
    else {
        debug('Listening on port ',port);
    }
});
