/** This module defines the controller for the LOCs
 *
 * @author Christian Mehns
 * @module controllers/locController
 * @type {Controller}
 */


// modules
var LOC = require('../models/locModel');
var parser = require('../lib/parser/parser.js');

module.exports = {


    /**
     * Get LOC via id (URI)
     * @param {Request} request, should have key id, with id String or Array
     * @param {Response} response
     * @param {Function} next
     * @return {Response}
     */
    getLOC: function (req, res, next) {
        var id = req.body.id;
        
        LOC.find({
            'id': {$in: id}
        }, function(err, result){
            console.log(result);
            if(err) return next(err);
            res.status(200).send(result);             
        });
    },


    /**
     * Get a list of all LOCs
     * @param {Request} request
     * @param {Response} response
     * @param {Function} next
     * @return {Response} List of all LOCs
     */
    listLOCs: function (req, res, next) {
        console.log("List all");
        LOC.find({
            
        }, function(err, locs){
            if(err) return next(err);
            //console.log("LOCS "+JSON.stringify(locs));
            //res.status(200).send(JSON.stringify(locs));

          
            parser.addContext(JSON.stringify(locs), function(err, jsonLd){
                if(err) return next(err);
                res.status(200).send(jsonLd);
            });   
               
        });
    },


    /**
     * Get a list of all frameworks
     * @param {Request} request
     * @param {Response} response
     * @param {Function} next
     * @return {Response}
     */
    listFrameworks: function (req, res, next) {
        console.log("List all Frameworks");

        LOC.find({type: 'LOCstructure'}, function(err, locs){
            if(err) return next(err);

            parser.addContext(JSON.stringify(locs), function(err, jsonLd){
                if(err) return next(err);
                res.status(200).send(jsonLd);
            });
        });

    },

    /**
     * Clear database
     * @param {Request} request
     * @param {Response} response
     * @param {Function} next
     * @return {Response}
     */
    clearDB: function (req, res, next) {
        LOC.remove({}, function(err, locs){
            if(err) return next(err);
            
            res.status(200).send("DB cleared");
        });
    },

    /**
     * Search Repository
     * @param {Request} request, contains query key
     * @param {Response} response
     * @param {Function} next
     * @return {Response}
     */
    searchLOC: function (req, res, next) {
        var term = req.body.query;
        console.log("search term: "+term);  

        var re = new RegExp(term, 'i');

        LOC.find({
                title: {$exists: true},
                description: {$exists: true}
            }).or([
                {'description.en': { $regex: re}},
                {'title.en': {$regex: re}},
                {'abbr.en': {$regex: re}}
            ]).exec(function(err, locs){
                if(err) return next(err);

                console.log("LOCS: "+locs);
                res.status(200).send(locs);            
            }
        );
    }
};