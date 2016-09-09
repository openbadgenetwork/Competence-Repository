var mongoose = require('mongoose');

var LocStructureSchema = new mongoose.Schema({
	id: String,
	name: String,
	type: String
});

module.exports = mongoose.model('locStructure', LocStructureSchema);