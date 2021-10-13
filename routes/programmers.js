var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');
const cheerio = require('cheerio');
var Crawling = require('../models/Crawling.js')
var xlsData = [];
var mergedata = [];

router.get('/catalog/:number', function(req, res, next) {
    for(var i = 1; i <= req.params.number; i++){
        xlsData.push(requestAPI(getTheUrl(i)));
      }
    
      Promise.all(xlsData).then(function(data){ 
        for(var i = 0; i < data.length; i++)
        {
          mergedata = mergedata.concat(data[i]);
        }
        var xls = json2xls(mergedata);
        var exceloutput = Date.now() + "-programmers.co.kr-output.xlsx"
          fs.writeFileSync(exceloutput, xls, 'binary');
          res.download(exceloutput,(err) =>  {
              if(err){
                  fs.unlinkSync(exceloutput)
                  res.send("Unable to download the excel file")
              }
              fs.unlinkSync(exceloutput)
          });
      }).catch(function(){ res.sendStatus(404) });
});

function getTheUrl() {
    var url = "https://programmers.co.kr/learn";
    return url
}

async function requestAPI(url){
    return new Promise((resolve, reject) => {
        request.get({url: url}, function(err, res, body) {
            if(err)
            {
               reject(err);
            }
            else
            {
                const arr = [];
                let $ = cheerio.load(body);
                $('div.container>div.courses>li').each(function(){
                    const img = $(this).find('li.col-item>a.list-item>div.course__thumb>img').attr('src');
                    const title = $(this).find('li.col-item>a.list-item>div.course__body>h4').text();
                    const price = $(this).find('li.col-item>a.list-item>div.course__price>h5.price>span.price').text();
                    const description = $(this).find('li.col-item>a.list-item>div.course__body>h6.description').text();
                    const number_pers = $(this).find('li.col-item>a.list-item>div.course__body>h6.statuts>span.lesson-quantity>svg').text();
                    var crawling = new Crawling(title, img, price, description, number_pers);
                    crawling.setTitle(title);
                    crawling.setImg(img);
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