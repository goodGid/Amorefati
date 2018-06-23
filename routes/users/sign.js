/*
 Default module
*/ 
const express = require('express');
const router = express.Router();
const _crypto = require('crypto');
const async = require('async');
const Color = require('color');

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


async function setProductPersonColor() {
    let selectQuery = 
    `
    SELECT color, idx
    FROM libs_product
    `;

    let result = await db.query(selectQuery); 
    console.log('length : ' + result.length);


    for(var i=0; i<result.length; i++){
        let _color = Color("#"+result[i].color).hsl().array();
        let s = _color[1].toString().substring(0,2);
        let l = _color[2].toString().substring(0,2);

        let person_color = 0 ;
        
        /*
        0 : Spring
        1 : Summer
        2 : Fall
        3 : Winter

        봄 (고명도)
        l : 50 ~ 100

        여름 (저중체도)
        S : 0 ~ 50

        가을 (중저체도 & 중저명도)
        S,L :  0 ~ 50

        겨울 (저명도)
        L : 0 ~ 50
        */

        
        if( s > 0 && s < 40 && l >= 60 && l < 100){
            person_color = 2;
        }else if(l >= 60 && l < 100){
            person_color = 0;
        }else if(s > 0 && s <= 40){
            person_color = 1;
        }else{
            person_color = 3;
        }

        let updateQuery =                 
        `
        UPDATE libs_product
        SET person_color = ?
        WHERE idx = ?
        `;
        console.log('person_color : ' + person_color);
        console.log('idx : ' + result[i].idx);

        try {    
            await db.query(updateQuery,[person_color,result[i].idx]);
        } catch (error) {
            res.status(500).send({
                state : error
            });
        }            
    } // End of For   
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
    SELECT person_color, count(*) as cnt
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

        selectQuery = 
        `
        SELECT lps.price, lps.name as product_name, lps.name, lp.*
        FROM libs_products as lps, libs_product as lp
        WHERE lp.id = lps.idx and lp.person_color = ?;
        `;

        let result_2 = await db.query(selectQuery,[result[0].person_color]); 

        for(var i=0; i<result_2.length; i++){
            result_2[i].image_path = "https://www.maccosmetics.co.kr" + result_2[i].image_path;
            console.log('image_path : ' + result_2[i].image_path);
        }

        res.status(200).send({
            state : "Login Success",
            data : result_2
        });
    } // End of else    
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
