var mongoose = require('mongoose');
var LOC = require('./loc');

var options = {discriminatorKey: 'kind'};

var structureScheme = new mongoose.Schema({
        combinationRules: [String]
    }, options);


structureScheme.pre('save', function (next) {
	if(this.combinationRules.length === 0) {
		this.combinationRules = null;
	}
	next();
});




var Structure = LOC.discriminator('Structure', structureScheme);

module.exports = mongoose.model('Structure', Structure);