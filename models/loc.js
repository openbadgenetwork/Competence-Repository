var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/compRepo2');

var options = {discriminatorKey: 'kind'};

var LOCSchema = mongoose.Schema({
	id: { 
		type: String, 
		required: true,
		index: true
	},
    type: String,
    title: String,
    description: String,
    abbr: String,
    extraID: String,
    language: {type: String, max: 2},
    furtherInformation: String,
    rights: String,
    version: String,
    created: { type: Date, default: Date.now },
    modified: Date,
    issued: Date,
    validityStart: Date,
    validityEnd: Date,
    hasLOCpart: [String],
    hasExample: [String],
    hasDefinedLevel: [String],
    isDefinedLevelOf: [String],
    isExampleOf: [String],
}, options);

/*
LOCSchema.methods.dudify = function() {
  // add some stuff to the users name
  this.name = this.name + '-dude'; 

  return this.name;
};
*/

var LOC = mongoose.model('LOC', LOCSchema);

module.exports = LOC;