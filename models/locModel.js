/** This module defines the model for the LOCs
 *
 * @author Christian Mehns *
 * @module models/locModel
 * @type {Model}
 */

var mongoose = require('mongoose');

var LOCSchema = mongoose.Schema({
    id: {
		type: String, 
		required: true,
		index: true
	},
    type: {
        type: String, 
        enum: ['LOCstructure','LOCdefinition']
    },
    title: {en: String},
    description: {en: String},
    abbr: {en: String},
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
    hasLOCpart: {},
    hasExample: {},
    hasDefinedLevel: {},
    isDefinedLevelOf: {},
    isExampleOf: {},
});

var LOC = mongoose.model('LOC', LOCSchema);

module.exports = LOC;