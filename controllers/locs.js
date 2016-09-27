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
var Association = require('../models/association');

var debug = require('debug')('compRepo:competencies');



module.exports = {

    test: function (req, res, next) {
        console.log("Test");
        res.status(200).send("Test");
    },

    create: function (req, res, next) {
        var id = req.body.id;


        // create a new user called chris
        var chris = new LOC({
          name: 'Chris',
          username: 'sevilayha',
          password: 'password' 
        });


        // call the built-in save method to save to the database
        chris.save(function(err) {
          if (err) throw err;

          console.log('User saved successfully!');
        });

        LOC.getRelations(id, function(err, locs){
            if(err) return next(err);
            res.status(200).send(locs);
        });
    },

    getLOC: function (req, res, next) {
        var id = req.body.id;
        var obj = {
            loc: {},
            associations: {}
        };
        
        LOC.find({id: id}, function(err, loc){
            if(err) return next(err);
            obj.loc = loc;

            Association.find({ 'hasSubject.id': id}, function(err, assos){
                if(err) return next(err);
                console.log('Associations: '+assos);
                obj.associations = assos;  
                res.status(200).send(obj);              
            });

            
        });

    },

    listRelations: function (req, res, next) {
        console.log("List all relations");
        Association.find({}, function(err, locs){
            if(err) return next(err);
            res.status(200).send(locs);
        });
    },

    list: function (req, res, next) {
        console.log("List all");
        LOC.find({}, function(err, locs){
            if(err) return next(err);
            res.status(200).send(locs);
        });
    },

    delete: function (req, res, next) {
        var id = req.body.id;
        console.log("List all");
        LOC.deleteAll(function(err, locs){
            if(err) return next(err);
            res.status(200).send(locs);
        });
    },

    deleteAll: function (req, res, next) {
        LOC.remove({}, function(err, locs){
            if(err) return next(err);

            Association.remove({}, function(err, locs){
                if(err) return next(err);
                
            });
            
            res.status(200).send("Everything removed from DB");
        });
    },

    search: function (req, res, next) {
        var term = req.body.query;
        console.log("search term: "+term);

        var re = new RegExp(term, 'i');

        LOC.find().or([
                {'description': {$regex: re}},
                {'title': {$regex: re}},
                {'abbr': {$regex: re}}
            ]).exec(function(err, locs){
                if(err) return next(err);
                res.status(200).send(locs);            
            }
        );
    }

};