const express = require('express');
const materialsController = require('../controllers/materialsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, materialsController.listMaterials);

module.exports = router;