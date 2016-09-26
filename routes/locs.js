var express = require('express');
var locsController = require('../controllers/locs');

var locsRouter = express.Router();


locsRouter.get('/', locsController.list);
locsRouter.post('/', locsController.getLOC);

locsRouter.get('/relations', locsController.listRelations);
locsRouter.post('/search', locsController.search);
locsRouter.delete('/', locsController.deleteAll);

module.exports = locsRouter;
