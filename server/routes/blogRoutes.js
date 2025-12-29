const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');

router.get('/', blogsController.getAllBlogs);

module.exports = router;
