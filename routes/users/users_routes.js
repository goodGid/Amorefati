/*
 Default module
*/
const express = require('express');
const router = express.Router();


// Sign [ in & up ] 
router.use('/', require('./sign'));


module.exports = router;
