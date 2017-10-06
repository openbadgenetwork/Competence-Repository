/** This module defines the routes
 *
 * @author Christian Mehns
 * @author Johannes Konert
 * @module routes/routes
 * @type {Router}
 */

var express = require('express');
var locController = require('../controllers/locController');
var parseController = require('../controllers/parseController');

var router = express.Router();

router.get('/competencies', locController.listLOCs);
router.post('/competencies', locController.getLOC);
router.delete('/competencies', locController.clearDB);
router.get('/frameworks', locController.listFrameworks);
router.post('/search', locController.searchLOC);
router.post('/submit', parseController.importData);
router.get('/submit/test', parseController.importDataTest);

module.exports = router;