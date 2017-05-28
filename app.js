/** Main app for server to start the competency repository *  
 * @author Christian Mehns
 */

"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var debug = require('debug')('compRepo:server');

// own modules
var restAPIchecks = require('./restapi/request-checks.js');
var errorResponseWare = require('./restapi/error-response');
var routes = require('./routes/routes');


//create app
var app = express();
var port = 3000;


//database
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/compRepo2', function(err){
    if(err){
        console.error('Could not connect to database');
    }
});


// Middleware *************************************************
//app.use(bodyParser.urlencoded({ extended: false}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// API request checks for API-version and JSON etc.
app.use(restAPIchecks);

// Routes ******************************************************
app.get(['/','/home', '/search', '/url', '/test'], function(req, res){res.sendFile(__dirname + '/public/index.html');});
app.use('/', routes);



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