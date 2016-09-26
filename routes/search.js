var express = require('express');
var locsController = require('../controllers/locs');


var searchRouter = express.Router();

//searchRouter.get('/competencies', locsController.list);
//searchRouter.post('/relations', locsController.relations);
searchRouter.post('/', locsController.search);
//searchRouter.delete('/competencies', locsController.deleteAll);



module.exports = searchRouter;