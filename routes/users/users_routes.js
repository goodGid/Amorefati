/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Sign [ in & up ] 
router.use('/', require('./sign'));


// Product Recommendation
router.use('/rec', require('./recommend'));

module.exports = router;
