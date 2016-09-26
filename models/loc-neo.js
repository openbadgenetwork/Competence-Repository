//competence.js
//Competence model logic



var errors = require('./errors');
var vocab = require('../vocab/vocabProvider').getVocabular(); //schema.org vocabular

var neo4j = require('node-neo4j');
var db = new neo4j('http://neo4j:neopass4J@localhost:7474');

//var neo4j = require('neo4j');
//var db = new neo4j.GraphDatabase('http://neo4j:neopass4J@localhost:7474');

/*
var db = new neo4j.GraphDatabase({
	// Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:neopass4J@localhost:7474';
    auth: process.env['NEO4J_AUTH'],
});
*/


// Private constructor:

var LOC = module.exports = function Competence(_id) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._id = _id;
}



// Public constants:

LOC.VALIDATION_INFO = {
    'id': {
        required: true,
        minLength: 2,
        maxLength: 16,
        pattern: /^[A-Za-z0-9_]+$/,
        message: '2-16 characters; letters, numbers, and underscores only.'
    },
};



// Public instance properties:

// The user's username, e.g. 'aseemk'.
Object.defineProperty(LOC.prototype, 'id', {
    get: function () { return this._node.properties['id']; }
});


// Private helpers:

// Takes the given caller-provided properties, selects only known ones,
// validates them, and returns the known subset.
// By default, only validates properties that are present.
// (This allows `User.prototype.patch` to not require any.)
// You can pass `true` for `required` to validate that all required properties
// are present too. (Useful for `User.create`.)
function validate(props, required) {
    var safeProps = {};

    for (var prop in LOC.VALIDATION_INFO) {
        var val = props[prop];
        validateProp(prop, val, required);
        safeProps[prop] = val;
    }

    return safeProps;
}


// Validates the given property based on the validation info above.
// By default, ignores null/undefined/empty values, but you can pass `true` for
// the `required` param to enforce that any required properties are present.
function validateProp(prop, val, required) {
    var info = LOC.VALIDATION_INFO[prop];
    var message = info.message;

    if (!val) {
        if (info.required && required) {
            throw new errors.ValidationError(
                'Missing ' + prop + ' (required).');
        } else {
            return;
        }
    }

    if (info.minLength && val.length < info.minLength) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (too short). Requirements: ' + message);
    }

    if (info.maxLength && val.length > info.maxLength) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (too long). Requirements: ' + message);
    }

    if (info.pattern && !info.pattern.test(val)) {
        throw new errors.ValidationError(
            'Invalid ' + prop + ' (format). Requirements: ' + message);
    }
}

function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation';
}



//Helper methods
//CUSTOM CODE
function formatObject(array){

  var obj = {
    "LOCstructure": [],
    "LOCdefinition": [],
    "LOCassociation": []
  };

  array.forEach(function(element){
    var type = getTypeOfURL(element.type);
    if(type in obj){
        obj[type].push(element);
    }
  });

  return obj;
}


function getTypeOfURL(url){
  return url.substr(url.lastIndexOf('/') + 1);
}



// Static methods:
LOC.createBatch = function(doc, callback){
    if(!Array.isArray(doc) || doc.length == 0){
        err = new Error('Empty Array');
        return callback(err);
    }

    //validate Data and create ordered array

    var obj = formatObject(doc);

    var query = [
        'WITH {json} AS document ',
        'UNWIND document.LOCstructure AS structure ',
        'MERGE (str:LOCstructure {id: structure.id}) ',
        'ON CREATE SET str = structure, str :LOC ',
        'WITH {json} AS document ',
        'UNWIND document.LOCdefinition AS definition ', 
        'MERGE (def:LOCdefinition {id: definition.id}) ',
        'ON CREATE SET def = definition, def :LOC ',
        'WITH {json} AS document ',
        'UNWIND document.LOCassociation AS association ',
        'MERGE (a {id: association.hasSubject}) ',
        'MERGE (b {id: association.hasObject}) ',
        'MERGE (a)-[asso:LOCassociation]->(b) ',
        'ON CREATE SET asso = association',
    ].join('\n')

    var params = {
        json: obj,
    };

    db.cypherQuery(query, params, function (err, results) {
        if (err) return callback(err);
        /*if (!results.data.length) {
            err = new Error('Batch failed: '+err);
            return callback(err);
        }*/
        //var loc = new LOC(results[0]['loc']);
        callback(null, "successfully saved"+ JSON.stringify(results));
    });
};




LOC.get = function (id, callback) {
    var query = [
        'MATCH (loc:LOC {id: {id}})',
        'RETURN loc',
    ].join('\n')

    var params = {
        id: id,
    };

    db.cypher({
        query: query,
        params: params,
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such loc with loc id: ' + id);
            return callback(err);
        }
        var loc = new LOC(results[0]['loc']);
        callback(null, loc);
    });
};


LOC.getRelations = function (id, callback) {
    var query = [
        'MATCH (loc {id: {id}})-[rel]-()',
        'RETURN rel',
    ].join('\n')

    var params = {
        id: id,
    };

    db.cypherQuery(query, params, function (err, results) {
        if (err) return callback(err);
        if (!results.data.length) {
            err = new Error('No such loc with loc id: ' + id);
            return callback(err);
        }
        //var loc = new LOC(results[0]['loc']);
        callback(null, results);
    });
};


LOC.getAll = function (callback) {
    var query = [
        'MATCH (loc:LOC)',
        'RETURN loc',
    ].join('\n');

    db.cypherQuery(query, function (err, results) {
        if (err) return callback(err);
        var locs = results.data.map(function (result) {
            return new LOC(result['_id']);
        });
        callback(null, locs);
    });
};


LOC.deleteAll = function (callback) {
    var query = [
        'MATCH (n) DETACH',
        'DELETE n',
    ].join('\n');

    db.cypherQuery(query, function (err, results) {
        if (err) return callback(err);
        
        callback(null, "Deleted All");
    });
};



LOC.search = function (term, callback) {

    var query = [
        'MATCH (n) ',
        'WHERE n.id =~ "(?i).*'+term+'.*" ',
        'OR n.title =~ "(?i).*'+term+'.*" ',
        'OR n.description =~ "(?i).*'+term+'.*" ',
        'RETURN n',
    ].join('\n');


    if(!term){
        err = new Error('Search String is empty');
        return callback(err);
    }

    db.cypherQuery(query, function (err, results) {
        if (err) return callback(err);
        
        if (!results.data.length) {
            err = new Error('Nothing found with term: ' + term + err + results);
            return callback(err);
        }
        
        //var loc = new LOC(results[0]['loc']);
        callback(null, results);
    });
};



// Static initialization:

// Register our unique username constraint.
// TODO: This is done async'ly (fire and forget) here for simplicity,
// but this would be better as a formal schema migration script or similar.
/*
db.createConstraint({
    label: 'LOC',
    property: 'id',
}, function (err, constraint) {
    if (err) throw err;     // Failing fast for now, by crash the application.
    if (constraint) {
        console.log('(Registered unique id constraint.)');
    } else {
        // Constraint already present; no need to log anything.
    }
})
*/
