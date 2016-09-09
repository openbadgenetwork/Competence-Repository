var mongoose = require('mongoose');

var LocDefinitionSchema = new mongoose.Schema({
	id: String,
	name: String,
	type: String,
	date: { type: Date, default: Date.now}
});

module.exports = mongoose.model('locDefinition', LocDefinitionSchema);