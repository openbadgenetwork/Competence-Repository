var mongoose = require('mongoose');

var LocSchema = new mongoose.Schema({
	id: String,
	locType: {
		type: String,
		enum: ['locdefinition','locstructure']
	}, 
	title: String,
	description: String,
	date: { type: Date, default: Date.now},
	primaryStructure: {type: mongoose.Schema.Types.ObjectId, ref: 'loc'},
	children: [{type: mongoose.Schema.Types.ObjectId, ref: 'loc'}]
});

module.exports = mongoose.model('loc', LocSchema);