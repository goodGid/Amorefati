/*
 Default module
*/
const express = require('express');
const router = express.Router();

// Users
router.use('/users', require('./users/users_routes'));

// Crawling
router.use('/crawling', require('./users/crawl'));

module.exports = router;
