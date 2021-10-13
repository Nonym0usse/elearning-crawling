var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var Crawling = require('../models/Crawling.js')
var fs = require('fs');
const cheerio = require('cheerio');

router.get('/catalog', function(req, res, next) {
    requestUrl().then(function(data){
       var xls = json2xls(data);
        var exceloutput = Date.now() + "-team-nova-light-output.xlsx"
         fs.writeFileSync(exceloutput, xls, 'binary');
         res.download(exceloutput,(err) =>  {
             if(err){
                 fs.unlinkSync(exceloutput)
                 res.send("Unable to download the excel file")
             }
             fs.unlinkSync(exceloutput)
         });
        }).catch(function(){ res.sendStatus(404)});
});

async function requestUrl(){
    const URL = "https://www.teamnovalight.co.kr/lecture_list.php";

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
                $('div.single-grid-view>div').each(function(){
                    const image = "https://www.teamnovalight.co.kr/" + $(this).find('div.col-md-4>div.category>div.ht__cat__thumb>a>img').attr('src');
                    const title = $(this).find('div.col-md-4>div.category>div.fr__product__inner>h4').text();
                    const price = $(this).find('div.col-md-4>div.category>div.fr__product__inner>ul.fr__pro__prize>li').text();
    
                    var crawling = new Crawling(title, image, price);
                    crawling.setTitle(title);
                    crawling.setImg(image);
                    crawling.setPrice(price);

                    arr.push(crawling);
                    resolve(arr);
                });
            }
        });
    });
  }



module.exports = router;