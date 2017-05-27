# Competency Directory

## Overview
This is a prototype that shows how several competency frameworks can be crawled and parsed based on semantic data in order to provide one search interface to find the appropriate competency definition (and the URL to refer to it).

The code extracts semantic data, that describes competence definitions, from a website and store it in a database while keeping the semantic information. 
A user then can search the database for a specific competence definition and get the globally unique URI, which he can use e.g. an Open Badge to unambiguously refer to a certain competence.

The [InLOC](http://www.cetis.org.uk/inloc/Home) standard is used to model the data and provide a vocabulary. The prototype assumes that the semantic data is structured in RDFa format.

The data is stored in a MongoDB in JSON format. a context with the InLOC vocabulary is provided and converts the JSON data into JSON-LD format to preserve the semantic information. 

The client app is a SPA based on AngularJS. A REST API  is used to communicate with the NodeJS app on serverside.


## Installation
- Install [MongoDB](https://www.mongodb.com/)
- Install [Node](https://nodejs.org/) (including NPM) 
- Clone repository and install dependencies ($ npm install)


## Start Application
- start MongoDB ($ mongod)
- start app.js ($ node app.js)
- open Browser localhost:3000


## How to use it 

### Import Data
- Paste an URL in "Neuer Eintrag" (new entry).
As an example the following URL can be used: https://raw.githubusercontent.com/openbadgenetwork/competence-directory/master/resources/RDFa_Websites/e-CF.html
This website contains parts of the [European Competence Framework (e-CF)](http://www.ecompetences.eu/) structured in the InLOC standard, formatted in RDFa.

- For testing instead of pasting an URL, a local website can be automatically imported into the database. Also the database data can be deleted here.


### Search Data
- Search for specific Competence Definitions. Additional Information of the selected Entry is shown in addition to the corresponding URI.



## Used Libraries
- [JSON-LD Processor](https://github.com/digitalbazaar/jsonld.js)
- [JSON-LD RDFa Parser](https://github.com/scienceai/jsonld-rdfa-parser)
- [Angular Modal Service](https://github.com/dwmkerr/angular-modal-service)


## Notes
This prototype is just a proof of concept, where still a lot of things have to be improved.
