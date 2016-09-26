var mongoose = require('mongoose');
var LOC = require('./loc');

var options = {discriminatorKey: 'kind'};


var Definition = LOC.discriminator('Definition',
    new mongoose.Schema({
        primaryStructure: String
    }, options));


var Definition = mongoose.model('Definition', Definition);

module.exports = Definition;