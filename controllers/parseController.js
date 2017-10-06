/** This module defines the controller to extract semantic data from websites,
 *  and save it to the db  
 *
 * @author Christian Mehns
 * @module controllers/locController
 * @type {Controller}
 */


// modules
var fs = require('fs');           //File System, read files
var request = require('request'); //Request URLs

//own modules
var parser = require('../lib/parser/parser.js');

//model
var LOC = require('../models/locModel');

//test Files
var testRDFa = './resources/RDFa_Websites/RDFa_test_01.html';



module.exports = {


  /**
   * Extracts RDFa Data from Website and saves it to DB
   * @param {Request} request
   * @param {Response} response
   * @param {Function} next
   * @return {Response} message that elements have been saved, or error
   */
  importData: function (req, res, next) {

    var url = req.body.url;

    parser.parse(url, function(err, obj){
      if(err){
        //console.log(err);
        var error = new Error('No Competencies found under that URL.');
        error.status = 404;
        return next(error);
      } 

      LOC.insertMany(obj, function(err, docs){
        if(err) return next(new Error('The Competencies already exist in the repository.'));

        res.status(200).send("Saved Elements");
      });
    });
  },



  /**
   * Extracts RDFa Data from locale Test site and saves it to DB
   * @param {Request} request
   * @param {Response} response
   * @param {Function} next
   * @return {Response} message that elements have been saved, or error
   */
  importDataTest: function (req, res, next) {
    var testFile = testRDFa;

    parser.parse(testFile, function(err, obj){
      if(err){
        var error = new Error('Could not read Test Data.');
        error.status = 404;
        return next(error);
      } 

      LOC.insertMany(obj, function(err, docs){
        if(err) return next(new Error('The Competencies already exist in the repository.'));

        res.status(200).send("Saved Elements");
      });
    });
  }

}