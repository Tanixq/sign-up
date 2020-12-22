const express = require("express");
const router = express.Router();
const controllers = require('../controllers/index');

// home route 
router.get('/', controllers.home);

module.exports = router;