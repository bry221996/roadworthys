const express = require('express');
const jobsController = require('../controllers/jobsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, jobsController.listJobs);
router.get('/:uuid', auth, jobsController.getJobDetails);
router.post('/', auth, jobsController.createJob);

module.exports = router;