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

var errors = require('../models/errors');
var LOC = require('../models/loc');

var debug = require('debug')('compRepo:competencies');


var neo4j = require('node-neo4j');
var db = new neo4j('http://neo4j:neopass4J@localhost:7474');

function getUserURL(user) {
    return '/users/' + encodeURIComponent(user.username);
}


exports.search = function (req, res, next) {
    LOC.getAll(function(err, locs){
        if(err) return next(err);
        res.status(200).send(locs);
    });
};