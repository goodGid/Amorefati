/*
 Default module
*/ 
const express = require('express');
const router = express.Router();
const _crypto = require('crypto');
const async = require('async');

/*
 Custom module
*/
const db = require('../../module/pool.js');
const secretKey = require('../../config/secretKey').key;

/*
 Variable declaration 
*/



/*
 Function Sector
*/

function getRandomInt() { // Print 1~4
    return Math.floor(Math.random() * (4 - 1)) + 1;
}

function encrypt(u_password) {
    const encrypted = _crypto.createHmac('sha512', secretKey).update(u_password).digest('base64');
    return encrypted;
}

/*
 Method : Get
*/
        

/*
 Method : Post
*/

router.post('/', async(req, res, next) => {
    let id = req.body.id;
    let pwd = req.body.pwd;
    const hashedValue = encrypt(pwd);

    let selectQuery = 
    `
    SELECT count(*) as cnt
    FROM users
    WHERE id = ? and pwd = ?
    `;


    let result = await db.query(selectQuery, [id, hashedValue.toString('base64')]); 
    if( result[0].cnt == 0){
        res.status(404).send({
            state: "Login Fail "
        });
    }
    else{
        res.status(200).send({
            state : "Login Success"
        });
    }    
});


module.exports = router;
