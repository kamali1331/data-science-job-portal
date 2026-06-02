const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const { validateCreateJob, validateJobId, validateUpdateJob } = require('../middleware/validate');

router.get('/', jobsController.getAllJobs);
router.post('/', validateCreateJob, jobsController.createJob);
router.put('/:id', validateJobId, validateUpdateJob, jobsController.updateJob);
router.delete('/:id', validateJobId, jobsController.deleteJob);

module.exports = router;
