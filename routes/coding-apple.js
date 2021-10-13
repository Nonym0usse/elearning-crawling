var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');
var Crawling = require('../models/Crawling.js')
const cheerio = require('cheerio');

router.get('/catalog', function(req, res, next) {
    requestAPI().then(function(data){
        var xls = json2xls(data);
        var exceloutput = Date.now() + "-coding-apple-output.xlsx"
         fs.writeFileSync(exceloutput, xls, 'binary');
         res.download(exceloutput,(err) =>  {
             if(err){
                 fs.unlinkSync(exceloutput)
                 res.send("Unable to download the excel file")
             }
             fs.unlinkSync(exceloutput)
         });
    });
    
});

async function requestAPI(){
    const URL = "https://codingapple.com/all-courses/";

    return new Promise((resolve, reject) => {
        request.get({url: URL}, function(err, res, body) {
            if(err)
            {
                reject(err);
            }
            else
            {
                const arr = [];
                let $ = cheerio.load(body);
                $('ul.item-list>li').each(function(index){
                    const image = $(this).find('img.attachment-full').attr('src');
                    const title = $(this).find('li.course_single_item>div.row>div.col-md-8>div.item>div.item-title').text();
                    const description = $(this).find('li.course_single_item>div.row>div.col-md-8>div.item>div.item-desc').text();
                    const price = $(this).find('li.course_single_item>div.row>div.col-md-8>div.item>div.item-credits').text();
                    const number_pers = $(this).find('li.course_single_item>div.row>div.col-md-8>div.item>div.item-meta>div.students').text();
    
                    var crawling = new Crawling(title, image, price, description, number_pers);
                    crawling.setTitle(title);
                    crawling.setImg(image);
                    crawling.setPrice(price);
                    crawling.setDescription(description);
                    crawling.setPersonNumber(number_pers);
                    arr.push(crawling);
                    resolve(arr);
                });
            }
        });
    });
  }



module.exports = router;