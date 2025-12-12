const express = require('express');
const jobsController = require('../controllers/jobsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, jobsController.createJob);

module.exports = router;