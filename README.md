# Competence-Repository

## Overview
This is a prototype that I created for my [Bachelor Thesis](https://github.com/Mehns/Competence-Repository/blob/master/thesis.pdf?raw=true)
The main idea is to extract semantic data, that describes Competence Definitions, from a website and store it in a database while keeping the semantic information. A user then can search the database for a specific Competence Definition and get the globally unique URI, which he can use e.g. an Open Badge to unambiguously refer to a certain Competence.

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
As an example the following URL can be used: https://raw.githubusercontent.com/Mehns/Competence-Repository/master/resources/RDFa_Websites/e-CF.html
This website contains parts of the [european Competence Framework (e-CF)](http://www.ecompetences.eu/) structured in the InLOC standard, formatted in RDFa.

- For testing instead of pasting an URL, a local website can be automatically imported into the database. Also the database data can be deleted here.


### Search Data
- Search for specific Competence Definitions. Additional Information of the selected Entry is shown in addition to the corresponding URI.



## Used Libraries
- [JSON-LD Processor](https://github.com/digitalbazaar/jsonld.js)
- [JSON-LD RDFa Parser](https://github.com/scienceai/jsonld-rdfa-parser)
- [Angular Modal Service](https://github.com/dwmkerr/angular-modal-service)


## Notes
This prototype is just a proof of concept, where still a lot of things has to be improved. Probably I won't keep on working on it in the next time. 
