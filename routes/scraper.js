var express = require('express');
var scraperController = require('../controllers/scraper');

var scraperRouter = express.Router();

scraperRouter.post('/', scraperController.extract);
scraperRouter.post('/save', scraperController.extractAndSave);
scraperRouter.get('/local', scraperController.extractLocal);
scraperRouter.get('/localsave', scraperController.extractLocalSave);
scraperRouter.get('/json', scraperController.testJSONLD);


module.exports = scraperRouter;