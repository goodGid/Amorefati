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

router.post('/signin', async(req, res, next) => {
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


router.post('/signup', async(req, res) => {
    let id = req.body.id;
    let pwd = encrypt(req.body.pwd);
    let name = req.body.name;
 
    let sex = req.body.sex;
    let age = req.body.age;
    let skin_type = req.body.skin_type;
 
    let person_color = getRandomInt();

    let selectID = 
    `
    SELECT *
    FROM users
    WHERE id = ?
    `;

    let selectResult = await db.query(selectID,[id]);
    if(selectResult.length > 0 ){
        res.status(200).send({
            state : "ID already exist !",
        });
    }
    else{
        let insertQuery = 
        `
        INSERT INTO users (id,pwd,sex,skin_type,name,age,person_color)
        VALUES(?,?,?,?,?,?,?);
        `;

        try {
            await db.query(insertQuery,[id,pwd,sex,skin_type,name,age,person_color]);
            await res.status(200).send({
                state : "Register Success"
            });
        } catch (error) {
            res.status(500).send({
                state : "Register Error"
            });
        }
    }
});


module.exports = router;
