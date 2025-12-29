const express = require('express');
const router = express.Router();
const roadmapsController = require('../controllers/roadmapsController');
const upload = require('../middleware/upload');

router.get('/', roadmapsController.getAllRoadmaps);
router.post('/', upload.single('roadmapFile'), roadmapsController.createRoadmap);

module.exports = router;
