/*
 Declare module
 */
const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const db = require('../../module/pool.js');

function crawling(id , url){
    return new Promise(function(resolve, reject){
        let baseURL = url;
        request(baseURL, async (error, response, body) => {
            if (!error) {
                const $ = cheerio.load(body)
                
                // 2 Clear
                // let prodID = $('#main_content > div.block.block-system.block-system-main > div > div > div.site-container > article > div').attr('data-product-id');

                let prodID = $('#main_content > div.block.block-system.block-system-main > div > div.site-container > article > div').attr('data-product-id');
                console.log('prodID : ' + prodID);
                let size = $('#product--prod_id-' + prodID + ' > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul').children().length;

                for(var i=1; i<=size; i++){
                    
                    // Get Query for [Image Src]
                    let result = $('#product--prod_id-' + prodID + ' > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul > li:nth-child(' + i + ') > div >  div:nth-child(1)');
                    let image_path = result.attr('data-bg-image');


                    let result = $('#product--prod_id-' + prodID + ' > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul > li:nth-child(' + i + ') > div >  div:nth-child(2)');
                    let name = result.attr('title');
                    console.log('name : ' + name);
                    console.log('image_path : ' +  image_path + '\n');


                    /*
                    // Get Query for [color, name]
                    let result = $('#product--prod_id-' + prodID + ' > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul > li:nth-child(' + i + ') > div >  div:nth-child(2)');
                    let color = result.css('background-color');
                    let name = result.attr('title');
                    console.log('color : ' + color);
                    */
                    
                    let insertQuery =                 
                    `
                    INSERT INTO libs_product(id,name,color)
                    VALUES(?,?,?);
                    `;

                    try {
                        // await db.query(insertQuery,[id,name,color]);
                    } catch (error) {
                        res.status(500).send({
                            state : error
                        });
                    }
                }
                resolve("Success");
            }
            else {

                console.log('here3');
                reject("Error");
                console.log("We’ve encountered an error: " + error);
            }
        }); // End of request
    });
};
    


/*
Method : Get
*/




/*
Method : Post
*/

router.post('/', async(req, res, next) => {

    let baseURL = "https://www.maccosmetics.co.kr/product/13851/52231/makeup/-/snow-ball-shadescents-kit#/shade/%ED%81%AC%EB%A0%98_%EB%93%9C_%EB%88%84%EB%93%9C";

        request(baseURL, async (error, response, body) => {
            if (!error) {
                const $ = cheerio.load(body)
                let prodID = $('#main_content > div.block.block-system.block-system-main > div > div.site-container > article > div').attr('data-product-id');
                console.log('prodID : ' + prodID);
                

                // 2번
                // let size = $('#product--prod_id-PROD310 > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul').children().length;
                // 2번 끝
                
                let size = $('#product--prod_id-' + prodID + ' > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul').children().length;                
                console.log('size : ' + size);

                for(var i=1; i<=size; i++){
                    // Get Query for [Image Src]
                    let result = $('#product--prod_id-' + prodID + ' > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul > li:nth-child(' + i + ') > div >  div:nth-child(1)');
                    let image_path = result.attr('data-bg-image');
                    

                    /*
                    // 2번 작업
                    let result = $('#product--prod_id-PROD310 > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul > li:nth-child( ' + i + ' ) > div >  div:nth-child(1)');
                    let image_path = result.attr('data-bg-image');
                    result = $('#product--prod_id-PROD310 > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul > li:nth-child( ' + i + ' ) > div >  div:nth-child(2)');
                    let name = result.attr('title');
                    // 2번 작업 끝 
                    */


                    result = $('#product--prod_id-' + prodID + ' > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul > li:nth-child(' + i + ') > div >  div:nth-child(2)');
                    let name = result.attr('title');
                    console.log('name : ' + name);
                    console.log('image_path : ' +  image_path + '\n');


                    /*
                    // Get Query for [color, name]
                    let result = $('#product--prod_id-' + prodID + ' > div.product__shade-column > div.shade-picker.js-shade-picker--v1.js-shade-picker > div.shade-picker__colors-mask > ul > li:nth-child(' + i + ') > div >  div:nth-child(2)');
                    let color = result.css('background-color');
                    let name = result.attr('title');
                    console.log('color : ' + color);
                    */
                    
                    let updateQuery =                 
                    `
                    UPDATE libs_product
                    SET image_path = ?
                    WHERE name = ?
                    `;

                    try {    
                        await db.query(updateQuery,[image_path,name]);
                        console.log('END');
                    } catch (error) {
                        res.status(500).send({
                            state : error
                        });
                    }
                }
            }
            else {
                console.log('here3');
                console.log("We’ve encountered an error: " + error);
            }
        }); // End of request
});




router.post('/2', async(req, res, next) => {

    let baseURL = "https://www.maccosmetics.co.kr";
    let subURL = "/products/13854/makeup";


    request(baseURL+subURL, async (error, response, body) => {
        if (!error) {
            const $ = cheerio.load(body);
            let size = $('#main_content > div.block.block-system.block-system-main > div > article > div > div > div').children().length;

            console.log('size : ' + size);
            for(var i=1; i<=size; i++){
                let href = $('#main_content > div.block.block-system.block-system-main > div > article > div > div > div > div:nth-child(' + i + ') > div > div > div > div > div > div > a').attr('href');              
                let name = $('#main_content > div.block.block-system.block-system-main > div > article > div > div > div > div:nth-child(' + i + ') > div > div > div > header > div > a > h3').text();

                console.log('href : ' + href);

                let insertQuery = 
                `
                INSERT INTO libs_products (name,id)
                VALUES(?,5);
                `;

                let selectQuery = 
                `
                SELECT count(*) as cnt
                FROM libs_products
                WHERE name = ?
                `;

                
                try {
                    var result = await db.query(selectQuery,[name]);
                } catch (error) {
                    res.status(500).send({
                        state : error
                    });
                }

                if(result[0].cnt == 0){
                    try {
                        console.log('result[0].cnt == 0');
                        await db.query(insertQuery,[name]);
                        let selectQuery = 
                        `
                        SELECT idx
                        FROM libs_products
                        WHERE name = ?
                        `;
                        var result = await db.query(selectQuery,[name]);
                        await crawling(result[0].idx,baseURL+href);
                    } catch (error) {
                        res.status(500).send({
                            state : error
                        });
                    }
                }
                else{
                    res.status(500).send({
                        state : "Already Exist"
                    });
                }
            }

            await res.status(200).send({
                state : "Success"
            });
        }
        else {
            await res.status(404).send({
                state : "Fail"
            });
            console.log("We’ve encountered an error: " + error);
        }
    }); // End of request
});


router.post('/set', async(req, res, next) => {

    let selectQuery =     
    `    
    SELECT color
    FROM libs_product
    `;


    let updateQuery = 
    `    
    UPDATE libs_product
    SET color = ?
    WHERE color = ?
    `;

    try {
        let result = await db.query(selectQuery);
        console.log(' Length : ' + result.length);
        console.log(' Result : ' + String(result[0].color).substring(1,7) ); 
        console.log(' Result : ' + String(result[1].color).substring(1,7) ); 

        for(var i = 0; i<result.length; i++){
            await db.query(updateQuery,[ String(result[i].color).substring(1,7),result[i].color ]);
        }
        
        await res.status(200).send({
            state : "Update Success"
        });
    } catch (error) {
        res.status(500).send({
            state : error
        });
    }   
});




module.exports = router;