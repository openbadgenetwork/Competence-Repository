var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/compRepo2');

var AssociationSchema = mongoose.Schema({
	id: String, 
    associationType: String,
    number: Number,
    hasSubject: {
        id: {
            type: String, 
            required: true
        },
        label: String
    },
    hasScheme: {
        id: {
            type: String, 
            required: true
        },
        label: String
    },
    hasObject: {
        id: {
            type: String, 
            required: true
        },
        label: String
    }
});

var Association = mongoose.model('Association', AssociationSchema);

module.exports = Association;